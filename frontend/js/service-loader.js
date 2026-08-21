/**
 * Service Loader - 统一加载所有 Services
 */

(function() {
    'use strict';

    const services = [
        'organization',
        'branch',
        'customer',
        'member',
        'product',
        'inventory',
        'purchase',
        'supplier',
        'pos',
        'order',
        'payment',
        'finance',
        'employee',
        'attendance',
        'vehicle',
        'crm',
        'marketing',
        'report',
        'settings',
        'notification',
        'audit'
    ];

    let loadedCount = 0;
    let failedCount = 0;

    async function loadServices() {
        console.log('📦 加载 Services...');
        
        const promises = services.map(async (svc) => {
            try {
                const script = document.createElement('script');
                script.src = '/services/' + svc + '.service.js';
                
                await new Promise((resolve, reject) => {
                    script.onload = resolve;
                    script.onerror = function() {
                        // 服务文件可能不存在，不抛出错误
                        resolve();
                    };
                    document.head.appendChild(script);
                });
                
                loadedCount++;
                return true;
            } catch (error) {
                failedCount++;
                return false;
            }
        });

        await Promise.all(promises);
        
        console.log('✅ Services 加载完成: ' + loadedCount + ' 个成功, ' + failedCount + ' 个失败');
    }

    // 在 DOM 加载后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadServices);
    } else {
        loadServices();
    }

})();
