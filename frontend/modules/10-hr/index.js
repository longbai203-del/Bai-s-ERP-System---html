/**
 * @file system/index.js
 * @description 系统管理模块
 * @module modules/system
 */

import { apiClient } from '@services/api-client.js';
import { datatable } from '@components/datatable.js';
import { modal } from '@components/modal.js';
import { navbar } from '@components/navbar.js';

export const meta = {
    name: '系统管理',
    path: '/system',
    icon: 'fa-cog',
    permission: 'system:view',
    enabled: true,
    order: 110
};

const subModules = [
    { id: 'settings', label: '系统设置', icon: 'fa-sliders-h' },
    { id: 'roles', label: '角色管理', icon: 'fa-user-tag' },
    { id: 'permissions', label: '权限管理', icon: 'fa-shield-alt' },
    { id: 'audit-logs', label: '审计日志', icon: 'fa-history' },
    { id: 'api-keys', label: 'API密钥', icon: 'fa-key' },
    { id: 'webhooks', label: 'Webhook管理', icon: 'fa-bolt' },
    { id: 'notifications', label: '通知管理', icon: 'fa-bell' },
    { id: 'integrations', label: '集成管理', icon: 'fa-plug' },
    { id: 'backup', label: '备份管理', icon: 'fa-database' },
    { id: 'restore', label: '恢复管理', icon: 'fa-undo-alt' },
    { id: 'marketplace', label: '应用市场', icon: 'fa-store' }
];

let state = { activeSub: 'settings' };

export async function render(container, params = {}) {
    const sub = params.sub || 'settings';
    state.activeSub = sub;

    navbar.updateBreadcrumb('系统管理');

    container.innerHTML = `
        <div class="system-container">
            <div class="page-header">
                <h1>⚙️ 系统管理</h1>
                <div class="page-actions">
                    <button class="btn btn-primary" id="systemAction">
                        <i class="fas fa-save"></i> 保存设置
                    </button>
                </div>
            </div>

            <div class="sub-module-nav" style="display:flex;gap:4px;margin-bottom:20px;background:white;padding:8px;border-radius:12px;border:1px solid #E5E7EB;flex-wrap:wrap;">
                ${subModules.map(sm => `
                    <button class="sub-module-btn ${sm.id === sub ? 'active' : ''}" 
                            data-sub="${sm.id}"
                            style="padding:6px 12px;border:none;border-radius:8px;cursor:pointer;background:${sm.id === sub ? '#4F46E5' : 'transparent'};color:${sm.id === sub ? 'white' : '#6B7280'};font-weight:${sm.id === sub ? '600' : '400'};font-size:12px;">
                        <i class="fas ${sm.icon}"></i> ${sm.label}
                    </button>
                `).join('')}
            </div>

            <div id="systemContent">
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

async function loadSubModule(sub) {
    const container = document.getElementById('systemContent');
    state.activeSub = sub;

    // 系统设置 - 显示配置表单
    if (sub === 'settings') {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <span class="card-title">⚙️ 系统设置</span>
                </div>
                <div class="card-body">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                        <div class="form-group">
                            <label class="form-label">系统名称</label>
                            <input type="text" class="form-control" id="sysName" value="Bai's ERP">
                        </div>
                        <div class="form-group">
                            <label class="form-label">系统版本</label>
                            <input type="text" class="form-control" id="sysVersion" value="2.0.0" disabled>
                        </div>
                        <div class="form-group">
                            <label class="form-label">默认语言</label>
                            <select class="form-control" id="sysLanguage">
                                <option value="zh-CN" selected>简体中文</option>
                                <option value="en-US">English</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">时区</label>
                            <select class="form-control" id="sysTimezone">
                                <option value="Asia/Shanghai" selected>Asia/Shanghai</option>
                                <option value="UTC">UTC</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">维护模式</label>
                            <select class="form-control" id="sysMaintenance">
                                <option value="0">关闭</option>
                                <option value="1">开启</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">日志级别</label>
                            <select class="form-control" id="sysLogLevel">
                                <option value="debug">Debug</option>
                                <option value="info" selected>Info</option>
                                <option value="warn">Warning</option>
                                <option value="error">Error</option>
                            </select>
                        </div>
                    </div>
                    <div style="margin-top:16px;padding-top:16px;border-top:1px solid #E5E7EB;">
                        <button class="btn btn-primary" id="saveSysSettings">
                            <i class="fas fa-save"></i> 保存设置
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.getElementById('saveSysSettings')?.addEventListener('click', () => {
            modal.alert('保存', '系统设置已保存 ✅', '知道了', 'success');
        });
        return;
    }

    // 其他子模块显示表格
    const endpoints = {
        roles: '/system/roles',
        permissions: '/system/permissions',
        'audit-logs': '/system/audit-logs',
        'api-keys': '/system/api-keys',
        webhooks: '/system/webhooks',
        notifications: '/system/notifications',
        integrations: '/system/integrations',
        backup: '/system/backup',
        restore: '/system/restore',
        marketplace: '/system/marketplace'
    };

    const columnsMap = {
        roles: [
            { key: 'name', label: '角色名称' },
            { key: 'description', label: '描述' },
            { key: 'users', label: '用户数' },
            { key: 'status', label: '状态', type: 'status' }
        ],
        permissions: [
            { key: 'name', label: '权限名称' },
            { key: 'resource', label: '资源' },
            { key: 'action', label: '操作' },
            { key: 'description', label: '描述' }
        ],
        'audit-logs': [
            { key: 'userName', label: '用户' },
            { key: 'action', label: '操作' },
            { key: 'resource', label: '资源' },
            { key: 'details', label: '详情' },
            { key: 'createdAt', label: '时间', type: 'datetime' }
        ],
        'api-keys': [
            { key: 'name', label: '名称' },
            { key: 'key', label: 'API Key' },
            { key: 'permissions', label: '权限' },
            { key: 'status', label: '状态', type: 'status' },
            { key: 'createdAt', label: '创建时间', type: 'datetime' }
        ],
        webhooks: [
            { key: 'name', label: '名称' },
            { key: 'url', label: 'URL' },
            { key: 'events', label: '事件' },
            { key: 'status', label: '状态', type: 'status' }
        ]
    };

    container.innerHTML = `
        <div class="card">
            <div class="card-header">
                <span class="card-title">${subModules.find(s => s.id === sub)?.label || ''}</span>
                <div style="display:flex;gap:8px;">
                    <input type="text" class="form-control" id="systemSearch" placeholder="搜索..." style="width:160px;padding:4px 12px;">
                    <button class="btn btn-sm btn-primary" id="systemSearchBtn"><i class="fas fa-search"></i></button>
                </div>
            </div>
            <div class="card-body" id="systemTable">
                <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
            </div>
        </div>
    `;

    const result = await apiClient.get(endpoints[sub] || `/system/${sub}`);
    const data = result.success ? result.data || [] : [];

    const tableContainer = document.getElementById('systemTable');
    datatable.render(tableContainer, {
        columns: columnsMap[sub] || [{ key: 'id', label: 'ID' }],
        data,
        rowKey: 'id',
        emptyText: `暂无${subModules.find(s => s.id === sub)?.label || ''}数据`
    });
}

function bindEvents(container) {
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

    document.getElementById('systemAction')?.addEventListener('click', () => {
        if (state.activeSub === 'settings') {
            modal.alert('保存', '系统设置已保存 ✅', '知道了', 'success');
        } else {
            modal.alert('保存', `正在保存 ${state.activeSub} 设置...`, '知道了');
        }
    });
}

export async function init() {
    console.log('✅ [System] 模块已初始化');
}

export default { meta, render, init };