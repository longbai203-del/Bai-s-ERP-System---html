/**
 * AI Module - AI智能助手
 */

(function() {
    'use strict';

    let messages = [];
    let isProcessing = false;

    window.initAI = function() {
        console.log('🤖 AI 模块加载完成');
        
        renderChat();
        bindEvents();
        loadSuggestions();
    };

    // 渲染聊天
    function renderChat() {
        const container = document.querySelector('.ai-chat-messages');
        if (!container) return;
        
        if (messages.length === 0) {
            container.innerHTML = `
                <div class="ai-welcome">
                    <div class="ai-avatar">🤖</div>
                    <div class="ai-message">你好！我是AI智能助手，可以帮助你：<br>
                        • 分析销售数据<br>
                        • 预测库存需求<br>
                        • 优化客户服务<br>
                        • 生成业务建议
                    </div>
                </div>
            `;
            return;
        }
        
        container.innerHTML = messages.map(msg => `
            <div class="ai-message ${msg.role}">
                <div class="ai-avatar">${msg.role === 'user' ? '👤' : '🤖'}</div>
                <div class="ai-content">${msg.content}</div>
            </div>
        `).join('');
        
        container.scrollTop = container.scrollHeight;
    }

    // 发送消息
    window.sendAIMessage = async function() {
        const input = document.querySelector('.ai-input');
        const message = input?.value.trim();
        
        if (!message || isProcessing) return;
        
        // 添加用户消息
        messages.push({ role: 'user', content: message });
        renderChat();
        input.value = '';
        
        isProcessing = true;
        document.querySelector('.ai-send-btn').disabled = true;
        
        try {
            // 调用AI API（这里使用模拟响应）
            const response = await getAIResponse(message);
            
            messages.push({ role: 'assistant', content: response });
            renderChat();
        } catch (error) {
            console.error('AI请求失败:', error);
            window.Notifications.error('AI服务暂时不可用');
            messages.push({ 
                role: 'assistant', 
                content: '抱歉，我暂时无法处理你的请求。请稍后再试。' 
            });
            renderChat();
        }
        
        isProcessing = false;
        document.querySelector('.ai-send-btn').disabled = false;
    };

    // 获取AI响应
    async function getAIResponse(message) {
        // 简单的关键词匹配响应（实际应调用AI API）
        const responses = {
            '销售': '根据最近30天的数据，总销售额为125,000 SAR，环比增长8.5%。最畅销的产品是洗车套餐，占比35%。',
            '库存': '当前库存总量为1,258件，其中低库存预警产品有5个。建议补充洗车液和轮胎清洁剂。',
            '客户': '本月新增客户42位，总客户数达到356位。会员占比45%，续费率为78%。',
            '建议': '基于数据分析，建议：1) 推出会员专享折扣活动 2) 增加高端洗车服务 3) 优化库存周转率',
            '默认': '收到你的问题。我正在分析相关数据，请稍等...\n\n建议你具体咨询：销售分析、库存管理、客户服务或业务优化建议。'
        };
        
        // 模拟API延迟
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        // 关键词匹配
        for (const [key, value] of Object.entries(responses)) {
            if (message.includes(key)) {
                return value;
            }
        }
        
        return responses['默认'];
    }

    // 加载建议
    function loadSuggestions() {
        const container = document.querySelector('.ai-suggestions');
        if (!container) return;
        
        const suggestions = [
            '📊 分析本月销售趋势',
            '📦 检查低库存产品',
            '👤 客户满意度分析',
            '💰 财务健康状况评估',
            '🎯 业务优化建议'
        ];
        
        container.innerHTML = suggestions.map(s => `
            <button class="ai-suggestion" onclick="window.sendSuggestion('${s}')">${s}</button>
        `).join('');
    }

    // 发送建议
    window.sendSuggestion = function(text) {
        const input = document.querySelector('.ai-input');
        if (input) {
            input.value = text;
            window.sendAIMessage();
        }
    };

    // 绑定事件
    function bindEvents() {
        // 发送按钮
        document.querySelector('.ai-send-btn')?.addEventListener('click', window.sendAIMessage);
        
        // Enter键发送
        document.querySelector('.ai-input')?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                window.sendAIMessage();
            }
        });
        
        // 清空对话
        document.querySelector('.ai-clear-btn')?.addEventListener('click', () => {
            messages = [];
            renderChat();
        });
    }

    // 模块加载时初始化
    if (document.querySelector('[data-module="ai"]')) {
        window.initAI();
    }

})();