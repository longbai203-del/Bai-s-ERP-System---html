// core/layout-loader.js
// 布局加载器 - 负责加载导航栏和侧边栏

export async function loadLayout() {
    console.log('🔄 加载布局...');
    
    try {
        // 加载导航栏
        const navbarContainer = document.getElementById('navbar-container');
        if (navbarContainer) {
            const navbarRes = await fetch('/layouts/navbar.html');
            if (navbarRes.ok) {
                navbarContainer.innerHTML = await navbarRes.text();
                console.log('✅ 导航栏加载成功');
            } else {
                console.error('❌ 导航栏加载失败:', navbarRes.status);
            }
        }
        
        // 加载侧边栏
        const sidebarContainer = document.getElementById('sidebar-container');
        if (sidebarContainer) {
            const sidebarRes = await fetch('/layouts/sidebar.html');
            if (sidebarRes.ok) {
                sidebarContainer.innerHTML = await sidebarRes.text();
                console.log('✅ 侧边栏加载成功');
            } else {
                console.error('❌ 侧边栏加载失败:', sidebarRes.status);
            }
        }
        
        // 高亮当前菜单
        const currentPath = window.location.pathname;
        document.querySelectorAll('.sidebar-item, .nav-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href && currentPath.includes(href.replace('/', ''))) {
                item.classList.add('active');
            }
        });
        
        console.log('🎉 布局加载完成');
        
    } catch (error) {
        console.error('❌ 布局加载失败:', error);
    }
}

// 如果 DOM 已加载，立即执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLayout);
} else {
    loadLayout();
}
