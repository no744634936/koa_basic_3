const Koa = require('koa')
const admin=require("./routers/admin/admin.js")
const app = new Koa()



app.use(admin);          //启动admin路由
app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})