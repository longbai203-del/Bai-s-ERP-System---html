// core/app.js
// BAI ERP 应用主入口

console.log('🚀 BAI ERP 应用启动中...');

// 应用配置
const APP_CONFIG = {
    name: 'BAI ERP',
    version: '1.0.0',
    env: 'development'
};

// 初始化应用
async function initApp() {
    console.log(📦  v);
    
    try {
        // 动态加载布局
        const { loadLayout } = await import('./layout-loader.js');
        await loadLayout();
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
