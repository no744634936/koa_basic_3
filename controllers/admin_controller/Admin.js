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
    },

    managerAdd:async(ctx)=>{
        await ctx.render("admin_views/add.html") 
    },

    doManagerAdd:async(ctx)=>{
    //1,获取表单提交的数据
    //2,验证表单数据是否合法。(可以自己添加一些验证条件)
    //3,在数据库中查询要增加的管理员是否存在。
    //4,增加管理员

        console.log(ctx.request.body);
        //这种写法是不对的
        // let username=ctx.request.username;
        // let password=ctx.request.password;
        // let rpassword=ctx.request.rpassword;


        let username=ctx.request.body.username;
        let password=ctx.request.body.password;
        let rpassword=ctx.request.body.rpassword;

        if(password!=rpassword){
            ctx.body="<script>alert('密码不一致');location.href='/admin/manager/add'</script>";
        }else{
            let findResult=await DB.find("admin",{"username":username});
            if(findResult.length>0){
                ctx.body="<script>alert('用户名已存在');location.href='/admin/manager/add'</script>";
            }else{
                
                let addResult=await DB.insert("admin",{"username":username,"password":md5(password),"status":1,"last_login":new Date()});
                if(addResult){
                    ctx.body="<script>alert('添加成功');location.href='/admin/manager/list'</script>";
                }else{
                    ctx.body="<script>alert('添加失败，请重新添加');location.href='/admin/manager/add'</script>";
                }
            }
        }
        
    },

    managerEdit:async(ctx)=>{
        let id=ctx.query.id;
        let result=await DB.find("admin",{"_id":DB.getObjectId(id)});

        await ctx.render("admin_views/edit.html",{
            list:result[0],
        }) 
    },
    doManagerEdit:async(ctx)=>{
        
    }

}