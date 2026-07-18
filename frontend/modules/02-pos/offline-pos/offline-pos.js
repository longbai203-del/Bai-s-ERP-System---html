export const meta = { name: '离线收银', path: '/pos/offline-pos', icon: 'fa-wifi-slash', permission: 'pos:offline' };
export async function render(container) {
    container.innerHTML = `
        <div class="offline-pos-container">
            <div class="page-header"><h1>📴 离线收银</h1></div>
            <div class="card"><div class="card-body">
                <div style="text-align:center;padding:40px;">
                    <i class="fas fa-wifi-slash" style="font-size:48px;color:#F59E0B;"></i>
                    <h3 style="margin-top:12px;">离线模式</h3>
                    <p style="color:#6B7280;">当前处于离线状态，数据将在恢复网络后同步</p>
                    <div style="margin-top:16px;display:flex;gap:12px;justify-content:center;">
                        <span style="background:#FEF3C7;padding:4px 12px;border-radius:12px;font-size:12px;">待同步: 3 单</span>
                        <button class="btn btn-primary" id="syncOffline">同步数据</button>
                    </div>
                </div>
            </div></div>
        </div>
    `;
}
export async function init() { console.log('✅ [OfflinePOS] 已初始化'); }
export default { meta, render, init };
