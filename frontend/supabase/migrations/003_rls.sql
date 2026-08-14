-- 003_rls.sql
-- 启用RLS并创建安全策略

-- 为所有表启用RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 创建策略函数：获取当前用户所在组织
CREATE OR REPLACE FUNCTION get_user_organization()
RETURNS UUID AS Green
    SELECT organization_id FROM profiles WHERE id = auth.uid();
Green LANGUAGE sql STABLE;

-- 创建策略函数：获取当前用户所在门店
CREATE OR REPLACE FUNCTION get_user_branch()
RETURNS UUID AS Green
    SELECT branch_id FROM profiles WHERE id = auth.uid();
Green LANGUAGE sql STABLE;

-- 创建策略函数：检查用户是否有特定权限
CREATE OR REPLACE FUNCTION has_permission(resource_name TEXT, action_name TEXT)
RETURNS BOOLEAN AS Green
    SELECT EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN role_permissions rp ON ur.role_id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE ur.user_id = auth.uid()
        AND p.resource = resource_name
        AND p.action = action_name
    );
Green LANGUAGE sql STABLE;

-- 组织级别策略
CREATE POLICY "Users can view their organization"
    ON organizations FOR SELECT
    USING (id = get_user_organization());

CREATE POLICY "Users can view their branch"
    ON branches FOR SELECT
    USING (organization_id = get_user_organization());

-- 配置文件策略
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (id = auth.uid());

-- 用户角色策略
CREATE POLICY "Users can view roles in their organization"
    ON roles FOR SELECT
    USING (organization_id = get_user_organization());

-- 业务数据策略
CREATE POLICY "Users can view customers in their organization"
    ON customers FOR SELECT
    USING (organization_id = get_user_organization());

CREATE POLICY "Users can insert customers in their organization"
    ON customers FOR INSERT
    WITH CHECK (organization_id = get_user_organization());

CREATE POLICY "Users can update customers in their organization"
    ON customers FOR UPDATE
    USING (organization_id = get_user_organization());

CREATE POLICY "Users can delete customers in their organization"
    ON customers FOR DELETE
    USING (organization_id = get_user_organization() AND has_permission('customers', 'delete'));

-- 产品策略
CREATE POLICY "Users can view products in their organization"
    ON products FOR SELECT
    USING (organization_id = get_user_organization());

CREATE POLICY "Users can insert products in their organization"
    ON products FOR INSERT
    WITH CHECK (organization_id = get_user_organization());

CREATE POLICY "Users can update products in their organization"
    ON products FOR UPDATE
    USING (organization_id = get_user_organization());

-- 订单策略
CREATE POLICY "Users can view orders in their organization"
    ON orders FOR SELECT
    USING (organization_id = get_user_organization());

CREATE POLICY "Users can insert orders in their organization"
    ON orders FOR INSERT
    WITH CHECK (organization_id = get_user_organization());

CREATE POLICY "Users can update orders in their organization"
    ON orders FOR UPDATE
    USING (organization_id = get_user_organization());

-- 库存策略
CREATE POLICY "Users can view inventory in their organization"
    ON inventory FOR SELECT
    USING (product_id IN (SELECT id FROM products WHERE organization_id = get_user_organization()));

-- 员工策略
CREATE POLICY "Users can view employees in their organization"
    ON employees FOR SELECT
    USING (organization_id = get_user_organization());

-- 审计日志策略
CREATE POLICY "Users can view audit logs in their organization"
    ON audit_logs FOR SELECT
    USING (user_id IN (SELECT id FROM profiles WHERE organization_id = get_user_organization()));

-- 通知策略
CREATE POLICY "Users can view their own notifications"
    ON notifications FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
    ON notifications FOR UPDATE
    USING (user_id = auth.uid());

-- 注意：这些是基础策略，实际使用时可能需要根据具体业务需求调整
