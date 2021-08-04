var tracking={}

tracking.baiduInit=function(id){
    window['_hmt'] = window['_hmt'] || [];
    (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?"+id;
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
    })();

    $(document).on('click', "[data-tracking='baidu']", function(e){
        tracking.trackEvent($(this).data('text'),$(this).data('event'));
    }).on('touchstart', "[data-tracking-touch='baidu']", function(e){
        tracking.trackEvent($(this).data('text'),$(this).data('event'));
    });
}

tracking.trackEvent=function(text = '', event = 'click',label='') {
    if(window['_hmt']){
        _hmt.push(['_trackEvent', text, event, label]);
    }else{
        console.error('没有初始化百度统计代码');
    }
    
}

tracking.trackPageview=function(value) {
    if(window['_hmt']){
        _hmt.push(['_trackPageview', value]);
    }else{
        console.error('没有初始化百度统计代码');
    }
}

module.exports=tracking;