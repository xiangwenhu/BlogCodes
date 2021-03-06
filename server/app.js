const Koa = require('koa')
const koaStatic = require('koa-static')
const path = require('path')
const betterBody = require('koa-better-body')
const routes = require('./routes')
const app = new Koa(),
  fs = require('fs'),
  https = require('https'),
  privateKey = fs.readFileSync(path.join(__dirname, '/cert/private.pem'), 'utf8'),
  certificate = fs.readFileSync(path.join(__dirname, '/cert/file.crt'), 'utf8'),
  credentials = { key: privateKey, cert: certificate }


//better body
app.use(betterBody())

//静态服务器资源
app.use(koaStatic(path.resolve(__dirname, '../client')))

//自定义错误处理
app.use(async (ctx, next) => {
  try {
    await next()
    if (ctx.status === 404) {
      ctx.body = ctx.body || {
        status: false,
        msg: '404 未找到' 
      }
    }
  } catch (err) {
    let status = err.status || 500
    ctx.body = {
      status: status,
      msg: '服务器内部错误' + err.body || err.message
    }
    console.log(err)
  }
})

//logger
app.use(async function (ctx, next) {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}`)
})

//路由
routes(app)

app.use(async (ctx,next) =>{
  console.log('middleware after routes')
  next()
})

//异常
app.on('error', (err, ctx) => {
  console.log('error url:' + ctx.url)
  console.log('error detail:' + err)
  console.log('error stack:' + err.stack)
})


var server = https.createServer(credentials, app.callback())
server.listen(8085)