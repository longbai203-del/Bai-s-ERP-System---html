/**
 * Notifications - 通知系统
 * 支持 Toast 提示、站内通知、浏览器通知
 */

(function() {
    'use strict';

    class Notifications {
        constructor() {
            this.container = null;
            this.permission = false;
            this.notifications = [];
            this.unreadCount = 0;
        }

        // 初始化
        async init() {
            this.createContainer();
            await this.requestPermission();
            
            // 加载未读通知
            await this.loadNotifications();
            
            // 更新通知徽章
            this.updateBadge();
            
            console.log('🔔 Notifications initialized');
        }

        // 创建通知容器
        createContainer() {
            if (this.container) return;
            
            this.container = document.createElement('div');
            this.container.className = 'notification-container';
            this.container.id = 'notification-container';
            document.body.appendChild(this.container);
        }

        // 请求通知权限
        async requestPermission() {
            if (!('Notification' in window)) return;
            
            if (Notification.permission === 'granted') {
                this.permission = true;
            } else if (Notification.permission === 'default') {
                try {
                    const result = await Notification.requestPermission();
                    this.permission = result === 'granted';
                } catch (error) {
                    console.warn('通知权限请求被拒绝');
                }
            }
        }

        // 显示 Toast 通知
        toast(message, type = 'info', duration = 3000) {
            const toast = document.createElement('div');
            toast.className = `notification-toast notification-${type}`;
            
            const icons = {
                info: 'ℹ️',
                success: '✅',
                warning: '⚠️',
                error: '❌'
            };
            
            toast.innerHTML = `
                <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
                <span class="toast-message">${message}</span>
                <button class="toast-close">&times;</button>
            `;
            
            this.container.appendChild(toast);
            
            // 关闭按钮
            toast.querySelector('.toast-close').addEventListener('click', () => {
                this.removeToast(toast);
            });
            
            // 自动关闭
            if (duration > 0) {
                setTimeout(() => {
                    this.removeToast(toast);
                }, duration);
            }
            
            return toast;
        }

        // 移除 Toast
        removeToast(toast) {
            toast.classList.add('toast-hide');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }

        // 快捷方法
        info(message, duration = 3000) {
            return this.toast(message, 'info', duration);
        }

        success(message, duration = 3000) {
            return this.toast(message, 'success', duration);
        }

        warning(message, duration = 4000) {
            return this.toast(message, 'warning', duration);
        }

        error(message, duration = 5000) {
            return this.toast(message, 'error', duration);
        }

        // 发送浏览器通知
        async sendBrowserNotification(title, options = {}) {
            if (!this.permission) return false;
            
            try {
                const notification = new Notification(title, {
                    icon: options.icon || '/assets/icons/icon-192x192.png',
                    body: options.body || '',
                    tag: options.tag || 'default',
                    requireInteraction: options.requireInteraction || false,
                    silent: options.silent || false,
                    ...options
                });
                
                // 点击通知跳转
                notification.onclick = () => {
                    if (options.url) {
                        window.focus();
                        window.location.href = options.url;
                    }
                    notification.close();
                };
                
                return true;
            } catch (error) {
                console.warn('发送浏览器通知失败:', error);
                return false;
            }
        }

        // 加载通知列表
        async loadNotifications() {
            try {
                if (window.DB) {
                    const result = await window.DB.getNotifications();
                    if (result) {
                        this.notifications = result;
                        this.unreadCount = result.filter(n => !n.read).length;
                    }
                }
            } catch (error) {
                console.warn('加载通知失败:', error);
            }
        }

        // 更新徽章
        updateBadge() {
            // 更新 Favicon 徽章
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.textContent = this.unreadCount;
                badge.style.display = this.unreadCount > 0 ? 'block' : 'none';
            }

            // 更新页面标题
            if (this.unreadCount > 0) {
                document.title = `(${this.unreadCount}) ${document.title.replace(/^\([0-9]+\)\s*/, '')}`;
            }
        }

        // 标记为已读
        async markAsRead(notificationId) {
            try {
                if (window.DB) {
                    await window.DB.markNotificationRead(notificationId);
                }
                
                const n = this.notifications.find(n => n.id === notificationId);
                if (n && !n.read) {
                    n.read = true;
                    this.unreadCount--;
                    this.updateBadge();
                }
            } catch (error) {
                console.warn('标记通知失败:', error);
            }
        }

        // 标记所有为已读
        async markAllAsRead() {
            try {
                if (window.DB) {
                    await window.DB.markAllNotificationsRead();
                }
                
                this.notifications.forEach(n => n.read = true);
                this.unreadCount = 0;
                this.updateBadge();
            } catch (error) {
                console.warn('标记所有通知失败:', error);
            }
        }

        // 获取未读数量
        getUnreadCount() {
            return this.unreadCount;
        }

        // 获取所有通知
        getAll() {
            return this.notifications;
        }
    }

    // 导出
    window.Notifications = new Notifications();

})();