/**
 * @file useToast.js
 * @description Toast 通知组合式函数
 * @module composables/useToast
 */

import { ref } from 'vue';

const toasts = ref([]);

export function useToast() {
    const showToast = (message, type = 'info', duration = 3000) => {
        const id = Date.now() + Math.random();
        const toast = {
            id,
            message,
            type,
            duration,
            visible: true
        };
        
        toasts.value.push(toast);
        
        setTimeout(() => {
            toast.visible = false;
            setTimeout(() => {
                toasts.value = toasts.value.filter(t => t.id !== id);
            }, 300);
        }, duration);
        
        return id;
    };

    const success = (message, duration) => showToast(message, 'success', duration);
    const error = (message, duration) => showToast(message, 'error', duration);
    const warning = (message, duration) => showToast(message, 'warning', duration);
    const info = (message, duration) => showToast(message, 'info', duration);

    const removeToast = (id) => {
        toasts.value = toasts.value.filter(t => t.id !== id);
    };

    const clearAll = () => {
        toasts.value = [];
    };

    return {
        toasts,
        showToast,
        success,
        error,
        warning,
        info,
        removeToast,
        clearAll
    };
}

export default useToast;