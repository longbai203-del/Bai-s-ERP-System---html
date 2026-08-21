/**
 * Supabase 客户端 - 使用 CDN 同步加载
 */

(function() {
    'use strict';

    const SUPABASE_URL = 'https://qryllswlfryaywiajilr.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyeWxsc3dsZnJ5YXl3aWFqaWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MzUxMjgsImV4cCI6MjEwMjMxMTEyOH0.g0i02OViDEINfXLMksp1oWNKoactxOBlylyTdDXr5qs';

    let supabaseClient = null;
    let initPromise = null;

    // 加载 Supabase SDK
    function loadSupabaseSDK() {
        return new Promise((resolve, reject) => {
            // 如果已经存在
            if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
                resolve(window.supabase);
                return;
            }

            // 检查是否已有 script 标签
            const existingScript = document.querySelector('script[src*="supabase"]');
            if (existingScript) {
                existingScript.addEventListener('load', function() {
                    if (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') {
                        resolve(window.supabase);
                    } else {
                        reject(new Error('Supabase SDK 加载失败'));
                    }
                });
                return;
            }

            // 创建 script 标签
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.min.js';
            script.async = true;
            
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

    // 初始化 Supabase
    async function initSupabase() {
        if (supabaseClient) {
            return supabaseClient;
        }

        if (initPromise) {
            return initPromise;
        }

        initPromise = (async () => {
            try {
                const supabase = await loadSupabaseSDK();
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

    // 立即初始化（非阻塞）
    initSupabase().catch(function(err) {
        console.warn('⚠️ Supabase 初始化警告:', err);
    });

    // 暴露 API
    window.Supabase = {
        // 确保初始化完成
        init: function() {
            return initSupabase();
        },

        // 获取客户端（同步，如果未初始化则抛出错误）
        getClient: function() {
            if (!supabaseClient) {
                throw new Error('Supabase 客户端未初始化，请先调用 Supabase.init()');
            }
            return supabaseClient;
        },

        // 从表查询
        from: function(table) {
            return this.getClient().from(table);
        },

        // 认证
        auth: function() {
            return this.getClient().auth;
        },

        // 存储
        storage: function() {
            return this.getClient().storage;
        },

        // 函数
        functions: function() {
            return this.getClient().functions;
        },

        // 实时
        realtime: function() {
            return this.getClient().realtime;
        },

        // 通道
        channel: function(name) {
            return this.getClient().channel(name);
        },

        removeChannel: function(channel) {
            return this.getClient().removeChannel(channel);
        },

        getChannels: function() {
            return this.getClient().getChannels();
        },

        // 检查是否就绪
        isReady: function() {
            return !!supabaseClient;
        }
    };

    console.log('📦 Supabase 模块加载完成');
})();
