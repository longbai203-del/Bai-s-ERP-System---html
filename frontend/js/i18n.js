/**
 * i18n - 国际化多语言支持
 */

(function() {
    'use strict';

    class I18n {
        constructor() {
            this.locale = 'zh-CN';
            this.translations = {};
            this.supportedLocales = ['zh-CN', 'en-US', 'ar-SA'];
            this.fallbackLocale = 'zh-CN';
        }

        // 初始化
        async init() {
            // 从 localStorage 读取语言设置
            const saved = localStorage.getItem('bais_locale');
            if (saved && this.supportedLocales.includes(saved)) {
                this.locale = saved;
            } else {
                // 自动检测浏览器语言
                const browserLang = navigator.language;
                if (this.supportedLocales.includes(browserLang)) {
                    this.locale = browserLang;
                } else if (browserLang.startsWith('ar')) {
                    this.locale = 'ar-SA';
                } else if (browserLang.startsWith('en')) {
                    this.locale = 'en-US';
                }
            }

            await this.loadLocale(this.locale);
            this.applyTranslations();
            this.handleRTL();
            
            console.log('🌍 i18n initialized with locale:', this.locale);
        }

        // 加载语言包
        async loadLocale(locale) {
            try {
                const response = await fetch(`/locales/${locale}.json`);
                if (!response.ok) throw new Error(`Locale ${locale} not found`);
                this.translations = await response.json();
            } catch (error) {
                console.warn(`加载语言包 ${locale} 失败，使用回退语言`, error);
                if (locale !== this.fallbackLocale) {
                    await this.loadLocale(this.fallbackLocale);
                }
            }
        }

        // 切换语言
        async setLocale(locale) {
            if (!this.supportedLocales.includes(locale)) {
                console.warn(`不支持的语种: ${locale}`);
                return;
            }

            if (locale === this.locale) return;

            await this.loadLocale(locale);
            this.locale = locale;
            localStorage.setItem('bais_locale', locale);
            
            this.applyTranslations();
            this.handleRTL();
            
            // 触发语言变化事件
            document.dispatchEvent(new CustomEvent('locale:changed', { 
                detail: { locale } 
            }));

            console.log(`🌍 Language switched to: ${locale}`);
        }

        // 翻译
        t(key, params = {}) {
            let text = this.translations[key] || key;
            
            // 替换参数
            for (const [k, v] of Object.entries(params)) {
                text = text.replace(new RegExp(`{{${k}}}`, 'g'), v);
            }
            
            return text;
        }

        // 获取当前语言
        getLocale() {
            return this.locale;
        }

        // 获取所有支持的语言
        getSupportedLocales() {
            return this.supportedLocales;
        }

        // 应用翻译到页面
        applyTranslations() {
            // 翻译 data-i18n 属性
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                el.textContent = this.t(key);
            });

            // 翻译 placeholder
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.getAttribute('data-i18n-placeholder');
                el.placeholder = this.t(key);
            });

            // 翻译 title
            document.querySelectorAll('[data-i18n-title]').forEach(el => {
                const key = el.getAttribute('data-i18n-title');
                el.title = this.t(key);
            });
        }

        // 处理 RTL 布局
        handleRTL() {
            const isRTL = this.locale === 'ar-SA';
            document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
            document.documentElement.lang = this.locale;
            
            if (isRTL) {
                document.body.classList.add('rtl');
                document.body.classList.remove('ltr');
            } else {
                document.body.classList.add('ltr');
                document.body.classList.remove('rtl');
            }
        }

        // 格式化日期
        formatDate(date, options = {}) {
            const d = new Date(date);
            return d.toLocaleDateString(this.locale, options);
        }

        // 格式化时间
        formatTime(date, options = {}) {
            const d = new Date(date);
            return d.toLocaleTimeString(this.locale, options);
        }

        // 格式化数字
        formatNumber(num, options = {}) {
            return new Intl.NumberFormat(this.locale, options).format(num);
        }

        // 格式化货币
        formatCurrency(amount, currency = 'SAR') {
            return new Intl.NumberFormat(this.locale, {
                style: 'currency',
                currency: currency
            }).format(amount);
        }

        // 格式化百分比
        formatPercent(value) {
            return new Intl.NumberFormat(this.locale, {
                style: 'percent'
            }).format(value);
        }
    }

    // 导出
    window.I18n = new I18n();

})();