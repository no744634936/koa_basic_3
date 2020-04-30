const Koa = require('koa')
const app = new Koa()

// 记录执行的时间
app.use(async (ctx, next)=>{
  let stime = new Date().getTime()
  await next()
  let etime = new Date().getTime()
  ctx.type = 'text/html'
  ctx.body = '<h1>Hello World</h1>'
  console.log(`请求地址: ${ctx.path}，响应时间：${etime - stime}ms`)
});

//await next(); 是等待下一个中间件执行结束之后再 执行下面的代码。
app.use(async (ctx, next) => {
  console.log('中间件1 doSomething')
  await next();
  console.log('中间件1 end')
})

app.use(async (ctx, next) => {
  console.log('中间件2 doSomething')
  // 注意，这里我们删掉了 next,可以把这个注释解开，看看效果。
    // await next()
  console.log('中间件2 end')
})

app.use(async (ctx, next) => {
  console.log('中间件3 doSomething')
  await next()
  console.log('中间件3 end')
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})