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
        let count=await DB.count("articles",{})
        let totalPages=Math.ceil(count/pageSize);
        
        let result=await DB.find("articles",{},{},{    //测试输入四个参数的时候是否正确表示。
            page:page,
            pageSize:pageSize,
            sortCondition:{"created_time":-1},   //按文章的最新顺序排序
        })
        console.log(result);
        
        await ctx.render("admin_views/articles_list.html",{
            list:result,
            currentPage:page,
            totalPages:totalPages
        });
    },
    doAddRichText:async(ctx)=>{
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
            ctx.redirect("/admin/manager/articlesList");
        }else{
            console.log("failed");
        }

    },
    editArticle:async(ctx)=>{
        let id=ctx.query.id;
        let categories=await DB.find('article_categories',{});
        let article=await DB.find("articles",{"_id":DB.getObjectId(id)});

        //获取上一页的url。为doEditArticle方法里的 编辑哪一页的记录，编辑完了之后就跳到那一页做准备。
        console.log(ctx.request.header.referer);
        

        await ctx.render("admin_views/edit_article",{
            cateList:categories,
            article:article[0],
            previousURL:ctx.request.header.referer
        });
    },
    doEditArticle:async(ctx)=>{
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

        let articleId=ctx.req.body.articleId;
        let startURL=ctx.req.body.previousURL;
        let json=null;
        //注意要判断是否修改了图片。如果img_url不存在，那么就不更新img_url。否者更新。
        if(img_url==""){
            json={
                pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content
            }
        }else{
            json={
                pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url
            }
        }

        var result=DB.update('articles',{"_id":DB.getObjectId(articleId)},json);
        if(result){

            //编辑哪一页的记录，编辑完了之后就跳到那一页。
            ctx.redirect(startURL);
        }else{
            console.log("failed");
        }
    },
    changeScore:async(ctx)=>{
        console.log(ctx.query);
        let table=decodeURIComponent(ctx.query.table);
        let id=decodeURIComponent(ctx.query.id);
        let newScore=decodeURIComponent(ctx.query.newScore);
        let data=await DB.find(table,{"_id":DB.getObjectId(id)});
        let json={ score:newScore };

        if(data.length>0){
            let updateResult=await DB.update(table,{"_id":DB.getObjectId(id)},json);
            if(updateResult){
                ctx.body={"message":"更新成功","success":true}
            }else{
                ctx.body={"message":"更新失败","success":false}
            }
        }
    },

    //轮播图的路由
    carouselsAdd:async(ctx)=>{
        await ctx.render("admin_views/add_carousels.html");
    },
    doCarouselsAdd:async(ctx)=>{

        // let fileName=ctx.req.file ? ctx.req.file.filename : "";
        // ctx.body={ 
        //     filename:fileName,//返回文件名 
        //     body:ctx.req.body 
        // }
        
        //注意ctx.req 跟ctx.request 是不一样的.跟图片一起穿过来的字符有取出来时要用ctx.req.body.title
        //而不是ctx.request.body.title
        //上传图片的路径为  ctx.req.file.path   ——>static_asset\carousels\1588409974795.png
        //去掉static_asset\
        
        let json={
            "picture":ctx.req.file ? ctx.req.file.path.substr(13) : "",
            "title":ctx.req.body.title,
            "url":ctx.req.body.url,
            "score":ctx.req.body.score,
            "status":ctx.req.body.status,
            "created_at":new Date(),
        }
        let addResult=await DB.insert("carousels",json);
        if(addResult){
            ctx.body="<script>alert('添加成功');location.href='/admin/manager/carouselsList'</script>";
        }else{
            ctx.body="<script>alert('添加失败，请重新添加');location.href='/admin/manager/carouselsAdd'</script>";
        }


    },
    carouselsList:async(ctx)=>{
        let page=ctx.query.page||1;
        let pageSize=5;
        let count=await DB.count("carousels",{})
        let totalPages=Math.ceil(count/pageSize);
        
        
        let result=await DB.find("carousels",{},{},{
            page:page,
            pageSize:pageSize,
            sortCondition:{"created_time":-1},   
        })
        await ctx.render("admin_views/carousels_list.html",{
            list:result,
            currentPage:page,
            totalPages:totalPages
        });
    },
    editCarousels:async(ctx)=>{
        let id=ctx.query.id;
        let result=await DB.find("carousels",{"_id":DB.getObjectId(id)});
        console.log(result[0]);
        
        await ctx.render("admin_views/edit_carousels.html",{
            item:result[0],
        });
    },
    doCarouselsEdit:async(ctx)=>{
        let id=ctx.query.id;
        let json=null;
        let picture=ctx.req.file ? ctx.req.file.path.substr(13) : "";
        if(picture==""){
            json={
                "title":ctx.req.body.title,
                "url":ctx.req.body.url,
                "score":ctx.req.body.score,
                "status":ctx.req.body.status,
            }
        }else{
            json={
                "picture":ctx.req.file.path.substr(13),
                "title":ctx.req.body.title,
                "url":ctx.req.body.url,
                "score":ctx.req.body.score,
                "status":ctx.req.body.status,
            }
        }

        var result=await DB.update('carousels',{"_id":DB.getObjectId(id)},json);
        
        if(result){
            ctx.body="<script>alert('添加成功');location.href='/admin/manager/carouselsList'</script>";
        }else{
            ctx.body=`<script>alert('添加失败，请重新添加');location.href='/admin/manager/editCarousels?id=${id}'</script>`;
        }
    },
    linksAdd:async(ctx)=>{
        await ctx.render("admin_views/add_links.html");
    },
    doLinksAdd:async(ctx)=>{

        let json={
            "picture":ctx.req.file ? ctx.req.file.path.substr(13) : "",
            "name":ctx.req.body.name,
            "url":ctx.req.body.url,
            "score":ctx.req.body.score,
            "status":ctx.req.body.status,
            "created_at":new Date(),
        }
        let addResult=await DB.insert("links",json);
        if(addResult){
            ctx.body="<script>alert('添加成功');location.href='/admin/manager/linksList'</script>";
        }else{
            ctx.body="<script>alert('添加失败，请重新添加');location.href='/admin/manager/carouselsAdd'</script>";
        }
    },
    linksList:async(ctx)=>{
        let page=ctx.query.page||1;
        let pageSize=5;
        let count=await DB.count("carousels",{})
        let totalPages=Math.ceil(count/pageSize);
        
        
        let result=await DB.find("links",{},{},{
            page:page,
            pageSize:pageSize,
            sortCondition:{"created_time":-1},   
        })
        await ctx.render("admin_views/links_list.html",{
            list:result,
            currentPage:page,
            totalPages:totalPages
        });
    },
    editLinks:async(ctx)=>{
        let id=ctx.query.id;
        let result=await DB.find("links",{"_id":DB.getObjectId(id)});
        console.log(result[0]);
        
        await ctx.render("admin_views/edit_links.html",{
            item:result[0],
        });
    },
    doLinksEdit:async(ctx)=>{
        let id=ctx.query.id;
        let json=null;
        let picture=ctx.req.file ? ctx.req.file.path.substr(13) : "";
        if(picture==""){
            json={
                "name":ctx.req.body.name,
                "url":ctx.req.body.url,
                "score":ctx.req.body.score,
                "status":ctx.req.body.status,
            }
        }else{
            json={
                "picture":ctx.req.file.path.substr(13),
                "name":ctx.req.body.name,
                "url":ctx.req.body.url,
                "score":ctx.req.body.score,
                "status":ctx.req.body.status,
            }
        }

        var result=await DB.update('links',{"_id":DB.getObjectId(id)},json);
        
        if(result){
            ctx.body="<script>alert('添加成功');location.href='/admin/manager/linksList'</script>";
        }else{
            ctx.body=`<script>alert('添加失败，请重新添加');location.href='/admin/manager/editLinks?id=${id}'</script>`;
        }
    },
    //导航栏的路由
    navAdd:async(ctx)=>{
        await ctx.render("admin_views/add_nav.html");
    },
    doNavAdd:async(ctx)=>{
        //注意这里不能使用ctx.req.body.title。只能使用ctx.request.body.title

        let json={
            title: ctx.request.body.title,
            url: ctx.request.body.url,
            score: ctx.request.body.score,
            status: ctx.request.body.status,
            created_at:new Date(),
        }
        let addResult=await DB.insert("navs",json);
        if(addResult){
            ctx.body="<script>alert('添加成功');location.href='/admin/manager/navList'</script>";
        }else{
            ctx.body="<script>alert('添加失败，请重新添加');location.href='/admin/manager/navAdd'</script>";
        }
    },
    navList:async(ctx)=>{
        let page=ctx.query.page||1;
        let pageSize=5;
        let count=await DB.count("carousels",{})
        let totalPages=Math.ceil(count/pageSize);
        
        
        let result=await DB.find("navs",{},{},{
            page:page,
            pageSize:pageSize,
            sortCondition:{"created_time":-1},   
        })
        await ctx.render("admin_views/navs_list.html",{
            list:result,
            currentPage:page,
            totalPages:totalPages
        });
    },
    editNav:async(ctx)=>{
        let id=ctx.query.id;
        let result=await DB.find("navs",{"_id":DB.getObjectId(id)});
        console.log(result[0]);
        
        await ctx.render("admin_views/edit_nav.html",{
            item:result[0],
        });
    },
    doNavEdit:async(ctx)=>{
        let id=ctx.query.id;
        let json={
            title: ctx.request.body.title,
            url: ctx.request.body.url,
            score: ctx.request.body.score,
            status: ctx.request.body.status,
        }
        var result=await DB.update('navs',{"_id":DB.getObjectId(id)},json);
        
        if(result){
            ctx.body="<script>alert('添加成功');location.href='/admin/manager/navList'</script>";
        }else{
            ctx.body=`<script>alert('添加失败，请重新添加');location.href='/admin/manager/editNav?id=${id}'</script>`;
        }
        
    },
    //系统设定的路由
    setting:async(ctx)=>{
        //因为整个数据表里只有一条数据，且只能修改不能删除，所以要提前在数据库里放入数据。然后取出
        let id="5eaea28930e2b04fc4682385";
        let result=await DB.find("siteSetting",{"_id":DB.getObjectId(id)});
        await ctx.render("admin_views/setting.html",{
            list:result[0]
        });
    },
    doSystemSetting:async(ctx)=>{
        // let fileName=ctx.req.file ? ctx.req.file.filename : "";
        // ctx.body={ 
        //     filename:fileName,//返回文件名 
        //     body:ctx.req.body 
        // }
        let id=ctx.query.id;
        let json=null;
        let picture=ctx.req.file ? ctx.req.file.path.substr(13) : "";
        if(picture==""){
            json={
                "site_title": ctx.req.body.site_title,
                "site_keywords": ctx.req.body.site_keywords,
                "site_description": ctx.req.body.site_description,
                "site_icp": ctx.req.body.site_icp,
                "site_qq": ctx.req.body.site_qq,
                "site_tel": ctx.req.body.site_tel,
                "site_address": ctx.req.body.site_address,
                "site_status":ctx.req.body.site_status,
            }
        }else{
            json={
                "site_logo": ctx.req.file.path.substr(13),
                "site_title": ctx.req.body.site_title,
                "site_keywords": ctx.req.body.site_keywords,
                "site_description": ctx.req.body.site_description,
                "site_icp": ctx.req.body.site_icp,
                "site_qq": ctx.req.body.site_qq,
                "site_tel": ctx.req.body.site_tel,
                "site_address": ctx.req.body.site_address,
                "site_status":ctx.req.body.site_status,
            }
        }
        var result=await DB.update('siteSetting',{"_id":DB.getObjectId(id)},json);
        
        if(result){
            ctx.body="<script>alert('添加成功');location.href='/admin/manager/setting'</script>";
        }else{
            ctx.body=`<script>alert('添加失败，请重新添加');location.href='/admin/manager/setting'</script>`;
        }
    }
}