const Router = require('koa-router')

var r1 = new Router({
  prefix: '/t'
})


r1.param('id', (id, ctx, next) => {
  if (id > 10) {
    ctx.status = 404
    ctx.body = {
      status: 404
    }
    return ctx
  }
  next()
})

r1.get('/test1/:id', function (ctx, next) {
  console.log('test1 :1')
  next()
}, function (ctx, next) {
  console.log('test1:2')
})


r1.get('/test1/:id', function (ctx, next) {
  console.log('test1 :3')
  next()
})




module.exports = r1