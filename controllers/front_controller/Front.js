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
    displayNewsCategory=async(ctx)=>{

        //像这样直接在代码里面写id是不对的。
        let newscategories=await DB.find("article_categories",{"_id":DB.getObjectId("5eafe79c6ea75e50a015f9c9")})
        console.log(newscategories[0].secondCategories);
        
        let subCateArr=[];
        for(let i=0;i<newscategories[0].secondCategories.length;i++){
            //注意一定要用toString 不然取出的_id 没有引号 是这个样子5eafe7b46ea75e50a015f9ca
            //而不是这个样子，这他妈的是怎么回事？
            subCateArr.push(newscategories[0].secondCategories[i]._id.toString())
        }


        // console.log(subCateArr);
        //可以这样使用关键字。$in
        let allNews=await DB.find("articles",{"pid":{$in:subCateArr}})
        console.log(allNews);
        
        await ctx.render("front_views/news.html",{
            newscategories:newscategories[0],
            newsList:allNews
        })
    }
    displayNews=async(ctx)=>{
        let category_id=ctx.params.category_id;
        let news = await DB.find("articles",{"pid":category_id});
        await ctx.render("front_views/news_category.html",{
            list:news,
        })
        
    }
}

module.exports= new FrontController();