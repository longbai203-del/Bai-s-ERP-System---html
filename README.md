# 项目名称

企业级 SaaS 管理后台（纯前端）

## 技术栈
- HTML5 + CSS3 + JavaScript
- 多语言支持（AR/EN/ZH）
- PWA 支持
- Vercel 部署

## 快速开始
直接在浏览器打开 `frontend/index.html`

## 模块列表
- 仪表盘、客户、库存、POS、财务、HR...

## 环境变量
在 `.env` 中配置 API 地址  
BAI'S ERP SYSTEM-HTML/
├── frontend/
│   ├── layouts/
│   │   ├── footer.html
│   │   ├── modal.html
│   │   ├── notification.html
│   │   └── sidebar.html
│   ├── locales/
│   │   ├── ar-SA.json
│   │   ├── en-US.json
│   │   └── zh-CN.json
│   └── modules/
│       ├── ai/
│       │   ├── ai.html
│       │   ├── auto-tasks.html
│       │   ├── chat.html
│       │   ├── crm.html
│       │   ├── module.json
│       │   └── report-gen.html
│       ├── analytics/
│       │   ├── analytics.html
│       │   ├── business-health.html
│       │   ├── custom-reports.html
│       │   ├── forecast.html
│       │   ├── module.json
│       │   ├── recommendations.html
│       │   ├── reports.html
│       │   └── visualizations.html
│       ├── customers/
│       │   ├── coupons.html
│       │   ├── customers.html
│       │   ├── feedback.html
│       │   ├── gift-cards.html
│       │   ├── membership.html
│       │   ├── module.json
│       │   ├── vehicles.html
│       │   └── wallet.html
│       ├── dashboard/
│       │   ├── analytics.html
│       │   ├── dashboard.html
│       │   ├── module.json
│       │   ├── notifications.html
│       │   ├── quick-actions.html
│       │   ├── reports.html
│       │   ├── tasks.html
│       │   └── timeline.html
│       ├── employee/
│       │   ├── approvals.html
│       │   ├── employee.html
│       │   ├── queue.html
│       │   ├── records.html
│       │   └── stats.html
│       ├── finance/
│       │   ├── bank.html
│       │   ├── cash-flow.html
│       │   ├── expenses.html
│       │   ├── finance.html
│       │   ├── income.html
│       │   ├── invoices.html
│       │   ├── journal.html
│       │   ├── payments.html
│       │   ├── profit-loss.html
│       │   ├── settlements.html
│       │   ├── taxes.html
│       │   ├── trial-balance.html
│       │   └── vat.html
│       ├── fleet/
│       │   ├── alerts.html
│       │   ├── fleet.html
│       │   ├── history.html
│       │   ├── maintenance.html
│       │   └── tracking.html
│       ├── hr/
│       │   ├── attendance.html
│       │   ├── bonuses.html
│       │   ├── commissions.html
│       │   ├── employees.html
│       │   ├── hr.html
│       │   ├── leaves.html
│       │   ├── module.json
│       │   ├── payroll.html
│       │   ├── penalties.html
│       │   ├── performance.html
│       │   ├── permissions.html
│       │   ├── schedules.html
│       │   ├── shifts.html
│       │   └── tasks.html
│       ├── inventory/
│       │   ├── adjustments.html
│       │   ├── batches.html
│       │   ├── cycle-counts.html
│       │   ├── expiry.html
│       │   ├── history.html
│       │   ├── inventory.html
│       │   ├── low-stock.html
│       │   ├── module.json
│       │   ├── serial-numbers.html
│       │   ├── stock.html
│       │   ├── transfers.html
│       │   └── warehouses.html
│       ├── marketing/
│       │   ├── campaigns.html
│       │   ├── loyalty.html
│       │   ├── marketing.html
│       │   ├── module.json
│       │   ├── promotions.html
│       │   └── referrals.html
│       ├── orders/
│       │   ├── detail.html
│       │   ├── list.html
│       │   ├── module.json
│       │   ├── orders.html
│       │   ├── refunds.html
│       │   ├── returns.html
│       │   └── submodules.html
│       ├── pos/
│       │   ├── cash-register.html
│       │   ├── cashier.html
│       │   ├── customer-display.html
│       │   ├── discounts.html
│       │   ├── exchange.html
│       │   ├── kitchen-display.html
│       │   ├── module.json
│       │   ├── offline-pos.html
│       │   ├── pos.html
│       │   ├── quick-sale.html
│       │   ├── receipt.html
│       │   ├── statistics.html
│       │   └── touch-pos.html
│       ├── products/
│       │   ├── barcodes.html
│       │   ├── brands.html
│       │   ├── categories.html
│       │   ├── combos.html
│       │   ├── modifiers.html
│       │   ├── module.json
│       │   ├── price-lists.html
│       │   ├── products.html
│       │   └── variants.html
│       ├── purchase/
│       │   ├── import.html
│       │   ├── purchase.html
│       │   ├── quotations.html
│       │   ├── receiving.html
│       │   ├── supplier-payments.html
│       │   └── suppliers.html
│       ├── saas/
│       │   ├── billing.html
│       │   ├── feature-limits.html
│       │   ├── module.json
│       │   ├── packages.html
│       │   ├── plans.html
│       │   ├── saas.html
│       │   ├── storage.html
│       │   ├── subscriptions.html
│       │   ├── tenants.html
│       │   └── usage.html
│       ├── settings/
│       │   ├── branches.html
│       │   ├── company.html
│       │   ├── general.html
│       │   ├── module.json
│       │   ├── preferences.html
│       │   ├── profile.html
│       │   └── settings.html
│       └── system/
│           ├── api-keys.html
│           ├── audit-logs.html
│           ├── audit.html
│           ├── backup.html
│           ├── import-export.html
│           ├── integrations.html
│           ├── marketplace.html
│           ├── module.json
│           ├── notifications.html
│           ├── permission.html
│           ├── restore.html
│           ├── roles.html
│           ├── settings.html
│           ├── system-logs.html
│           ├── system.html
│           └── webhooks.html
├── .env
├── .gitignore
├── 404.html
├── DEPLOY.md
├── favicon.ico
├── index.html
├── login.html
├── manifest.json
├── package.json
├── project-tree.txt
├── README.md
└── vercel.json
                                                                                                                                                    