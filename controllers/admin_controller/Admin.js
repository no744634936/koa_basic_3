module.exports={
    test: async(ctx,next)=>{
        console.log("test");
        ctx.body="test";
    },

    login: async(ctx,next)=>{
        console.log("login page");

        // render 里面的路径不能这样写  "/admin_views/login" 最前面不能有/
        await ctx.render("admin_views/login") 
    }

}