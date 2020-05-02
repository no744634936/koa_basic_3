let MongoClient=require("mongodb").MongoClient;
let ObjectId=require("mongodb").ObjectID;
let config=require("./config.js");

class Db{

    constructor(){
        this.connect();
        this.dbClient="";
    }

    static getInstance=()=>{
        if(!(Db.instance)){
            Db.instance=new Db();
        }
        return Db.instance;
    }


    connect=()=>{

        return new Promise((resolve,reject)=>{
            if(!this.dbClient){
                MongoClient.connect(config.dbUrl,{ useUnifiedTopology:true },(err,client)=>{
                    if(err){
                        reject(err);
                    }else{
                        let db=client.db(config.dbName);
                        this.dbClient=db;
                        resolve(this.dbClient);
                    }
                })
            }else{
                resolve(this.dbClient);
            }
        });

    }

   find=(...args)=>{
    
    //注意箭头函数里面不能用arguments只能使用...args


    let attr=null;
    let skipNum=null;
    let pageSize=null;
    let sortJson=null;

    let collectionName=args[0];
    let json1=args[1];
    let json2=args[2];
    let json3=args[3];
    if(args.length==2){
            //当传入两个参数时，
            //collectionName为表名
            //json1为空object
            //,json2为空object
            //json3里面包含了skipNum跟 pageSize，如果没有传json3，那么skipNum跟pageSize为零
            //db.articles.find({},{}),skip(0),limit(0); 的意思就是查询全部

             attr={};
             skipNum=0;
             pageSize=0;
    }else if(args.length==3){
            //当传入三个参数时
            //collectionName为表名
            //json1，为空object
            //json2 有值为{"title":1} 意思是只查title字段。
            //json3里面包含了skipNum跟 pageSize，如果没有传json3，那么skipNum跟pageSize为零
            //db.articles.find({},{"title":1}),skip(0).limit(0);
             attr=json2;
             skipNum=0;
             pageSize=0;
    }else if(args.length==4){
            //当传入四个参数时
            //collectionName为表名
            //json1，为空object
            //json2 有值为{"title":1} 意思是只查title字段。
            //json3里面包含了skipNum跟 pageSize有值。

            //db.articles.find({},{"title":1}),skip(5).limit(5);   一页5条的情况下是，返回第二也的5条记录。
             attr=json2; 
             let page=json3.page||1;           //如果传了json3但是里面没有page那么默认为1.
             pageSize=json3.pageSize ||10; //如果传了json3但是里面没有pageSize,那么默认为10，
             skipNum=(page-1)*pageSize;

             //排序部分的代码
             if(json3.sortCondition){
                 sortJson=json3.sortCondition;
             }else{
                 sortJson={};
             }
    }else{
        console.log("传入的参数出现了错误");
        
    }
    return new Promise(async(resolve,reject)=>{
        try{

            let db=await this.connect();
            let result=db.collection(collectionName).find(json1,{projection:attr}).sort(sortJson).skip(skipNum).limit(pageSize);
            result.toArray((err,docs)=>{
                resolve(docs);
            })
        }catch(err){
            reject(err);
        }
    })

}

    //json1 需要更新的对象， json2更新的信息
    update=(collectionName,json1,json2)=>{
        return new Promise(async(resolve,reject)=>{
            let db=await this.connect();
            db.collection(collectionName).updateOne(json1,{$set:json2},(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        });
    }
    
    updateEmbeddedDocument=(collectionName,child_id,json)=>{
        return new Promise(async(resolve,reject)=>{
            let db=await this.connect();
                db.collection(collectionName).updateOne(
                    {"secondCategories":{$elemMatch:{"_id":this.getObjectId(child_id)}}},
                    {$set:{"secondCategories.$":json}},
                    (err,result)=>{
                    if(err){
                        reject(err);
                    }else{
                        resolve(result);
                    }
                })
        });
    }

    //insert A new document in an embedded document
    insertEmbededDocument=(collectionName,json1,json2)=>{

        return new Promise(async(resolve,reject)=>{
            let db=await this.connect();
            db.collection(collectionName).updateOne(json1,{$push:json2},(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        });
    }

    insert=(collectionName,json)=>{
        return new Promise(async(resolve,reject)=>{
            let db=await this.connect();
            db.collection(collectionName).insertOne(json,(err,result)=>{
                if(err){
                    reject(err);
                    return
                }else{
                    resolve(result);
                }
            })
        })
    }

    //json就是条件。要满足什么条件才会被删除
    remove=(collectionName,json)=>{
        return new Promise(async(resolve,reject)=>{
            let db=await this.connect();
            db.collection(collectionName).removeOne(json,(err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        });
    }

    removeEmbeddedDocument=(collectionName,father_id,child_id)=>{
        return new Promise(async(resolve,reject)=>{
            let db=await this.connect();
            db.collection(collectionName).update(
                {"_id":this.getObjectId(father_id)},
                {$pull:{"secondCategories":{"_id":this.getObjectId(child_id)}}},
                (err,result)=>{
                if(err){
                    reject(err);
                }else{
                    resolve(result);
                }
            })
        });
    }

    getObjectId=(id)=>{
        //mongodb里面查询_id时，需要把字符串转换成object
        return new ObjectId(id); 
    }

    //统计数据表数据的数量。

    count=(collectionName,json)=>{
        return new Promise(async(resolve,reject)=>{
            let db=await this.connect();
            db.collection(collectionName).countDocuments(json,(err,result)=>{
                if(err){
                    reject(err);
                    return
                }else{
                    resolve(result);
                }
            })
        })
    }



}

module.exports=Db.getInstance();