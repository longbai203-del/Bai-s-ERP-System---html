# Bai's ERP System - API 文档

## 📋 概述

- **Base URL**: `/api`
- **认证方式**: Bearer Token (JWT)
- **响应格式**: JSON
- **字符编码**: UTF-8
- **版本**: 2.0.0

---

## 🔐 认证说明

所有需要认证的接口，请在请求头中携带：

```
Authorization: Bearer <your-jwt-token>
```

---

## 📊 统一响应格式

### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功",
  "timestamp": "2026-01-13T10:30:00.000Z"
}
```

### 失败响应

```json
{
  "success": false,
  "error": "错误信息",
  "code": "ERROR_CODE",
  "errors": ["字段1错误", "字段2错误"],
  "timestamp": "2026-01-13T10:30:00.000Z"
}
```

### 分页响应

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 🔑 认证模块 `/api/auth`

### POST /api/auth/login - 用户登录

**请求体:**

```json
{
  "username": "admin",
  "password": "123456"
}
```

**响应:**

```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "username": "admin",
      "name": "管理员",
      "role": "admin",
      "status": "active",
      "email": "admin@example.com",
      "phone": "0500000000",
      "tenant_id": "uuid",
      "store_id": "uuid"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "登录成功"
}
```

**错误码:**

| code | 说明 |
|------|------|
| `VALIDATION_ERROR` | 参数验证失败 |
| `DB_ERROR` | 数据库查询失败 |
| `INVALID_CREDENTIALS` | 用户名或密码错误 |
| `ACCOUNT_PENDING` | 账号待审核 |
| `ACCOUNT_REJECTED` | 账号已被拒绝 |
| `ACCOUNT_INVALID` | 账号状态异常 |

---

### POST /api/auth/register - 用户注册

**请求体:**

```json
{
  "username": "zhangsan",
  "password": "123456",
  "name": "张三",
  "role": "employee",
  "phone": "0501234567",
  "email": "zhangsan@example.com"
}
```

**响应:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "zhangsan",
    "name": "张三",
    "role": "employee",
    "status": "pending",
    "phone": "0501234567",
    "email": "zhangsan@example.com"
  },
  "message": "注册成功，请等待管理员审核"
}
```

**错误码:**

| code | 说明 |
|------|------|
| `VALIDATION_ERROR` | 参数验证失败 |
| `USERNAME_EXISTS` | 用户名已存在 |
| `PHONE_EXISTS` | 手机号已被注册 |
| `ROLE_NOT_ALLOWED` | 不允许注册该角色 |
| `DB_ERROR` | 数据库错误 |

---

### GET /api/auth/me - 获取当前用户信息

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "admin",
    "name": "管理员",
    "role": "admin",
    "status": "active",
    "email": "admin@example.com",
    "phone": "0500000000",
    "tenant_id": "uuid",
    "store_id": "uuid",
    "last_login_at": "2026-01-13T10:30:00.000Z",
    "created_at": "2026-01-01T00:00:00.000Z",
    "permissions": ["dashboard:view", "orders:manage"]
  }
}
```

**错误码:**

| code | 说明 |
|------|------|
| `UNAUTHORIZED` | 未授权 |
| `INVALID_TOKEN` | 无效或过期的 Token |
| `USER_NOT_FOUND` | 用户不存在 |

---

### POST /api/auth/logout - 用户登出

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "success": true,
  "message": "登出成功"
}
```

---

### POST /api/auth/reset-password - 重置密码

**请求体:**

```json
{
  "username": "zhangsan",
  "newPassword": "654321"
}
```

**响应:**

```json
{
  "success": true,
  "message": "密码重置成功"
}
```

**错误码:**

| code | 说明 |
|------|------|
| `VALIDATION_ERROR` | 参数验证失败 |
| `USER_NOT_FOUND` | 用户不存在 |
| `ACCOUNT_NOT_APPROVED` | 账号未审核通过 |

---

## 👥 员工模块 `/api/employees`

### GET /api/employees - 获取员工列表

**请求头:** `Authorization: Bearer <token>`

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `limit` | number | 否 | 每页数量，默认 20 |
| `status` | string | 否 | 状态筛选: all/pending/approved/rejected |
| `role` | string | 否 | 角色筛选: all/admin/manager/cashier/employee |
| `search` | string | 否 | 搜索关键词（用户名/姓名/邮箱） |

**响应:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "username": "zhangsan",
      "name": "张三",
      "role": "employee",
      "status": "approved",
      "email": "zhangsan@example.com",
      "phone": "0501234567",
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 5
  }
}
```

---

### GET /api/employees/:id - 获取员工详情

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "zhangsan",
    "name": "张三",
    "role": "employee",
    "status": "approved",
    "email": "zhangsan@example.com",
    "phone": "0501234567",
    "tenant_id": "uuid",
    "store_id": "uuid",
    "created_at": "2026-01-01T00:00:00.000Z",
    "recent_attendance": [
      {
        "date": "2026-01-13",
        "check_in_time": "09:00:00",
        "check_out_time": "18:00:00",
        "work_hours": 9.0
      }
    ]
  }
}
```

**错误码:**

| code | 说明 |
|------|------|
| `EMPLOYEE_NOT_FOUND` | 员工不存在 |

---

### POST /api/employees - 创建员工

**权限:** `owner` / `admin`

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "username": "lisi",
  "password": "123456",
  "name": "李四",
  "role": "cashier",
  "phone": "0507654321",
  "email": "lisi@example.com"
}
```

**响应:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "lisi",
    "name": "李四",
    "role": "cashier",
    "status": "approved"
  },
  "message": "员工创建成功"
}
```

---

### PUT /api/employees/:id - 更新员工

**权限:** `owner` / `admin`

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "name": "李四更新",
  "role": "manager",
  "phone": "0507654321",
  "email": "lisi_new@example.com",
  "status": "active"
}
```

**响应:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "username": "lisi",
    "name": "李四更新",
    "role": "manager",
    "status": "active"
  },
  "message": "员工更新成功"
}
```

---

### POST /api/employees/approve - 审核员工

**权限:** `owner` / `admin`

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "userId": "uuid",
  "status": "approved",
  "note": "审核通过，欢迎加入"
}
```

**响应:**

```json
{
  "success": true,
  "data": { ... },
  "message": "用户已审核通过"
}
```

**错误码:**

| code | 说明 |
|------|------|
| `VALIDATION_ERROR` | 参数验证失败 |
| `INVALID_STATUS` | 无效的审核状态 |
| `USER_NOT_FOUND` | 用户不存在 |
| `FORBIDDEN` | 不能审核老板账号 |

---

### DELETE /api/employees/:id - 删除员工

**权限:** `owner` / `admin`

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "success": true,
  "message": "员工删除成功"
}
```

---

### GET /api/employees/stats/summary - 员工统计

**权限:** `owner` / `admin` / `manager`

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "success": true,
  "data": {
    "total": 25,
    "active": 20,
    "pending": 3,
    "byRole": [
      { "role": "manager", "count": 2 },
      { "role": "cashier", "count": 8 },
      { "role": "employee", "count": 10 }
    ]
  }
}
```

---

## 👤 客户模块 `/api/customers`

### GET /api/customers - 获取客户列表

**请求头:** `Authorization: Bearer <token>`

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `limit` | number | 否 | 每页数量，默认 10 |
| `name` | string | 否 | 客户姓名（模糊搜索） |
| `phone` | string | 否 | 手机号（模糊搜索） |
| `level` | string | 否 | 等级: vip/gold/silver/bronze |
| `status` | string | 否 | 状态: active/inactive |
| `sortBy` | string | 否 | 排序字段，默认 created_at |
| `sortOrder` | string | 否 | 排序方式: asc/desc |

**响应:**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "uuid",
      "name": "张三",
      "phone": "0501234567",
      "email": "zhangsan@example.com",
      "level": "gold",
      "total_spent": 15000,
      "order_count": 25,
      "status": "active",
      "created_at": "2026-01-01T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 10,
  "totalPages": 10
}
```

---

### GET /api/customers/:id - 获取客户详情

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "uuid",
    "name": "张三",
    "phone": "0501234567",
    "email": "zhangsan@example.com",
    "level": "gold",
    "address": "利雅得",
    "notes": "VIP客户",
    "total_spent": 15000,
    "order_count": 25,
    "vehicles": [
      {
        "id": "uuid",
        "plate_number": "ABC1234",
        "brand": "Toyota",
        "model": "Camry"
      }
    ],
    "orderCount": 25,
    "totalSpent": 15000
  }
}
```

---

### POST /api/customers - 创建客户

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "name": "王五",
  "phone": "0509876543",
  "email": "wangwu@example.com",
  "level": "silver",
  "address": "吉达",
  "notes": "新客户",
  "plateNumber": "XYZ5678",
  "vehicleBrand": "Honda",
  "vehicleModel": "Accord"
}
```

**响应:**

```json
{
  "code": 201,
  "message": "客户创建成功",
  "data": {
    "id": "uuid",
    "name": "王五",
    "phone": "0509876543",
    "level": "silver"
  }
}
```

**错误码:**

| code | 说明 |
|------|------|
| 400 | 姓名或手机号为空 |
| 409 | 手机号已被注册 |

---

### PUT /api/customers/:id - 更新客户

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "name": "王五更新",
  "phone": "0509876543",
  "email": "wangwu_new@example.com",
  "level": "gold",
  "address": "达曼",
  "notes": "重要客户",
  "status": "active"
}
```

**响应:**

```json
{
  "code": 200,
  "message": "客户更新成功",
  "data": { ... }
}
```

---

### DELETE /api/customers/:id - 删除客户

**权限:** `admin`

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "code": 200,
  "message": "客户删除成功",
  "data": { ... }
}
```

**错误码:**

| code | 说明 |
|------|------|
| 400 | 该客户有订单记录，无法删除 |

---

### GET /api/customers/stats/summary - 客户统计

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "total": 150,
    "active": 130,
    "vip": 15,
    "gold": 30
  }
}
```

---

## 📦 商品模块 `/api/products`

### GET /api/products - 获取商品列表

**请求头:** `Authorization: Bearer <token>`

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `limit` | number | 否 | 每页数量，默认 10 |
| `name` | string | 否 | 商品名称（模糊搜索） |
| `category` | string | 否 | 分类筛选 |
| `status` | string | 否 | 状态: active/inactive |
| `sortBy` | string | 否 | 排序字段 |
| `sortOrder` | string | 否 | 排序方式 |

**响应:**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "uuid",
      "name": "标准洗车",
      "category": "洗车服务",
      "price": 68.00,
      "cost": 20.00,
      "stock": 45,
      "unit": "次",
      "status": "active",
      "sku": "SRV-001"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 10,
  "totalPages": 5
}
```

---

### GET /api/products/:id - 获取商品详情

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "uuid",
    "name": "标准洗车",
    "category": "洗车服务",
    "price": 68.00,
    "cost": 20.00,
    "stock": 45,
    "unit": "次",
    "description": "标准洗车服务",
    "sku": "SRV-001",
    "status": "active",
    "created_at": "2026-01-01T00:00:00.000Z",
    "updated_at": "2026-01-13T10:30:00.000Z"
  }
}
```

---

### POST /api/products - 创建商品

**权限:** `admin` / `manager`

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "name": "精致洗车",
  "category": "洗车服务",
  "price": 128.00,
  "cost": 40.00,
  "stock": 30,
  "unit": "次",
  "status": "active",
  "description": "精致洗车服务",
  "sku": "SRV-002"
}
```

**响应:**

```json
{
  "code": 201,
  "message": "商品创建成功",
  "data": { ... }
}
```

---

### PUT /api/products/:id - 更新商品

**权限:** `admin` / `manager`

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "name": "精致洗车升级版",
  "price": 158.00,
  "status": "inactive"
}
```

**响应:**

```json
{
  "code": 200,
  "message": "商品更新成功",
  "data": { ... }
}
```

---

### PATCH /api/products/:id/stock - 更新库存

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "stock": 50,
  "operation": "set"
}
```

| operation | 说明 |
|-----------|------|
| `set` | 直接设置库存数量 |
| `add` | 增加库存 |
| `subtract` | 减少库存 |

**响应:**

```json
{
  "code": 200,
  "message": "库存更新成功",
  "data": { ... }
}
```

---

### DELETE /api/products/:id - 删除商品

**权限:** `admin`

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "code": 200,
  "message": "商品删除成功",
  "data": { ... }
}
```

---

### GET /api/products/categories/list - 获取商品分类

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "code": 200,
  "message": "success",
  "data": ["洗车服务", "汽车美容", "保养服务", "汽车配件"]
}
```

---

## 📋 订单模块 `/api/orders`

### GET /api/orders - 获取订单列表

**请求头:** `Authorization: Bearer <token>`

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `limit` | number | 否 | 每页数量，默认 10 |
| `status` | string | 否 | 状态: pending/processing/completed/cancelled |
| `customer` | string | 否 | 客户姓名（模糊搜索） |
| `orderNo` | string | 否 | 订单号（模糊搜索） |
| `startDate` | string | 否 | 开始日期 |
| `endDate` | string | 否 | 结束日期 |
| `sortBy` | string | 否 | 排序字段 |
| `sortOrder` | string | 否 | 排序方式 |

**响应:**

```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": "uuid",
      "order_number": "ORD-20260113-0001",
      "customer_name": "张三",
      "customer_phone": "0501234567",
      "total": 680.00,
      "status": "completed",
      "payment_status": "paid",
      "payment_method": "cash",
      "created_at": "2026-01-13T10:30:00.000Z"
    }
  ],
  "total": 200,
  "page": 1,
  "limit": 10,
  "totalPages": 20
}
```

---

### GET /api/orders/:id - 获取订单详情

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": "uuid",
    "order_number": "ORD-20260113-0001",
    "customer_name": "张三",
    "customer_phone": "0501234567",
    "subtotal": 680.00,
    "discount": 0,
    "tax": 88.00,
    "total": 680.00,
    "status": "completed",
    "payment_status": "paid",
    "payment_method": "cash",
    "items": [
      {
        "product_name": "标准洗车",
        "quantity": 10,
        "unit_price": 68.00,
        "total_price": 680.00
      }
    ],
    "notes": "",
    "created_at": "2026-01-13T10:30:00.000Z"
  }
}
```

---

### POST /api/orders - 创建订单

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "customerId": "uuid",
  "customerName": "张三",
  "customerPhone": "0501234567",
  "items": [
    {
      "product_id": "uuid",
      "quantity": 1,
      "unit_price": 68.00
    }
  ],
  "total": 680.00,
  "subtotal": 680.00,
  "discount": 0,
  "tax": 0,
  "paymentMethod": "cash",
  "paymentStatus": "paid",
  "notes": "客户备注"
}
```

**响应:**

```json
{
  "code": 201,
  "message": "订单创建成功",
  "data": {
    "id": "uuid",
    "order_number": "ORD-20260113-0001",
    "total": 680.00,
    "status": "pending"
  }
}
```

---

### PUT /api/orders/:id - 更新订单

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "status": "completed",
  "payment_status": "paid",
  "notes": "更新备注"
}
```

---

### PATCH /api/orders/:id/status - 更新订单状态

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "status": "completed"
}
```

**有效状态值:** `pending` | `processing` | `completed` | `cancelled`

---

### DELETE /api/orders/:id - 删除订单

**权限:** `admin` / `manager`

**请求头:** `Authorization: Bearer <token>`

---

### GET /api/orders/stats/summary - 订单统计

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "todayRevenue": 2850.00,
    "todayOrders": 15,
    "todayCompleted": 12,
    "totalOrders": 200,
    "pendingOrders": 5
  }
}
```

---

## 📊 报表模块 `/api/reports`

### GET /api/reports/daily - 日报

**权限:** `owner` / `admin` / `manager`

**请求头:** `Authorization: Bearer <token>`

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `date` | string | 否 | 日期 (YYYY-MM-DD)，默认今天 |

**响应:**

```json
{
  "success": true,
  "data": {
    "date": "2026-01-13",
    "summary": {
      "totalRevenue": 2850.00,
      "totalOrders": 15,
      "pendingOrders": 3,
      "completedOrders": 12,
      "cancelledOrders": 0,
      "avgOrderValue": 190.00
    },
    "paymentBreakdown": {
      "cash": 1200.00,
      "mada": 900.00,
      "visa": 750.00
    },
    "orders": [...]
  }
}
```

---

### GET /api/reports/monthly - 月报

**权限:** `owner` / `admin` / `manager`

**请求头:** `Authorization: Bearer <token>`

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `month` | string | 否 | 月份 (YYYY-MM)，默认本月 |

**响应:**

```json
{
  "success": true,
  "data": {
    "month": "2026-01",
    "summary": {
      "totalRevenue": 68500.00,
      "totalOrders": 180,
      "avgOrderValue": 380.56
    },
    "dailyTrend": {
      "2026-01-01": { "revenue": 2500, "count": 8 },
      "2026-01-02": { "revenue": 3200, "count": 10 }
    },
    "orders": [...]
  }
}
```

---

### GET /api/reports/sales - 销售报表（按产品）

**权限:** `owner` / `admin` / `manager`

**请求头:** `Authorization: Bearer <token>`

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `startDate` | string | 否 | 开始日期 (YYYY-MM-DD) |
| `endDate` | string | 否 | 结束日期 (YYYY-MM-DD) |
| `limit` | number | 否 | 返回数量，默认 20 |

**响应:**

```json
{
  "success": true,
  "data": [
    {
      "product_id": "uuid",
      "product_name": "标准洗车",
      "quantity": 45,
      "revenue": 3060.00,
      "order_count": 30
    },
    {
      "product_id": "uuid",
      "product_name": "精致洗车",
      "quantity": 20,
      "revenue": 2560.00,
      "order_count": 18
    }
  ],
  "total": 2
}
```

---

## 📦 库存模块 `/api/inventory`

### GET /api/inventory - 库存列表

**请求头:** `Authorization: Bearer <token>`

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `limit` | number | 否 | 每页数量，默认 20 |
| `search` | string | 否 | 搜索（名称/SKU/条码） |
| `category` | string | 否 | 分类筛选 |
| `low_stock` | string | 否 | true 仅显示低库存 |

**响应:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "标准洗车",
      "sku": "SRV-001",
      "stock_quantity": 45,
      "min_stock": 10,
      "price": 68.00,
      "category": { "name": "洗车服务" },
      "status": "active"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50
  }
}
```

---

### GET /api/inventory/:id - 获取产品详情

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "标准洗车",
    "sku": "SRV-001",
    "price": 68.00,
    "cost": 20.00,
    "stock_quantity": 45,
    "min_stock": 10,
    "status": "active",
    "transactions": [
      {
        "type": "in",
        "quantity": 20,
        "unit_price": 20.00,
        "supplier": "供应商A",
        "created_at": "2026-01-10T10:00:00.000Z"
      }
    ]
  }
}
```

---

### PUT /api/inventory/:id - 更新产品

**权限:** `owner` / `admin` / `manager`

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "name": "标准洗车升级版",
  "price": 78.00,
  "cost": 25.00,
  "min_stock": 15,
  "status": "active",
  "description": "升级版洗车服务"
}
```

---

### POST /api/inventory/stock-in - 入库

**权限:** `owner` / `admin` / `manager`

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "product_id": "uuid",
  "quantity": 50,
  "unit_price": 20.00,
  "supplier": "供应商A",
  "note": "补货入库"
}
```

**响应:**

```json
{
  "success": true,
  "message": "入库成功，标准洗车 当前库存: 95",
  "data": {
    "product_id": "uuid",
    "new_quantity": 95
  }
}
```

---

### POST /api/inventory/stock-out - 出库

**权限:** `owner` / `admin` / `manager`

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "product_id": "uuid",
  "quantity": 5,
  "reason": "日常消耗",
  "note": "门店领用"
}
```

**响应:**

```json
{
  "success": true,
  "message": "出库成功，标准洗车 当前库存: 90",
  "data": {
    "product_id": "uuid",
    "new_quantity": 90
  }
}
```

**错误码:**

| code | 说明 |
|------|------|
| `INSUFFICIENT_STOCK` | 库存不足 |

---

### GET /api/inventory/stats/low-stock - 低库存列表

**请求头:** `Authorization: Bearer <token>`

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `threshold` | number | 否 | 阈值，默认 10 |

**响应:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "标准洗车",
      "stock_quantity": 5,
      "min_stock": 10
    }
  ],
  "count": 3
}
```

---

## 📅 考勤模块 `/api/attendance`

### GET /api/attendance - 获取考勤列表

**请求头:** `Authorization: Bearer <token>`

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `limit` | number | 否 | 每页数量，默认 20 |
| `date` | string | 否 | 日期筛选 |
| `employee_id` | string | 否 | 员工ID筛选 |
| `status` | string | 否 | 状态: present/absent/leave/late |

**响应:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "employee_id": "uuid",
      "staff_name": "张三",
      "date": "2026-01-13",
      "check_in_time": "09:00:00",
      "check_out_time": "18:00:00",
      "work_hours": 9.0,
      "status": "present",
      "employees": { "full_name": "张三", "department": "销售部" }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 30
  }
}
```

---

### GET /api/attendance/:id - 获取考勤详情

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "employee_id": "uuid",
    "staff_name": "张三",
    "date": "2026-01-13",
    "check_in_time": "09:00:00",
    "check_out_time": "18:00:00",
    "work_hours": 9.0,
    "status": "present",
    "check_in_location": "利雅得总部",
    "check_out_location": "利雅得总部",
    "created_at": "2026-01-13T09:00:00.000Z"
  }
}
```

**错误码:**

| code | 说明 |
|------|------|
| `ATTENDANCE_NOT_FOUND` | 考勤记录不存在 |

---

### POST /api/attendance/clock - 打卡

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "type": "in",
  "lat": 24.7136,
  "lng": 46.6753,
  "location": "利雅得总部"
}
```

**响应 (上班打卡):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "employee_id": "uuid",
    "date": "2026-01-13",
    "check_in_time": "09:00:00",
    "status": "present"
  },
  "message": "打卡上班成功"
}
```

**响应 (下班打卡):**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "check_out_time": "18:00:00",
    "work_hours": 9.0
  },
  "message": "打卡下班成功，今日工作时长 9 小时"
}
```

**错误码:**

| code | 说明 |
|------|------|
| `VALIDATION_ERROR` | 参数验证失败 |
| `INVALID_TYPE` | 无效的打卡类型 |
| `ALREADY_CLOCKED_IN` | 今日已打卡上班 |
| `NOT_CLOCKED_IN` | 今日尚未打卡上班 |
| `ALREADY_CLOCKED_OUT` | 今日已打卡下班 |

---

### GET /api/attendance/stats/summary - 考勤统计

**权限:** `owner` / `admin` / `manager`

**请求头:** `Authorization: Bearer <token>`

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `date` | string | 否 | 日期，默认今天 |
| `employee_id` | string | 否 | 员工ID筛选 |

**响应:**

```json
{
  "success": true,
  "data": {
    "date": "2026-01-13",
    "total": 25,
    "present": 20,
    "absent": 3,
    "leave": 1,
    "late": 1,
    "attendance_rate": 80
  }
}
```

---

### PUT /api/attendance/:id - 更新考勤记录

**权限:** `owner` / `admin` / `manager`

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "check_in_time": "09:30:00",
  "check_out_time": "18:30:00",
  "status": "late",
  "note": "迟到30分钟"
}
```

**响应:**

```json
{
  "success": true,
  "data": { ... },
  "message": "考勤记录更新成功"
}
```

---

## 🔐 权限模块 `/api/permissions`

### GET /api/permissions/me - 获取当前用户权限

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@example.com",
    "role": "admin",
    "permissions": ["*"],
    "role_permissions": ["*"]
  }
}
```

---

### GET /api/permissions/roles - 获取角色列表

**权限:** `admin`

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "admin",
      "description": "系统管理员",
      "permissions": ["*"],
      "is_system": true
    },
    {
      "id": "uuid",
      "name": "manager",
      "description": "门店经理",
      "permissions": ["dashboard:view", "orders:manage"],
      "is_system": true
    }
  ]
}
```

---

### POST /api/permissions/roles - 创建角色

**权限:** `admin`

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "name": "supervisor",
  "description": "主管",
  "permissions": ["dashboard:view", "orders:view", "inventory:view"]
}
```

---

### PUT /api/permissions/roles/:id - 更新角色

**权限:** `admin`

**请求头:** `Authorization: Bearer <token>`

---

### DELETE /api/permissions/roles/:id - 删除角色

**权限:** `admin`

**请求头:** `Authorization: Bearer <token>`

**注意:** 系统角色不可删除

---

### GET /api/permissions/user/:userId - 获取用户权限

**权限:** `admin` / `manager`

**请求头:** `Authorization: Bearer <token>`

---

### PUT /api/permissions/user/:userId - 更新用户权限

**权限:** `admin`

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "role": "manager",
  "permissions": ["dashboard:view", "orders:manage"]
}
```

---

## 🚗 车辆监控模块 `/api/vehicle-monitor`

### GET /api/vehicle-monitor - 获取车辆记录列表

**权限:** `owner` / `admin`

**请求头:** `Authorization: Bearer <token>`

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `page` | number | 否 | 页码，默认 1 |
| `limit` | number | 否 | 每页数量，默认 20 |
| `date` | string | 否 | 日期筛选 |
| `plate` | string | 否 | 车牌号搜索 |
| `status` | string | 否 | inside/outside |

**响应:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "plate": "ABC1234",
      "vehicle_type": "sedan",
      "entry_time": "2026-01-13T09:00:00.000Z",
      "exit_time": null,
      "duration_minutes": null,
      "status": "inside"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 10
  }
}
```

---

### GET /api/vehicle-monitor/:id - 获取车辆记录详情

**权限:** `owner` / `admin`

**请求头:** `Authorization: Bearer <token>`

**响应:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "plate": "ABC1234",
    "plate_color": "白色",
    "vehicle_type": "sedan",
    "vehicle_brand": "Toyota",
    "vehicle_model": "Camry",
    "vehicle_color": "黑色",
    "entry_time": "2026-01-13T09:00:00.000Z",
    "exit_time": null,
    "duration_minutes": null,
    "note": "VIP客户",
    "operator_id": "uuid",
    "tenant_id": "uuid",
    "store_id": "uuid"
  }
}
```

**错误码:**

| code | 说明 |
|------|------|
| `RECORD_NOT_FOUND` | 车辆记录不存在 |

---

### POST /api/vehicle-monitor/entry - 车辆进入

**权限:** `owner` / `admin`

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "plate": "ABC1234",
  "vehicle_type": "sedan",
  "plate_color": "白色",
  "vehicle_brand": "Toyota",
  "vehicle_model": "Camry",
  "vehicle_color": "黑色",
  "note": "VIP客户"
}
```

**响应:**

```json
{
  "success": true,
  "data": { ... },
  "message": "车辆 ABC1234 已进入"
}
```

**错误码:**

| code | 说明 |
|------|------|
| `VALIDATION_ERROR` | 参数验证失败 |
| `VEHICLE_INSIDE` | 车辆已在场内 |

---

### POST /api/vehicle-monitor/exit - 车辆离开

**权限:** `owner` / `admin`

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "plate": "ABC1234",
  "note": "正常离开"
}
```

**响应:**

```json
{
  "success": true,
  "data": { ... },
  "message": "车辆 ABC1234 已离开，停留 45 分钟"
}
```

**错误码:**

| code | 说明 |
|------|------|
| `VALIDATION_ERROR` | 参数验证失败 |
| `VEHICLE_NOT_FOUND` | 车辆不在场内 |

---

### POST /api/vehicle-monitor/recognize - 车牌识别（模拟）

**权限:** `owner` / `admin`

**请求头:** `Authorization: Bearer <token>`

**请求体:**

```json
{
  "image": "base64_encoded_image_data"
}
```

**响应:**

```json
{
  "success": true,
  "data": {
    "plate": "ABC1234",
    "plate_color": "白色",
    "brand": "Toyota",
    "model": "Camry",
    "color": "黑色",
    "confidence": 0.96
  },
  "message": "识别完成"
}
```

---

### POST /api/vehicle-monitor/webhook - NVR Webhook

**请求头:**

```
x-webhook-secret: your-nvr-webhook-secret
```

**请求体:**

```json
{
  "channel": 1,
  "eventType": "vehicle_detected",
  "timestamp": "2026-01-13T09:00:00.000Z",
  "imageUrl": "https://nvr.example.com/snapshot.jpg",
  "imageBase64": "base64_encoded_image"
}
```

**响应:**

```json
{
  "success": true,
  "record": { ... },
  "plate": {
    "plate": "ABC1234",
    "confidence": 96
  }
}
```

---

### GET /api/vehicle-monitor/stats/summary - 车辆统计

**权限:** `owner` / `admin`

**请求头:** `Authorization: Bearer <token>`

**查询参数:**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `date` | string | 否 | 日期，默认今天 |

**响应:**

```json
{
  "success": true,
  "data": {
    "date": "2026-01-13",
    "total": 45,
    "inside": 12,
    "outside": 33,
    "avg_duration_minutes": 65
  }
}
```

---

## 📋 健康检查

### GET /api/health - 健康检查

**响应:**

```json
{
  "status": "ok",
  "timestamp": "2026-01-13T10:30:00.000Z",
  "version": "2.0.0",
  "environment": "production",
  "corsOrigin": "https://bais-erp-frontend.vercel.app"
}
```

---

## 📝 错误码速查表

| 错误码 | HTTP状态 | 说明 |
|--------|----------|------|
| `VALIDATION_ERROR` | 400 | 参数验证失败 |
| `UNAUTHORIZED` | 401 | 未授权 |
| `INVALID_TOKEN` | 401 | 无效的Token |
| `FORBIDDEN` | 403 | 权限不足 |
| `USER_NOT_FOUND` | 404 | 用户不存在 |
| `NOT_FOUND` | 404 | 资源不存在 |
| `DB_ERROR` | 500 | 数据库错误 |
| `INTERNAL_ERROR` | 500 | 服务器内部错误 |
| `ACCOUNT_PENDING` | 403 | 账号待审核 |
| `ACCOUNT_REJECTED` | 403 | 账号已被拒绝 |
| `ACCOUNT_INVALID` | 403 | 账号状态异常 |
| `USERNAME_EXISTS` | 409 | 用户名已存在 |
| `PHONE_EXISTS` | 409 | 手机号已被注册 |
| `INSUFFICIENT_STOCK` | 400 | 库存不足 |
| `VEHICLE_INSIDE` | 409 | 车辆已在场内 |
| `VEHICLE_NOT_FOUND` | 404 | 车辆不在场内 |
| `ALREADY_CLOCKED_IN` | 409 | 今日已打卡上班 |
| `NOT_CLOCKED_IN` | 400 | 今日尚未打卡上班 |
| `ALREADY_CLOCKED_OUT` | 409 | 今日已打卡下班 |
| `EMPLOYEE_NOT_FOUND` | 404 | 员工不存在 |
| `PRODUCT_NOT_FOUND` | 404 | 产品不存在 |
| `ORDER_NOT_FOUND` | 404 | 订单不存在 |
| `CUSTOMER_NOT_FOUND` | 404 | 客户不存在 |
```

---

## 📋 操作总结

| # | 操作 | 文件 | 状态 |
|---|------|------|------|
| 1 | 生成 Express Router 版本 | `api/attendance.js` | ✅ 已提供 |
| 2 | 生成 Express Router 版本 | `api/vehicle-monitor.js` | ✅ 已提供 |
| 3 | 删除或重命名 | `api/health.js` | 建议删除 |
| 4 | 补充完整文档 | `docs/API.md` | ✅ 已提供 |

---

**请按顺序执行：**

1. 用上面的代码替换 `api/attendance.js`
2. 用上面的代码替换 `api/vehicle-monitor.js`
3. 删除 `api/health.js`
4. 用上面的完整内容替换 `docs/API.md`

完成后告诉我，我帮你检查并提交！🚀