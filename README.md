# 周报生成器

一个基于 AI 的周报生成器，可以从 GitHub 提交记录自动生成专业的周报。

## 功能特点

- 🔐 GitHub OAuth 登录认证
- 📊 自动获取指定时间范围的 GitHub 提交记录
- 🤖 使用 Claude AI 智能生成周报摘要
- 📝 支持多种报告周期（1周、2周、1个月）
- 🎨 现代化的用户界面，基于 Tailwind CSS

## 技术栈

- **框架**：Next.js 15 (App Router)
- **语言**：TypeScript
- **样式**：Tailwind CSS 4
- **认证**：NextAuth.js (GitHub OAuth)
- **AI 服务**：Anthropic Claude API
- **GitHub API**：Octokit

## 安装步骤

### 1. 克隆仓库

```bash
git clone https://github.com/dupengair/weekly-report.git
cd weekly-report
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

复制环境变量示例文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入以下配置：

```env
# GitHub OAuth 配置
# 在 https://github.com/settings/developers 创建 OAuth 应用
GITHUB_CLIENT_ID=你的_github_client_id
GITHUB_CLIENT_SECRET=你的_github_client_secret

# Claude API 配置
# 从 https://console.anthropic.com/ 获取 API Key
ANTHROPIC_API_KEY=你的_anthropic_api_key

# NextAuth 配置
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=生成的随机密钥
```

**生成 NEXTAUTH_SECRET：**

```bash
openssl rand -base64 32
```

**配置 GitHub OAuth 应用：**

1. 访问：https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 填写应用信息：
   - Application name: 周报生成器
   - Homepage URL: http://localhost:3000
   - Authorization callback URL: http://localhost:3000/api/auth/callback/github
4. 获取 Client ID 和 Client Secret

## 使用方法

### 启动开发服务器

```bash
npm run dev
```

访问：http://localhost:3000

### 生成周报

1. 使用 GitHub 账号登录
2. 选择报告周期（1周、2周或1个月）
3. 点击"生成周报"按钮
4. 等待 AI 生成周报摘要
5. 查看生成的周报

## 构建生产版本

```bash
npm run build
npm start
```

## 代码规范

- 运行 lint 检查：`npm run lint`
- 提交前确保 lint 通过

## 许可证

MIT

## 作者

- dupengair

## 致谢

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- [Anthropic Claude](https://www.anthropic.com/)
