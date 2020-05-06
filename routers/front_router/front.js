let router=require("koa-router")();
let frontController=require("../../controllers/front_controller/Front.js");
let url=require("url");

//所有路径都要先通过这个router.use
router.use(async(ctx,next)=>{
    //获取http://localhost:3003/  中的/,或者/news
    //pathname是哪一个，那也个导航栏的项目就选中
    let pathName=url.parse(ctx.request.url).pathname;  
    ctx.state.pathName=pathName;

    await next();
})

router.get("/",frontController.showTopPage);
router.get("/service",frontController.service);
//通过url传值有两种方法，一种是/centent?id=123 一种是动态路由传值 /centent/123.这里使用的是动态路由
router.get("/content/:id",frontController.displayContent);
router.get("/news",frontController.displayNewsCategory);
router.get("/news/category/:category_id",frontController.displayNews);



module.exports=router.routes();  //启动路由的命令