
var Koa=require('koa'),
    render = require('koa-art-template'),
    path=require('path'),
    app=new Koa(),
    router=require("./router/admin.js")

//配置 koa-art-template模板引擎
render(app, {
    root: path.join(__dirname, 'views'),   // 视图的位置
    extname: '.html',  // 后缀名
    debug: process.env.NODE_ENV !== 'production'  //是否开启调试模式

});


app.use(router);
app.listen(3001, () => {
    console.log('server is running at http://localhost:3001')
  })





