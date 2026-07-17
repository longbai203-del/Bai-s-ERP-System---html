// core/init.js
// 应用初始化

import { appStore } from './stores.js';

export async function initApp() {
    console.log('🔄 初始化应用...');
    
    // 检查用户登录状态
    const user = localStorage.getItem('user');
    if (user) {
        try {
            appStore.setState({ user: JSON.parse(user) });
        } catch (e) {
            console.warn('无效的用户数据');
        }
    }
    
    console.log('✅ 应用初始化完成');
    return appStore.getState();
}

// 自动初始化
export const appInit = initApp();
