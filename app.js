const Koa = require('koa');
const path=require('path');
const render = require('koa-art-template');
const admin=require("./routers/admin_router/admin.js");
const static=require("koa-static")
const app = new Koa();



//配置 koa-art-template模板引擎
render(app, {
    root: path.join(__dirname, 'views'),   // 视图的位置
    extname: '.html',  // 后缀名
    debug: process.env.NODE_ENV !== 'production'  //是否开启调试模式
});


//配置静态资源路径
app.use(static(__dirname+'/static_asset'));   


//使用中间件。
app.use(admin); 

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})