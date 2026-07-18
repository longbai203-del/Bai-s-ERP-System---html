export const meta = { name: '小票管理', path: '/pos/receipt', icon: 'fa-receipt', permission: 'pos:receipt' };
export async function render(container) {
    container.innerHTML = `
        <div class="receipt-container">
            <div class="page-header"><h1>🧾 小票管理</h1></div>
            <div class="card"><div class="card-body" id="receiptTable">
                <div style="text-align:center;padding:20px;"><div class="spinner" style="margin:0 auto;"></div></div>
            </div></div>
        </div>
    `;
    const result = await apiClient.get('/orders', { params: { limit: 20 } });
    const data = result.success ? result.data.list || [] : [];
    const columns = [
        { key: 'orderNumber', label: '订单号' },
        { key: 'customerName', label: '客户' },
        { key: 'totalAmount', label: '金额', render: v => `¥${v}` },
        { key: 'createdAt', label: '时间', type: 'datetime' }
    ];
    const tableContainer = document.getElementById('receiptTable');
    datatable.render(tableContainer, { columns, data, rowKey: 'id', emptyText: '暂无小票' });
}
export async function init() { console.log('✅ [Receipt] 已初始化'); }
export default { meta, render, init };
