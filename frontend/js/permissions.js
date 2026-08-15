// frontend/js/permissions.js
// 权限管理模块

class PermissionManager {
    constructor() {
        this.auth = window.authManager;
        this.supabase = window.supabaseClient;
        this.permissionsCache = null;
    }

    async loadUserPermissions(userId) {
        if (!userId) userId = this.auth.currentUser?.id;
        if (!userId) return [];

        try {
            const { data, error } = await this.supabase
                .from('user_roles')
                .select(
                    roles (
                        role_permissions (
                            permissions (
                                resource,
                                action
                            )
                        )
                    )
                )
                .eq('user_id', userId);

            if (error) throw error;

            const permissions = [];
            data.forEach(userRole => {
                if (userRole.roles && userRole.roles.role_permissions) {
                    userRole.roles.role_permissions.forEach(rp => {
                        if (rp.permissions) {
                            permissions.push({
                                resource: rp.permissions.resource,
                                action: rp.permissions.action
                            });
                        }
                    });
                }
            });

            this.permissionsCache = permissions;
            return permissions;
        } catch (error) {
            console.error('加载权限失败:', error);
            return [];
        }
    }

    hasPermission(resource, action) {
        if (!this.permissionsCache) {
            this.loadUserPermissions();
            return false;
        }

        return this.permissionsCache.some(p => 
            p.resource === resource && p.action === action
        );
    }

    hasAnyPermission(permissions) {
        if (!this.permissionsCache) {
            this.loadUserPermissions();
            return false;
        }

        return permissions.some(({ resource, action }) =>
            this.permissionsCache.some(p => 
                p.resource === resource && p.action === action
            )
        );
    }

    hasAllPermissions(permissions) {
        if (!this.permissionsCache) {
            this.loadUserPermissions();
            return false;
        }

        return permissions.every(({ resource, action }) =>
            this.permissionsCache.some(p => 
                p.resource === resource && p.action === action
            )
        );
    }

    async isSuperAdmin() {
        if (!this.auth.currentUser) return false;
        return await this.auth.hasRole('super_admin');
    }

    getAvailableResources() {
        if (!this.permissionsCache) return [];
        const resources = new Set();
        this.permissionsCache.forEach(p => resources.add(p.resource));
        return Array.from(resources);
    }

    getResourceActions(resource) {
        if (!this.permissionsCache) return [];
        return this.permissionsCache
            .filter(p => p.resource === resource)
            .map(p => p.action);
    }
}

const permissions = new PermissionManager();
window.permissions = permissions;

console.log('✅ 权限模块初始化完成');
