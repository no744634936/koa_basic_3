
let adminController=require("../../controllers/admin_controller/Admin.js");
let router=require("koa-router")()

router.get("/admin/test",adminController.test);
router.get("/admin/login",adminController.login)

module.exports=router.routes();  //启动路由的命令