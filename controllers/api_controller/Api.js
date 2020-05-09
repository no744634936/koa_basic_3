let DB=require("../../models/admin_model/db.js");

class APIController{
    catelist=async(ctx)=>{
        let result=await DB.find("article_categories",{});
        if(result.length>0){
            ctx.body={
                result:result,
            }
        }
    }
    articleList=async(ctx)=>{
        let page=ctx.query.page||1;
        let pageSize=3;
        let result=await DB.find("articles",{},{},{
            page:page,
            pageSize:pageSize,
        })
        if(result.length>0){
            ctx.body={
                result:result,
            }
        }
    }
}

module.exports= new APIController();