# 🚀 正式上线部署指南 (更新版)

## 一、需要申请的账号 (3个 ✅ 已验证域名可用)

| 平台 | 作用 | 申请地址 | 获取什么？ |
|------|------|---------|-----------|
| **CoinGecko** | 抓取实时 USDT 汇率 | `coingecko.com/api` | 免费公开 API，无需 Key |
| **NowPayments** 🌏 | 支持 QRIS, PromptPay, 多国本地支付 | **`nowpayments.io`** | API Key + Webhook Secret |
| **Crypto.com** 💳 (或 Bybit) | USDT 热钱包提现 (TRC20) | **`crypto.com/defi-wallet`** | TRC20 私钥 / API Key |

> 💡 **NowPayments** 是当前东南亚最成熟的加密支付网关，已整合 QRIS (印尼) 和 PromptPay (泰国)。个人注册即可，支持 API 和 Webhook。
> 
> **Crypto.com DeFi Wallet** 或 **Bybit**：用来存放 USDT 热钱包私钥，用于自动发币给用户。

---

## 二、填写配置 (`.env.local`)

```env
# ==========================================
# 核心 API Keys (去后台获取)
# ==========================================

# CoinGecko 汇率 (免费公开，无需 Key)
NEXT_PUBLIC_RATE_API_URL=https://api.coingecko.com/api/v3/simple/price

# NowPayments - 收法币付款的网关 (替代 WallyPay/Bit2Me)
NOWPAYMENTS_API_KEY=your_nowpayments_api_key_here

# Crypto.com / Bybit TRC20 API (用于自动发 USDT)
CRYPTO_API_KEY=your_crypto_api_key
CRYPTO_API_SECRET=your_crypto_api_secret

# Webhook 安全密钥 (自定义，用于验证回调签名)
WEBHOOK_SECRET=whsec_随机字符串1234567890

# ==========================================
# 运行环境设置 (开发时填 localhost，上线改域名)
# ==========================================
NEXT_PUBLIC_API_URL=http://localhost:3100
```

---

## 三、上线修改清单 (Production Checklist)

| 步骤 | 操作位置 | 说明 |
|------|---------|------|
| **1. 购买域名** | Cloudflare / Namecheap | 推荐 `.com` 或 `.io`，绑定 Vercel |
| **2. 申请正式 API Key** | NowPayments → Dashboard → Settings → API | 将测试 Key 换成 Live Key |
| **3. 配置 Webhook URL** | NowPayments -> Payment Settings -> Webhook | 填写 `https://你的域名/api/webhooks/payment` |
| **4. 上传环境变量** | Vercel Dashboard -> Settings -> Environment Variables | 粘贴所有 API Key、私钥等 |
| **5. 部署上线** | GitHub Push / Vercel CLI | `vercel --prod` 自动构建并分配 HTTPS |
| **6. 热钱包充值** | Bybit/Crypto.com → Withdrawal Settings | 存入 $100-500 USDT (TRC20)，Bot 才能秒发 U |

---

## 四、推荐部署平台：Vercel (免费+极速)

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录并部署到生产环境
cd ui-design
vercel login
vercel --prod
# 按提示选择项目名，Vercel 会自动配置 HTTPS 和 Webhook 域名
```

---

## 五、NowPayments API 对接说明 (已更新代码)

**创建订单 → 生成支付链接/二维码：**
```javascript
// POST https://api.nowpayments.io/v1/payment
{
  "amount": "50",
  "currency": "thb",       // 或 "idr"
  "pay_currency": "usdt",   // 用户付法币，平台收稳定币
  "ipn_callback_url": "https://你的域名/api/webhooks/payment",
  "order_id": "订单号_随机数"
}
```

**返回数据包含：**
- `payment_url` → 用户支付链接
- `invoice_url` → 支付页面 URL (可嵌入二维码)
- `pay_address` → 法币收款账号 QRIS/PromptPay 码

**Webhook 回调格式 (支付成功后 NowPayments 推送):**
```json
{
  "payment_status": "confirmed",
  "order_id": "订单号_随机数",
  "amount": "50",
  "currency": "thb"
}
```

收到 confirmed → 触发 USDT 提现函数。
