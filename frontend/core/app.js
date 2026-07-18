// core/app.js
// 应用主入口

import { MENU_CONFIG } from '../config/modules.config.js';
import { loadModuleFromURL } from './module-loader.js';

console.log('🚀 BAI ERP 应用启动中...');

// ============================================================
// 渲染导航栏
// ============================================================
function renderNavbar() {
    const container = document.getElementById('navbar-container');
    if (!container) return;
    console.log('✅ 导航栏加载完成');
}

// ============================================================
// 渲染侧边栏
// ============================================================
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

    // ============================================================
    // 事件绑定
    // ============================================================

    // 主模块点击 - 折叠/展开
    container.querySelectorAll('.sidebar-module-header').forEach(function(header) {
        header.addEventListener('click', function(e) {
            e.stopPropagation();

            const moduleId = this.dataset.module;
            const children = this.nextElementSibling;
            const arrow = this.querySelector('.arrow');

            if (children) {
                children.classList.toggle('open');
                if (arrow) {
                    arrow.classList.toggle('open');
                }
            }

            // 高亮
            container.querySelectorAll('.sidebar-module-header').forEach(function(h) {
                h.classList.remove('active');
            });
            this.classList.add('active');

            // 加载模块
            import('./module-loader.js').then(function(module) {
                module.loadModule(moduleId, null);
            });
        });
    });

    // 子模块点击
    container.querySelectorAll('.sidebar-child-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.stopPropagation();

            const moduleId = this.dataset.module;
            const childId = this.dataset.child;

            // 高亮
            container.querySelectorAll('.sidebar-child-item').forEach(function(c) {
                c.classList.remove('active');
            });
            this.classList.add('active');

            // 高亮父模块
            container.querySelectorAll('.sidebar-module-header').forEach(function(h) {
                h.classList.remove('active');
            });
            const parentHeader = container.querySelector('.sidebar-module-header[data-module="' + moduleId + '"]');
            if (parentHeader) {
                parentHeader.classList.add('active');
                const arrow = parentHeader.querySelector('.arrow');
                if (arrow) {
                    arrow.classList.add('open');
                }
                const children = parentHeader.nextElementSibling;
                if (children) {
                    children.classList.add('open');
                }
            }

            // 加载模块
            import('./module-loader.js').then(function(module) {
                module.loadModule(moduleId, childId);
            });
        });
    });

    console.log('✅ 侧边栏渲染完成');
}

// ============================================================
// 初始化应用
// ============================================================
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
