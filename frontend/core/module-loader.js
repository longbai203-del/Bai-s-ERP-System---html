// core/module-loader.js
// 动态加载模块

import { MENU_CONFIG } from '../config/modules.config.js';

let currentModule = null;
let currentChild = null;

// 加载模块
export async function loadModule(moduleId, childId) {
    const module = MENU_CONFIG.find(function(m) { return m.id === moduleId; });
    if (!module) {
        console.error('❌ 模块不存在:', moduleId);
        return;
    }

    currentModule = moduleId;
    currentChild = childId || (module.children && module.children.length > 0 ? module.children[0].id : null);

    console.log('📦 加载模块:', moduleId, '->', currentChild);

    updateSidebarActive(moduleId, currentChild);
    await loadPageContent(module, currentChild);
    await loadModuleScript(module, currentChild);
}

// 加载页面内容
async function loadPageContent(module, childId) {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // 查找子模块
    const child = module.children.find(function(c) { return c.id === childId; });
    
    // 获取文件路径
    let filePath = child ? child.file : 'index.html';
    let modulePath = child ? child.modulePath : module.modulePath;

    // 构建完整路径: modules/01-dashboard/dashboard/dashboard.html
    const htmlPath = 'modules/' + modulePath + '/' + filePath;

    console.log('📄 加载页面:', htmlPath);

    try {
        const response = await fetch(htmlPath);
        if (response.ok) {
            let html = await response.text();
            const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
            if (bodyMatch) {
                html = bodyMatch[1];
            }
            html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
            mainContent.innerHTML = html;
            console.log('✅ 页面加载成功');
        } else {
            mainContent.innerHTML =
                '<div style="padding:40px;text-align:center;">' +
                '<h2 style="color:#ef4444;">⚠️ 页面加载失败</h2>' +
                '<p style="color:#64748b;">' + htmlPath + ' (' + response.status + ')</p>' +
                '</div>';
        }
    } catch (error) {
        console.error('❌ 加载页面失败:', error);
        mainContent.innerHTML =
            '<div style="padding:40px;text-align:center;">' +
            '<h2 style="color:#ef4444;">⚠️ 加载错误</h2>' +
            '<p style="color:#64748b;">' + error.message + '</p>' +
            '</div>';
    }
}

// 加载模块JS
async function loadModuleScript(module, childId) {
    const child = module.children.find(function(c) { return c.id === childId; });
    
    let filePath = child ? child.file : 'index.js';
    let modulePath = child ? child.modulePath : module.modulePath;

    // 构建JS路径: modules/01-dashboard/dashboard/dashboard.js
    const jsPath = 'modules/' + modulePath + '/' + filePath.replace('.html', '.js');

    console.log('📜 加载脚本:', jsPath);

    try {
        const oldScript = document.getElementById('module-script');
        if (oldScript) {
            oldScript.remove();
        }

        const script = document.createElement('script');
        script.id = 'module-script';
        script.type = 'module';
        script.src = jsPath;
        script.onload = function() {
            console.log('✅ 脚本加载成功');
        };
        script.onerror = function() {
            console.warn('⚠️ 脚本加载失败（可能不存在）:', jsPath);
        };
        document.body.appendChild(script);
    } catch (error) {
        console.warn('⚠️ 加载脚本失败:', error);
    }
}

// 更新侧边栏高亮
function updateSidebarActive(moduleId, childId) {
    document.querySelectorAll('.sidebar-item').forEach(function(el) {
        el.classList.remove('active');
    });

    var moduleLink = document.querySelector('.sidebar-item[data-module="' + moduleId + '"]');
    if (moduleLink) {
        moduleLink.classList.add('active');
    }

    var childLink = document.querySelector('.sidebar-item[data-child="' + childId + '"]');
    if (childLink) {
        childLink.classList.add('active');
    }
}

// 从URL加载模块
export function loadModuleFromURL() {
    var params = new URLSearchParams(window.location.search);
    var moduleId = params.get('module') || 'dashboard';
    var childId = params.get('child') || null;
    loadModule(moduleId, childId);
}

window.addEventListener('hashchange', function() {
    loadModuleFromURL();
});

document.addEventListener('DOMContentLoaded', loadModuleFromURL);
