
const Koa = require('koa')
// 注意 require('koa-router') 返回的是函数:
const router = require('koa-router')()
const app = new Koa()


router.get('/', async (ctx, next) => {
    ctx.response.body = `<h1>index page</h1>`
    await next();
})
router.all('/', async (ctx, next) => {
    console.log('match "all" method')
});
// 调用路由中间件
app.use(router.routes())

app.listen(3000, ()=>{
    console.log('server is running at http://localhost:3000')
})