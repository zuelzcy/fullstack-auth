# 全栈用户认证项目

技术栈：**Next.js（前端）+ FastAPI（后端）+ MySQL（数据库）**，认证采用 **Session + httpOnly Cookie** 方案。

```
fullstack-auth/
├── backend/                 # FastAPI 后端
│   ├── app/
│   │   ├── config.py        # 配置（pydantic-settings，读 .env）
│   │   ├── database.py      # SQLAlchemy 引擎 / Session / get_db
│   │   ├── models.py        # User / Session 模型
│   │   ├── security.py      # bcrypt 密码哈希 + 会话令牌生成
│   │   ├── deps.py          # 从 Cookie 解析当前用户
│   │   ├── main.py          # 应用入口 / CORS / 建表
│   │   └── routers/
│   │       ├── auth.py      # 注册 / 登录 / 登出 / me
│   │       └── users.py     # 受保护接口示例
│   ├── requirements.txt
│   └── .env.example
├── frontend/                # Next.js 前端
│   ├── app/                 # 页面（login / register / dashboard）
│   ├── lib/api.ts           # 带 credentials 的 API 客户端
│   └── .env.local.example
├── docker-compose.yml       # 一键起 MySQL
└── README.md
```

## 1. 启动数据库（MySQL）

```bash
cd fullstack-auth
docker compose up -d mysql      # 首次会拉取镜像
```

## 2. 启动后端

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env            # 默认已指向本地 MySQL
uvicorn app.main:app --reload --port 8000
```

接口文档：http://localhost:8000/docs

## 3. 启动前端

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

访问：http://localhost:3000

## 认证流程说明

- **注册** `/auth/register`：邮箱唯一，密码用 bcrypt 哈希后入库。
- **登录** `/auth/login`：校验凭据，生成随机会话令牌写入 `sessions` 表，并通过 `Set-Cookie` 下发 `session` Cookie（`HttpOnly`、`SameSite=Lax`）。
- **鉴权**：`/auth/me` 等受保护接口从 Cookie 读取令牌，校验 `sessions` 表与过期时间。
- **登出** `/auth/logout`：删除会话记录并清除 Cookie。

> 前后端同处 `localhost` 不同端口，浏览器视为同站（same-site），`SameSite=Lax` 即可正常携带 Cookie；跨域已通过 CORS（`allow_credentials=True`）放行前端源。生产环境部署到不同域名时，请将 `SECURE_COOKIES` 设为 `True` 并使用 `SameSite=None`。

## 环境变量

**backend/.env**
| 变量 | 说明 | 默认 |
| --- | --- | --- |
| DATABASE_URL | 数据库连接串 | `mysql+pymysql://root:root@localhost:3306/authdb` |
| SECRET_KEY | 应用密钥 | `change-me-in-production` |
| SESSION_EXPIRE_HOURS | 会话有效期（小时） | `168` |
| FRONTEND_ORIGIN | 前端源（CORS） | `http://localhost:3000` |
| SECURE_COOKIES | 是否仅 HTTPS 下发 Cookie | `False` |
| COOKIE_NAME | Cookie 名称 | `session` |

**frontend/.env.local**
| 变量 | 说明 | 默认 |
| --- | --- | --- |
| NEXT_PUBLIC_API_BASE | 后端 API 地址 | `http://localhost:8000` |

## 本地无 Docker 时的后端快速自测

把 `DATABASE_URL` 临时改为 `sqlite:///./dev.db` 即可在无 MySQL 环境下跑通接口逻辑。
