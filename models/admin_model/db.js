let MongoClient=require("mongodb").MongoClient;
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

    find=(collectionName,json)=>{
        return new Promise(async(resolve,reject)=>{
            try{

                let db=await this.connect();
                let result=db.collection(collectionName).find(json);
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
            db.collection(collectionName).update(json1,{$set:json2},(err,result)=>{
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

}



// let test1=Db.getInstance();

// test1.find("admin",{}).then((data)=>{
//     console.log(data);
// });

//test1=Db.getInstance();

module.exports=Db.getInstance();