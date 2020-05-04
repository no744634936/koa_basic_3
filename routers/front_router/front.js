let router=require("koa-router")();
let frontController=require("../../controllers/front_controller/Front.js");

router.get("/",frontController.showTopPage);

module.exports=router.routes();  //启动路由的命令