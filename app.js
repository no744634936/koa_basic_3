const Koa = require('koa');
const path=require('path');
const render = require('koa-art-template');
const admin=require("./routers/admin_router/admin.js");
const user=require("./routers/user_router/user.js");
const static=require("koa-static");
const session = require('koa-session');
const koaBodyparser = require('koa-bodyparser');
const app = new Koa();


//配置 koa-art-template模板引擎
render(app, {
    root: path.join(__dirname, 'views'),   // 视图的位置
    extname: '.html',  // 后缀名
    debug: process.env.NODE_ENV !== 'production'  //是否开启调试模式
});

//配置跟使用session
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess', 
    maxAge: 86400000,
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: true, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};


//使用中间件。
app.use(koaBodyparser());
app.use(static(__dirname+'/static_asset'));
app.use(session(CONFIG, app));



//路由写在所有中间件的最下面。
app.use(admin); 
app.use(user); 
app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})