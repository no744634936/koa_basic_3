
let router=require("koa-router")()

router.use(async (ctx,next)=>{
    console.log("user");
    await next();
})

router.get("/user",async(ctx,next)=>{
    await ctx.render("user_views/index")

});


module.exports=router.routes();  //启动路由的命令