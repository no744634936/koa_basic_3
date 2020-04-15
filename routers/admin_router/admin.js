
let adminController=require("../../controllers/admin_controller/Admin.js");
let router=require("koa-router")()


//当用户输入一个包含admin的url的时候（）都会首先经过这个路由
//让后通过await next(); 像下继续匹配路由

router.use(async (ctx,next)=>{
    console.log("admin");
    
    let current_url_array=ctx.url.split("/");  //[ '', 'admin', 'doLogin' ]
    console.log(current_url_array);
    
    //定义一个全局变量G，然后再每一个页面(view)里都可以使用这个current_url_array里面的信息了
    ctx.state.G={
        current_url_array:current_url_array,

        adminInfo:ctx.session.adminInfo,
    }


    if(ctx.session.adminInfo){
        await next();
    }else{
        
        if((ctx.request.url=="/admin/login")||(ctx.request.url=="/admin/doLogin")){
            //注意这里是 admin下面的login 里的doLogin ctx.url=="/admin/login/doLogin"
            await next();
        }else{
            ctx.redirect("/admin/login");
        }
    }
    
})

router.get("/admin/test",adminController.test);
router.get("/admin/login",adminController.login);
router.get("/admin/logout",adminController.logout);
router.post("/admin/doLogin",adminController.doLogin);

router.get("/admin/manager/list",adminController.managerList);
router.get("/admin",adminController.index)

module.exports=router.routes();  //启动路由的命令