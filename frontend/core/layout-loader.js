// core/layout-loader.js
// 布局加载器 - 确保只加载一次

let layoutLoaded = false;

export async function loadLayout() {
    // 防止重复加载
    if (layoutLoaded) {
        console.log('⚠️ 布局已加载，跳过重复加载');
        return;
    }
    
    console.log('🔄 加载布局...');
    
    try {
        // 加载导航栏
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer && !navbarContainer.dataset.loaded) {
            const navbarRes = await fetch('/layouts/navbar.html');
            if (navbarRes.ok) {
                navbarContainer.innerHTML = await navbarRes.text();
                navbarContainer.dataset.loaded = 'true';
                console.log('✅ 导航栏加载成功');
            } else {
                console.error('❌ 导航栏加载失败:', navbarRes.status);
            }
        }
        
        // 加载侧边栏
        const sidebarContainer = document.getElementById('sidebar-container');
        if (sidebarContainer && !sidebarContainer.dataset.loaded) {
            const sidebarRes = await fetch('/layouts/sidebar.html');
            if (sidebarRes.ok) {
                sidebarContainer.innerHTML = await sidebarRes.text();
                sidebarContainer.dataset.loaded = 'true';
                console.log('✅ 侧边栏加载成功');
            } else {
                console.error('❌ 侧边栏加载失败:', sidebarRes.status);
            }
        }
        
        // 高亮当前菜单
        const currentPath = window.location.pathname;
        document.querySelectorAll('.sidebar-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href && currentPath.includes(href.replace('/', ''))) {
                item.classList.add('active');
            }
        });
        
        layoutLoaded = true;
        console.log('🎉 布局加载完成');
        
    } catch (error) {
        console.error('❌ 布局加载失败:', error);
    }
}

// 自动初始化 - 只在 DOM 加载完成后执行一次
if (document.readyState === 'complete') {
    if (!layoutLoaded) loadLayout();
} else {
    document.addEventListener('DOMContentLoaded', function() {
        if (!layoutLoaded) loadLayout();
    });
}

