/**
 * Finance Module - 财务管理
 */

(function() {
    'use strict';

    window.initFinance = function() {
        console.log('💰 Finance 模块加载完成');
        
        loadFinances();
        loadStats();
        bindEvents();
    };

    // 加载财务记录
    async function loadFinances() {
        try {
            const finances = await window.FinanceService.getAll({
                organization_id: window._currentOrg?.id
            });
            
            renderFinances(finances);
        } catch (error) {
            console.error('加载财务记录失败:', error);
        }
    }

    // 渲染财务记录
    function renderFinances(finances) {
        const container = document.querySelector('.finance-list');
        if (!container) return;
        
        container.innerHTML = finances.map(item => `
            <tr>
                <td>${item.voucher_no}</td>
                <td>${item.description}</td>
                <td><span class="type-${item.type}">${item.type === 'income' ? '收入' : '支出'}</span></td>
                <td>${item.category || '-'}</td>
                <td>${item.amount} SAR</td>
                <td>${new Date(item.transaction_date).toLocaleDateString()}</td>
                <td>
                    <button onclick="window.editFinance('${item.id}')">编辑</button>
                    <button onclick="window.deleteFinance('${item.id}')">删除</button>
                </td>
            </tr>
        `).join('');
    }

    // 加载统计
    async function loadStats() {
        try {
            const stats = await window.FinanceService.getStats({
                organization_id: window._currentOrg?.id
            });
            
            const el = document.querySelector($2); if (el) { el.textContent = stats.totalIncome + ' SAR'; }
            const el = document.querySelector($2); if (el) { el.textContent = stats.totalExpense + ' SAR'; }
            const el = document.querySelector($2); if (el) { el.textContent = stats.balance + ' SAR'; }
        } catch (error) {
            console.error('加载统计失败:', error);
        }
    }

    // 添加财务记录
    window.addFinance = async function() {
        const data = await window.Modal.form(`
            <form id="financeForm">
                <input name="description" placeholder="描述" required>
                <select name="type" required>
                    <option value="income">收入</option>
                    <option value="expense">支出</option>
                </select>
                <input name="category" placeholder="类别">
                <input name="amount" type="number" step="0.01" placeholder="金额" required>
                <input name="transaction_date" type="date">
                <textarea name="notes" placeholder="备注"></textarea>
            </form>
        `, '添加财务记录');
        
        if (data) {
            try {
                await window.FinanceService.create({
                    ...data,
                    organization_id: window._currentOrg?.id,
                    branch_id: window._currentBranch
                });
                loadFinances();
                loadStats();
                window.Notifications.success('财务记录添加成功');
            } catch (error) {
                window.Notifications.error('添加失败: ' + error.message);
            }
        }
    };

    // 绑定事件
    function bindEvents() {
        document.querySelector('.btn-add-finance')?.addEventListener('click', window.addFinance);
        document.querySelector('.btn-refresh')?.addEventListener('click', () => {
            loadFinances();
            loadStats();
        });
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="finance"]')) {
        window.initFinance();
    }

})();

