# 🏢 Bai's ERP System

## 项目概述

Bai's ERP System 是一个企业级 POS 与零售管理系统，包含收银、订单、商品、客户、库存、财务、人事等完整功能模块。

### 技术栈

| 技术 | 说明 |
|------|------|
| **前端** | 原生 JavaScript + HTML + CSS（模块化 SPA） |
| **后端** | Node.js + Express |
| **数据库** | Supabase (PostgreSQL) |
| **认证** | JWT |
| **部署** | 前端 Vercel + 后端 Render |

---

## 📁 项目结构

Bai's ERP System/
├── api/ # API 路由层
│ ├── index.js # Express 入口
│ ├── auth.js # 认证路由
│ ├── orders.js # 订单路由
│ ├── products.js # 商品路由
│ ├── customers.js # 客户路由
│ ├── employees.js # 员工路由
│ ├── inventory.js # 库存路由
│ ├── reports.js # 报表路由
│ ├── attendance.js # 考勤路由
│ ├── permissions.js # 权限路由
│ └── vehicle-monitor.js # 车辆监控路由
│
├── business-core/ # 业务逻辑层
│ ├── index.js # 服务导出入口
│ └── services/
│ ├── base-service.js # 基类（CRUD + 缓存）
│ ├── customer-service.js # 客户服务
│ ├── order-service.js # 订单服务
│ ├── product-service.js # 商品服务
│ └── ai-service.js # AI 服务
│
├── database/ # 数据库脚本
│ └── v3-schema.sql # 完整 Schema
│
├── frontend/ # 前端 SPA
│ ├── index.html # 入口页面
│ ├── css/ # 全局样式
│ ├── js/ # 核心逻辑
│ └── modules/ # 15 个功能模块
│
├── scripts/ # 工具脚本
│ ├── generate-all-pages.js
│ └── refactor-to-v2.js
│
├── shared/ # 前后端共享代码
│ ├── constants/ # 常量定义
│ │ ├── roles.js
│ │ └── status.js
│ └── lib/ # 共享工具库
│ ├── supabase.js
│ ├── auth.js
│ ├── logger.js
│ └── validation.js
│
├── docs/ # 文档
│ └── API.md
│
├── .env.example # 环境变量模板
├── package.json # 依赖配置
├── vercel.json # Vercel 部署配置
├── render.yaml # Render 部署配置
└── README.md # 项目说明