/**
 * @file useApi.js
 * @description API 组合式函数
 * @module composables/useApi
 */

import { ref } from 'vue';
import { api } from '../services/api.js';

export function useApi() {
    const loading = ref(false);
    const error = ref(null);
    const data = ref(null);

    const fetchData = async (url, options = {}) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.get(url, options);
            data.value = response.data;
            return { success: true, data: response.data };
        } catch (err) {
            error.value = err.message || '请求失败';
            return { success: false, error: error.value };
        } finally {
            loading.value = false;
        }
    };

    const postData = async (url, body, options = {}) => {
        loading.value = true;
        error.value = null;
        try {
            const response = await api.post(url, body, options);
            data.value = response.data;
            return { success: true, data: response.data };
        } catch (err) {
            error.value = err.message || '请求失败';
            return { success: false, error: error.value };
        } finally {
            loading.value = false;
        }
    };

    return {
        loading,
        error,
        data,
        fetchData,
        postData
    };
}

export default useApi;