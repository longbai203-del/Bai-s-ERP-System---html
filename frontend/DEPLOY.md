# Enterprise ERP - Vercel 部署与运维指南

## 1. 技术架构
*   **类型**：纯静态单页应用 (SPA), 无后端依赖.
*   **目录**：所有源码位于 `/frontend` 文件夹.
*   **数据**：完全使用 `localStorage` 本地存储, 符合沙特当地数据留存与隐私要求.
*   **税务**：系统内置沙特 15% VAT 计算逻辑.

## 2. 首次 Vercel 部署 (极简 3 步)
1.  **代码上传**：将整个项目推送到 GitHub 仓库.
2.  **导入项目**：登录 Vercel, 点击 `Add New` -> `Project`, 选择你的 GitHub 仓库.
3.  **配置关键路径 (必填)**：
    *   **Framework Preset**: 选择 `Other`.
    *   **Root Directory**: **必须填写 `frontend`** (这是 Vercel 寻找 `index.html` 的起点).
    *   **Build Command & Output Directory**: 留空 (不要填任何内容，因为我们不需要构建).
4.  点击 `Deploy`.

## 3. 本地开发与预览
打开终端，进入项目根目录，执行以下命令即可启动本地服务器:
```bash
npm run preview