import Vue from 'vue'
import 'vant/lib/vant-css/index.css';
// 引入固定资产
require('assets/scss/function.scss')


import Toast from 'path/to/@vant/weapp/dist/toast/toast';



export { Toast }


export function pageInit(app, data = {}) {
    return new Vue({
        el: "#app",
        data: data,
        // components: { app },
        render: h => h(app)
        /**
         * 置入路由
         */
        // router
    });
}
