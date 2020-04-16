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
        var result=await DB.find('admin',{"username":username,"password":password});
    
        if(result.length>0){

            await DB.update("admin",{"_id":DB.getObjectId(result[0]._id)},{last_login:new Date()});
            ctx.session.adminInfo=result[0];
            ctx.redirect('/admin');
            
        }else{
            //跳出弹窗，点击ok后返回login页面
            ctx.body="<script>alert('用户名或密码错误');location.href='/admin/login'</script>";
        }
    },

    index:async(ctx,next)=>{
        await ctx.render("admin_views/index.html")
    },

    logout:async(ctx,next)=>{
        ctx.session.adminInfo=null;
        ctx.redirect("/admin/login");
    },

    managerList:async(ctx,next)=>{
        let result=await DB.find('admin',{});

        await ctx.render("admin_views/list.html",{
            list:result,
        })
    },

    changeStatus:async(ctx,next)=>{
        //通过ajax来使用这个方法。
        //靠koa-jsonp来实现的这个传递json数据
        //http://localhost:3000/admin/manager/changeStatus?callback=? 用这个路由来查看是否返回了json数据
        ctx.body={"message":"good","success":true};
        
    }

}