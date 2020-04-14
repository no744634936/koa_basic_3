let md5=require('md5');
let DB=require("../../models/admin_model/db.js");
module.exports={
    test: async(ctx,next)=>{
        console.log("test");
        ctx.body="test";
    },

    login: async(ctx,next)=>{
        // render 里面的路径不能这样写  "/admin_views/login" 最前面不能有/
        // 其他地方写路径都要在最前面写上/
        await ctx.render("admin_views/login") 
    },

    doLogin: async(ctx,next)=>{
        
        var username=ctx.request.body.username;
        var password=md5(ctx.request.body.password);
        //前后端都需要做validation
        var result=await DB.find('admin',{"username":username,"password":password});
    
        if(result.length>0){
            //获取信息成功之后将用户信息写入session
            ctx.session.adminInfo=result[0];

            //redirect 是有路由的时候跳转。render是没有路由的时候。
            // ctx.redirect('/admin/test');
            await ctx.render("admin_views/test")
            
        }else{
            //跳出弹窗，点击ok后返回login页面
            ctx.body="<script>alert('用户名或密码错误');location.href='/admin/login'</script>";
        }
    }

}