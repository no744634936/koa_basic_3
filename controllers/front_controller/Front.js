let DB=require("../../models/admin_model/db.js");

class FrontController{

    //因为这导航栏是所有页面都有要用到的，所以单独写一个方法。
    getNavs=async()=>{
        //导航条的数据。
        let navResult=await DB.find("navs",{status:"1"},{},{
            sortCondition:{"score":-1}
        })
        return navResult;
    }
    test=()=>{
        return "test"
    }
    showTopPage=async(ctx)=>{

        let carouselsResult=await DB.find("carousels",{status:"1"},{},{
            sortCondition:{"score":1}
        })
        await ctx.render("front_views/index.html",{
            navs:await this.getNavs(),
            carousels:carouselsResult
        })
    }

    service=async(ctx)=>{
        let serviceList=await DB.find("articles",{"pid":"5eafe7856ea75e50a015f9c8"});
        await ctx.render("front_views/service.html",{
            serviceList:serviceList,
        })
    }

    displayContent=async(ctx)=>{
        console.log(ctx.params);
        let id=ctx.params.id;
        let content=await DB.find("articles",{"_id":DB.getObjectId(id)});
        console.log(content[0]);
        
        await ctx.render("front_views/content.html",{
            list:content[0],
        })
    
    }
    diplayNews=async(ctx)=>{
        await ctx.render("front_views/news.html")
    }
}

module.exports= new FrontController();