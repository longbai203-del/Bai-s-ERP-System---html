-- ============================================================
-- 种子数据 - 插入初始数据
-- ============================================================

-- 1. 插入默认组织
INSERT INTO organizations (id, name, code, is_default, status)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Bai''s ERP 演示公司',
    'BAIS001',
    TRUE,
    'active'
) ON CONFLICT (id) DO NOTHING;

-- 2. 插入默认分支
INSERT INTO branches (id, organization_id, name, code, status)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '总部',
    'HQ001',
    'active'
) ON CONFLICT (id) DO NOTHING;

-- 3. 插入默认设置
INSERT INTO settings (organization_id, key, value)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    'company_name',
    'Bai''s ERP 演示公司'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE key = 'company_name');

INSERT INTO settings (organization_id, key, value)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    'currency',
    'SAR'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE key = 'currency');

INSERT INTO settings (organization_id, key, value)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    'language',
    'zh-CN'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE key = 'language');

INSERT INTO settings (organization_id, key, value)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    'tax_rate',
    '15'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE key = 'tax_rate');

-- 4. 插入测试客户
INSERT INTO customers (organization_id, branch_id, customer_code, name, phone, status)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'CUS0001',
    '张三',
    '+966500000001',
    'active'
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE customer_code = 'CUS0001');

INSERT INTO customers (organization_id, branch_id, customer_code, name, phone, status)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    'CUS0002',
    '李四',
    '+966500000002',
    'active'
WHERE NOT EXISTS (SELECT 1 FROM customers WHERE customer_code = 'CUS0002');

-- 5. 插入测试产品
INSERT INTO products (organization_id, name, sku, price, status)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    '基础洗车',
    'PRD001',
    50,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRD001');

INSERT INTO products (organization_id, name, sku, price, status)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    '精洗套餐',
    'PRD002',
    120,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRD002');

INSERT INTO products (organization_id, name, sku, price, status)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    '内饰清洁',
    'PRD003',
    80,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRD003');

INSERT INTO products (organization_id, name, sku, price, status)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    '抛光打蜡',
    'PRD004',
    200,
    'active'
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'PRD004');

-- 6. 插入库存数据
INSERT INTO inventory (organization_id, branch_id, product_id, quantity, min_quantity)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    (SELECT id FROM products WHERE sku = 'PRD001'),
    100,
    10
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_id = (SELECT id FROM products WHERE sku = 'PRD001'));

INSERT INTO inventory (organization_id, branch_id, product_id, quantity, min_quantity)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    (SELECT id FROM products WHERE sku = 'PRD002'),
    50,
    10
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_id = (SELECT id FROM products WHERE sku = 'PRD002'));

INSERT INTO inventory (organization_id, branch_id, product_id, quantity, min_quantity)
SELECT 
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000002',
    (SELECT id FROM products WHERE sku = 'PRD003'),
    30,
    10
WHERE NOT EXISTS (SELECT 1 FROM inventory WHERE product_id = (SELECT id FROM products WHERE sku = 'PRD003'));

-- 7. 插入默认权限（如果权限表为空）
INSERT INTO permissions (name, resource, action, description)
SELECT * FROM (VALUES
    ('dashboard_view', 'dashboard', 'view', '查看仪表盘'),
    ('dashboard_manage', 'dashboard', 'manage', '管理仪表盘'),
    ('customers_view', 'customers', 'view', '查看客户'),
    ('customers_create', 'customers', 'create', '创建客户'),
    ('customers_update', 'customers', 'update', '更新客户'),
    ('customers_delete', 'customers', 'delete', '删除客户'),
    ('products_view', 'products', 'view', '查看产品'),
    ('products_create', 'products', 'create', '创建产品'),
    ('products_update', 'products', 'update', '更新产品'),
    ('products_delete', 'products', 'delete', '删除产品'),
    ('orders_view', 'orders', 'view', '查看订单'),
    ('orders_create', 'orders', 'create', '创建订单'),
    ('orders_update', 'orders', 'update', '更新订单'),
    ('orders_delete', 'orders', 'delete', '删除订单'),
    ('inventory_view', 'inventory', 'view', '查看库存'),
    ('inventory_manage', 'inventory', 'manage', '管理库存'),
    ('employees_view', 'employees', 'view', '查看员工'),
    ('employees_create', 'employees', 'create', '创建员工'),
    ('employees_update', 'employees', 'update', '更新员工'),
    ('finance_view', 'finance', 'view', '查看财务'),
    ('reports_view', 'reports', 'view', '查看报表'),
    ('settings_manage', 'settings', 'manage', '管理设置')
) AS v(name, resource, action, description)
WHERE NOT EXISTS (SELECT 1 FROM permissions LIMIT 1);

SELECT '✅ 种子数据插入完成！' as result;
