export const meta = { name: '快速销售', path: '/pos/quick-sale', icon: 'fa-bolt', permission: 'pos:quick-sale' };
export async function render(container) {
    container.innerHTML = `
        <div class="quick-sale-container">
            <div class="page-header"><h1>⚡ 快速销售</h1></div>
            <div class="card"><div class="card-body">
                <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
                    ${['标准洗车','精洗','打蜡','内饰清洁','发动机清洗','轮胎护理','空调清洗','镀膜'].map(name => `
                        <button class="btn btn-primary quick-sale-btn" style="padding:20px;font-size:16px;text-align:center;height:80px;">
                            <div style="font-size:24px;">🚗</div>
                            <div>${name}</div>
                            <div style="font-size:12px;font-weight:300;">¥${Math.floor(Math.random()*200+50)}</div>
                        </button>
                    `).join('')}
                </div>
            </div></div>
        </div>
    `;
}
export async function init() { console.log('✅ [QuickSale] 已初始化'); }
export default { meta, render, init };