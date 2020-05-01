const Koa = require('koa')
  const router = require('koa-router')()
  const bodyParser = require('koa-bodyparser')
  const app = new Koa()

  app.use(bodyParser())

  router.get('/', async(ctx, next) => {
    ctx.body = `<h1>index page</h1>`
  })


  router.get('/user', async(ctx, next)=>{
    ctx.body = 
    `
      <form action="/user/register" method="post">
        <input name="name" type="text" placeholder="请输入用户名：ikcamp"/> 
        <br/>
        <input name="password" type="text" placeholder="请输入密码：123456"/>
        <br/> 
        <button>GoGoGo</button>
      </form>
    `
  });

  router.post('/user/register',async(ctx, next)=>{
    let {name, password} = ctx.request.body
    if( name === 'ikcamp' && password === '123456' ){
      ctx.body = `Hello， ${name}！`
    }else{
      ctx.body = '账号信息错误'
    }
  });


  
  app.use(router.routes())

  app.listen(3000, () => {
    console.log('server is running at http://localhost:3000')
  })