// frontend/js/storage.js
// 缓存与存储管理模块

class StorageManager {
    constructor() {
        this.prefix = 'erp_';
        this.cacheTTL = 5 * 60 * 1000;
    }

    set(key, value) {
        try {
            const data = {
                value: value,
                timestamp: Date.now()
            };
            localStorage.setItem(this.prefix + key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('存储数据失败:', error);
            return false;
        }
    }

    get(key) {
        try {
            const raw = localStorage.getItem(this.prefix + key);
            if (!raw) return null;
            const data = JSON.parse(raw);
            return data.value;
        } catch (error) {
            console.error('读取数据失败:', error);
            return null;
        }
    }

    getWithCache(key, maxAge) {
        try {
            const raw = localStorage.getItem(this.prefix + key);
            if (!raw) return null;
            const data = JSON.parse(raw);
            const age = Date.now() - data.timestamp;
            const ttl = maxAge || this.cacheTTL;
            if (age > ttl) {
                localStorage.removeItem(this.prefix + key);
                return null;
            }
            return data.value;
        } catch (error) {
            console.error('读取缓存数据失败:', error);
            return null;
        }
    }

    remove(key) {
        localStorage.removeItem(this.prefix + key);
    }

    clear() {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                localStorage.removeItem(key);
            }
        });
    }

    setSession(key, value) {
        try {
            sessionStorage.setItem(this.prefix + key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('存储会话数据失败:', error);
            return false;
        }
    }

    getSession(key) {
        try {
            const raw = sessionStorage.getItem(this.prefix + key);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (error) {
            console.error('读取会话数据失败:', error);
            return null;
        }
    }

    removeSession(key) {
        sessionStorage.removeItem(this.prefix + key);
    }

    clearSession() {
        const keys = Object.keys(sessionStorage);
        keys.forEach(key => {
            if (key.startsWith(this.prefix)) {
                sessionStorage.removeItem(key);
            }
        });
    }

    cacheUser(user) {
        this.set('user', user);
        this.setSession('user', user);
    }

    getCachedUser() {
        return this.getSession('user') || this.get('user');
    }

    cacheProfile(profile) {
        this.set('profile', profile);
        this.setSession('profile', profile);
    }

    getCachedProfile() {
        return this.getSession('profile') || this.get('profile');
    }

    cachePermissions(permissions) {
        this.set('permissions', permissions);
    }

    getCachedPermissions() {
        return this.get('permissions');
    }

    cacheList(key, data) {
        this.set('list_' + key, data);
    }

    getCachedList(key, maxAge) {
        return this.getWithCache('list_' + key, maxAge);
    }

    clearAll() {
        this.clear();
        this.clearSession();
    }
}

const storage = new StorageManager();
window.storage = storage;

console.log('✅ 存储模块初始化完成');
