// ============================================================
// BAI ERP - 主模块统一入口文件
// 生成时间: 2026-07-16 11:54:17
// ============================================================

// 模块注册表
const MODULE_REGISTRY = {};

// 注册模块函数
export function registerModule(name, module) {
    MODULE_REGISTRY[name] = module;
    console.log(✅ 模块 \ 已注册);
}

// 获取模块
export function getModule(name) {
    return MODULE_REGISTRY[name] || null;
}

// 加载模块
export function loadModule(name) {
    const module = getModule(name);
    if (module && module.onLoad) {
        try {
            module.onLoad();
            return true;
        } catch(e) {
            console.warn(⚠️ 模块 \ 加载失败:, e.message);
            return false;
        }
    }
    return false;
}

// 初始化所有模块
export function initAllModules() {
    console.log('🚀 初始化所有模块...');
    for (const [name, module] of Object.entries(MODULE_REGISTRY)) {
        if (module.init) {
            try {
                module.init();
                console.log(   ✅ \ 初始化成功);
            } catch(e) {
                console.warn(   ⚠️ \ 初始化失败:, e.message);
            }
        }
    }
}

console.log('📦 模块加载器已初始化');
