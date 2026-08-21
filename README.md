# Bai's ERP System 🚗

> 专为沙特阿拉伯洗车行业打造的企业资源计划管理系统

## 📋 项目简介

Bai's ERP System 是一款面向洗车行业的 SaaS 管理平台，提供完整的业务管理解决方案，包括：

- 📊 实时仪表板
- 🛒 POS 销售点
- 👤 客户管理
- 💎 会员管理
- 📦 产品管理
- 📈 库存管理
- 🛍️ 订单管理
- 💰 财务管理
- 🤝 CRM 客户关系
- 👔 人力资源管理
- 🚗 车队管理
- 🤖 AI 智能助手
- 📊 报表与分析

## 🚀 快速开始

### 1. 克隆项目

\\\ash
git clone https://github.com/your-username/bais-erp-system.git
cd bais-erp-system
\\\

### 2. 安装依赖

\\\ash
npm install
\\\

### 3. 配置环境变量

复制 \.env.example\ 为 \.env\ 并填入你的 Supabase 凭证：

\\\env
VITE_SUPABASE_URL=https://qryllswlfryaywiajilr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFyeWxsc3dsZnJ5YXl3aWFqaWxyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MzUxMjgsImV4cCI6MjEwMjMxMTEyOH0.g0i02OViDEINfXLMksp1oWNKoactxOBlylyTdDXr5qs
\\\

### 4. 启动开发服务器

\\\ash
npm start
# 或
python -m http.server 3000
\\\

### 5. 访问应用

打开浏览器访问：\http://localhost:3000\

## 🗄️ 数据库迁移

在 Supabase Dashboard 的 SQL Editor 中执行迁移文件：

\\\ash
按顺序执行 supabase/migrations/ 目录下的文件
001_extensions.sql → 002_organizations.sql → ... → 025_seed.sql
\\\

## 📁 项目结构

\\\
frontend/
├── index.html          # 主页面
├── login.html          # 登录页面
├── register.html       # 注册页面
├── 404.html           # 404页面
├── config.js          # 配置文件
├── manifest.json      # PWA配置
├── sw.js              # Service Worker
├── css/               # 样式文件
├── js/                # JavaScript核心
├── services/          # 业务服务层
├── modules/           # 功能模块
├── layouts/           # 布局组件
├── locales/           # 多语言
├── supabase/          # 数据库迁移
└── assets/            # 静态资源
\\\

## 🛠️ 技术栈

| 技术 | 说明 |
|------|------|
| HTML5 | 结构 |
| CSS3 | 样式 |
| Vanilla JS | 逻辑 |
| Supabase | 后端 + 认证 |
| PostgreSQL | 数据库 |
| Chart.js | 图表 |
| PWA | 离线支持 |

## 🌐 多语言支持

| 语言 | 代码 |
|------|------|
| 简体中文 | zh-CN |
| English | en-US |
| العربية | ar-SA |

## 🔧 功能模块

| 模块 | 状态 | 描述 |
|------|------|------|
| 仪表板 | ✅ | 数据概览 |
| POS | ✅ | 销售点系统 |
| 订单 | ✅ | 订单管理 |
| 客户 | ✅ | 客户信息 |
| 会员 | ✅ | 会员管理 |
| 产品 | ✅ | 产品信息 |
| 库存 | ✅ | 库存管理 |
| 采购 | ✅ | 采购管理 |
| 供应商 | ✅ | 供应商信息 |
| 财务 | ✅ | 财务管理 |
| CRM | ✅ | 客户关系 |
| HR | ✅ | 人力资源管理 |
| 报表 | ✅ | 报表中心 |
| 分析 | ✅ | 数据分析 |
| 车队 | ✅ | 车辆管理 |
| AI | ✅ | 智能助手 |
| 设置 | ✅ | 系统设置 |

## 📊 演示账号

> 注意：需要在 Supabase 中创建用户

- **邮箱**: admin@bais-erp.com
- **密码**: Admin@2026

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## 📞 联系我们

- 网站: https://bais-erp.com
- 邮箱: support@bais-erp.com

---

**⭐ 如果这个项目对你有帮助，请给一个 Star！**
