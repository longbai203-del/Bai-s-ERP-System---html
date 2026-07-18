export const meta = { name: '厨房显示屏', path: '/pos/kitchen-display', icon: 'fa-utensils', permission: 'pos:kitchen-display' };
export async function render(container) {
    container.innerHTML = `
        <div class="kitchen-display-container">
            <div class="page-header"><h1>🍳 厨房显示屏</h1></div>
            <div class="card"><div class="card-body">
                <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;" id="kitchenOrders">
                    <div style="text-align:center;padding:20px;color:#9CA3AF;">暂无订单</div>
                </div>
            </div></div>
        </div>
    `;
}
export async function init() { console.log('✅ [KitchenDisplay] 已初始化'); }
export default { meta, render, init };
