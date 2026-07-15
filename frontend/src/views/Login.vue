<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <img src="/src/assets/images/logo.svg" alt="Bai's ERP" class="login-logo" />
        <h1>Bai's ERP</h1>
        <p>企业资源计划系统</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>用户名</label>
          <input type="text" v-model="username" placeholder="请输入用户名" required />
        </div>
        
        <div class="form-group">
          <label>密码</label>
          <input type="password" v-model="password" placeholder="请输入密码" required />
        </div>
        
        <button type="submit" :disabled="loading" class="login-btn">
          {{ loading ? '登录中...' : '登录' }}
        </button>
        
        <div v-if="error" class="error-message">{{ error }}</div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '../services/auth.service.js';
import { api } from '../services/api.js';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref('');

    const handleLogin = async () => {
      if (!username.value || !password.value) {
        error.value = '请输入用户名和密码';
        return;
      }

      loading.value = true;
      error.value = '';

      try {
        const response = await api.post('/auth/login', {
          username: username.value,
          password: password.value
        });

        if (response.success) {
          // 存储 token 和用户信息
          localStorage.setItem('accessToken', response.data.token);
          localStorage.setItem('refreshToken', response.data.refreshToken);
          localStorage.setItem('user', JSON.stringify(response.data.user));
          
          // 跳转到仪表盘
          router.push('/dashboard');
        } else {
          error.value = response.message || '登录失败';
        }
      } catch (err) {
        error.value = err.response?.data?.message || '登录失败，请重试';
      } finally {
        loading.value = false;
      }
    };

    return { username, password, loading, error, handleLogin };
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a2332 0%, #2d3748 100%);
}

.login-card {
  background: #fff;
  border-radius: 12px;
  padding: 40px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-logo {
  width: 64px;
  height: 64px;
  margin-bottom: 12px;
}

.login-header h1 {
  font-size: 24px;
  color: #1a2332;
  margin: 0;
}

.login-header p {
  color: #718096;
  font-size: 14px;
  margin: 4px 0 0;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #4a5568;
  margin-bottom: 4px;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4a90d9;
  box-shadow: 0 0 0 3px rgba(74, 144, 217, 0.1);
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #4a90d9;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.login-btn:hover:not(:disabled) {
  background: #3a7bc8;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  margin-top: 12px;
  padding: 10px;
  background: #fed7d7;
  color: #c53030;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
}
</style>