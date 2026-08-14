-- 004_seed.sql
-- 初始化系统数据

-- 插入基础权限
INSERT INTO permissions (resource, action, description) VALUES
('dashboard', 'view', '查看仪表盘'),
('dashboard', 'manage', '管理仪表盘'),
('customers', 'view', '查看客户'),
('customers', 'create', '创建客户'),
('customers', 'update', '更新客户'),
('customers', 'delete', '删除客户'),
('products', 'view', '查看产品'),
('products', 'create', '创建产品'),
('products', 'update', '更新产品'),
('products', 'delete', '删除产品'),
('orders', 'view', '查看订单'),
('orders', 'create', '创建订单'),
('orders', 'update', '更新订单'),
('orders', 'delete', '删除订单'),
('orders', 'approve', '审批订单'),
('inventory', 'view', '查看库存'),
('inventory', 'manage', '管理库存'),
('inventory', 'adjust', '调整库存'),
('inventory', 'count', '盘点库存'),
('employees', 'view', '查看员工'),
('employees', 'create', '创建员工'),
('employees', 'update', '更新员工'),
('employees', 'delete', '删除员工'),
('finance', 'view', '查看财务'),
('finance', 'manage', '管理财务'),
('reports', 'view', '查看报表'),
('reports', 'export', '导出报表'),
('settings', 'view', '查看设置'),
('settings', 'manage', '管理设置'),
('system', 'view', '查看系统'),
('system', 'manage', '管理系统'),
('analytics', 'view', '查看分析'),
('analytics', 'export', '导出分析数据'),
('marketing', 'view', '查看营销'),
('marketing', 'manage', '管理营销'),
('purchase', 'view', '查看采购'),
('purchase', 'create', '创建采购'),
('purchase', 'update', '更新采购'),
('purchase', 'approve', '审批采购'),
('saas', 'view', '查看SaaS'),
('saas', 'manage', '管理SaaS'),
('fleet', 'view', '查看车队'),
('fleet', 'manage', '管理车队'),
('ai', 'view', '查看AI'),
('ai', 'manage', '管理AI');

-- 插入默认角色（组织级别）
-- 注意：实际创建角色时需要关联到具体组织，这里只是示例

-- 超级管理员角色（系统级别）
INSERT INTO roles (id, organization_id, name, code, description, level, is_system)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    NULL,
    '超级管理员',
    'super_admin',
    '系统最高权限',
    100,
    TRUE
);

-- 管理员角色
INSERT INTO roles (id, organization_id, name, code, description, level, is_system)
VALUES (
    '00000000-0000-0000-0000-000000000002',
    NULL,
    '管理员',
    'admin',
    '组织管理员',
    90,
    TRUE
);

-- 门店经理角色
INSERT INTO roles (id, organization_id, name, code, description, level, is_system)
VALUES (
    '00000000-0000-0000-0000-000000000003',
    NULL,
    '门店经理',
    'store_manager',
    '门店经理',
    70,
    TRUE
);

-- 员工角色
INSERT INTO roles (id, organization_id, name, code, description, level, is_system)
VALUES (
    '00000000-0000-0000-0000-000000000004',
    NULL,
    '员工',
    'employee',
    '普通员工',
    50,
    TRUE
);

-- 客户角色
INSERT INTO roles (id, organization_id, name, code, description, level, is_system)
VALUES (
    '00000000-0000-0000-0000-000000000005',
    NULL,
    '客户',
    'customer',
    '客户角色',
    10,
    TRUE
);

-- 注意：实际部署时，Super Admin 角色应该拥有所有权限
-- 这里需要在 Supabase Dashboard 中手动配置或通过其他方式分配
