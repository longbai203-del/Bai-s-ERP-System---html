/**
 * api/index.js - API主路由入口
 * @module api
 * @description 统一API路由注册和中间件配置
 */

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

// 导入路由模块（全部统一为 Express Router）
import authRoutes from './auth.js';
import orderRoutes from './orders.js';
import productRoutes from './products.js';
import customerRoutes from './customers.js';
import employeeRoutes from './employees.js';
import inventoryRoutes from './inventory.js';
import reportRoutes from './reports.js';
import attendanceRoutes from './attendance.js';
import permissionRoutes from './permissions.js';
import vehicleMonitorRoutes from './vehicle-monitor.js';

console.log('[API] ✅ 所有路由模块已加载');

const app = express();

// ============================================================
// 中间件配置
// ============================================================

// 安全头
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false
}));

// CORS - 允许前端跨域访问
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
console.log(`[API] CORS 允许来源: ${corsOrigin}`);

// 请求解析
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 请求日志（开发环境）
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`[API] ${req.method} ${req.path}`);
        next();
    });
}

// ============================================================
// 健康检查
// ============================================================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'development',
        corsOrigin: corsOrigin
    });
});

// ============================================================
// API路由注册（统一挂载）
// ============================================================

console.log('[API] 开始注册路由...');

app.use('/api/auth', authRoutes);
console.log('[API] ✅ /api/auth 已注册');

app.use('/api/orders', orderRoutes);
console.log('[API] ✅ /api/orders 已注册');

app.use('/api/products', productRoutes);
console.log('[API] ✅ /api/products 已注册');

app.use('/api/customers', customerRoutes);
console.log('[API] ✅ /api/customers 已注册');

app.use('/api/employees', employeeRoutes);
console.log('[API] ✅ /api/employees 已注册');

app.use('/api/inventory', inventoryRoutes);
console.log('[API] ✅ /api/inventory 已注册');

app.use('/api/reports', reportRoutes);
console.log('[API] ✅ /api/reports 已注册');

app.use('/api/attendance', attendanceRoutes);
console.log('[API] ✅ /api/attendance 已注册');

app.use('/api/permissions', permissionRoutes);
console.log('[API] ✅ /api/permissions 已注册');

app.use('/api/vehicle-monitor', vehicleMonitorRoutes);
console.log('[API] ✅ /api/vehicle-monitor 已注册');

console.log('[API] ✅ 所有路由注册完成');

// ============================================================
// 404处理
// ============================================================

app.use((req, res) => {
    res.status(404).json({
        code: 404,
        message: `API endpoint not found: ${req.method} ${req.path}`,
        timestamp: new Date().toISOString()
    });
});

// ============================================================
// 错误处理
// ============================================================

app.use((err, req, res, next) => {
    console.error('[API Error]', err);

    const status = err.status || 500;
    const message = err.message || 'Internal server error';
    const details = process.env.NODE_ENV === 'development' ? err.stack : undefined;

    res.status(status).json({
        code: status,
        message: message,
        ...(details && { details }),
        timestamp: new Date().toISOString()
    });
});

// ============================================================
// 导出（用于 Render）
// ============================================================

export default app;

// ============================================================
// 启动服务器（所有环境）
// ============================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 API Server running on port ${PORT}`);
    console.log(`📚 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔗 CORS allowed origin: ${corsOrigin}`);
    console.log(`📋 Registered routes:`);
    console.log(`   /api/auth`);
    console.log(`   /api/orders`);
    console.log(`   /api/products`);
    console.log(`   /api/customers`);
    console.log(`   /api/employees`);
    console.log(`   /api/inventory`);
    console.log(`   /api/reports`);
    console.log(`   /api/attendance`);
    console.log(`   /api/permissions`);
    console.log(`   /api/vehicle-monitor`);
});

// 处理进程信号 - 优雅关闭
process.on('SIGTERM', () => {
    console.log('[API] 收到 SIGTERM 信号，正在关闭...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('[API] 收到 SIGINT 信号，正在关闭...');
    process.exit(0);
});

// 捕获未处理的异常
process.on('uncaughtException', (err) => {
    console.error('[API] ❌ 未捕获的异常:', err.message);
    console.error(err.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('[API] ❌ 未处理的 Promise 拒绝:', reason);
    console.error('Promise:', promise);
    process.exit(1);
});