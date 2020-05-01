const Koa = require('koa')
// 注意 require('koa-router') 返回的是函数:
const router = require('koa-router')()
const app = new Koa()

 // 添加路由
 router.get('/', async (ctx, next) => {
    ctx.body = `<h1>index page</h1>`
})

router.get('/home', async (ctx, next) => {
    ctx.body = '<h1>HOME page</h1>'
})

router.get('/404', async (ctx, next) => {
    ctx.body = '<h1>404 Not Found</h1>'
})

router.get('/:category/:title', function (ctx, next) {
    
    console.log(ctx.params);
    //localhost:3001/hahah/bababa
    // => { category: 'hahah', title: 'bababa' }
  });

 // 调用路由中间件
 app.use(router.routes())

app.listen(3001, ()=>{
  console.log('server is running at http://localhost:3001')
})