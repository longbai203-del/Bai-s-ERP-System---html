/**
 * @file marketing/index.js
 * @description 营销管理模块 - 促销活动、优惠券、积分、推荐
 * @module modules/marketing
 */

import { apiClient } from '@services/api-client.js';
import { formatCurrency, formatDate } from '@utils/helpers.js';
import { datatable } from '@components/datatable.js';
import { modal } from '@components/modal.js';


export const meta = {
    name: '营销管理',
    path: '/marketing',
    icon: 'fa-bullhorn',
    permission: 'marketing:view',
    enabled: true,
    order: 50
};

// ============================================================
// 子模块定义
// ============================================================

const subModules = [
    { id: 'promotions', label: '促销活动', icon: 'fa-tags' },
    { id: 'coupons', label: '优惠券管理', icon: 'fa-ticket-alt' },
    { id: 'loyalty', label: '积分管理', icon: 'fa-star' },
    { id: 'referrals', label: '推荐管理', icon: 'fa-share-alt' },
    { id: 'campaigns', label: '营销活动', icon: 'fa-bullhorn' }
];

let state = {
    activeSub: 'promotions',
    list: [],
    total: 0,
    page: 1,
    pageSize: 20,
    loading: false
};

// ============================================================
// 主渲染
// ============================================================

export async function render(container, params = {}) {
    const sub = params.sub || 'promotions';
    state.activeSub = sub;

    

    container.innerHTML = `
        <div class="marketing-container">
            <div class="page-header">
                <h1>📢 营销管理</h1>
                <div class="page-actions">
                    <button class="btn btn-primary" id="createMarketingItem">
                        <i class="fas fa-plus"></i> 新建
                    </button>
                </div>
            </div>

            <!-- 子模块导航 -->
            <div class="sub-module-nav" style="display:flex;gap:4px;margin-bottom:20px;background:white;padding:8px;border-radius:12px;border:1px solid #E5E7EB;flex-wrap:wrap;">
                ${subModules.map(sm => `
                    <button class="sub-module-btn ${sm.id === sub ? 'active' : ''}" 
                            data-sub="${sm.id}"
                            style="padding:8px 16px;border:none;border-radius:8px;cursor:pointer;background:${sm.id === sub ? '#4F46E5' : 'transparent'};color:${sm.id === sub ? 'white' : '#6B7280'};font-weight:${sm.id === sub ? '600' : '400'};transition:all 0.2s;">
                        <i class="fas ${sm.icon}"></i> ${sm.label}
                    </button>
                `).join('')}
            </div>

            <!-- 内容区 -->
            <div id="marketingContent">
                <div style="text-align:center;padding:40px;color:#9CA3AF;">
                    <div class="spinner" style="margin:0 auto;"></div>
                    <p style="margin-top:12px;">加载中...</p>
                </div>
            </div>
        </div>
    `;

    await loadSubModule(sub);
    bindEvents(container);
}

// ============================================================
// 加载子模块
// ============================================================

async function loadSubModule(sub) {
    const container = document.getElementById('marketingContent');
    state.activeSub = sub;

    switch (sub) {
        case 'promotions':
            await renderPromotions(container);
            break;
        case 'coupons':
            await renderCoupons(container);
            break;
        case 'loyalty':
            await renderLoyalty(container);
            break;
        case 'referrals':
            await renderReferrals(container);
            break;
        case 'campaigns':
            await renderCampaigns(container);
            break;
        default:
            container.innerHTML = '<div style="text-align:center;padding:40px;color:#9CA3AF;">未知子模块</div>';
    }
}

// ============================================================
// 子模块：促销活动
// ============================================================

async function renderPromotions(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">🎯 促销活动</span>
            </div>
            <div class="card-body" id="promotionsTable">
                <div style="text-align:center;padding:20px;">
                    <div class="spinner" style="margin:0 auto;"></div>
                </div>
            </div>
        </div>
    `;

    const result = await apiClient.get('/marketing/promotions');
    const data = result.success ? result.data || [] : [];

    const columns = [
        { key: 'name', label: '活动名称' },
        { key: 'type', label: '类型' },
        { key: 'discount', label: '折扣', render: v => `${v}%` },
        { key: 'startDate', label: '开始时间', type: 'datetime' },
        { key: 'endDate', label: '结束时间', type: 'datetime' },
        { key: 'status', label: '状态', type: 'status' }
    ];

    const tableContainer = document.getElementById('promotionsTable');
    datatable.render(tableContainer, {
        columns,
        data,
        rowKey: 'id',
        emptyText: '暂无促销活动',
        loading: false
    });
}

// ============================================================
// 子模块：优惠券管理
// ============================================================

async function renderCoupons(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">🎫 优惠券管理</span>
            </div>
            <div class="card-body" id="couponsTable">
                <div style="text-align:center;padding:20px;">
                    <div class="spinner" style="margin:0 auto;"></div>
                </div>
            </div>
        </div>
    `;

    const result = await apiClient.get('/marketing/coupons');
    const data = result.success ? result.data || [] : [];

    const columns = [
        { key: 'code', label: '优惠码' },
        { key: 'name', label: '名称' },
        { key: 'type', label: '类型', render: v => v === 'percentage' ? '百分比' : '固定金额' },
        { key: 'value', label: '面值', render: v => v?.toString() || '-' },
        { key: 'usedCount', label: '使用次数' },
        { key: 'expiryDate', label: '过期时间', type: 'datetime' },
        { key: 'status', label: '状态', type: 'status' }
    ];

    const tableContainer = document.getElementById('couponsTable');
    datatable.render(tableContainer, {
        columns,
        data,
        rowKey: 'id',
        emptyText: '暂无优惠券',
        loading: false
    });
}

// ============================================================
// 子模块：积分管理
// ============================================================

async function renderLoyalty(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">⭐ 积分管理</span>
            </div>
            <div class="card-body">
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:20px;">
                    <div class="stat-card">
                        <div class="stat-label">总积分</div>
                        <div class="stat-value" id="totalPoints">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">已使用</div>
                        <div class="stat-value" id="usedPoints">0</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-label">可用积分</div>
                        <div class="stat-value" id="availablePoints">0</div>
                    </div>
                </div>
                <div id="loyaltyTable">
                    <div style="text-align:center;padding:20px;">
                        <div class="spinner" style="margin:0 auto;"></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    const result = await apiClient.get('/marketing/loyalty');
    const stats = result.success ? result.data?.stats || {} : {};
    const records = result.success ? result.data?.records || [] : [];

    document.getElementById('totalPoints').textContent = stats.total || 0;
    document.getElementById('usedPoints').textContent = stats.used || 0;
    document.getElementById('availablePoints').textContent = stats.available || 0;

    const columns = [
        { key: 'customerName', label: '客户' },
        { key: 'points', label: '积分变化' },
        { key: 'type', label: '类型' },
        { key: 'description', label: '说明' },
        { key: 'createdAt', label: '时间', type: 'datetime' }
    ];

    const tableContainer = document.getElementById('loyaltyTable');
    datatable.render(tableContainer, {
        columns,
        data: records,
        rowKey: 'id',
        emptyText: '暂无积分记录',
        loading: false
    });
}

// ============================================================
// 子模块：推荐管理
// ============================================================

async function renderReferrals(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">🔗 推荐管理</span>
            </div>
            <div class="card-body" id="referralsTable">
                <div style="text-align:center;padding:20px;">
                    <div class="spinner" style="margin:0 auto;"></div>
                </div>
            </div>
        </div>
    `;

    const result = await apiClient.get('/marketing/referrals');
    const data = result.success ? result.data || [] : [];

    const columns = [
        { key: 'referrer', label: '推荐人' },
        { key: 'referred', label: '被推荐人' },
        { key: 'status', label: '状态', type: 'status' },
        { key: 'reward', label: '奖励', render: v => v ? `¥${v}` : '-' },
        { key: 'createdAt', label: '时间', type: 'datetime' }
    ];

    const tableContainer = document.getElementById('referralsTable');
    datatable.render(tableContainer, {
        columns,
        data,
        rowKey: 'id',
        emptyText: '暂无推荐记录',
        loading: false
    });
}

// ============================================================
// 子模块：营销活动
// ============================================================

async function renderCampaigns(container) {
    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">📣 营销活动</span>
            </div>
            <div class="card-body" id="campaignsTable">
                <div style="text-align:center;padding:20px;">
                    <div class="spinner" style="margin:0 auto;"></div>
                </div>
            </div>
        </div>
    `;

    const result = await apiClient.get('/marketing/campaigns');
    const data = result.success ? result.data || [] : [];

    const columns = [
        { key: 'name', label: '活动名称' },
        { key: 'type', label: '类型' },
        { key: 'target', label: '目标' },
        { key: 'reach', label: '触达' },
        { key: 'conversion', label: '转化率', render: v => v ? `${v}%` : '-' },
        { key: 'status', label: '状态', type: 'status' },
        { key: 'createdAt', label: '创建时间', type: 'datetime' }
    ];

    const tableContainer = document.getElementById('campaignsTable');
    datatable.render(tableContainer, {
        columns,
        data,
        rowKey: 'id',
        emptyText: '暂无营销活动',
        loading: false
    });
}

// ============================================================
// 事件绑定
// ============================================================

function bindEvents(container) {
    // 子模块切换
    container.querySelectorAll('.sub-module-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sub = btn.dataset.sub;
            if (sub !== state.activeSub) {
                container.querySelectorAll('.sub-module-btn').forEach(b => {
                    b.classList.remove('active');
                    b.style.background = 'transparent';
                    b.style.color = '#6B7280';
                    b.style.fontWeight = '400';
                });
                btn.classList.add('active');
                btn.style.background = '#4F46E5';
                btn.style.color = 'white';
                btn.style.fontWeight = '600';
                
                loadSubModule(sub);
            }
        });
    });

    // 新建按钮
    document.getElementById('createMarketingItem')?.addEventListener('click', () => {
        modal.alert('新建', `正在创建 ${state.activeSub} 功能...`, '知道了');
    });
}

export async function init() {
    console.log('✅ [Marketing] 模块已初始化');
}

export default { meta, render, init };