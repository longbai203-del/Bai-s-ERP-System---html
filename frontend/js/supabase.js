/**
 * Supabase 客户端 - 统一全局对象
 * 使用 window.Supabase 作为唯一入口
 */

(function() {
    'use strict';

    const SUPABASE_URL = 'https://qryllswlfryaywiajilr.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyeWxsc3dsZnJ5YXl3aWFqaWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MzUxMjgsImV4cCI6MjEwMjMxMTEyOH0.g0i02OViDEINfXLMksp1oWNKoactxOBlylyTdDXr5qs';

    let supabaseClient = null;
    let initPromise = null;

    function loadSDK() {
        return new Promise((resolve, reject) => {
            if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
                resolve(window.supabase);
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
            script.onload = function() {
                if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
                    resolve(window.supabase);
                } else {
                    reject(new Error('Supabase SDK 加载失败'));
                }
            };
            script.onerror = function() {
                reject(new Error('Supabase SDK 加载失败，请检查网络'));
            };
            document.head.appendChild(script);
        });
    }

    async function init() {
        if (supabaseClient) return supabaseClient;
        if (initPromise) return initPromise;

        initPromise = (async () => {
            try {
                const supabase = await loadSDK();
                supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
                console.log('✅ Supabase 客户端初始化成功');
                return supabaseClient;
            } catch (error) {
                console.error('❌ Supabase 初始化失败:', error);
                throw error;
            }
        })();

        return initPromise;
    }

    // 立即初始化
    init().catch(function(err) {
        console.warn('⚠️ Supabase 初始化警告:', err);
    });

    // 统一暴露为 window.Supabase
    window.Supabase = {
        init: init,
        getClient: function() {
            if (!supabaseClient) {
                throw new Error('Supabase 未初始化，请先调用 Supabase.init()');
            }
            return supabaseClient;
        },
        from: function(table) {
            return this.getClient().from(table);
        },
        auth: function() {
            return this.getClient().auth;
        },
        storage: function() {
            return this.getClient().storage;
        },
        functions: function() {
            return this.getClient().functions;
        },
        realtime: function() {
            return this.getClient().realtime;
        },
        channel: function(name) {
            return this.getClient().channel(name);
        },
        removeChannel: function(channel) {
            return this.getClient().removeChannel(channel);
        },
        getChannels: function() {
            return this.getClient().getChannels();
        },
        isReady: function() {
            return !!supabaseClient;
        }
    };

    // 兼容旧代码 - 同时暴露 window.supabaseClient
    Object.defineProperty(window, 'supabaseClient', {
        get: function() {
            return window.Supabase.getClient();
        },
        set: function(val) {
            console.warn('⚠️ window.supabaseClient 已弃用，请使用 window.Supabase');
        }
    });

    console.log('📦 Supabase 模块加载完成');
})();
