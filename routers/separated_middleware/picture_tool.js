const multer=require('koa-multer');

let pictureTools={
    test:"123",
    articleMulter:()=>{
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
        return upload;
    },
    carouselsMulter:()=>{
        let storage=multer.diskStorage({
            //文件保存路径 
            destination:function(req,file,cb){ 
                cb(null,'static_asset/carousels') //注意路径必须存在,也就是说
            }, 
            //修改文件名称 
            filename:function(req,file,cb){
                 let fileFormat=(file.originalname).split("."); 
                 cb(null,Date.now()+"."+fileFormat[fileFormat.length-1]); 
            } 
        })
        //加载配置
        let upload=multer({storage:storage})
        return upload;
    },
    linksMulter:()=>{
        let storage=multer.diskStorage({
            //文件保存路径 
            destination:function(req,file,cb){ 
                cb(null,'static_asset/link_pictures') //注意路径必须存在,也就是说
            }, 
            //修改文件名称 
            filename:function(req,file,cb){
                 let fileFormat=(file.originalname).split("."); 
                 cb(null,Date.now()+"."+fileFormat[fileFormat.length-1]); 
            } 
        })
        //加载配置
        let upload=multer({storage:storage})
        return upload;
    },
    logoMulter:()=>{
        let storage=multer.diskStorage({
            //文件保存路径 
            destination:function(req,file,cb){ 
                cb(null,'static_asset/logo') //注意路径必须存在,也就是说
            }, 
            //修改文件名称 
            filename:function(req,file,cb){
                 let fileFormat=(file.originalname).split("."); 
                 cb(null,Date.now()+"."+fileFormat[fileFormat.length-1]); 
            } 
        })
        //加载配置
        let upload=multer({storage:storage})
        return upload;
    }
}


module.exports=pictureTools;