```javascript
var debug = require('debug')('koa-router');
var pathToRegExp = require('path-to-regexp');

module.exports = Layer;

/**
 * Initialize a new routing Layer with given `method`, `path`, and `middleware`.
 *
 * @param {String|RegExp} path Path string or regular expression.
 * @param {Array} methods Array of HTTP verbs.
 * @param {Array} middleware Layer callback/middleware or series of.
 * @param {Object=} opts
 * @param {String=} opts.name route name
 * @param {String=} opts.sensitive case sensitive (default: false)
 * @param {String=} opts.strict require the trailing slash (default: false)
 * @returns {Layer}
 * @private
 */

function Layer(path, methods, middleware, opts) {
  this.opts = opts || {};
  this.name = this.opts.name || null;
  this.methods = [];
  this.paramNames = [];
  // 中间件
  this.stack = Array.isArray(middleware) ? middleware : [middleware]; 

  // 方法转为小写
  methods.forEach(function(method) {
    var l = this.methods.push(method.toUpperCase());
    if (this.methods[l-1] === 'GET') {
      this.methods.unshift('HEAD');
    }
  }, this);

  // ensure middleware is a function
  this.stack.forEach(function(fn) {
    var type = (typeof fn);
    if (type !== 'function') {
      throw new Error(
        methods.toString() + " `" + (this.opts.name || path) +"`: `middleware` "
        + "must be a function, not `" + type + "`"
      );
    }
  }, this);

  this.path = path;
  //  从路径提取正则，效果如下：https://github.com/pillarjs/path-to-regexp,
  // var re = pathToRegexp('/foo/:bar', keys) =>  // re = /^\/foo\/([^\/]+?)\/?$/i
  // var re = pathToRegExp('/:foo/:bar/12/:tong/a',keys) =>  /^\/((?:[^\/]+?))\/((?:[^\/]+?))\/12\/((?:[^\/]+?))\/a(?:\/(?=$))?$/i
  //
  // this.paramNames 格式如下
  // [ { name: 'foo',
  //  prefix: '/',
  //  delimiter: '/',
  //  optional: false,
  //  repeat: false,
  //  partial: false,
  //  asterisk: false,
  //  pattern: '[^\\/]+?' }, .....]
  this.regexp = pathToRegExp(path, this.paramNames, this.opts);

  debug('defined route %s %s', this.methods, this.opts.prefix + this.path);
};

/**
 * Returns whether request `path` matches route.
 *
 * @param {String} path
 * @returns {Boolean}
 * @private
 */

Layer.prototype.match = function (path) {
  return this.regexp.test(path);
};

/**
 * Returns map of URL parameters for given `path` and `paramNames`.
 * 获得路由参数键值对
 * @param {String} path
 * @param {Array.<String>} captures
 * @param {Object=} existingParams
 * @returns {Object}
 * @private
 */

Layer.prototype.params = function (path, captures, existingParams) {
  var params = existingParams || {};

  for (var len = captures.length, i=0; i<len; i++) {
    if (this.paramNames[i]) {
      var c = captures[i];
      params[this.paramNames[i].name] = c ? safeDecodeURIComponent(c) : c;
    }
  }

  return params;
};

/**
 * Returns array of regexp url path captures.
 * 返回各个参数的值
 * '/foo/:bar', regexp =  /^\/foo\/([^\/]+?)\/?$/i , '/foo/bar' 返回 [bar] 
 *'/:foo/:bar/12/:tong/a', regexp = /^\/((?:[^\/]+?))\/((?:[^\/]+?))\/12\/((?:[^\/]+?))\/a(?:\/(?=$))?$/i , '/foo/bar/12/tong/a' 返回 ['foo','var','tong']
 * @param {String} path
 * @returns {Array.<String>}
 * @private
 */

Layer.prototype.captures = function (path) {
  if (this.opts.ignoreCaptures) return [];
  return path.match(this.regexp).slice(1);
};

/**
 * Generate URL for route using given `params`.
 * 用参数构建URL,params参数可视是对象也可是数组
 * @example
 *
 * ```javascript
 * var route = new Layer(['GET'], '/users/:id', fn);
 *
 * route.url({ id: 123 }); // => "/users/123"
 * ```
 *
 * @param {Object} params url parameters
 * @returns {String}
 * @private
 */

Layer.prototype.url = function (params) {
  var args = params;
  var url = this.path.replace('\(\.\*\)', '');
  var toPath = pathToRegExp.compile(url);

  // argument is of form { key: val }
  if (typeof params != 'object') {
    args = Array.prototype.slice.call(arguments);
  }

  if (args instanceof Array) {
    //如果是数组，转换为对象
    var tokens = pathToRegExp.parse(url);
    var replace = {};
    for (var len = tokens.length, i=0, j=0; i<len; i++) {
      // 有name，才是有效的参数，https://github.com/pillarjs/path-to-regexp#parse
      if (tokens[i].name)  [tokens[i].name] = args[j++];
    }
    return toPath(replace);
  }
  else {
    return toPath(params);
  }
};

/**
 * Run validations on route named parameters.
 * 验证具名参数
 * @example
 *
 * ```javascript
 * router
 *   .param('user', function (id, ctx, next) {
 *     ctx.user = users[id];
 *     if (!user) return ctx.status = 404;
 *     next();
 *   })
 *   .get('/users/:user', function (ctx, next) {
 *     ctx.body = ctx.user;
 *   });
 * ```
 *
 * @param {String} param
 * @param {Function} middleware
 * @returns {Layer}
 * @private
 */

Layer.prototype.param = function (param, fn) {
  var stack = this.stack;
  var params = this.paramNames;
  // 构建参数验证中间件
  var middleware = function (ctx, next) {
    return fn.call(this, ctx.params[param], ctx, next);
  };
  middleware.param = param;

  var names = params.map(function (p) {
    return p.name;
  });

  var x = names.indexOf(param);
  if (x > -1) {
    // iterate through the stack, to figure out where to place the handler fn
    stack.some(function (fn, i) {
      // param handlers are always first, so when we find an fn w/o a param property, stop here
      // if the param handler at this part of the stack comes after the one we are adding, stop here
      // fn.param 作为判断是不是参数验证中间件的标志
      // 如果不是参数验证中间件，或者参数验证中间件需要验证的参数在我之后，插入参数验证中间件
      // 比如说path是这样的 /user/:id/posts/:postid, 那么id参数验证中间件应该在postid参数之前
      // 简单说，确保参数按照顺序被验证
      if (!fn.param || names.indexOf(fn.param) > x) {
        // inject this param handler right before the current item
        stack.splice(i, 0, middleware);
        return true; // then break the loop
      }
    });
  }

  return this;
};

/**
 * Prefix route path.
 * 设置路由前缀，https://github.com/alexmingoia/koa-router/tree/master/#router-prefixes
 * @param {String} prefix
 * @returns {Layer}
 * @private
 */

Layer.prototype.setPrefix = function (prefix) {
  if (this.path) {
    this.path = prefix + this.path;
    this.paramNames = [];
    this.regexp = pathToRegExp(this.path, this.paramNames, this.opts);
  }

  return this;
};

/**
 * Safe decodeURIComponent, won't throw any error.
 * If `decodeURIComponent` error happen, just return the original value.
 *
 * @param {String} text
 * @returns {String} URL decode original string.
 * @private
 */

function safeDecodeURIComponent(text) {
  try {
    return decodeURIComponent(text);
  } catch (e) {
    return text;
  }
}
```