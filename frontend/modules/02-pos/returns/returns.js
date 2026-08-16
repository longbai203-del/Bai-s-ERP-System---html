export const meta = { name: '退货管理', path: '/pos/returns', icon: 'fa-undo', permission: 'pos:returns' };
export async function render(container) {
    container.innerHTML = `
        <div class="returns-container">
            <div class="page-header"><h1>↩️ 退货管理</h1></div>
            <div class="card"><div class="card-body">
                <div style="display:flex;gap:12px;margin-bottom:16px;">
                    <input type="text" class="form-control" placeholder="输入订单号" style="flex:1;" id="returnOrderNo">
                    <button class="btn btn-primary" id="returnSearch">查询</button>
                </div>
                <div id="returnResult"></div>
                <button class="btn btn-danger" id="returnConfirm" style="display:none;">确认退货</button>
            </div></div>
        </div>
    `;
}
export async function init() { console.log('✅ [Returns] 已初始化'); }
export default { meta, render, init };