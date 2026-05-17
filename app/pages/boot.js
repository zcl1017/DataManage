import { createApp } from 'vue';

// 引入elementui
import ElementUI from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import pinia from '$store';
import { createRouter, createWebHashHistory } from 'vue-router';
import './assserts/custom.css';
import 'element-plus/theme-chalk/dark/css-vars.css';

/*
 * vue 页面主入口，用于启动 vue
 * @param pageComponent 页面根组件
 */
export default (pageComponent, { routes, libs } = {}) => {
    const app = createApp(pageComponent);

    app.use(ElementUI);
    app.use(pinia);

    // 引入第三方包
    if (libs && libs.length) {
        for (let i = 0; i < libs.length; ++i) {
            app.use(libs[i]);
        }
    }

    // 页面路由
    if (routes && routes.length) {
        // 页面路由
        const router = createRouter({
            history: createWebHashHistory(), // hash
            routes
        });
        app.use(router);
        router.isReady().then(() => {
            app.mount('#root');
        });
    } else {
        app.mount('#root');
    }
};