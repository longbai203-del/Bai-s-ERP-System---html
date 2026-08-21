/**
 * Auth - 认证管理
 * 统一使用 window.Supabase
 */

(function() {
    'use strict';

    class Auth {
        constructor() {
            this.currentUser = null;
            this.session = null;
        }

        async _ensureInit() {
            if (!window.Supabase) {
                throw new Error('Supabase 未加载');
            }
            if (window.Supabase.isReady && window.Supabase.isReady()) {
                return;
            }
            await window.Supabase.init();
        }

        getClient() {
            if (!window.Supabase || !window.Supabase.getClient) {
                throw new Error('Supabase 未初始化');
            }
            return window.Supabase.getClient();
        }

        async register(email, password, fullName, organizationName) {
            try {
                await this._ensureInit();
                const client = this.getClient();

                const { data: authData, error: authError } = await client.auth.signUp({
                    email: email,
                    password: password,
                    options: {
                        data: { full_name: fullName }
                    }
                });

                if (authError) throw authError;
                if (!authData.user) throw new Error('注册失败');

                const { data: orgData, error: orgError } = await client
                    .from('organizations')
                    .insert([{
                        name: organizationName || fullName + '的公司',
                        code: 'ORG' + Date.now().toString().slice(-6),
                        status: 'active'
                    }])
                    .select()
                    .single();

                if (orgError) throw orgError;

                const { data: branchData, error: branchError } = await client
                    .from('branches')
                    .insert([{
                        organization_id: orgData.id,
                        name: '总部',
                        code: 'HQ' + Date.now().toString().slice(-4),
                        status: 'active'
                    }])
                    .select()
                    .single();

                if (branchError) throw branchError;

                const { error: profileError } = await client
                    .from('profiles')
                    .insert([{
                        id: authData.user.id,
                        organization_id: orgData.id,
                        branch_id: branchData.id,
                        full_name: fullName,
                        status: 'active'
                    }]);

                if (profileError) throw profileError;

                return { success: true, user: authData.user };

            } catch (error) {
                console.error('注册失败:', error);
                return { success: false, error: error.message };
            }
        }

        async login(email, password) {
            try {
                await this._ensureInit();
                const client = this.getClient();

                const { data, error } = await client.auth.signInWithPassword({
                    email: email,
                    password: password
                });

                if (error) throw error;

                this.currentUser = data.user;
                this.session = data.session;
                await this.loadProfile();

                return { success: true, user: data.user };

            } catch (error) {
                console.error('登录失败:', error);
                return { success: false, error: error.message };
            }
        }

        async logout() {
            try {
                await this._ensureInit();
                const client = this.getClient();
                const { error } = await client.auth.signOut();
                if (error) throw error;

                this.currentUser = null;
                this.session = null;
                window._currentUser = null;

                return { success: true };

            } catch (error) {
                console.error('登出失败:', error);
                return { success: false, error: error.message };
            }
        }

        async getSession() {
            try {
                await this._ensureInit();
                const client = this.getClient();
                const { data, error } = await client.auth.getSession();
                if (error) throw error;

                if (data.session) {
                    this.currentUser = data.session.user;
                    this.session = data.session;
                    await this.loadProfile();
                }

                return data.session;

            } catch (error) {
                console.error('获取会话失败:', error);
                return null;
            }
        }

        async loadProfile() {
            if (!this.currentUser) return null;

            try {
                await this._ensureInit();
                const client = this.getClient();
                const { data, error } = await client
                    .from('profiles')
                    .select('*')
                    .eq('id', this.currentUser.id)
                    .single();

                if (error) throw error;

                this.currentUser.profile = data;
                window._currentUser = this.currentUser;

                return data;

            } catch (error) {
                console.error('加载用户资料失败:', error);
                return null;
            }
        }

        getCurrentUser() {
            return this.currentUser;
        }

        isAuthenticated() {
            return !!this.currentUser && !!this.session;
        }

        async resetPassword(email) {
            try {
                await this._ensureInit();
                const client = this.getClient();
                const { error } = await client.auth.resetPasswordForEmail(email);
                if (error) throw error;
                return { success: true };
            } catch (error) {
                console.error('重置密码失败:', error);
                return { success: false, error: error.message };
            }
        }

        async updatePassword(newPassword) {
            try {
                await this._ensureInit();
                const client = this.getClient();
                const { error } = await client.auth.updateUser({
                    password: newPassword
                });
                if (error) throw error;
                return { success: true };
            } catch (error) {
                console.error('更新密码失败:', error);
                return { success: false, error: error.message };
            }
        }
    }

    // 统一暴露为 window.Auth
    window.Auth = new Auth();

    // 兼容旧代码
    Object.defineProperty(window, 'authManager', {
        get: function() {
            console.warn('⚠️ window.authManager 已弃用，请使用 window.Auth');
            return window.Auth;
        }
    });

    console.log('🔐 Auth 模块加载完成');
})();
