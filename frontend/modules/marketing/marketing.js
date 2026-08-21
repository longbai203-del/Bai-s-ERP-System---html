/**
 * Marketing Module - 营销管理
 */

(function() {
    'use strict';

    let campaigns = [];

    window.initMarketing = async function() {
        console.log('📣 Marketing 模块加载完成');
        await loadCampaigns();
        bindEvents();
    };

    async function loadCampaigns() {
        try {
            var container = document.getElementById('marketingTableWrapper');
            if (!container) return;

            container.innerHTML = '<div class="loading-placeholder"><div class="spinner"></div><p>加载营销活动中...</p></div>';

            var client = window.Supabase.getClient();
            var result = await client
                .from('marketing_campaigns')
                .select('*')
                .order('created_at', { ascending: false });

            if (result.error) throw result.error;

            campaigns = result.data || [];
            renderCampaigns(container);

        } catch (error) {
            console.error('加载营销活动失败:', error);
            var container = document.getElementById('marketingTableWrapper');
            if (container) {
                container.innerHTML = '<div style="text-align:center;padding:40px;color:#c33;"><p>加载失败: ' + error.message + '</p><button onclick="window.initMarketing()" style="margin-top:12px;padding:8px 20px;background:#667eea;color:#fff;border:none;border-radius:4px;cursor:pointer;">重试</button></div>';
            }
        }
    }

    function renderCampaigns(container) {
        if (!campaigns || campaigns.length === 0) {
            container.innerHTML = '<div style="text-align:center;padding:60px 20px;color:#999;"><div style="font-size:48px;margin-bottom:16px;">📣</div><h3>暂无营销活动</h3><p style="margin-top:8px;">点击「新建活动」创建第一个营销活动</p></div>';
            return;
        }

        var html = '<div style="margin-bottom:16px;color:#666;font-size:14px;">共 ' + campaigns.length + ' 个活动</div>';
        html += '<table style="width:100%;border-collapse:collapse;background:#fff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.06);"><thead><tr style="background:#f8f9fa;"><th style="padding:12px 16px;text-align:left;">活动名称</th><th style="padding:12px 16px;text-align:left;">类型</th><th style="padding:12px 16px;text-align:left;">预算</th><th style="padding:12px 16px;text-align:left;">状态</th><th style="padding:12px 16px;text-align:center;">操作</th></tr></thead><tbody>';

        for (var i = 0; i < campaigns.length; i++) {
            var c = campaigns[i];
            html += '<tr style="border-bottom:1px solid #f0f0f0;"><td style="padding:12px 16px;font-weight:500;">' + (c.name || '-') + '</td><td style="padding:12px 16px;color:#666;">' + (c.type || '-') + '</td><td style="padding:12px 16px;color:#666;">' + (c.budget || 0) + ' SAR</td><td style="padding:12px 16px;"><span class="' + getStatusClass(c.status) + '">' + (c.status || 'draft') + '</span></td><td style="padding:12px 16px;text-align:center;"><button class="btn-edit" onclick="window.editCampaign(\'' + c.id + '\')" style="padding:4px 12px;border:none;border-radius:4px;background:#e3f2fd;color:#1976d2;cursor:pointer;">编辑</button><button class="btn-delete" onclick="window.deleteCampaign(\'' + c.id + '\')" style="padding:4px 12px;border:none;border-radius:4px;background:#fce4ec;color:#c62828;cursor:pointer;margin-left:4px;">删除</button></td></tr>';
        }

        html += '</tbody></table>';
        container.innerHTML = html;
    }

    window.showCreateCampaign = async function() {
        var formHtml = '<form id="campaignForm" style="display:flex;flex-direction:column;gap:16px;"><div><label style="display:block;margin-bottom:4px;font-weight:500;">活动名称 *</label><input type="text" name="name" placeholder="请输入活动名称" required style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;"></div><div><label style="display:block;margin-bottom:4px;font-weight:500;">类型</label><select name="type" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;"><option value="email">邮件</option><option value="sms">短信</option><option value="social">社交媒体</option><option value="in_store">门店</option></select></div><div><label style="display:block;margin-bottom:4px;font-weight:500;">预算</label><input type="number" name="budget" placeholder="请输入预算" style="width:100%;padding:10px 12px;border:1px solid #ddd;border-radius:6px;font-size:14px;"></div></form>';

        var result = await window.Modal.form(formHtml, '📣 新建营销活动', '创建', '取消');
        if (result) {
            try {
                var client = window.Supabase.getClient();
                var insertResult = await client
                    .from('marketing_campaigns')
                    .insert([{
                        name: result.name,
                        type: result.type || 'email',
                        budget: parseFloat(result.budget) || 0,
                        status: 'draft'
                    }]);

                if (insertResult.error) throw insertResult.error;

                window.Notifications.success('营销活动创建成功');
                await loadCampaigns();

            } catch (error) {
                window.Notifications.error('创建失败: ' + error.message);
            }
        }
    };

    function bindEvents() {}

    if (document.querySelector('[data-module="marketing"]')) {
        window.initMarketing();
    }

})();
