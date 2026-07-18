// core/app.js
// 应用主入口

import { MENU_CONFIG } from '../config/modules.config.js';
import { loadModuleFromURL } from './module-loader.js';

console.log('🚀 BAI ERP 应用启动中...');

// 渲染侧边栏
function renderSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    let html = '';
    MENU_CONFIG.forEach(function(module) {
        const hasChildren = module.children && module.children.length > 0;
        const icon = module.icon || '📄';

        html += '<div class="sidebar-module">';
        html += '<div class="sidebar-module-header" data-module="' + module.id + '">';
        html += '<span class="icon">' + icon + '</span>';
        html += '<span class="label">' + module.label + '</span>';
        if (hasChildren) {
            html += '<span class="arrow">▶</span>';
        }
        html += '</div>';

        if (hasChildren) {
            html += '<div class="sidebar-children">';
            module.children.forEach(function(child) {
                html += '<div class="sidebar-child-item" data-module="' + module.id + '" data-child="' + child.id + '">';
                html += '<span class="dot"></span>';
                html += '<span>' + child.label + '</span>';
                html += '</div>';
            });
            html += '</div>';
        }
        html += '</div>';
    });

    container.innerHTML = html;

    // 事件绑定
    container.querySelectorAll('.sidebar-module-header').forEach(function(header) {
        header.addEventListener('click', function() {
            const children = this.nextElementSibling;
            const arrow = this.querySelector('.arrow');
            if (children) {
                children.classList.toggle('open');
                if (arrow) arrow.classList.toggle('open');
            }
        });
    });

    container.querySelectorAll('.sidebar-child-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const moduleId = this.dataset.module;
            const childId = this.dataset.child;
            import('./module-loader.js').then(function(m) {
                m.loadModule(moduleId, childId);
            });
        });
    });

    console.log('✅ 侧边栏渲染完成');
}

// 渲染导航栏
function renderNavbar() {
    const container = document.getElementById('navbar-container');
    if (!container) return;
    // 导航栏已在 HTML 中硬编码，不需要额外渲染
    console.log('✅ 导航栏加载完成');
}

// 初始化应用
async function initApp() {
    console.log('📦 初始化应用...');

    try {
        renderNavbar();
        renderSidebar();
        loadModuleFromURL();
        console.log('✅ 应用初始化完成');
    } catch (error) {
        console.error('❌ 初始化失败:', error);
    }
}

// 启动
if (document.readyState === 'complete') {
    initApp();
} else {
    document.addEventListener('DOMContentLoaded', initApp);
}

export default { initApp };
