export const meta = { name: '换货管理', path: '/pos/exchange', icon: 'fa-exchange-alt', permission: 'pos:exchange' };
export async function render(container) {
    container.innerHTML = `
        <div class="exchange-container">
            <div class="page-header"><h1>🔄 换货管理</h1></div>
            <div class="card"><div class="card-body">
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;">
                    <div>
                        <h4>原订单</h4>
                        <input type="text" class="form-control" placeholder="输入订单号" id="exchangeOrderNo">
                        <button class="btn btn-primary" style="margin-top:8px;" id="exchangeSearchOrder">查询</button>
                        <div id="exchangeOrderInfo" style="margin-top:12px;"></div>
                    </div>
                    <div>
                        <h4>换货商品</h4>
                        <div id="exchangeItems"></div>
                        <button class="btn btn-success" style="margin-top:12px;" id="exchangeConfirm">确认换货</button>
                    </div>
                </div>
            </div></div>
        </div>
    `;
}
export async function init() { console.log('✅ [Exchange] 已初始化'); }
export default { meta, render, init };

