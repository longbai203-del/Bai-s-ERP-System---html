/**
 * Bootstrap - 应用启动引导
 * 负责初始化所有核心模块
 */

(function() {
    'use strict';

    // 等待 DOM 加载完成
    document.addEventListener('DOMContentLoaded', async function() {
        console.log('🚀 Bai\'s ERP System v1.0.0 启动中...');

        try {
            // 1. 初始化 i18n
            if (window.I18n) {
                await window.I18n.init();
                console.log('✅ i18n 初始化完成');
            }

            // 2. 检查认证状态
            if (window.Auth) {
                const session = await window.Auth.getSession();
                const isAuthPage = window.location.pathname.includes('login') || 
                                   window.location.pathname.includes('register');
                
                if (!session && !isAuthPage) {
                    console.log('⏳ 未登录，跳转到登录页');
                    window.location.href = 'login.html';
                    return;
                }

                if (session && isAuthPage) {
                    console.log('✅ 已登录，跳转到首页');
                    window.location.href = 'index.html';
                    return;
                }

                if (session) {
                    console.log('✅ 用户已认证:', session.user.email);
                    // 加载用户数据
                    await loadUserData(session.user);
                }
            }

            // 3. 初始化路由
            if (window.Router) {
                window.Router.init();
                console.log('✅ Router 初始化完成');
            }

            // 4. 初始化通知系统
            if (window.Notifications) {
                await window.Notifications.init();
                console.log('✅ Notifications 初始化完成');
            }

            // 5. 初始化模态框组件
            if (window.Modal) {
                window.Modal.init();
                console.log('✅ Modal 初始化完成');
            }

            // 6. 初始化表格组件
            if (window.Table) {
                window.Table.init();
                console.log('✅ Table 初始化完成');
            }

            // 7. 加载模块
            await loadModules();

            // 8. 加载全局数据
            await loadGlobalData();

            console.log('✅ 应用启动完成!');
            
            // 触发启动完成事件
            document.dispatchEvent(new CustomEvent('app:ready'));

        } catch (error) {
            console.error('❌ 应用启动失败:', error);
            // 显示错误提示
            if (window.Notifications) {
                window.Notifications.error('应用加载失败，请刷新重试');
            }
        }
    });

    // 加载用户数据
    async function loadUserData(user) {
        try {
            if (window.DB) {
                const profile = await window.DB.getUserProfile(user.id);
                if (profile) {
                    window._currentUser = { ...user, profile };
                    // 更新 UI
                    updateUserUI(profile);
                }
            }
        } catch (error) {
            console.warn('加载用户数据失败:', error);
        }
    }

    // 更新用户界面
    function updateUserUI(profile) {
        const avatar = document.querySelector('.user-avatar');
        const name = document.querySelector('.user-name');
        if (avatar) avatar.textContent = profile.full_name?.charAt(0) || 'U';
        if (name) name.textContent = profile.full_name || '用户';
    }

    // 加载模块
    async function loadModules() {
        const moduleName = getCurrentModule();
        if (moduleName) {
            try {
                const script = document.createElement('script');
                script.src = `modules/${moduleName}/${moduleName}.js`;
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = reject;
                    document.head.appendChild(script);
                });
                console.log(`✅ 模块 ${moduleName} 加载完成`);
            } catch (error) {
                console.warn(`⚠️ 模块 ${moduleName} 加载失败:`, error);
            }
        }
    }

    function getCurrentModule() {
        const path = window.location.pathname;
        const match = path.match(/\/modules\/([^\/]+)\//);
        return match ? match[1] : null;
    }

    // 加载全局数据
    async function loadGlobalData() {
        try {
            if (window.DB) {
                // 加载组织信息
                const org = await window.DB.getCurrentOrganization();
                if (org) {
                    window._currentOrg = org;
                    document.title = `${org.name} - Bai's ERP`;
                }
            }
        } catch (error) {
            console.warn('加载全局数据失败:', error);
        }
    }

})();