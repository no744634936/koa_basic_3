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

        //console.log(ctx.query);
        //表里面的status如果是1要改成0，如果是0要改成1.

        //取出url传过来的参数
        let table=decodeURIComponent(ctx.query.table);
        let status=decodeURIComponent(ctx.query.status);
        let id=decodeURIComponent(ctx.query.id);


        let data=await DB.find(table,{"_id":DB.getObjectId(id)});
        if(data.length>0){
            let json=null;
            if(data[0][status]==1){
                json={"status":0}
            }else{
                json={"status":1}
            }

            let updateResult=await DB.update(table,{"_id":DB.getObjectId(id)},json);
            if(updateResult){
                ctx.body={"message":"更新成功","success":true}
            }else{
                ctx.body={"message":"更新失败","success":false}
            }
        }else{
            ctx.body={"message":"更新失败","success":false}
        }
    }

}