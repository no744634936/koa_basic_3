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
}

module.exports= new APIController();