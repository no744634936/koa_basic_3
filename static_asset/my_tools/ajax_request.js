// let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
//require 只能在node.js里面用，这个js文件是要导入到html文件里面去的所以就不能require
//因为 浏览器是支持 XMLHttpRequest 的，所以不用require也可以用 XMLHttpRequest 的

let ajax={
    toggle:()=>{
        const request=new XMLHttpRequest();
        request.open("GET","http://localhost:3000/admin/manager/changeStatus/");
        request.send();
        request.addEventListener("readystatechange",()=>{
            if(request.readyState===4 && request.status===200){
                console.log(request.responseText);
            }else if(request.readyState===4){
                console.log("can not find data");
                
            }
        })
    }
}



