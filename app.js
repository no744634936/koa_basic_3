const Koa = require('koa')
const app = new Koa()

// 中间件
app.use(async (ctx) => {
  ctx.body = 'test'
})

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})