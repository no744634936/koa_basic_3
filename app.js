const Koa = require('koa');
const path=require('path');
const render = require('koa-art-template');
const admin=require("./routers/admin_router/admin.js");
const user=require("./routers/user_router/user.js");
const static=require("koa-static");
const session = require('koa-session');
const koaBodyparser = require('koa-bodyparser');
const sd = require('silly-datetime');
const jsonp=require("koa-jsonp");

const app = new Koa();


//配置 koa-art-template模板引擎
render(app, {
    root: path.join(__dirname, 'views'),   // 视图的位置
    extname: '.html',  // 后缀名
    debug: process.env.NODE_ENV !== 'production',  //是否开启调试模式

    //扩展模板里面的方法，用来格式化日期。
    dateFormat: dateFormat=(value)=>{
        return sd.format(value, 'YYYY-MM-DD HH:mm');
    }
});

//配置跟使用session
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess', 
    maxAge: 86400000,
    overwrite: true, 
    httpOnly: true, 
    signed: true, 
    rolling: true, 
    renew: false, 
};


//使用中间件。
app.use(koaBodyparser());
app.use(static(__dirname+'/static_asset'));
app.use(session(CONFIG, app));
app.use(jsonp());




//路由写在所有中间件的最下面。
app.use(admin); 
app.use(user); 
app.listen(3001, () => {
  console.log('server is running at http://localhost:3000')
})