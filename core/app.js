// core/app.js
// 应用主入口文件

import { loadLayout } from './layout-loader.js';

// 应用配置
const APP_CONFIG = {
    name: 'BAIERP',
    version: '1.0.0',
    env: 'development'
};

// 初始化应用
async function initApp() {
    console.log(🚀  v 启动中...);
    
    try {
        // 加载布局
        await loadLayout();
        console.log('✅ 应用初始化完成');
    } catch (error) {
        console.error('❌ 应用初始化失败:', error);
    }
}

// 页面加载完成后初始化
if (document.readyState === 'complete') {
    initApp();
} else {
    document.addEventListener('DOMContentLoaded', initApp);
}

// 导出应用实例
export default {
    config: APP_CONFIG,
    init: initApp
};
