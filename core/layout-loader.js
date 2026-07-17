// core/layout-loader.js
// 布局加载器 - 修复版

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
                
                // 为移动端添加遮罩
                const overlay = document.createElement('div');
                overlay.className = 'sidebar-overlay';
                overlay.id = 'sidebar-overlay';
                document.body.appendChild(overlay);
                
                // 移动端切换
                const toggleBtn = document.querySelector('.navbar-toggle');
                if (toggleBtn) {
                    toggleBtn.addEventListener('click', function() {
                        sidebarContainer.classList.toggle('open');
                        overlay.classList.toggle('show');
                    });
                }
                
                overlay.addEventListener('click', function() {
                    sidebarContainer.classList.remove('open');
                    overlay.classList.remove('show');
                });
                
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
        
        console.log('🎉 布局加载完成');
        
    } catch (error) {
        console.error('❌ 布局加载失败:', error);
    }
}

// 自动初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadLayout);
} else {
    loadLayout();
}
