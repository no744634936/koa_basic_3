// let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

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


//object 上面不能这样用foreach
// params.forEach((key,value)=>{
//     array.push(`${key}=${value}`);
// })

//为什么要使用encodeURIComponent
//将一些特殊的字符转码(特殊字符包括=，/,%,&,+,-之类的)
// 为什么需要Url编码，通常如果一样东西需要编码，说明这样东西并不适合传输。
// 原因多种多样，如Size过大，包含隐私数据，
// 对于Url来说，之所 以要进行编码，是因为Url中有些字符会引起歧义。
//  例如Url参数字符串中使用key=value键值对这样的形式来传参，
//  键值对之间以&符号分隔，如/s?q=abc&ie=utf- 8。
//  如果你的value字符串中包含了=或者&，那么势必会造成接收Url的服务器解析错误，
//  因此必须将引起歧义的&和=符号进行转义， 也就是对其进行编码。
// 又如，Url的编码格式采用的是ASCII码，而不是Unicode，
// 这也就是说你不能在Url中包含任何非ASCII字符，例如中文。
// 否则如果客户端浏 览器和服务端浏览器支持的字符集不同的情况下，中文可能会造成问题。



