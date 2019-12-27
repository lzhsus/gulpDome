function request(url, data = {}, type, showLoading=true) {
    var dtd = $.Deferred();
    if(showLoading){
        vueApp.Loading.open();
    }
    data.scene=""
    
    if(vueApp.taobao.isTaobao){
        data.sec = vueApp.taobao.sec;
    }
    let $ajax = {};
    if( type=='POST' ){
        $ajax = $.post(vueApp.config.serverPath + url, data)
    }else if( type=="GET" ){
        $ajax = $.get(vueApp.config.serverPath + url, data);         
    }else{
        $ajax = $.getJSON(vueApp.config.serverPath + url + '?callback=?', data);   
    }
    $ajax.done(res => {                
        if( res.errcode==42001 ){
        }else{
            dtd.resolve(res)
        }
    })
    .fail(res => {
        console.log(vueApp.config.serverPath + url,res)
        dtd.reject(res);
    })
    .always((res) => {
        if(showLoading){
            vueApp.Loading.close();
        }
    })
    return dtd;
}
function requestPro(url, data = {}, type, showLoading=true) {
    var dtd = $.Deferred();
    if(showLoading){
        vueApp.Loading.open();
    }
    data.scene=""
    
    if(vueApp.taobao.isTaobao){
        data.sec = vueApp.taobao.sec;
    }
    $.ajax({
        url:url,//地址
        dataType:'json',//数据类型  
        data:data,
        type:'GET',//类型
        processData: false, // 告诉jQuery不要去处理发送的数据
        contentType: false,// 告诉jQuery不要去设置Content-Type请求头
        cache: false,   //上传文件不需要缓存

        jsonpCallback:"cb",/*设置一个回调函数，名字随便取，和下面的函数里的名字相同就行*/
        timeout:2000,//超时
        //请求成功
        success:(data,status)=>{
            //alert(data);
            //alert(status);
        },
        //失败/超时
        error:(XMLHttpRequest,textStatus,errorThrown)=>{
            
        },
        complete:()=>{
            if(showLoading){
                vueApp.Loading.close();
            }
        }
    })
}