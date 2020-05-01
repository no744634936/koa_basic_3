
const Koa = require('koa')
const router = require('koa-router')()
const app = new Koa()

router.get('user', '/users/:id', function (ctx, next) {
    ctx.body = `<h1>user page</h1>`;
});

const url1=router.url('user', 3);
console.log("url1:",url1);


const url2=router.url('user', { id: 4 });
console.log("url2:",url2);


 // 调用路由中间件
 app.use(router.routes())

app.listen(3000, ()=>{
  console.log('server is running at http://localhost:3000')
})