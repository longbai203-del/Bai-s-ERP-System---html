export const meta = { name: '触屏收银', path: '/pos/touch-pos', icon: 'fa-hand-pointer', permission: 'pos:touch' };
export async function render(container) {
    container.innerHTML = `
        <div class="touch-pos-container">
            <div class="page-header"><h1>👆 触屏收银</h1></div>
            <div class="card"><div class="card-body">
                <div style="text-align:center;padding:40px;">
                    <i class="fas fa-hand-pointer" style="font-size:48px;color:#4F46E5;"></i>
                    <h3 style="margin-top:12px;">触屏收银模式</h3>
                    <p style="color:#6B7280;">针对触屏设备优化的收银界面</p>
                    <div style="margin-top:16px;display:grid;grid-template-columns:repeat(5,1fr);gap:8px;max-width:600px;margin:16px auto;">
                        ${[1,2,3,4,5,6,7,8,9,0,'清空','结账'].map(n => `
                            <button class="btn btn-outline" style="padding:16px;font-size:20px;">${n}</button>
                        `).join('')}
                    </div>
                </div>
            </div></div>
        </div>
    `;
}
export async function init() { console.log('✅ [TouchPOS] 已初始化'); }
export default { meta, render, init };