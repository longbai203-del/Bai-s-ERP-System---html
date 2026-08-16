/**
 * @file products/index.js
 * @description 商品管理模块
 * @module modules/products
 */

import { productService } from '@services/product.service.js';
import { formatCurrency } from '@utils/helpers.js';
import { datatable } from '@components/datatable.js';
import { modal } from '@components/modal.js';
import { navbar } from '@components/navbar.js';

/**
 * 模块元信息
 */
export const meta = {
    name: '商品管理',
    path: '/products',
    icon: 'fa-box',
    permission: 'products:view',
    enabled: true,
    order: 20
};

/**
 * 模块状态
 */
let state = {
    list: [],
    total: 0,
    page: 1,
    pageSize: 20,
    category: 'all',
    status: 'all',
    keyword: '',
    loading: false
};

/**
 * 渲染商品管理
 */
export async function render(container, params = {}) {
    navbar.updateBreadcrumb('商品管理');

    container.innerHTML = `
        <div class="products-container">
            <div class="page-header">
                <h1>📦 商品管理</h1>
                <div class="page-actions">
                    <button class="btn btn-primary" id="createProduct">
                        <i class="fas fa-plus"></i> 新增商品
                    </button>
                    <button class="btn btn-outline" id="exportProducts">
                        <i class="fas fa-download"></i> 导出
                    </button>
                </div>
            </div>

            <!-- 筛选栏 -->
            <div class="card" style="margin-bottom:20px;">
                <div class="card-body">
                    <div style="display:flex;flex-wrap:wrap;gap:12px;align-items:center;">
                        <div style="flex:1;min-width:180px;">
                            <input type="text" class="form-control" id="productSearch" placeholder="搜索商品名称..." style="width:100%;">
                        </div>
                        <div style="width:140px;">
                            <select class="form-control" id="productCategoryFilter">
                                <option value="all">全部分类</option>
                                <option value="洗车">洗车</option>
                                <option value="美容">美容</option>
                                <option value="保养">保养</option>
                                <option value="配件">配件</option>
                            </select>
                        </div>
                        <div style="width:120px;">
                            <select class="form-control" id="productStatusFilter">
                                <option value="all">全部状态</option>
                                <option value="active">已上架</option>
                                <option value="inactive">已下架</option>
                            </select>
                        </div>
                        <button class="btn btn-primary" id="searchProducts">
                            <i class="fas fa-search"></i> 搜索
                        </button>
                        <button class="btn btn-outline" id="resetProducts">
                            <i class="fas fa-undo"></i> 重置
                        </button>
                    </div>
                </div>
            </div>

            <!-- 表格 -->
            <div class="card">
                <div class="card-header">
                    <span class="card-title">商品列表</span>
                    <span style="font-size:14px;color:#6B7280;">共 <strong id="productTotal">0</strong> 件</span>
                </div>
                <div class="card-body" id="productsTableContainer">
                    <div style="text-align:center;padding:40px;">
                        <div class="spinner" style="margin:0 auto;"></div>
                        <p style="margin-top:12px;color:#6B7280;">加载中...</p>
                    </div>
                </div>
                <div class="card-footer" style="padding:12px 20px;border-top:1px solid #E5E7EB;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
                    <div style="font-size:14px;color:#6B7280;">
                        显示第 <span id="pageStart">0</span>-<span id="pageEnd">0</span> 件，共 <span id="pageTotal">0</span> 件
                    </div>
                    <div style="display:flex;gap:4px;" id="paginationContainer"></div>
                </div>
            </div>
        </div>
    `;

    await loadProducts();
    bindEvents(container);
}

/**
 * 加载商品列表
 */
async function loadProducts() {
    state.loading = true;

    const params = {
        page: state.page,
        pageSize: state.pageSize,
        name: state.keyword || undefined,
        category: state.category !== 'all' ? state.category : undefined,
        status: state.status !== 'all' ? state.status : undefined
    };

    const result = await productService.getList(params);
    
    if (result.success) {
        state.list = result.data.list || [];
        state.total = result.data.total || 0;
        renderTable();
        renderPagination();
    } else {
        console.error('[Products] 加载失败:', result.error);
    }

    state.loading = false;
}

/**
 * 渲染表格
 */
function renderTable() {
    const container = document.getElementById('productsTableContainer');
    if (!container) return;

    const columns = [
        { key: 'name', label: '商品名称', type: 'text' },
        { key: 'category', label: '分类', type: 'text' },
        { key: 'price', label: '价格', type: 'currency' },
        { key: 'cost', label: '成本', type: 'currency' },
        { key: 'stock', label: '库存', type: 'text' },
        { key: 'unit', label: '单位', type: 'text' },
        { key: 'status', label: '状态', type: 'status' }
    ];

    const actions = [
        {
            key: 'edit',
            label: '编辑',
            className: 'btn btn-sm btn-primary',
            icon: 'fa-edit',
            onClick: (data) => editProduct(data)
        },
        {
            key: 'delete',
            label: '删除',
            className: 'btn btn-sm btn-danger',
            icon: 'fa-trash',
            onClick: (data) => deleteProduct(data)
        }
    ];

    datatable.render(container, {
        columns,
        data: state.list,
        rowKey: 'id',
        actions,
        loading: state.loading,
        emptyText: '暂无商品'
    });

    document.getElementById('productTotal').textContent = state.total;
}

/**
 * 渲染分页
 */
function renderPagination() {
    const container = document.getElementById('paginationContainer');
    if (!container) return;

    const totalPages = Math.ceil(state.total / state.pageSize);
    const start = (state.page - 1) * state.pageSize + 1;
    const end = Math.min(state.page * state.pageSize, state.total);

    document.getElementById('pageStart').textContent = state.total > 0 ? start : 0;
    document.getElementById('pageEnd').textContent = end;
    document.getElementById('pageTotal').textContent = state.total;

    let html = '';
    html += `<button class="btn btn-sm btn-outline" ${state.page <= 1 ? 'disabled' : ''} data-page="${state.page - 1}">
        <i class="fas fa-chevron-left"></i>
    </button>`;

    const maxVisible = 7;
    let startPage = Math.max(1, state.page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (startPage > 1) {
        html += `<button class="btn btn-sm btn-outline" data-page="1">1</button>`;
        if (startPage > 2) html += `<span style="padding:0 8px;color:#9CA3AF;">...</span>`;
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `<button class="btn btn-sm ${i === state.page ? 'btn-primary' : 'btn-outline'}" data-page="${i}">${i}</button>`;
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += `<span style="padding:0 8px;color:#9CA3AF;">...</span>`;
        html += `<button class="btn btn-sm btn-outline" data-page="${totalPages}">${totalPages}</button>`;
    }

    html += `<button class="btn btn-sm btn-outline" ${state.page >= totalPages ? 'disabled' : ''} data-page="${state.page + 1}">
        <i class="fas fa-chevron-right"></i>
    </button>`;

    container.innerHTML = html;

    container.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.dataset.page);
            if (page && page !== state.page) {
                state.page = page;
                loadProducts();
            }
        });
    });
}

/**
 * 编辑商品
 */
function editProduct(data) {
    modal.open({
        title: '编辑商品',
        content: `
            <div style="padding:10px 0;">
                <div class="form-group">
                    <label class="form-label">商品名称</label>
                    <input type="text" class="form-control" id="editProductName" value="${data.name || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">分类</label>
                    <select class="form-control" id="editProductCategory">
                        <option value="洗车" ${data.category === '洗车' ? 'selected' : ''}>洗车</option>
                        <option value="美容" ${data.category === '美容' ? 'selected' : ''}>美容</option>
                        <option value="保养" ${data.category === '保养' ? 'selected' : ''}>保养</option>
                        <option value="配件" ${data.category === '配件' ? 'selected' : ''}>配件</option>
                    </select>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div class="form-group">
                        <label class="form-label">价格</label>
                        <input type="number" class="form-control" id="editProductPrice" value="${data.price || 0}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">成本</label>
                        <input type="number" class="form-control" id="editProductCost" value="${data.cost || 0}">
                    </div>
                </div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div class="form-group">
                        <label class="form-label">库存</label>
                        <input type="number" class="form-control" id="editProductStock" value="${data.stock || 0}">
                    </div>
                    <div class="form-group">
                        <label class="form-label">单位</label>
                        <input type="text" class="form-control" id="editProductUnit" value="${data.unit || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">状态</label>
                    <select class="form-control" id="editProductStatus">
                        <option value="active" ${data.status === 'active' ? 'selected' : ''}>已上架</option>
                        <option value="inactive" ${data.status === 'inactive' ? 'selected' : ''}>已下架</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">描述</label>
                    <textarea class="form-control" id="editProductDesc" rows="2">${data.description || ''}</textarea>
                </div>
            </div>
        `,
        buttons: [
            { label: '取消', type: 'secondary' },
            {
                label: '保存',
                type: 'primary',
                onClick: async () => {
                    const name = document.getElementById('editProductName').value.trim();
                    const category = document.getElementById('editProductCategory').value;
                    const price = parseFloat(document.getElementById('editProductPrice').value);
                    const cost = parseFloat(document.getElementById('editProductCost').value);
                    const stock = parseInt(document.getElementById('editProductStock').value);
                    const unit = document.getElementById('editProductUnit').value.trim();
                    const status = document.getElementById('editProductStatus').value;
                    const description = document.getElementById('editProductDesc').value.trim();

                    if (!name) {
                        modal.alert('提示', '请输入商品名称', '知道了', 'warning');
                        return;
                    }

                    const result = await productService.update(data.id, {
                        name, category, price, cost, stock, unit, status, description
                    });

                    if (result.success) {
                        await loadProducts();
                        modal.alert('成功', '商品已更新');
                    } else {
                        modal.alert('失败', result.error || '更新商品失败', '知道了', 'danger');
                    }
                }
            }
        ]
    });
}

/**
 * 删除商品
 */
async function deleteProduct(data) {
    const confirmed = await modal.confirmDelete(data.name);
    if (!confirmed) return;

    const result = await productService.delete(data.id);
    if (result.success) {
        await loadProducts();
        modal.alert('删除成功', '商品已删除');
    } else {
        modal.alert('删除失败', result.error || '删除商品失败', '知道了', 'danger');
    }
}

/**
 * 绑定事件
 */
function bindEvents(container) {
    // 新增商品
    const createBtn = container.querySelector('#createProduct');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            modal.open({
                title: '新增商品',
                content: `
                    <div style="padding:10px 0;">
                        <div class="form-group">
                            <label class="form-label">商品名称</label>
                            <input type="text" class="form-control" id="newProductName" placeholder="请输入商品名称">
                        </div>
                        <div class="form-group">
                            <label class="form-label">分类</label>
                            <select class="form-control" id="newProductCategory">
                                <option value="洗车">洗车</option>
                                <option value="美容">美容</option>
                                <option value="保养">保养</option>
                                <option value="配件">配件</option>
                            </select>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                            <div class="form-group">
                                <label class="form-label">价格</label>
                                <input type="number" class="form-control" id="newProductPrice" placeholder="0.00">
                            </div>
                            <div class="form-group">
                                <label class="form-label">成本</label>
                                <input type="number" class="form-control" id="newProductCost" placeholder="0.00">
                            </div>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                            <div class="form-group">
                                <label class="form-label">库存</label>
                                <input type="number" class="form-control" id="newProductStock" placeholder="0">
                            </div>
                            <div class="form-group">
                                <label class="form-label">单位</label>
                                <input type="text" class="form-control" id="newProductUnit" placeholder="个/件/箱">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">描述</label>
                            <textarea class="form-control" id="newProductDesc" rows="2" placeholder="商品描述"></textarea>
                        </div>
                    </div>
                `,
                buttons: [
                    { label: '取消', type: 'secondary' },
                    {
                        label: '创建',
                        type: 'primary',
                        onClick: async () => {
                            const name = document.getElementById('newProductName').value.trim();
                            const category = document.getElementById('newProductCategory').value;
                            const price = parseFloat(document.getElementById('newProductPrice').value);
                            const cost = parseFloat(document.getElementById('newProductCost').value) || 0;
                            const stock = parseInt(document.getElementById('newProductStock').value) || 0;
                            const unit = document.getElementById('newProductUnit').value.trim() || '个';

                            if (!name) {
                                modal.alert('提示', '请输入商品名称', '知道了', 'warning');
                                return;
                            }

                            if (isNaN(price) || price <= 0) {
                                modal.alert('提示', '请输入有效的价格', '知道了', 'warning');
                                return;
                            }

                            const result = await productService.create({
                                name, category, price, cost, stock, unit,
                                status: 'active',
                                description: document.getElementById('newProductDesc').value.trim()
                            });

                            if (result.success) {
                                await loadProducts();
                                modal.alert('成功', '商品已创建');
                            } else {
                                modal.alert('失败', result.error || '创建商品失败', '知道了', 'danger');
                            }
                        }
                    }
                ]
            });
        });
    }

    // 搜索
    const searchBtn = container.querySelector('#searchProducts');
    const searchInput = container.querySelector('#productSearch');
    const categoryFilter = container.querySelector('#productCategoryFilter');
    const statusFilter = container.querySelector('#productStatusFilter');

    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            state.keyword = searchInput?.value || '';
            state.category = categoryFilter?.value || 'all';
            state.status = statusFilter?.value || 'all';
            state.page = 1;
            loadProducts();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                state.keyword = searchInput.value;
                state.page = 1;
                loadProducts();
            }
        });
    }

    // 重置
    const resetBtn = container.querySelector('#resetProducts');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (categoryFilter) categoryFilter.value = 'all';
            if (statusFilter) statusFilter.value = 'all';
            state.keyword = '';
            state.category = 'all';
            state.status = 'all';
            state.page = 1;
            loadProducts();
        });
    }

    // 导出
    const exportBtn = container.querySelector('#exportProducts');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            modal.alert('导出', '导出功能开发中...', '知道了');
        });
    }
}

/**
 * 模块初始化钩子
 */
export async function init() {
    console.log('✅ [Products] 模块已初始化');
}

export default { meta, render, init };