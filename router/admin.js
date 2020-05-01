let router = require('koa-router')();


router.get('/',async (ctx)=>{
    //ctx.body="首页"
     let list={
 
         name:'张三',
         h:'<h2>这是一个h2</h2>',
         num:20,
         data:['11111111','2222222222','33333333333']
     }
 
     await ctx.render('index',{
         list:list
     });
 })


 //接收post提交的数据
 router.get('/news',async (ctx)=>{
 
     let app={
         name:'张三11',
         h:'<h2>这是一个h211</h2>',
         num:20,
         data:['11111111','2222222222','33333333333']
     };
     await ctx.render('news',{
         list:app
     });
 })


 module.exports=router.routes();  //启动路由的命令