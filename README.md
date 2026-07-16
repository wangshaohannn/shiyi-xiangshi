# 拾壹香室官网

这是一个本地可运行的品牌官网，包含 React 前端、Tailwind CSS 视觉系统、CSS 首屏香烟效果、互动制香工具，以及 Node.js 本地后端。

## 上线方式

这个项目包含 React 前端和 `/api` 接口。正式上线建议使用 Supabase 保存订单、预约、笔记和香方；本地开发不配置 Supabase 时会退回 `data/db.json` 文件模式。

当前接口已经统一到同一套数据访问层：

- 本地开发：可不配置数据库，使用 `data/db.json`。
- 正式上线：必须配置 Supabase、`SITE_URL` 和 `ADMIN_TOKEN`，否则启动前环境变量校验会失败。

### 最短上线步骤

1. 在 Supabase 新建项目，打开 SQL Editor，执行 `supabase/init.sql`。
2. 在部署平台填写环境变量：

```text
NODE_ENV=production
SITE_URL=https://你的正式域名
SUPABASE_URL=https://你的项目.supabase.co
SUPABASE_SERVICE_ROLE_KEY=你的 service_role key
SUPABASE_STATE_TABLE=site_state
SHIYI_STATE_ID=default
ADMIN_TOKEN=后台管理员口令
```

3. 部署构建：

```text
Build Command: npm install && npm run build
Start Command: npm start
Port: 使用平台自动注入的 PORT
```

4. 部署后访问 `/api/health`，返回 `storage: "supabase"` 即表示数据库已连接。第一次访问接口时，系统会把 `data/db.json` 作为初始数据写入 Supabase。

`SUPABASE_STATE_TABLE` 和 `SHIYI_STATE_ID` 可以不填，默认分别是 `site_state` 和 `default`。不要把 `SUPABASE_SERVICE_ROLE_KEY` 暴露到前端或提交到仓库。

### Render 配置

仓库里的 `render.yaml` 已声明构建、启动、健康检查和环境变量。Render Blueprint 导入后，需要在后台填写：

```text
SITE_URL
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
ADMIN_TOKEN
```

`HOST=0.0.0.0`、`NODE_ENV=production`、`SUPABASE_STATE_TABLE=site_state`、`SHIYI_STATE_ID=default` 已经有默认值。

### Vercel 配置

`vercel.json` 已配置 Vite 构建输出和 API 初始化所需的 `data/db.json` 种子文件。Vercel 项目后台需要添加同样的环境变量：

```text
SITE_URL=https://你的正式域名
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
SUPABASE_STATE_TABLE=site_state
SHIYI_STATE_ID=default
ADMIN_TOKEN
```

添加后重新部署，再访问 `/api/health` 检查 `storage` 字段。

本地测试时可以参考 `.env.example`，在终端临时 `export` 对应变量后再启动。不要把真实密钥提交到仓库。

### 后台管理

访问后台：

```text
/admin
```

或：

```text
/#admin
```

后台接口为 `GET /api/admin` 和 `PATCH /api/admin`，需要请求头 `X-Admin-Token` 或 `Authorization: Bearer <token>`。生产环境必须配置 `ADMIN_TOKEN`；本地开发未配置时默认口令为 `dev-admin`。

### SEO 与分享

构建时会根据 `SITE_URL` 自动生成：

```text
/robots.txt
/sitemap.xml
```

首页已包含 canonical、Open Graph、Twitter Card、结构化数据和站点图标。`SITE_URL` 为空或仍是 `https://your-domain.com` 这类占位值时，`npm run build` 会直接失败，避免生成错误的 canonical、分享图地址和站点地图。

上线前流程：

```bash
npm install
export NODE_ENV=production
export SITE_URL=https://你的正式域名
export SUPABASE_URL=https://你的项目.supabase.co
export SUPABASE_SERVICE_ROLE_KEY=你的 service_role key
export ADMIN_TOKEN=后台管理员口令
npm run build
npm run check:env
npm start
```

如果只是本机检查 SEO 构建，可以临时使用正式域名：

```bash
SITE_URL=https://你的正式域名 npm run build
```

启动后可以访问：

```text
http://127.0.0.1:8787
```

## 启动

生产构建需提供 `SITE_URL`：

```bash
SITE_URL=https://你的正式域名 npm run build
```

启动本地网站：

```bash
npm start
```

启动后访问：

```text
http://127.0.0.1:8787
```

开发模式：

```bash
npm start
npm run dev
```

开发前端时访问：

```text
http://127.0.0.1:5173
```

## 后端能力

- `GET /api/health`：服务健康检查
- `GET /api/bootstrap`：首页初始化数据
- `GET /api/products`：产品列表
- `POST /api/orders`：创建订单，支持商品数量、联系方式、取货方式、支付方式、库存校验与库存扣减
- `POST /api/bookings`：创建预约，支持日期、时段、人数、姓名、联系方式与备注校验
- `GET /api/admin`：后台摘要，需管理员口令
- `PATCH /api/admin`：更新商品库存/价格、订单状态、预约状态，需管理员口令
- `POST /api/formulas`：保存互动香方
- `GET /api/notes`：读取社区笔记
- `POST /api/notes`：发布社区笔记

数据暂存在 `data/db.json`，后续可以替换为 MySQL、MongoDB、Strapi 或支付/会员系统。
