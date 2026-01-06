# PDD 成本查询系统 - Cloudflare Workers 版本

基于飞书多维表格的产品成本查询系统，使用 Cloudflare Workers 部署。

## 功能特性

- 支持商品编码和商品名称查询
- 查询商品成本信息（单件/2件/3件成本）
- 查看库存信息（总库存、电商库存、兴富库存及待入库）
- 查看物流信息（省内/省外运费、重量）
- 密码登录保护

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置敏感信息

在 Cloudflare Dashboard 中设置以下 Secrets，或使用 wrangler 命令：

```bash
# 设置飞书应用配置
npx wrangler secret put APP_ID
npx wrangler secret put APP_SECRET
npx wrangler secret put APP_TOKEN
npx wrangler secret put TABLE_ID

# 设置访问密码
npx wrangler secret put VALID_PASSWORD_1
npx wrangler secret put VALID_PASSWORD_2
npx wrangler secret put VALID_PASSWORD_3
```

或者参考 `.env.example` 文件中的配置格式。

### 3. 本地开发

```bash
npm run dev
# 或
npx wrangler dev
```

### 4. 部署到生产环境

```bash
npm run deploy
# 或
npx wrangler deploy
```

## 项目结构

```
Cloudflare-PDD/
├── wrangler.toml        # Cloudflare Workers 配置
├── src/
│   └── index.js         # 主入口文件（包含前端页面和 API）
├── .env.example         # 环境变量示例
└── package.json
```

## API 接口

### 登录
- **POST** `/api/login`
- **Body**: `{ "password": "your_password" }`
- **Response**: `{ "success": true, "token": "xxx", "message": "登录成功" }`

### 查询
- **POST** `/api/query`
- **Headers**: `{ "x-auth-token": "your_token" }`
- **Body**: `{ "keyword": "search_term" }`
- **Response**: `{ "success": true, "data": [...] }`

## 配置说明

### 飞书应用配置

需要在[飞书开放平台](https://open.feishu.cn/)创建应用并配置以下权限：
- `bitable:record:read` - 读取多维表格数据

### 多维表格字段

系统默认查询以下字段：
- 商品编码、商品名称、品牌、备案号、更新时间
- 专供渠道、批发价
- 单件总成本、2件总成本、3件总成本
- 总库存、电商库存、兴富库存
- 电商待入库、兴富待入库
- 广东省内邮费预估、省外非偏远运费预估、单件重量KG
