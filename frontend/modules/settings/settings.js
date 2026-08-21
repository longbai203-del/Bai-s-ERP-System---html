/**
 * Settings Module - 系统设置
 */

(function() {
    'use strict';

    window.initSettings = function() {
        console.log('⚙️ Settings 模块加载完成');
        
        loadSettings();
        bindEvents();
    };

    // 加载设置
    async function loadSettings() {
        try {
            const settings = await window.SettingsService.getSystemSettings();
            
            // 填充表单
            const form = document.querySelector('.settings-form');
            if (!form) return;
            
            const inputs = form.querySelectorAll('[data-setting]');
            inputs.forEach(input => {
                const key = input.dataset.setting;
                if (settings[key] !== undefined) {
                    input.value = settings[key];
                }
            });
            
            // 更新显示
            updatePreview(settings);
        } catch (error) {
            console.error('加载设置失败:', error);
        }
    }

    // 更新预览
    function updatePreview(settings) {
        // 公司名称预览
        const el = document.querySelector($2); if (el) { el.textContent = settings.companyName || 'Bai\'s ERP'; }
        
        // 货币符号
        const currencySymbols = {
            'SAR': 'ر.س',
            'USD': '$',
            'EUR': '€',
            'CNY': '¥'
        };
        const el = document.querySelector($2); if (el) { el.textContent = currencySymbols[settings.currency] || 'ر.س'; }
        
        // 语言
        const languageNames = {
            'zh-CN': '简体中文',
            'en-US': 'English',
            'ar-SA': 'العربية'
        };
        const el = document.querySelector($2); if (el) { el.textContent = languageNames[settings.language] || '简体中文'; }
    }

    // 保存设置
    window.saveSettings = async function() {
        const form = document.querySelector('.settings-form');
        if (!form) return;
        
        const settings = {};
        const inputs = form.querySelectorAll('[data-setting]');
        inputs.forEach(input => {
            const key = input.dataset.setting;
            const value = input.type === 'checkbox' ? input.checked : input.value;
            settings[key] = value;
        });
        
        try {
            await window.SettingsService.setMultiple(settings, window._currentOrg?.id);
            window.Notifications.success('设置已保存');
            loadSettings();
        } catch (error) {
            window.Notifications.error('保存设置失败: ' + error.message);
        }
    };

    // 重置设置
    window.resetSettings = async function() {
        const confirmed = await window.Modal.confirm('确定要重置所有设置为默认值吗？');
        if (confirmed) {
            try {
                await window.SettingsService.reset(window._currentOrg?.id);
                window.Notifications.success('设置已重置');
                loadSettings();
            } catch (error) {
                window.Notifications.error('重置失败: ' + error.message);
            }
        }
    };

    // 切换语言
    window.changeLanguage = async function(locale) {
        try {
            await window.I18n.setLocale(locale);
            window.Notifications.success('语言已切换');
            loadSettings();
        } catch (error) {
            window.Notifications.error('切换语言失败: ' + error.message);
        }
    };

    // 绑定事件
    function bindEvents() {
        // 保存按钮
        document.querySelector('.btn-save-settings')?.addEventListener('click', window.saveSettings);
        
        // 重置按钮
        document.querySelector('.btn-reset-settings')?.addEventListener('click', window.resetSettings);
        
        // 语言切换
        document.querySelectorAll('.lang-switch').forEach(btn => {
            btn.addEventListener('click', () => {
                const locale = btn.dataset.locale;
                if (locale) window.changeLanguage(locale);
            });
        });
        
        // 实时预览
        document.querySelectorAll('[data-setting]').forEach(input => {
            input.addEventListener('change', () => {
                const form = document.querySelector('.settings-form');
                const inputs = form.querySelectorAll('[data-setting]');
                const settings = {};
                inputs.forEach(i => {
                    settings[i.dataset.setting] = i.value;
                });
                updatePreview(settings);
            });
        });
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="settings"]')) {
        window.initSettings();
    }

})();

