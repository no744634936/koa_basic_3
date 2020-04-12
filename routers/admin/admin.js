let router=require("koa-router")();
let adminController=require("../../controllers/Admin.js");

router.get("/admin/test",adminController.test);

module.exports=router.routes();