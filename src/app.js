import Vue from 'vue'
// 引入固定资产
require('assets/scss/function.scss')




/**
 * 事件管理中心
 */
export const globalDispatcher = new Vue();


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
