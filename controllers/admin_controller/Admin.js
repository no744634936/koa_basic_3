let md5=require('md5');
let DB=require("../../models/admin_model/db.js");
//用来生成唯一的id
let ObjectID = require('mongodb').ObjectID;

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
        // console.log(ctx.request.body);
        try{
            let password=ctx.request.body.password;
            let rpassword=ctx.request.body.rpassword;
            let id=ctx.request.body.id;
            console.log(password);
            console.log(id);
            
            
            //密码不为空
            if(password!=""){
                if(password!=rpassword){
                    ctx.body=`<script>alert('密码不一致');location.href='/admin/manager/edit?id=${id}'</script>`;
                }else{    
                    let updateResult=await DB.update("admin",{"_id":DB.getObjectId(id)},{"password":md5(password)});
                    if(updateResult){
                        ctx.body="<script>alert('修改成功');location.href='/admin/manager/list'</script>";
                    }else{
                        ctx.body=`<script>alert('修改失败，请重新修改');location.href='/admin/manager/edit?id=${id}'</script>`;
                    }
                }
            }else{
                ctx.body=`<script>alert('密码不能为空');location.href='/admin/manager/edit?id=${id}'</script>`;
            }            
        }catch(err){
            console.log(err);
            console.log("更新失败");
            
        }
    },
    showArticleCategories:async(ctx)=>{
        //find 返回的是一个数组
        var result=await DB.find('article_categories',{});
        await ctx.render("admin_views/artcle_categories.html",{
            list:result
        });
    },
    addCategories:async(ctx)=>{
        let result=await DB.find("article_categories",{});
        await ctx.render("admin_views/add_categories.html",{
            list:result
        });
    },
    doAddCategories:async(ctx)=>{

        let recevied_object=ctx.request.body;
        let father_id=recevied_object.first_category_id;
        if(father_id==0){
            //添加顶级分类
            recevied_object.secondCategories=[];

            recevied_object.title= recevied_object.s_title;
            
            delete recevied_object.s_title;
            delete recevied_object.first_category_id;

            let addResult=await DB.insert("article_categories",recevied_object);
            ctx.redirect("/admin/manager/article_categories");
        }else{
            //添加二级分类

            //删除里面的顶级分类id
            delete recevied_object.first_category_id;
            //添加二级分类id
            let embeded_document_id=new ObjectID();
            recevied_object._id=embeded_document_id;
            //insert A new document in an embedded document
            let result=await DB.insertEmbededDocument("article_categories",{"_id":DB.getObjectId(father_id)},{"secondCategories":recevied_object});
            if(result){
                ctx.redirect("/admin/manager/article_categories")
            }else{
                ctx.body=`<script>alert('添加失败，请重新添加');location.href='/admin/manager/add_categories'</script>`;
            }
        }

    },
    editCategory:async(ctx)=>{
        let father_id=ctx.query.father_id;
        let child_id=ctx.query.child_id;
        let top_category=await DB.find("article_categories",{});
        let target=null;
        //如果没有child id 显示顶级分类
        if(!child_id){
            let first_category=await DB.find("article_categories",{"_id":DB.getObjectId(father_id)});
            target=first_category[0];
        }else{
            //如果有child id 显示二级分类
            //fetch A  document　from an embedded document
            let first_category=await DB.find("article_categories",{"_id":DB.getObjectId(father_id)});
            first_category[0].secondCategories.forEach(element => {
                if(element._id==child_id){
                    target=element;
                    //foreach 里面不能使用break 只能用return true
                    return true;
                }
            });
        }

        await ctx.render("admin_views/edit_category.html",{
            list:target,
            top_category:top_category,
            father_id:father_id
        });
        
    },
    doUpdateCategory:async(ctx)=>{
        let recevied_object=ctx.request.body;
        delete recevied_object.first_category_id;

        //获取跳转页面之前的页面的url
        let ref=ctx.request.headers.referer;
        //获取url里面的参数
        let param_string=ref.split("?")[1];
        let urlParams = new URLSearchParams(param_string);
        let father_id=urlParams.get("father_id");
        let child_id=urlParams.get("child_id");
        
        //获取当前url 和url里的参数 使用
        // ctx.query (或者 ctx.request.query)
        let result=null;
        if(!child_id){
           result=await DB.update("article_categories",{"_id":DB.getObjectId(father_id)},recevied_object);
        }else{
          //因为updateEmbeddedDocument方法是将embedded document 的所有项目都替换，所以_id也必须替换。不然_id会不见。
           recevied_object._id=DB.getObjectId(child_id);
           result=await DB.updateEmbeddedDocument(
                "article_categories",
                child_id,
                recevied_object
               )
        }
        if(result){
            ctx.redirect("/admin/manager/article_categories");
        }else{
            ctx.body=`<script>alert('添加失败，请重新添加');location.href='/admin/manager/editCategory?father_id=${father_id}&child_id=${child_id}'</script>`;
        }
    },
    deleteCategory:async(ctx)=>{
        let father_id=ctx.query.father_id;
        let child_id=ctx.query.child_id;
        if(!child_id){
            result=await DB.remove("article_categories",{"_id":DB.getObjectId(father_id)})
            ctx.redirect("/admin/manager/article_categories");
        }else{
            result=await DB.removeEmbeddedDocument("article_categories",father_id,child_id);
            ctx.redirect("/admin/manager/article_categories");
        }
    },
    addPicture:async(ctx)=>{
        await ctx.render("admin_views/add_picture.html");
    },
    doAddPicture:(ctx)=>{
        //如果没有提交封面图片系统会报错。Cannot read property 'filename' of undefined
        //所以加一个判断来修正。
        let fileName=ctx.req.file ? ctx.req.file.filename : "";
        ctx.body={ 
            filename:fileName,//返回文件名 
            body:ctx.req.body 
        }
        //返回这个数据
        //{"filename":"1587700475877.jpg","body":{"title":"test22","description":"122334"}}
    },
    addRichText:async(ctx)=>{
        await ctx.render("admin_views/add_rich_text_editor.html");
    },
    articlesList:async(ctx)=>{

        // let result=await DB.find("articles",{});              //测试输入两个参数的时候数据是否被正确表示。
        // let result=await DB.find("articles",{},{"title":1});   //测试输入三个参数的时候是否正确表示。
        
        //如果url为http://localhost:3001/admin/manager/articlesList?page=1　加载第一页数据。如果没有page这个参数也返回第一页参数。
        let page=ctx.query.page||1;
        let pageSize=5;
        let result=await DB.find("articles",{},{},{    //测试输入四个参数的时候是否正确表示。
            page:page,
            pageSize:pageSize
        })
        await ctx.render("admin_views/articles_list.html",{
            list:result,
        });
    },
    doAddRichText:async(ctx)=>{
        console.log(ctx.request.body);
        ctx.body={body:ctx.request.body};
    },
    addArticle:async(ctx)=>{
        let result=await DB.find('article_categories',{});
        await ctx.render("admin_views/add_article",{
            list:result
        });
    },
    doAddArticle:async(ctx)=>{
        let pid=ctx.req.body.pid;
        let catename=ctx.req.body.categoryName ? ctx.req.body.categoryName.trim():"";
        let title=ctx.req.body.title ? ctx.req.body.title.trim():"";
        let author=ctx.req.body.author ? ctx.req.body.author.trim():"";
        let status=ctx.req.body.status;
        let is_best=ctx.req.body.is_best;
        let is_hot=ctx.req.body.is_hot;
        let is_new=ctx.req.body.is_new;
        let keywords=ctx.req.body.keywords;
        let description=ctx.req.body.description || '';
        let content=ctx.req.body.content ||'';
        let img_url=ctx.req.file? ctx.req.file.path :'';

        //属性的简写
        let json={
            pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url
        }

        var result=DB.insert('articles',json);
        if(result){
            console.log("hahaha");
            ctx.redirect("/admin/manager/articlesList");
        }else{
            console.log("failed");
        }

    }
}