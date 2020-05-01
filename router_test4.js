const Koa = require('koa')
const Router = require('koa-router');
const app = new Koa();

var forums = new Router();
var posts = new Router();
 
posts.get('/', async(ctx, next)=>{
    ctx.response.body="<h1>responds to /forms/123/posts</h1>";
});
posts.get('/:pid', async(ctx, next)=>{
    ctx.response.body="<h1>responds to /forms/123/posts/123</h1>";
});
 
forums.use('/forums/:fid/posts', posts.routes(), posts.allowedMethods());

//posts.allowedMethods() 这个中间件是对一些异常的处理。
// 可以匹配到的路由为 "/forums/123/posts" 或者 "/forums/123/posts/123"
app.use(forums.routes());


app.listen(3000, ()=>{
  console.log('server is running at http://localhost:3000')
})