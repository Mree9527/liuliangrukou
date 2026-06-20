# USDT OTC (场外兑换) — 单人全自动战略

## 一、商业逻辑：为什么选 USDT？

在东南亚黑灰产，**现金难收，卡被冻；USDT 才是王道**。
你不需要有“产品”，你只需要做一个**汇率转换层 (Rate Converter)**。

### 核心盈利模式：吃“点差” (Spread)
你不赚固定的手续费，而是通过买卖差价赚钱。
*   **买入价**（用户给你本币）：1 USDT = 15,300 IDR (印尼盾)
*   **卖出价**（你给用户 USDT）：1 USDT = 16,200 IDR
*   **单笔利润**：$0.9 USDT。
*   **日流水目标**：如果你每天只做 100 单，每单 $1，月利就是 $3,000。这在东南亚完全不是梦。

---

## 二、自动化流程 (无需人工)

传统的换汇是“用户发截图 -> 你核对 -> 转 USDT”。
单人全自动的玩法是 **API 直连 + OCR 识别**。

### 步骤 1：报价与下单
1.  用户在 Bot 输入 "Buy $100"。
2.  Bot 自动抓取 CoinGecko 实时汇率，加上你的利润点差（例如 +6%），生成唯一支付二维码。

### 步骤 2：收款 (核心：QRIS / PromptPay)
*   **策略**：使用**动态 QRIS (印尼)** 或 **PromptPay (泰国)**。
*   **优势**：
    *   **无需人工核对**：这些支付通道支持 API，或者你可以用手机银行自动监听通知。
    *   **金额固定**：二维码绑定了精确到分的金额，扫多了少了都能识别异常。

### 步骤 3：放款 (USDT)
1.  Bot 监听你的银行卡/App 通知（或用户上传支付截图）。
2.  **OCR 自动验单**：如果用户发了截图，Bot 调 Google Vision API 自动识别金额和收款人。
3.  **秒发 USDT**：验证无误后，从你的热钱包 (Hot Wallet) 直接转 USDT 给用户。

---

## 三、“无库存”资金管理策略

你不需要买很多 USDT 囤着，你需要的是**流动性管理**。

### 1. 热钱包 + 冷钱包架构
*   **热钱包 (Hot Wallet)**：存 $500 - $1,000 USDT。这是用于**秒到账**的钱。只要余额少于 10 USDT，系统报警。
*   **冷/交易所账户 (Exchange Account)**：存大部分法币收入。当你发现 USDT 池子空了，再从 Binance/OKX 买入补进热钱包（通常几分钟到一小时）。

### 2. 自动调价机制
*   Bot 每分钟抓取一次 CoinGecko API。
*   **算法**：`卖出价 = (CoinGecko实时汇率 × 1.05) + 缓冲值`。
*   **风控**：如果市场暴跌超过 1%，Bot 自动暂停买入，防止你低价收到 USDT 导致亏损。

---

## 四、获客与裂变 (Viral Loop)

黑灰产用户对价格极其敏感。**“最低汇率”** 是最好的广告。

### 分销机制 (Referral System)
*   **逻辑**：用户 A 邀请用户 B，B 每充值 $100，A 自动获得 $0.5 USDT 奖励。
*   **效果**：大群主为了省钱，会主动把你的 Bot 推荐到他们的几千人的群里（因为他们也能拿佣金）。

---

## 五、MVP (最小可行性产品) 规格

| 模块 | 功能 | 自动化程度 |
|------|------|-----------|
| **汇率看板** | 显示实时 USDT 价格，动态加价 | **全自动** (API抓取 + 预设利润率) |
| **下单钱包** | 自动生成唯一 QRIS/PromptPay 收款码 | **全自动** (调用支付网关) |
| **自动验单** | 监听收款通知或识别用户上传的 PDF/Screenshot | **全自动** (OCR API) |
| **转账** | USDT-TRC20 发送 | **全自动** (私钥签名) |

---

## 六、技术栈建议

*   **后端**：Node.js (处理高并发和实时汇率更新非常快)。
*   **前端**：Telegram Mini App (TG内置浏览器，体验极像 App)。
*   **数据库**：MongoDB (存订单记录)。

### 核心代码逻辑示例 (伪代码)

```javascript
// 用户请求购买 10 USDT
async function buyUsdt(userId, amountUsd) {
    const marketRate = await getCoinGeckoRate('USDT_IDR');
    const ourSellRate = marketRate * 1.06; // 赚 6% 差价
    
    // 生成唯一支付指令 (绑定该用户的订单ID)
    const paymentLink = generateQRIS(userId, amountUsd * ourSellRate);
    
    // 存入数据库，状态为 'PENDING'
    await db.orders.create({ userId, status: 'PENDING', rate: ourSellRate });
    
    return paymentLink;
}

// 收到支付通知 (Webhook)
async function onPaymentReceived(orderId) {
    const order = await db.orders.findById(orderId);
    order.status = 'PAID';
    // 自动从热钱包划转 USDT
    await sendUSDT(order.userId, order.amountUsd);
}
```

## 七、总结：你的第一把刀

1.  **选市场**：印尼 (QRIS) 或 泰国 (PromptPay)，这两个国家的移动支付最发达，最适合自动化。
2.  **配资金**：准备 $500 USDT 和 $1,000 本地法币作为启动池。
3.  **写 Bot**：做一个能自动改价格、自动出二维码的 Mini App。
4.  **铺分销**：去 TG 找那些卖 Togel 群的群主，告诉他“用我的 Bot 收款，返你 1%”。
