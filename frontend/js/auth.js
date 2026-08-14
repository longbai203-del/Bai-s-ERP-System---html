// frontend/js/auth.js
// 认证管理模块

class AuthManager {
    constructor() {
        this.supabase = window.supabaseClient;
        this.currentUser = null;
        this.currentSession = null;
        this.userProfile = null;
        this.init();
    }

    async init() {
        // 检查当前会话
        const { data: { session }, error } = await this.supabase.auth.getSession();
        if (error) {
            console.error('获取会话失败:', error);
            return;
        }
        
        if (session) {
            this.currentSession = session;
            this.currentUser = session.user;
            await this.loadUserProfile();
        }

        // 监听认证状态变化
        this.supabase.auth.onAuthStateChange((event, session) => {
            console.log('认证状态变化:', event);
            if (event === 'SIGNED_IN' && session) {
                this.currentSession = session;
                this.currentUser = session.user;
                this.loadUserProfile();
            } else if (event === 'SIGNED_OUT') {
                this.currentSession = null;
                this.currentUser = null;
                this.userProfile = null;
                if (!window.location.pathname.includes('login.html')) {
                    window.location.href = '/login.html';
                }
            }
        });
    }

    async login(email, password) {
        try {
            const { data, error } = await this.supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            this.currentSession = data.session;
            this.currentUser = data.user;
            await this.loadUserProfile();

            return { success: true, user: data.user };
        } catch (error) {
            console.error('登录失败:', error);
            return { success: false, error: error.message };
        }
    }

    async logout() {
        try {
            const { error } = await this.supabase.auth.signOut();
            if (error) throw error;
            
            this.currentSession = null;
            this.currentUser = null;
            this.userProfile = null;
            
            return { success: true };
        } catch (error) {
            console.error('登出失败:', error);
            return { success: false, error: error.message };
        }
    }

    async register(email, password, userData) {
        try {
            const { data, error } = await this.supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: userData
                }
            });

            if (error) throw error;

            if (data.user) {
                await this.createProfile(data.user.id, userData);
            }

            return { success: true, user: data.user };
        } catch (error) {
            console.error('注册失败:', error);
            return { success: false, error: error.message };
        }
    }

    async createProfile(userId, userData) {
        try {
            const { error } = await this.supabase
                .from('profiles')
                .insert([{
                    id: userId,
                    full_name: userData.full_name || '',
                    phone: userData.phone || '',
                    organization_id: userData.organization_id || null,
                    branch_id: userData.branch_id || null,
                    job_title: userData.job_title || ''
                }]);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('创建用户配置失败:', error);
            return { success: false, error: error.message };
        }
    }

    async loadUserProfile() {
        if (!this.currentUser) return null;

        try {
            const { data, error } = await this.supabase
                .from('profiles')
                .select('*')
                .eq('id', this.currentUser.id)
                .single();

            if (error) throw error;

            this.userProfile = data;
            return data;
        } catch (error) {
            console.error('加载用户配置失败:', error);
            return null;
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    getCurrentSession() {
        return this.currentSession;
    }

    getUserProfile() {
        return this.userProfile;
    }

    isAuthenticated() {
        return !!this.currentUser && !!this.currentSession;
    }

    async hasRole(roleCode) {
        if (!this.currentUser) return false;

        try {
            const { data, error } = await this.supabase
                .from('user_roles')
                .select('roles(code)')
                .eq('user_id', this.currentUser.id)
                .eq('roles.code', roleCode);

            if (error) throw error;
            return data && data.length > 0;
        } catch (error) {
            console.error('检查角色失败:', error);
            return false;
        }
    }
}

const authManager = new AuthManager();
window.authManager = authManager;

console.log('✅ 认证模块初始化完成');
