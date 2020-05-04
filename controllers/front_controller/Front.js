let frontController={
    showTopPage:async(ctx)=>{
        await ctx.render("front_views/index.html")
    }
}

module.exports=frontController;