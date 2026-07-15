/**
 * @file ai/index.js
 * @description AI智能助手模块
 * @module modules/ai
 */

import { apiClient } from '@services/api-client.js';

import { modal } from '@components/modal.js';

export const meta = {
    name: 'AI智能助手',
    path: '/ai',
    icon: 'fa-robot',
    permission: 'ai:view',
    enabled: true,
    order: 140
};

const subModules = [
    { id: 'chat', label: 'AI对话', icon: 'fa-comment-dots' },
    { id: 'analytics', label: '智能分析', icon: 'fa-brain' },
    { id: 'predict', label: '预测建议', icon: 'fa-chart-line' },
    { id: 'automation', label: '自动化', icon: 'fa-cogs' },
    { id: 'insights', label: '智能洞察', icon: 'fa-lightbulb' }
];

let state = { activeSub: 'chat' };

export async function render(container, params = {}) {
    const sub = params.sub || 'chat';
    state.activeSub = sub;

    

    container.innerHTML = `
        <div class="ai-container">
            <div class="page-header">
                <h1>🤖 AI智能助手</h1>
                <div class="page-actions">
                    <span style="font-size:12px;color:#6B7280;background:#E0F2FE;padding:4px 12px;border-radius:12px;">
                        <i class="fas fa-circle" style="color:#10B981;font-size:8px;"></i> 在线
                    </span>
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

            <div id="aiContent">
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
    const container = document.getElementById('aiContent');
    state.activeSub = sub;

    if (sub === 'chat') {
        container.innerHTML = `
            <div class="card" style="height:500px;display:flex;flex-direction:column;">
                <div class="card-header">
                    <span class="card-title">💬 AI对话</span>
                    <button class="btn btn-sm btn-outline" id="clearChat">
                        <i class="fas fa-trash"></i> 清空对话
                    </button>
                </div>
                <div class="card-body" id="chatMessages" style="flex:1;overflow-y:auto;padding:16px;">
                    <div style="display:flex;gap:12px;margin-bottom:16px;">
                        <div style="width:36px;height:36px;border-radius:50%;background:#4F46E5;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;flex-shrink:0;">AI</div>
                        <div style="background:#F3F4F6;padding:12px 16px;border-radius:12px;border-top-left-radius:4px;max-width:80%;">
                            你好！我是 Bai's ERP 智能助手，有什么可以帮助你的吗？
                        </div>
                    </div>
                </div>
                <div style="padding:12px 16px;border-top:1px solid #E5E7EB;display:flex;gap:8px;">
                    <input type="text" class="form-control" id="chatInput" placeholder="输入你的问题..." style="flex:1;">
                    <button class="btn btn-primary" id="sendChat">
                        <i class="fas fa-paper-plane"></i> 发送
                    </button>
                </div>
            </div>
        `;

        document.getElementById('sendChat')?.addEventListener('click', sendMessage);
        document.getElementById('chatInput')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
        document.getElementById('clearChat')?.addEventListener('click', () => {
            const container = document.getElementById('chatMessages');
            container.innerHTML = `
                <div style="display:flex;gap:12px;margin-bottom:16px;">
                    <div style="width:36px;height:36px;border-radius:50%;background:#4F46E5;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;flex-shrink:0;">AI</div>
                    <div style="background:#F3F4F6;padding:12px 16px;border-radius:12px;border-top-left-radius:4px;max-width:80%;">
                        对话已清空，有什么我可以帮你的吗？
                    </div>
                </div>
            `;
        });
        return;
    }

    // 其他子模块
    const contentMap = {
        analytics: `
            <div class="card">
                <div class="card-header"><span class="card-title">🧠 智能分析</span></div>
                <div class="card-body">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                        <div style="padding:20px;background:#F0FDF4;border-radius:8px;text-align:center;">
                            <div style="font-size:32px;">📈</div>
                            <div style="font-weight:600;margin-top:4px;">销售预测</div>
                            <div style="font-size:14px;color:#6B7280;">基于历史数据预测未来销售</div>
                            <button class="btn btn-sm btn-primary" style="margin-top:8px;" id="aiPredictSales">分析</button>
                        </div>
                        <div style="padding:20px;background:#EFF6FF;border-radius:8px;text-align:center;">
                            <div style="font-size:32px;">👥</div>
                            <div style="font-weight:600;margin-top:4px;">客户分析</div>
                            <div style="font-size:14px;color:#6B7280;">客户画像与行为分析</div>
                            <button class="btn btn-sm btn-primary" style="margin-top:8px;" id="aiAnalyzeCustomers">分析</button>
                        </div>
                        <div style="padding:20px;background:#FEF3C7;border-radius:8px;text-align:center;">
                            <div style="font-size:32px;">📊</div>
                            <div style="font-weight:600;margin-top:4px;">库存优化</div>
                            <div style="font-size:14px;color:#6B7280;">智能库存预测与补货建议</div>
                            <button class="btn btn-sm btn-primary" style="margin-top:8px;" id="aiOptimizeStock">优化</button>
                        </div>
                        <div style="padding:20px;background:#FCE4EC;border-radius:8px;text-align:center;">
                            <div style="font-size:32px;">💰</div>
                            <div style="font-weight:600;margin-top:4px;">财务分析</div>
                            <div style="font-size:14px;color:#6B7280;">AI驱动的财务健康分析</div>
                            <button class="btn btn-sm btn-primary" style="margin-top:8px;" id="aiAnalyzeFinance">分析</button>
                        </div>
                    </div>
                    <div id="aiResult" style="margin-top:16px;padding:16px;background:#F9FAFB;border-radius:8px;display:none;"></div>
                </div>
            </div>
        `,
        predict: `
            <div class="card">
                <div class="card-header"><span class="card-title">🔮 预测建议</span></div>
                <div class="card-body">
                    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:16px;">
                        <div class="stat-card">
                            <div class="stat-label">下月销售预测</div>
                            <div class="stat-value" style="font-size:20px;">¥128,500</div>
                            <div style="font-size:12px;color:#10B981;">↑ 8.5%</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">建议补货商品</div>
                            <div class="stat-value" style="font-size:20px;">12</div>
                            <div style="font-size:12px;color:#F59E0B;">⚠️ 需关注</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">客户增长预测</div>
                            <div class="stat-value" style="font-size:20px;">+24</div>
                            <div style="font-size:12px;color:#10B981;">↑ 12%</div>
                        </div>
                    </div>
                    <div style="border-top:1px solid #E5E7EB;padding-top:12px;">
                        <div style="font-weight:500;margin-bottom:8px;">📋 智能建议</div>
                        <div style="padding:12px;background:#F3F4F6;border-radius:8px;font-size:14px;color:#6B7280;">
                            根据数据分析，建议增加洗车类商品库存，重点关注高端美容产品线。预计下月客户增长12%，建议提前准备营销活动。
                        </div>
                    </div>
                </div>
            </div>
        `,
        automation: `
            <div class="card">
                <div class="card-header"><span class="card-title">⚡ 自动化</span></div>
                <div class="card-body">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                        <div style="padding:16px;border:1px solid #E5E7EB;border-radius:8px;">
                            <div style="display:flex;align-items:center;gap:8px;">
                                <i class="fas fa-clock" style="color:#3B82F6;"></i>
                                <span style="font-weight:500;">自动订单处理</span>
                            </div>
                            <div style="font-size:13px;color:#6B7280;margin-top:4px;">自动确认新订单</div>
                            <label style="margin-top:8px;display:flex;align-items:center;gap:8px;">
                                <input type="checkbox" checked> 启用
                            </label>
                        </div>
                        <div style="padding:16px;border:1px solid #E5E7EB;border-radius:8px;">
                            <div style="display:flex;align-items:center;gap:8px;">
                                <i class="fas fa-bell" style="color:#10B981;"></i>
                                <span style="font-weight:500;">智能通知</span>
                            </div>
                            <div style="font-size:13px;color:#6B7280;margin-top:4px;">库存预警自动通知</div>
                            <label style="margin-top:8px;display:flex;align-items:center;gap:8px;">
                                <input type="checkbox" checked> 启用
                            </label>
                        </div>
                        <div style="padding:16px;border:1px solid #E5E7EB;border-radius:8px;">
                            <div style="display:flex;align-items:center;gap:8px;">
                                <i class="fas fa-file-alt" style="color:#F59E0B;"></i>
                                <span style="font-weight:500;">自动报表</span>
                            </div>
                            <div style="font-size:13px;color:#6B7280;margin-top:4px;">每日自动生成报表</div>
                            <label style="margin-top:8px;display:flex;align-items:center;gap:8px;">
                                <input type="checkbox"> 启用
                            </label>
                        </div>
                        <div style="padding:16px;border:1px solid #E5E7EB;border-radius:8px;">
                            <div style="display:flex;align-items:center;gap:8px;">
                                <i class="fas fa-users" style="color:#8B5CF6;"></i>
                                <span style="font-weight:500;">客户自动跟进</span>
                            </div>
                            <div style="font-size:13px;color:#6B7280;margin-top:4px;">老客户自动回访</div>
                            <label style="margin-top:8px;display:flex;align-items:center;gap:8px;">
                                <input type="checkbox"> 启用
                            </label>
                        </div>
                    </div>
                    <button class="btn btn-primary" style="margin-top:16px;">
                        <i class="fas fa-save"></i> 保存自动化设置
                    </button>
                </div>
            </div>
        `,
        insights: `
            <div class="card">
                <div class="card-header"><span class="card-title">💡 智能洞察</span></div>
                <div class="card-body">
                    <div style="margin-bottom:16px;">
                        <div style="display:flex;gap:8px;flex-wrap:wrap;">
                            <button class="btn btn-sm btn-primary" id="insightRefresh">
                                <i class="fas fa-sync"></i> 刷新洞察
                            </button>
                            <button class="btn btn-sm btn-outline" id="insightExport">
                                <i class="fas fa-download"></i> 导出报告
                            </button>
                        </div>
                    </div>
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;" id="insightCards">
                        <div style="padding:16px;background:#F0FDF4;border-radius:8px;border-left:4px solid #10B981;">
                            <div style="font-weight:500;">📈 销售增长</div>
                            <div style="font-size:14px;color:#6B7280;margin-top:4px;">本周销售额环比增长 15.3%</div>
                        </div>
                        <div style="padding:16px;background:#EFF6FF;border-radius:8px;border-left:4px solid #3B82F6;">
                            <div style="font-weight:500;">👥 客户活跃</div>
                            <div style="font-size:14px;color:#6B7280;margin-top:4px;">活跃客户数较上月增加 28%</div>
                        </div>
                        <div style="padding:16px;background:#FEF3C7;border-radius:8px;border-left:4px solid #F59E0B;">
                            <div style="font-weight:500;">⚠️ 库存预警</div>
                            <div style="font-size:14px;color:#6B7280;margin-top:4px;">5个商品库存低于安全线</div>
                        </div>
                        <div style="padding:16px;background:#FCE4EC;border-radius:8px;border-left:4px solid #EF4444;">
                            <div style="font-weight:500;">📉 流失预警</div>
                            <div style="font-size:14px;color:#6B7280;margin-top:4px;">3个客户超过30天未消费</div>
                        </div>
                    </div>
                </div>
            </div>
        `
    };

    container.innerHTML = contentMap[sub] || '<div style="text-align:center;padding:40px;color:#9CA3AF;">AI 功能开发中</div>';

    // 绑定AI功能按钮
    if (sub === 'analytics') {
        document.getElementById('aiPredictSales')?.addEventListener('click', () => {
            const result = document.getElementById('aiResult');
            result.style.display = 'block';
            result.innerHTML = `
                <div style="display:flex;align-items:center;gap:12px;">
                    <div class="spinner" style="width:20px;height:20px;border-width:2px;"></div>
                    <span>AI 正在分析销售数据...</span>
                </div>
            `;
            setTimeout(() => {
                result.innerHTML = `
                    <div style="padding:12px;background:#F0FDF4;border-radius:8px;">
                        <div style="font-weight:500;">📊 销售预测结果</div>
                        <div style="font-size:14px;color:#6B7280;margin-top:4px;">预测下月销售额：¥128,500</div>
                        <div style="font-size:14px;color:#6B7280;">建议：增加洗车类产品库存，预计需求增长12%</div>
                    </div>
                `;
            }, 1500);
        });
        document.getElementById('aiAnalyzeCustomers')?.addEventListener('click', () => {
            const result = document.getElementById('aiResult');
            result.style.display = 'block';
            result.innerHTML = `
                <div style="padding:12px;background:#EFF6FF;border-radius:8px;">
                    <div style="font-weight:500;">👥 客户分析结果</div>
                    <div style="font-size:14px;color:#6B7280;margin-top:4px;">VIP客户占比：12% | 活跃客户：328人</div>
                    <div style="font-size:14px;color:#6B7280;">建议：针对VIP客户推出专属优惠，提升复购率</div>
                </div>
            `;
        });
        document.getElementById('aiOptimizeStock')?.addEventListener('click', () => {
            const result = document.getElementById('aiResult');
            result.style.display = 'block';
            result.innerHTML = `
                <div style="padding:12px;background:#FEF3C7;border-radius:8px;">
                    <div style="font-weight:500;">📦 库存优化建议</div>
                    <div style="font-size:14px;color:#6B7280;margin-top:4px;">建议补货商品：泡沫洗车液(12件)、水蜡(8件)</div>
                    <div style="font-size:14px;color:#6B7280;">预计可减少缺货损失 ¥2,800</div>
                </div>
            `;
        });
        document.getElementById('aiAnalyzeFinance')?.addEventListener('click', () => {
            const result = document.getElementById('aiResult');
            result.style.display = 'block';
            result.innerHTML = `
                <div style="padding:12px;background:#FCE4EC;border-radius:8px;">
                    <div style="font-weight:500;">💰 财务分析结果</div>
                    <div style="font-size:14px;color:#6B7280;margin-top:4px;">毛利率：32% | 净利率：18%</div>
                    <div style="font-size:14px;color:#6B7280;">建议：优化采购成本，可提升利润率约5%</div>
                </div>
            `;
        });
    }

    if (sub === 'insights') {
        document.getElementById('insightRefresh')?.addEventListener('click', () => {
            modal.alert('刷新', 'AI 洞察已更新 ✅', '知道了', 'success');
        });
        document.getElementById('insightExport')?.addEventListener('click', () => {
            modal.alert('导出', 'AI 洞察报告已导出 📄', '知道了', 'success');
        });
    }
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
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    const messages = document.getElementById('chatMessages');
    
    // 添加用户消息
    messages.innerHTML += `
        <div style="display:flex;gap:12px;margin-bottom:16px;justify-content:flex-end;">
            <div style="background:#4F46E5;color:white;padding:12px 16px;border-radius:12px;border-top-right-radius:4px;max-width:80%;">
                ${message}
            </div>
            <div style="width:36px;height:36px;border-radius:50%;background:#9CA3AF;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;flex-shrink:0;">U</div>
        </div>
    `;

    input.value = '';
    messages.scrollTop = messages.scrollHeight;

    // AI 响应（模拟）
    const responses = [
        '好的，我理解你的问题。让我帮你分析一下...',
        '根据系统数据，我建议你可以这样做...',
        '这是一个很好的问题！让我为你详细解释...',
        '我已经为你找到了相关信息，请查看...',
        '明白了，我会为你处理这个请求。'
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    setTimeout(() => {
        messages.innerHTML += `
            <div style="display:flex;gap:12px;margin-bottom:16px;">
                <div style="width:36px;height:36px;border-radius:50%;background:#4F46E5;display:flex;align-items:center;justify-content:center;color:white;font-weight:600;flex-shrink:0;">AI</div>
                <div style="background:#F3F4F6;padding:12px 16px;border-radius:12px;border-top-left-radius:4px;max-width:80%;">
                    ${randomResponse}
                </div>
            </div>
        `;
        messages.scrollTop = messages.scrollHeight;
    }, 500);
}

export async function init() {
    console.log('✅ [AI] 模块已初始化');
}

export default { meta, render, init };