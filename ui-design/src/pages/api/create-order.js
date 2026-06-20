// Next.js API Route: 创建 WallyPay / Bit2Me 订单
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { amount, currency, payment_method, webhook_url } = req.body;

  try {
    let gatewayKey = '';
    let apiEndpoint = '';
    
    // 1. 根据货币选择支付网关 (WallyPay 或 Bit2Me)
    if (currency === 'IDR') {
      gatewayKey = process.env.WALLYPAY_API_KEY;
      apiEndpoint = 'https://api.wallypay.com/v1/payments/qr';
    } else if (currency === 'THB') {
      gatewayKey = process.env.BIT2ME_API_KEY;
      apiEndpoint = 'https://api.bit2me.io/v1/order';
    } else {
      return res.status(400).json({ error: 'Unsupported currency' });
    }

    if (!gatewayKey) throw new Error('Gateway API Key not configured');

    // 2. 调用真实网关生成动态收款码
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gatewayKey}` 
      },
      body: JSON.stringify({
        amount,
        currency,
        redirect_url: webhook_url, // 支付成功后跳转或回调
        reference_number: `TXN_${Date.now()}`,
        expire_in: 600 // 10分钟过期
      })
    });

    const gatewayData = await response.json();
    
    if (gatewayData.status !== 'success') {
      throw new Error(gatewayData.message || 'Gateway error');
    }

    // 3. 返回给前端展示 QR 码的数据
    res.status(200).json({
      success: true,
      qr_code: gatewayData.qr_payload, // WallyPay/Bit2Me 生成的二维码字符串
      payment_url: gatewayData.payment_url, // 备用支付链接
      order_id: gatewayData.id,
      expires_at: Date.now() + 600000 
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
}
