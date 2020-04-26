
let adminController=require("../../controllers/admin_controller/Admin.js");
let router=require("koa-router")()
const multer=require('koa-multer');
const ueditor = require('koa2-ueditor')

let storage=multer.diskStorage({
    //文件保存路径 
    destination:function(req,file,cb){ 
        cb(null,'static_asset/article_cover_picture') //注意路径必须存在,也就是说
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
    //模板引擎配置全局的变量
    ctx.state.__HOST__='http://'+ctx.request.header.host;


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

//测试富文本编辑器功能
router.get("/admin/manager/addRichText",adminController.addRichText);
router.post("/admin/manager/doAddRichText",adminController.doAddRichText);

// 这个 '/editor/controller' 是富文本编辑器里面上传图片，点击确认时的url
//把上传的图片放到 static/upload/ueditor/image/20200424 文件夹里面去。文件名为上传时的文件名。
//记住图片，js等文件一定要放进static_asset里面去，否则取不出来。因为我一开始就设置了静态资源的路径。
//一定要把/editor/controller  改成 /admin/manager/editor/controller。要登录了才能通过富文本编辑器来传递图片。
//否者黑客可以通过localhost:3000/editor/controller 来攻击网站。
//记得将 ueditor.config.js 里面的 serverUrl改为 "/admin/manager/editor/controller"
router.all('/admin/manager/editor/controller', ueditor(['static_asset', {        
	"imageAllowFiles": [".png", ".jpg", ".jpeg"],
	"imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"  // 保存为原文件名
}]))


//添加文章内容的路由
router.get("/admin/manager/addArticle",adminController.addArticle);
router.post("/admin/manager/DoAddArticle",upload.single("img"),adminController.doAddArticle);


router.get("/admin/manager/articlesList",adminController.articlesList);
router.get("/admin/manager/editArticle",adminController.editArticle);


router.get("/admin",adminController.index)

module.exports=router.routes();  //启动路由的命令