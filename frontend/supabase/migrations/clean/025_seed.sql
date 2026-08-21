-- 种子数据 - 默认组织（不创建用户，由 Supabase Auth 处理）
DO $$
DECLARE
    org_id UUID := ''00000000-0000-0000-0000-000000000002'';
    branch_id UUID := ''00000000-0000-0000-0000-000000000003'';
BEGIN
    -- 默认组织
    INSERT INTO organizations (id, name, code, is_default, status)
    VALUES (
        org_id,
        ''Bai''''s ERP 演示公司'',
        ''BAIS001'',
        TRUE,
        ''active''
    ) ON CONFLICT (id) DO NOTHING;

    -- 默认分支
    INSERT INTO branches (id, organization_id, name, code, status)
    VALUES (
        branch_id,
        org_id,
        ''总部'',
        ''HQ001'',
        ''active''
    ) ON CONFLICT (id) DO NOTHING;

    -- 默认设置
    INSERT INTO settings (organization_id, key, value) VALUES
        (org_id, ''company_name'', ''Bai''''s ERP 演示公司''),
        (org_id, ''currency'', ''SAR''),
        (org_id, ''language'', ''zh-CN''),
        (org_id, ''tax_rate'', ''15'')
    ON CONFLICT (organization_id, key) DO NOTHING;
END $$;
