(function (self) {
  'use strict';  
  if (self.fetch) {
     return
  }

  // 封装的 Headers，支持的方法参考https://developer.mozilla.org/en-US/docs/Web/API/Headers
  function Headers(headers) {
    ......
  }  

  //方法参考：https://developer.mozilla.org/en-US/docs/Web/API/Body
  function Body() { 
    ......
  }

  // 请求的Request对象 ，https://developer.mozilla.org/en-US/docs/Web/API/Request
  // cache,context,integrity,redirect,referrerPolicy 在MDN定义中是存在的
  function Request(input, options) {
     ......
  }

  Body.call(Request.prototype)  //把Body方法属性绑到 Reques.prototype
  
  function Response(bodyInit, options) {   
  }

  Body.call(Response.prototype) //把Body方法属性绑到 Reques.prototype

  self.Headers = Headers  //暴露Headers
  self.Request = Request //暴露Request
  self.Response = Response //暴露Response

  self.fetch = function (input, init) {
    return new Promise(function (resolve, reject) {
      var request = new Request(input, init)  //初始化request对象
      var xhr = new XMLHttpRequest()  // 初始化 xhr

      xhr.onload = function () { //请求成功，构建Response，并resolve进入下一阶段
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      //请求失败，构建Error，并reject进入下一阶段
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'))
      }

      //请求超时，构建Error，并reject进入下一阶段
      xhr.ontimeout = function () {
        reject(new TypeError('Network request failed'))
      }

      // 设置xhr参数
      xhr.open(request.method, request.url, true)

      // 设置 credentials 
      if (request.credentials === 'include') {
        xhr.withCredentials = true
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false
      }

      // 设置 responseType
      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      // 设置Header
      request.headers.forEach(function (value, name) {
        xhr.setRequestHeader(name, value)
      })
      // 发送请求
      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  //标记是fetch是polyfill的，而不是原生的
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this); // IIFE函数的参数，不用window，web worker, service worker里面也可以使用
