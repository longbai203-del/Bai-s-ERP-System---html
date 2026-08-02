# CHANGELOG

## 2026-08-02

### Fixed
- 修复了 `frontend/index.html` 中 `<link>` 和 `<script>` 标签的路径引用，使其严格指向 `./css/common.css` 和 `./js/common.js`。
- 清理了 `frontend/404.html` 及 `frontend/login.html` 中残留的非法 `\n` 字符，确保页面渲染正常。
- 优化了 `vercel.json` 的静态路由分发规则，确保多级路径（如 `/modules/xxx/yyy.html`）在 Vercel 环境下正确加载。

## 2026-08-01

### Fixed
- Repaired malformed HTML templates caused by stray literal `n`/`\n` markers that broke page rendering across many module pages.
- Added a shared navigation router in the main dashboard shell and reusable sidebar component to normalize paths.