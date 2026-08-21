/**
 * Modal - 模态框组件
 * 支持多种大小、自定义内容、回调
 */

(function() {
    'use strict';

    class Modal {
        constructor() {
            this.modals = [];
            this.currentModal = null;
            this.backdrop = null;
        }

        // 初始化
        init() {
            // 创建模态框容器
            this.createContainer();
            
            // 绑定键盘事件
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    this.close();
                }
            });
            
            console.log('📦 Modal component initialized');
        }

        // 创建容器
        createContainer() {
            if (document.getElementById('modal-container')) return;
            
            const container = document.createElement('div');
            container.id = 'modal-container';
            container.className = 'modal-container';
            document.body.appendChild(container);
        }

        // 打开模态框
        open(options = {}) {
            const {
                title = '',
                content = '',
                size = 'md', // sm, md, lg, xl, full
                buttons = [],
                onOpen = null,
                onClose = null,
                onConfirm = null,
                closeOnBackdrop = true,
                closeOnEscape = true,
                showClose = true,
                className = '',
                data = null
            } = options;

            // 关闭已打开的
            if (this.currentModal) {
                this.close();
            }

            const id = `modal-${Date.now()}`;
            const modal = document.createElement('div');
            modal.id = id;
            modal.className = `modal fade ${className}`;
            modal.dataset.size = size;

            // 构建模态框 HTML
            modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-dialog modal-${size}">
                    <div class="modal-content">
                        ${title ? `
                            <div class="modal-header">
                                <h5 class="modal-title">${title}</h5>
                                ${showClose ? `<button class="modal-close">&times;</button>` : ''}
                            </div>
                        ` : ''}
                        <div class="modal-body">
                            ${content}
                        </div>
                        ${buttons.length > 0 ? `
                            <div class="modal-footer">
                                ${buttons.map(btn => `
                                    <button class="btn-${btn.type || 'secondary'} btn-${btn.size || 'md'}" 
                                            data-action="${btn.action || 'close'}"
                                            ${btn.disabled ? 'disabled' : ''}>
                                        ${btn.text}
                                    </button>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;

            const container = document.getElementById('modal-container');
            container.appendChild(modal);

            // 绑定事件
            // 关闭按钮
            modal.querySelectorAll('.modal-close, [data-action="close"]').forEach(el => {
                el.addEventListener('click', () => {
                    this.close();
                    if (onClose) onClose(data);
                });
            });

            // 确认按钮
            modal.querySelectorAll('[data-action="confirm"]').forEach(el => {
                el.addEventListener('click', () => {
                    if (onConfirm) {
                        const result = onConfirm(data);
                        if (result !== false) {
                            this.close();
                        }
                    } else {
                        this.close();
                    }
                });
            });

            // 其他按钮
            modal.querySelectorAll('[data-action]').forEach(el => {
                const action = el.dataset.action;
                if (action !== 'close' && action !== 'confirm') {
                    el.addEventListener('click', () => {
                        if (options[action]) {
                            options[action](data);
                        }
                    });
                }
            });

            // 点击背景关闭
            if (closeOnBackdrop) {
                modal.querySelector('.modal-backdrop').addEventListener('click', () => {
                    this.close();
                    if (onClose) onClose(data);
                });
            }

            // 显示模态框
            requestAnimationFrame(() => {
                modal.classList.add('show');
                document.body.classList.add('modal-open');
            });

            this.currentModal = modal;
            this.modals.push(modal);

            // 回调
            if (onOpen) onOpen(data);

            return { id, modal, data };
        }

        // 关闭模态框
        close() {
            if (!this.currentModal) return;

            this.currentModal.classList.remove('show');
            document.body.classList.remove('modal-open');

            setTimeout(() => {
                if (this.currentModal.parentNode) {
                    this.currentModal.parentNode.removeChild(this.currentModal);
                }
                this.currentModal = null;
            }, 300);
        }

        // 更新内容
        update(content) {
            if (!this.currentModal) return;
            
            const body = this.currentModal.querySelector('.modal-body');
            if (body) {
                body.innerHTML = content;
            }
        }

        // 更新标题
        updateTitle(title) {
            if (!this.currentModal) return;
            
            const titleEl = this.currentModal.querySelector('.modal-title');
            if (titleEl) {
                titleEl.textContent = title;
            }
        }

        // 获取当前模态框
        getCurrent() {
            return this.currentModal;
        }

        // 确认对话框
        confirm(message, title = '确认', confirmText = '确认', cancelText = '取消') {
            return new Promise((resolve) => {
                this.open({
                    title: title,
                    content: `<p class="text-center">${message}</p>`,
                    size: 'sm',
                    buttons: [
                        { text: cancelText, type: 'secondary', action: 'close' },
                        { text: confirmText, type: 'primary', action: 'confirm' }
                    ],
                    onConfirm: () => resolve(true),
                    onClose: () => resolve(false)
                });
            });
        }

        // 提示框
        alert(message, title = '提示', buttonText = '确定') {
            return new Promise((resolve) => {
                this.open({
                    title: title,
                    content: `<p>${message}</p>`,
                    size: 'sm',
                    buttons: [
                        { text: buttonText, type: 'primary', action: 'confirm' }
                    ],
                    onConfirm: () => resolve(true)
                });
            });
        }

        // 表单对话框
        form(formHTML, title = '表单', submitText = '提交', cancelText = '取消') {
            return new Promise((resolve) => {
                this.open({
                    title: title,
                    content: formHTML,
                    buttons: [
                        { text: cancelText, type: 'secondary', action: 'close' },
                        { text: submitText, type: 'primary', action: 'confirm' }
                    ],
                    onConfirm: () => {
                        const form = this.currentModal.querySelector('form');
                        if (form) {
                            const formData = new FormData(form);
                            const data = Object.fromEntries(formData.entries());
                            resolve(data);
                        } else {
                            resolve(null);
                        }
                    },
                    onClose: () => resolve(null)
                });
            });
        }
    }

    // 导出
    window.Modal = new Modal();

})();