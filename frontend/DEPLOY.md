# Enterprise ERP 部署文档

## 系统概述

Enterprise ERP 是一套**纯前端企业资源计划管理系统**，基于 HTML5 + CSS3 + JavaScript ES6+ 构建。

- **架构**：HTML单模块架构（每个页面 = 一个完整HTML文件）
- **数据存储**：localStorage / IndexedDB
- **多语言**：中文、英文、阿拉伯语
- **主题**：明亮 / 暗黑模式
- **PWA**：支持离线运行

---

## 系统要求

| 项目 | 要求 |
|------|------|
| 浏览器 | Chrome 90+, Firefox 88+, Edge 90+, Safari 14+ |
| 存储 | localStorage (至少 10MB) |
| 网络 | 首次加载需要网络（后续可离线运行） |

---

## 快速部署

### 1. 本地运行（开发环境）

```bash
# 方法1：使用 Python
cd frontend
python -m http.server 3000

# 方法2：使用 Node.js
npx serve frontend

# 方法3：使用 PHP
php -S localhost:3000 -t frontend

# 方法4：双击 index.html（部分功能可能受限）