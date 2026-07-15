# 在 frontend/src/views/ 目录下创建 Dashboard.vue
@'
<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h1 class="page-title">
        <i class="fas fa-chart-line"></i>
        仪表盘
      </h1>
      <div class="page-actions">
        <span class="date-display">{{ currentDate }}</span>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="{ color: stat.color }">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
      </div>
    </div>

    <!-- 图表和活动 -->
    <div class="dashboard-grid">
      <div class="chart-card">
        <h3 class="card-title">
          <i class="fas fa-chart-bar"></i>
          近7日收入趋势
        </h3>
        <div class="chart-placeholder">
          <div class="bar-chart">
            <div 
              v-for="(item, index) in chartData" 
              :key="index"
              class="bar-item"
              :style="{ height: item.height + '%' }"
            >
              <span class="bar-value">{{ item.value }}</span>
              <span class="bar-label">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="activity-card">
        <h3 class="card-title">
          <i class="fas fa-clock"></i>
          最近活动
        </h3>
        <div class="activity-list">
          <div 
            v-for="activity in activities" 
            :key="activity.id"
            class="activity-item"
          >
            <div class="activity-icon">
              <i :class="activity.icon"></i>
            </div>
            <div class="activity-content">
              <div class="activity-message">{{ activity.message }}</div>
              <div class="activity-time">{{ activity.time }}</div>
            </div>
          </div>
          <div v-if="activities.length === 0" class="text-muted">
            暂无活动
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';

export default {
  name: 'Dashboard',
  setup() {
    const currentDate = ref('');
    const loading = ref(false);

    // 统计数据
    const stats = ref([
      { label: '今日收入', value: '¥0', icon: 'fas fa-dollar-sign', color: '#4A90D9' },
      { label: '今日订单', value: '0', icon: 'fas fa-shopping-cart', color: '#28A745' },
      { label: '总客户', value: '0', icon: 'fas fa-users', color: '#17A2B8' },
      { label: '总商品', value: '0', icon: 'fas fa-box', color: '#D69E2E' }
    ]);

    // 图表数据
    const chartData = ref([
      { label: '周一', value: 0, height: 10 },
      { label: '周二', value: 0, height: 10 },
      { label: '周三', value: 0, height: 10 },
      { label: '周四', value: 0, height: 10 },
      { label: '周五', value: 0, height: 10 },
      { label: '周六', value: 0, height: 10 },
      { label: '周日', value: 0, height: 10 }
    ]);

    // 活动数据
    const activities = ref([
      { id: 1, icon: 'fas fa-user-plus', message: '新用户注册', time: '刚刚' },
      { id: 2, icon: 'fas fa-shopping-bag', message: '新订单 #ORD-0001', time: '5分钟前' },
      { id: 3, icon: 'fas fa-box', message: '商品 "产品A" 库存不足', time: '15分钟前' }
    ]);

    const fetchDashboardData = async () => {
      loading.value = true;
      try {
        // TODO: 从 API 获取数据
        // const response = await api.get('/dashboard/stats');
        // stats.value = ...
      } catch (error) {
        console.error('获取仪表盘数据失败:', error);
      } finally {
        loading.value = false;
      }
    };

    const updateDate = () => {
      const now = new Date();
      currentDate.value = now.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      });
    };

    onMounted(() => {
      updateDate();
      fetchDashboardData();
    });

    return {
      currentDate,
      loading,
      stats,
      chartData,
      activities
    };
  }
};
</script>

<style scoped>
.dashboard-page {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #2D3748;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0;
}

.page-title i {
  color: #4A90D9;
}

.date-display {
  font-size: 14px;
  color: #718096;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #F7FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #2D3748;
}

.stat-label {
  font-size: 14px;
  color: #718096;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.chart-card,
.activity-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #2D3748;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.card-title i {
  color: #4A90D9;
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: flex-end;
  padding: 0 8px;
}

.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  width: 100%;
  height: 100%;
}

.bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30px;
  min-height: 20px;
  background: #4A90D9;
  border-radius: 4px 4px 0 0;
  transition: height 0.3s ease;
  position: relative;
}

.bar-value {
  font-size: 12px;
  color: #4A90D9;
  margin-bottom: 4px;
}

.bar-label {
  font-size: 12px;
  color: #718096;
  margin-top: 8px;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #F7FAFC;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #F7FAFC;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #4A90D9;
}

.activity-content {
  flex: 1;
}

.activity-message {
  font-size: 14px;
  color: #2D3748;
}

.activity-time {
  font-size: 12px;
  color: #A0AEC0;
}

.text-muted {
  color: #A0AEC0;
  text-align: center;
  padding: 20px 0;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
'@ | Set-Content src/views/Dashboard.vue -NoNewline

Write-Host "✅ Dashboard.vue 已创建" -ForegroundColor Green