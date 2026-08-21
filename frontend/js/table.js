/**
 * Table - 数据表格组件
 * 支持排序、筛选、分页、导出
 */

(function() {
    'use strict';

    class Table {
        constructor() {
            this.tables = new Map();
            this.config = {
                pageSize: 20,
                pageSizes: [10, 20, 50, 100],
                sortField: 'created_at',
                sortOrder: 'desc'
            };
        }

        // 初始化
        init() {
            // 自动初始化带有 data-table 属性的表格
            document.querySelectorAll('[data-table]').forEach(el => {
                const id = el.id || `table-${Date.now()}`;
                const config = this.parseConfig(el);
                this.initTable(id, config);
            });
            
            console.log('📊 Table component initialized');
        }

        // 解析配置
        parseConfig(el) {
            return {
                id: el.id,
                url: el.dataset.url,
                columns: JSON.parse(el.dataset.columns || '[]'),
                pageSize: parseInt(el.dataset.pageSize) || this.config.pageSize,
                sortField: el.dataset.sortField || this.config.sortField,
                sortOrder: el.dataset.sortOrder || this.config.sortOrder,
                searchable: el.dataset.searchable === 'true',
                filterable: el.dataset.filterable === 'true',
                selectable: el.dataset.selectable === 'true',
                actions: JSON.parse(el.dataset.actions || '[]'),
                pagination: el.dataset.pagination !== 'false'
            };
        }

        // 初始化表格
        initTable(id, config) {
            const table = {
                id,
                config,
                data: [],
                filtered: [],
                selected: [],
                page: 1,
                total: 0,
                loading: false
            };
            
            this.tables.set(id, table);
            this.render(id);
            this.loadData(id);
        }

        // 加载数据
        async loadData(id) {
            const table = this.tables.get(id);
            if (!table || table.loading) return;
            
            table.loading = true;
            this.showLoading(id);
            
            try {
                const { config } = table;
                let url = config.url;
                
                // 构建查询参数
                const params = new URLSearchParams();
                params.append('page', table.page);
                params.append('pageSize', config.pageSize);
                params.append('sortField', config.sortField);
                params.append('sortOrder', config.sortOrder);
                
                if (config.searchable && table.search) {
                    params.append('search', table.search);
                }
                
                const response = await fetch(`${url}?${params.toString()}`);
                const result = await response.json();
                
                table.data = result.data || [];
                table.total = result.total || table.data.length;
                table.filtered = table.data;
                
                this.render(id);
                this.updatePagination(id);
                
            } catch (error) {
                console.error('加载表格数据失败:', error);
                if (window.Notifications) {
                    window.Notifications.error('加载数据失败');
                }
            }
            
            table.loading = false;
            this.hideLoading(id);
        }

        // 渲染表格
        render(id) {
            const table = this.tables.get(id);
            if (!table) return;
            
            const el = document.getElementById(id);
            if (!el) return;
            
            const { config, data, filtered, selected } = table;
            
            // 构建表格 HTML
            let html = `
                <div class="table-wrapper">
                    ${config.searchable ? this.renderSearch(id) : ''}
                    ${config.filterable ? this.renderFilters(id) : ''}
                    <table class="table">
                        <thead>
                            <tr>
                                ${config.selectable ? '<th><input type="checkbox" class="select-all"></th>' : ''}
                                ${config.columns.map(col => `
                                    <th data-sort="${col.field}" 
                                        class="${config.sortField === col.field ? `sort-${config.sortOrder}` : ''}"
                                        style="${col.width ? `width: ${col.width}` : ''}">
                                        ${col.label}
                                        <span class="sort-icon">${config.sortField === col.field ? (config.sortOrder === 'asc' ? '▲' : '▼') : '⇅'}</span>
                                    </th>
                                `).join('')}
                                ${config.actions.length > 0 ? '<th>操作</th>' : ''}
                            </tr>
                        </thead>
                        <tbody>
                            ${filtered.length === 0 ? `
                                <tr>
                                    <td colspan="${config.columns.length + (config.selectable ? 1 : 0) + (config.actions.length > 0 ? 1 : 0)}" class="text-center">
                                        暂无数据
                                    </td>
                                </tr>
                            ` : filtered.map(row => `
                                <tr class="${selected.includes(row.id) ? 'selected' : ''}" data-id="${row.id}">
                                    ${config.selectable ? `<td><input type="checkbox" class="row-select" ${selected.includes(row.id) ? 'checked' : ''}></td>` : ''}
                                    ${config.columns.map(col => `
                                        <td>
                                            ${col.render ? this.renderCell(col.render, row[col.field], row) : row[col.field] || '-'}
                                        </td>
                                    `).join('')}
                                    ${config.actions.length > 0 ? `
                                        <td class="table-actions">
                                            ${config.actions.map(action => `
                                                <button class="btn-${action.type || 'primary'} btn-sm" 
                                                        data-action="${action.name}"
                                                        data-id="${row.id}"
                                                        ${action.confirm ? `data-confirm="${action.confirm}"` : ''}>
                                                    ${action.icon || ''} ${action.label || action.name}
                                                </button>
                                            `).join('')}
                                        </td>
                                    ` : ''}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    ${config.pagination ? this.renderPagination(id) : ''}
                </div>
            `;
            
            el.innerHTML = html;
            
            // 绑定事件
            this.bindEvents(id);
        }

        // 渲染搜索
        renderSearch(id) {
            return `
                <div class="table-search">
                    <input type="text" 
                           class="form-control" 
                           placeholder="搜索..."
                           data-table-search="${id}">
                    <button class="btn-primary" data-table-search-btn="${id}">搜索</button>
                </div>
            `;
        }

        // 渲染分页
        renderPagination(id) {
            const table = this.tables.get(id);
            if (!table) return '';
            
            const { page, total, config } = table;
            const totalPages = Math.ceil(total / config.pageSize);
            
            if (totalPages <= 1) return '';
            
            let html = `
                <div class="table-pagination">
                    <span>共 ${total} 条记录</span>
                    <div class="pagination">
                        <button class="page-btn" ${page <= 1 ? 'disabled' : ''} data-page="prev">«</button>
                        ${this.renderPageNumbers(page, totalPages)}
                        <button class="page-btn" ${page >= totalPages ? 'disabled' : ''} data-page="next">»</button>
                    </div>
                    <select class="page-size-select" data-table-page-size="${id}">
                        ${config.pageSizes.map(size => `
                            <option value="${size}" ${config.pageSize === size ? 'selected' : ''}>${size} 条/页</option>
                        `).join('')}
                    </select>
                </div>
            `;
            
            return html;
        }

        // 渲染页码
        renderPageNumbers(current, total) {
            let html = '';
            let start = Math.max(1, current - 2);
            let end = Math.min(total, current + 2);
            
            if (start > 1) {
                html += `<button class="page-btn" data-page="1">1</button>`;
                if (start > 2) html += `<button class="page-btn" disabled>...</button>`;
            }
            
            for (let i = start; i <= end; i++) {
                html += `<button class="page-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
            }
            
            if (end < total) {
                if (end < total - 1) html += `<button class="page-btn" disabled>...</button>`;
                html += `<button class="page-btn" data-page="${total}">${total}</button>`;
            }
            
            return html;
        }

        // 渲染单元格
        renderCell(renderFn, value, row) {
            if (typeof renderFn === 'function') {
                return renderFn(value, row);
            }
            if (typeof renderFn === 'string' && window[renderFn]) {
                return window[renderFn](value, row);
            }
            return value || '-';
        }

        // 绑定事件
        bindEvents(id) {
            const table = this.tables.get(id);
            if (!table) return;
            
            const el = document.getElementById(id);
            if (!el) return;
            
            // 搜索
            const searchInput = el.querySelector('[data-table-search]');
            const searchBtn = el.querySelector('[data-table-search-btn]');
            
            if (searchInput) {
                searchInput.addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') {
                        table.search = searchInput.value;
                        table.page = 1;
                        this.loadData(id);
                    }
                });
            }
            
            if (searchBtn) {
                searchBtn.addEventListener('click', () => {
                    if (searchInput) {
                        table.search = searchInput.value;
                        table.page = 1;
                        this.loadData(id);
                    }
                });
            }
            
            // 排序
            el.querySelectorAll('th[data-sort]').forEach(th => {
                th.addEventListener('click', () => {
                    const field = th.dataset.sort;
                    if (table.config.sortField === field) {
                        table.config.sortOrder = table.config.sortOrder === 'asc' ? 'desc' : 'asc';
                    } else {
                        table.config.sortField = field;
                        table.config.sortOrder = 'asc';
                    }
                    table.page = 1;
                    this.loadData(id);
                });
            });
            
            // 分页
            el.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
                btn.addEventListener('click', () => {
                    const page = btn.dataset.page;
                    if (page === 'prev') {
                        table.page = Math.max(1, table.page - 1);
                    } else if (page === 'next') {
                        const totalPages = Math.ceil(table.total / table.config.pageSize);
                        table.page = Math.min(totalPages, table.page + 1);
                    } else {
                        table.page = parseInt(page);
                    }
                    this.loadData(id);
                });
            });
            
            // 每页条数
            const sizeSelect = el.querySelector('[data-table-page-size]');
            if (sizeSelect) {
                sizeSelect.addEventListener('change', () => {
                    table.config.pageSize = parseInt(sizeSelect.value);
                    table.page = 1;
                    this.loadData(id);
                });
            }
            
            // 全选
            const selectAll = el.querySelector('.select-all');
            if (selectAll) {
                selectAll.addEventListener('change', () => {
                    const checkboxes = el.querySelectorAll('.row-select');
                    checkboxes.forEach(cb => cb.checked = selectAll.checked);
                    
                    table.selected = selectAll.checked ? table.filtered.map(row => row.id) : [];
                    this.updateSelection(id);
                });
            }
            
            // 行选择
            el.querySelectorAll('.row-select').forEach(cb => {
                cb.addEventListener('change', () => {
                    const id = cb.closest('tr').dataset.id;
                    if (cb.checked) {
                        if (!table.selected.includes(id)) {
                            table.selected.push(id);
                        }
                    } else {
                        table.selected = table.selected.filter(s => s !== id);
                    }
                    this.updateSelection(id);
                });
            });
            
            // 操作按钮
            el.querySelectorAll('[data-action]').forEach(btn => {
                btn.addEventListener('click', async () => {
                    const action = btn.dataset.action;
                    const id = btn.dataset.id;
                    const confirm = btn.dataset.confirm;
                    
                    if (confirm) {
                        const result = await window.Modal?.confirm(confirm);
                        if (!result) return;
                    }
                    
                    if (table.config[action]) {
                        await table.config[action](id, table);
                        this.loadData(id);
                    }
                });
            });
        }

        // 更新分页
        updatePagination(id) {
            // 重新渲染分页部分
            const table = this.tables.get(id);
            if (!table) return;
            
            const el = document.getElementById(id);
            if (!el) return;
            
            const paginationEl = el.querySelector('.table-pagination');
            if (paginationEl) {
                const html = this.renderPagination(id);
                paginationEl.outerHTML = html;
                this.bindEvents(id);
            }
        }

        // 更新选择状态
        updateSelection(id) {
            // 可自定义选择逻辑
        }

        // 显示加载
        showLoading(id) {
            const el = document.getElementById(id);
            if (el) {
                el.classList.add('loading');
            }
        }

        // 隐藏加载
        hideLoading(id) {
            const el = document.getElementById(id);
            if (el) {
                el.classList.remove('loading');
            }
        }

        // 刷新表格
        refresh(id) {
            if (id) {
                this.loadData(id);
            } else {
                this.tables.forEach((_, key) => {
                    this.loadData(key);
                });
            }
        }

        // 导出数据
        exportData(id, format = 'csv') {
            const table = this.tables.get(id);
            if (!table) return;
            
            const { config, filtered } = table;
            
            if (format === 'csv') {
                const headers = config.columns.map(col => col.label).join(',');
                const rows = filtered.map(row => {
                    return config.columns.map(col => {
                        const value = row[col.field] || '';
                        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
                    }).join(',');
                });
                const csv = [headers, ...rows].join('\n');
                this.downloadFile(csv, `export-${Date.now()}.csv`, 'text/csv');
            }
        }

        // 下载文件
        downloadFile(content, filename, mimeType = 'text/plain') {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }

        // 获取选中数据
        getSelected(id) {
            const table = this.tables.get(id);
            if (!table) return [];
            return table.filtered.filter(row => table.selected.includes(row.id));
        }

        // 获取所有数据
        getData(id) {
            const table = this.tables.get(id);
            if (!table) return [];
            return table.filtered;
        }

        // 设置数据
        setData(id, data) {
            const table = this.tables.get(id);
            if (!table) return;
            
            table.data = data;
            table.filtered = data;
            table.total = data.length;
            this.render(id);
            this.updatePagination(id);
        }
    }

    // 导出
    window.Table = new Table();

})();