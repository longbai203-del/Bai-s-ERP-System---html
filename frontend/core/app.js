// core/app.js
// 应用主入口

import { loadLayout } from './layout-loader.js';
import { loadModuleFromURL } from './module-loader.js';

console.log('🚀 BAI ERP 应用启动中...');

const APP_CONFIG = {
    name: 'BAI ERP',
    version: '1.0.0',
    env: 'development'
};

async function initApp() {
    console.log("📦  v");
    
    try {
        // 加载布局（导航栏 + 侧边栏）
        await loadLayout();
        
        // 加载当前模块
        loadModuleFromURL();
        
        console.log('✅ 应用初始化完成');
    } catch (error) {
        console.error('❌ 应用初始化失败:', error);
    }
}

// DOM 加载完成后初始化
if (document.readyState === 'complete') {
    initApp();
} else {
    document.addEventListener('DOMContentLoaded', initApp);
}

export default APP_CONFIG;

