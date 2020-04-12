const Koa = require('koa')

const admin=require("./routers/admin_router/admin.js")
const app = new Koa()



app.use(admin); //使用中间件。

app.listen(3000, () => {
  console.log('server is running at http://localhost:3000')
})