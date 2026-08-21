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

    async function loadSettings() {
        try {
            var settings = await window.SettingsService.getSystemSettings();
            var form = document.querySelector('.settings-form');
            if (!form) return;
            
            var inputs = form.querySelectorAll('[data-setting]');
            inputs.forEach(function(input) {
                var key = input.dataset.setting;
                if (settings[key] !== undefined) {
                    input.value = settings[key];
                }
            });
            
            updatePreview(settings);
        } catch (error) {
            console.error('加载设置失败:', error);
        }
    }

    function updatePreview(settings) {
        var el = document.querySelector('.preview-company');
        if (el) { el.textContent = settings.companyName || 'Bai\'s ERP'; }
        
        var currencySymbols = {
            'SAR': 'ر.س',
            'USD': '$',
            'EUR': '€',
            'CNY': '¥'
        };
        var el2 = document.querySelector('.preview-currency');
        if (el2) { el2.textContent = currencySymbols[settings.currency] || 'ر.س'; }
        
        var languageNames = {
            'zh-CN': '简体中文',
            'en-US': 'English',
            'ar-SA': 'العربية'
        };
        var el3 = document.querySelector('.preview-language');
        if (el3) { el3.textContent = languageNames[settings.language] || '简体中文'; }
    }

    window.saveSettings = async function() {
        var form = document.querySelector('.settings-form');
        if (!form) return;
        
        var settings = {};
        var inputs = form.querySelectorAll('[data-setting]');
        inputs.forEach(function(input) {
            var key = input.dataset.setting;
            settings[key] = input.type === 'checkbox' ? input.checked : input.value;
        });
        
        try {
            await window.SettingsService.setMultiple(settings, window._currentOrg?.id);
            window.Notifications.success('设置已保存');
            loadSettings();
        } catch (error) {
            window.Notifications.error('保存设置失败: ' + error.message);
        }
    };

    window.resetSettings = async function() {
        var confirmed = await window.Modal.confirm('确定要重置所有设置为默认值吗？');
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

    window.changeLanguage = async function(locale) {
        try {
            await window.I18n.setLocale(locale);
            window.Notifications.success('语言已切换');
            loadSettings();
        } catch (error) {
            window.Notifications.error('切换语言失败: ' + error.message);
        }
    };

    function bindEvents() {
        document.querySelector('.btn-save-settings')?.addEventListener('click', window.saveSettings);
        document.querySelector('.btn-reset-settings')?.addEventListener('click', window.resetSettings);
        
        document.querySelectorAll('.lang-switch').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var locale = this.dataset.locale;
                if (locale) window.changeLanguage(locale);
            });
        });
        
        document.querySelectorAll('[data-setting]').forEach(function(input) {
            input.addEventListener('change', function() {
                var form = document.querySelector('.settings-form');
                var inputs = form.querySelectorAll('[data-setting]');
                var settings = {};
                inputs.forEach(function(i) {
                    settings[i.dataset.setting] = i.value;
                });
                updatePreview(settings);
            });
        });
    }

    if (document.querySelector('[data-module="settings"]')) {
        window.initSettings();
    }

})();
