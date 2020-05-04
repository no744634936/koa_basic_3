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
        
        console.log(this.test());
        console.log(await this.getNavs());

        await ctx.render("front_views/index.html",{
            navs:await this.getNavs(),
            carousels:carouselsResult
        })
    }
}

module.exports= new FrontController();