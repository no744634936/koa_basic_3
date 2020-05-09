let apiController=require("../../controllers/api_controller/Api.js");
let router=require("koa-router")()

router.get ("/api/cateList",apiController.catelist);

router.get ("/api/articles",apiController.articleList);




module.exports=router.routes();  //启动路由的命令