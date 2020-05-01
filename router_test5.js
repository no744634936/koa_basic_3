const Koa = require('koa')
const Router = require('koa-router');
const app = new Koa();

var router = new Router({
    prefix: '/users'
  });
 
router.get('/', async(ctx, next)=>{
    ctx.body="<h1>responds to /users</h1>";
});
router.get('/:pid', async(ctx, next)=>{
    ctx.body="<h1>responds to /users/:id</h1>";
});

//匹配/users 和 users/7 这样的路由。
app.use(router.routes());


app.listen(3000, ()=>{
  console.log('server is running at http://localhost:3000')
})