
let router=require("koa-router")()

router.use(async (ctx,next)=>{
    console.log("user");
    await next();
})

router.get("/user/login",async(ctx,next)=>{
    ctx.body="hahahaha";
    console.log("hahaha");
});


module.exports=router.routes();  //启动路由的命令