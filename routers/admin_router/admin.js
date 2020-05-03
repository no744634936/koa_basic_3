
let adminController=require("../../controllers/admin_controller/Admin.js");
let router=require("koa-router")()


//当用户输入一个包含admin的url的时候（）都会首先经过这个路由
//让后通过await next(); 像下继续匹配路由

router.use(async (ctx,next)=>{
    console.log("admin");

    if(ctx.session.adminInfo){
        //如果有session数据，说明已登录，可以通过输入的路由访问数
        await next();
    }else{
        //如过没有session
        //只允许访问 "/admin/login"  和 "/admin/doLogin" 两个路由，输入任何其他路由都会跳到login画面
        if((ctx.request.url=="/admin/login")||(ctx.request.url=="/admin/doLogin")){
            await next();
        }else{
            ctx.redirect("/admin/login");
        }
    }
    
})

router.get("/admin/test",adminController.test);
router.get("/admin/login",adminController.login)
router.post("/admin/doLogin",adminController.doLogin)

module.exports=router.routes();  //启动路由的命令