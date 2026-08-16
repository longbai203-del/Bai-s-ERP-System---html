/**
 * @file settings/index.js
 * @description 系统设置模块
 * @module modules/settings
 */

import { apiClient } from '@services/api-client.js';
import { navbar } from '@components/navbar.js';
import { modal } from '@components/modal.js';

export const meta = {
    name: '系统设置',
    path: '/settings',
    icon: 'fa-sliders-h',
    permission: 'settings:view',
    enabled: true,
    order: 130
};

const subModules = [
    { id: 'general', label: '通用设置', icon: 'fa-globe' },
    { id: 'profile', label: '个人设置', icon: 'fa-user' },
    { id: 'company', label: '公司设置', icon: 'fa-building' },
    { id: 'branches', label: '门店管理', icon: 'fa-store' },
    { id: 'preferences', label: '偏好设置', icon: 'fa-sliders-h' }
];

let state = { activeSub: 'general' };

export async function render(container, params = {}) {
    const sub = params.sub || 'general';
    state.activeSub = sub;

    navbar.updateBreadcrumb('系统设置');

    container.innerHTML = `
        <div class="settings-container">
            <div class="page-header">
                <h1>⚙️ 系统设置</h1>
                <div class="page-actions">
                    <button class="btn btn-primary" id="settingsSave">
                        <i class="fas fa-save"></i> 保存设置
                    </button>
                </div>
            </div>

            <div style="display:flex;gap:20px;align-items:flex-start;">
                <!-- 侧边导航 -->
                <div style="width:200px;flex-shrink:0;background:white;border-radius:12px;border:1px solid #E5E7EB;padding:8px;">
                    ${subModules.map(sm => `
                        <button class="settings-nav-btn ${sm.id === sub ? 'active' : ''}" 
                                data-sub="${sm.id}"
                                style="display:flex;align-items:center;gap:10px;width:100%;padding:10px 14px;border:none;border-radius:8px;cursor:pointer;background:${sm.id === sub ? '#4F46E5' : 'transparent'};color:${sm.id === sub ? 'white' : '#6B7280'};font-weight:${sm.id === sub ? '600' : '400'};transition:all 0.2s;margin-bottom:2px;">
                            <i class="fas ${sm.icon}"></i> ${sm.label}
                        </button>
                    `).join('')}
                </div>

                <!-- 内容 -->
                <div style="flex:1;" id="settingsContent">
                    <div style="text-align:center;padding:40px;color:#9CA3AF;">
                        <div class="spinner" style="margin:0 auto;"></div>
                        <p style="margin-top:12px;">加载中...</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    await loadSubModule(sub);
    bindEvents(container);
}

async function loadSubModule(sub) {
    const container = document.getElementById('settingsContent');
    state.activeSub = sub;

    const contentMap = {
        general: `
            <div class="card">
                <div class="card-header"><span class="card-title">🌐 通用设置</span></div>
                <div class="card-body">
                    <div class="form-group">
                        <label class="form-label">系统名称</label>
                        <input type="text" class="form-control" id="settingAppName" value="Bai's ERP">
                    </div>
                    <div class="form-group">
                        <label class="form-label">默认语言</label>
                        <select class="form-control" id="settingLanguage">
                            <option value="zh-CN">简体中文</option>
                            <option value="en-US">English</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">时区</label>
                        <select class="form-control" id="settingTimezone">
                            <option value="Asia/Shanghai">Asia/Shanghai</option>
                            <option value="UTC">UTC</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">日期格式</label>
                        <select class="form-control" id="settingDateFormat">
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                        </select>
                    </div>
                </div>
            </div>
        `,
        profile: `
            <div class="card">
                <div class="card-header"><span class="card-title">👤 个人设置</span></div>
                <div class="card-body">
                    <div class="form-group">
                        <label class="form-label">姓名</label>
                        <input type="text" class="form-control" id="profileName" placeholder="请输入姓名">
                    </div>
                    <div class="form-group">
                        <label class="form-label">邮箱</label>
                        <input type="email" class="form-control" id="profileEmail" placeholder="请输入邮箱">
                    </div>
                    <div class="form-group">
                        <label class="form-label">手机号</label>
                        <input type="text" class="form-control" id="profilePhone" placeholder="请输入手机号">
                    </div>
                    <div style="padding-top:12px;border-top:1px solid #E5E7EB;">
                        <h4 style="font-size:14px;font-weight:600;margin-bottom:12px;">修改密码</h4>
                        <div class="form-group">
                            <label class="form-label">当前密码</label>
                            <input type="password" class="form-control" id="profileOldPwd" placeholder="请输入当前密码">
                        </div>
                        <div class="form-group">
                            <label class="form-label">新密码</label>
                            <input type="password" class="form-control" id="profileNewPwd" placeholder="请输入新密码">
                        </div>
                        <div class="form-group">
                            <label class="form-label">确认密码</label>
                            <input type="password" class="form-control" id="profileConfirmPwd" placeholder="请再次输入新密码">
                        </div>
                    </div>
                </div>
            </div>
        `,
        company: `
            <div class="card">
                <div class="card-header"><span class="card-title">🏢 公司设置</span></div>
                <div class="card-body">
                    <div class="form-group">
                        <label class="form-label">公司名称</label>
                        <input type="text" class="form-control" id="companyName" placeholder="请输入公司名称">
                    </div>
                    <div class="form-group">
                        <label class="form-label">税号</label>
                        <input type="text" class="form-control" id="companyTaxId" placeholder="请输入税号">
                    </div>
                    <div class="form-group">
                        <label class="form-label">地址</label>
                        <input type="text" class="form-control" id="companyAddress" placeholder="请输入公司地址">
                    </div>
                    <div class="form-group">
                        <label class="form-label">联系电话</label>
                        <input type="text" class="form-control" id="companyPhone" placeholder="请输入联系电话">
                    </div>
                    <div class="form-group">
                        <label class="form-label">邮箱</label>
                        <input type="email" class="form-control" id="companyEmail" placeholder="请输入公司邮箱">
                    </div>
                </div>
            </div>
        `,
        branches: `
            <div class="card">
                <div class="card-header">
                    <span class="card-title">🏪 门店管理</span>
                    <button class="btn btn-sm btn-primary" id="addBranch"><i class="fas fa-plus"></i> 添加门店</button>
                </div>
                <div class="card-body" id="branchesList">
                    <div style="text-align:center;padding:20px;color:#9CA3AF;">
                        <div class="spinner" style="margin:0 auto;"></div>
                    </div>
                </div>
            </div>
        `,
        preferences: `
            <div class="card">
                <div class="card-header"><span class="card-title">🎯 偏好设置</span></div>
                <div class="card-body">
                    <div class="form-group">
                        <label class="form-label">默认页面</label>
                        <select class="form-control" id="prefDefaultPage">
                            <option value="dashboard">仪表盘</option>
                            <option value="orders">订单管理</option>
                            <option value="pos">POS收银</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label class="form-label">每页显示条数</label>
                        <select class="form-control" id="prefPageSize">
                            <option value="10">10</option>
                            <option value="20" selected>20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <div style="display:flex;align-items:center;gap:8px;">
                            <input type="checkbox" id="prefDarkMode" checked>
                            <label for="prefDarkMode" style="margin:0;">深色模式</label>
                        </div>
                    </div>
                    <div class="form-group">
                        <div style="display:flex;align-items:center;gap:8px;">
                            <input type="checkbox" id="prefNotifications" checked>
                            <label for="prefNotifications" style="margin:0;">启用通知</label>
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    container.innerHTML = contentMap[sub] || '<div style="text-align:center;padding:40px;color:#9CA3AF;">设置页面</div>';

    // 加载门店数据
    if (sub === 'branches') {
        await loadBranches();
    }
}

async function loadBranches() {
    const container = document.getElementById('branchesList');
    const result = await apiClient.get('/settings/branches');
    const branches = result.success ? result.data || [] : [];

    if (branches.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:40px;color:#9CA3AF;">
                <i class="fas fa-store" style="font-size:32px;opacity:0.3;"></i>
                <p style="margin-top:8px;">暂无门店</p>
                <button class="btn btn-sm btn-primary" style="margin-top:8px;" id="addBranchEmpty">
                    <i class="fas fa-plus"></i> 添加门店
                </button>
            </div>
        `;
        document.getElementById('addBranchEmpty')?.addEventListener('click', addBranch);
        return;
    }

    container.innerHTML = branches.map(b => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:12px 16px;border-bottom:1px solid #F3F4F6;">
            <div>
                <div style="font-weight:500;">${b.name}</div>
                <div style="font-size:13px;color:#6B7280;">${b.address || '无地址'} | ${b.phone || '无电话'}</div>
            </div>
            <div style="display:flex;gap:8px;">
                <span style="font-size:12px;color:${b.status === 'active' ? '#10B981' : '#6B7280'};">${b.status === 'active' ? '✅ 营业中' : '⏸️ 已停用'}</span>
                <button class="btn btn-sm btn-outline branch-edit" data-id="${b.id}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger branch-delete" data-id="${b.id}"><i class="fas fa-trash"></i></button>
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.branch-edit').forEach(btn => {
        btn.addEventListener('click', () => modal.alert('编辑', '编辑门店功能开发中...', '知道了'));
    });
    document.querySelectorAll('.branch-delete').forEach(btn => {
        btn.addEventListener('click', () => modal.confirmDelete('门店').then(c => {
            if (c) modal.alert('删除', '门店已删除', '知道了', 'success');
        }));
    });
}

function addBranch() {
    modal.open({
        title: '添加门店',
        content: `
            <div style="padding:10px 0;">
                <div class="form-group">
                    <label class="form-label">门店名称</label>
                    <input type="text" class="form-control" id="branchName" placeholder="请输入门店名称">
                </div>
                <div class="form-group">
                    <label class="form-label">地址</label>
                    <input type="text" class="form-control" id="branchAddress" placeholder="请输入地址">
                </div>
                <div class="form-group">
                    <label class="form-label">电话</label>
                    <input type="text" class="form-control" id="branchPhone" placeholder="请输入电话">
                </div>
            </div>
        `,
        buttons: [
            { label: '取消', type: 'secondary' },
            {
                label: '创建',
                type: 'primary',
                onClick: async () => {
                    const name = document.getElementById('branchName').value.trim();
                    if (!name) {
                        modal.alert('提示', '请输入门店名称', '知道了', 'warning');
                        return;
                    }
                    await apiClient.post('/settings/branches', {
                        name,
                        address: document.getElementById('branchAddress').value.trim(),
                        phone: document.getElementById('branchPhone').value.trim(),
                        status: 'active'
                    });
                    modal.alert('成功', '门店已创建 ✅', '知道了', 'success');
                    await loadBranches();
                }
            }
        ]
    });
}

function bindEvents(container) {
    container.querySelectorAll('.settings-nav-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sub = btn.dataset.sub;
            if (sub !== state.activeSub) {
                container.querySelectorAll('.settings-nav-btn').forEach(b => {
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

    document.getElementById('settingsSave')?.addEventListener('click', () => {
        modal.alert('保存', '设置已保存 ✅', '知道了', 'success');
    });

    document.getElementById('addBranch')?.addEventListener('click', addBranch);
}

export async function init() {
    console.log('✅ [Settings] 模块已初始化');
}

export default { meta, render, init };