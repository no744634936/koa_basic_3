let apiController=require("../../controllers/api_controller/Api.js");
let router=require("koa-router")()

router.get ("/api/cateList",apiController.catelist);

router.get ("/api/articles",apiController.articleList);xiam

//前面写后端的时候，post方法既能用来增加数据，也能用来修改数据。
//但是在restful api中。post方法最好仅仅用来增加数据。
//get 跟delete方法都是通过url来传递数据。而post跟put都是通过body-parser来传递数据。
router.post("/addToCart",async(ctx)=>{
    console.log(ctx.request.body);

    //在数据库里增加数据的代码。省略
    
    //api不仅要能操作数据，还要能响应数据。才是完整接口。
    //下面这代码就是响应数据。否则前端会返回404
    ctx.body={
        sucess:true,
        "message":"增加数据成功"
    }
    
});

//put方法用来修改数据
router.put("/editInfo",async(ctx)=>{
    console.log(ctx.request.body);

    ctx.body={
        sucess:true,
        "message":"修改数据成功"
    }
    
});


//删除商品数据
router.delete("/removeProduct",async(ctx)=>{
    console.log(ctx.query);

    ctx.body={
        sucess:true,
        "message":"删除数据成功"
    }
    
});


module.exports=router.routes();  //启动路由的命令