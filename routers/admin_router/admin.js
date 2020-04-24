
let adminController=require("../../controllers/admin_controller/Admin.js");
let router=require("koa-router")()

const multer=require('koa-multer');
// const file=require('file');

let storage=multer.diskStorage({
    //文件保存路径 
    destination:function(req,file,cb){ 
        cb(null,'public/upload_pictures') //注意路径必须存在 
    }, 
    //修改文件名称 
    filename:function(req,file,cb){
         let fileFormat=(file.originalname).split("."); 
         cb(null,Date.now()+"."+fileFormat[fileFormat.length-1]); 
    } 
})
//加载配置
let upload=multer({storage:storage})


router.use(async (ctx,next)=>{
    console.log("admin");
    
    let current_url_array=ctx.url.split("/");
    console.log(current_url_array);
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
router.get("/admin/manager/add",adminController.managerAdd);
router.post("/admin/manager/doAdd",adminController.doManagerAdd);
router.get("/admin/manager/changeStatus",adminController.changeStatus);//通过ajax来请求这个接口

router.get("/admin/manager/edit",adminController.managerEdit);
router.post("/admin/manager/doEdit",adminController.doManagerEdit);

router.get("/admin/manager/article_categories",adminController.showArticleCategories);
router.get("/admin/manager/add_categories",adminController.addCategories);
router.post("/admin/manager/doAddCategories",adminController.doAddCategories);

router.get("/admin/manager/editCategory",adminController.editCategory);
router.post("/admin/manager/doUpdateCategory",adminController.doUpdateCategory);
router.get("/admin/manager/deleteCategory",adminController.deleteCategory);

router.get("/admin/manager/addPicture",adminController.addPicture)
//single里面的名字是，view里面图片输入框的name的值。
router.post("/admin/manager/doAddPicture",upload.single('picture'),adminController.doAddPicture);

router.get("/admin/manager/articlesList",adminController.articlesList);

router.get("/admin",adminController.index)

module.exports=router.routes();  //启动路由的命令