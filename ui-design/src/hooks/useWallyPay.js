import { useState, useEffect, useCallback } from 'react';

// 读取环境变量中的 API Key
const WALLYPAY_KEY = process.env.NEXT_PUBLIC_WALLYPAY_API_KEY || '';
const BIT2ME_KEY = process.env.BIT2ME_API_KEY || ''; 
const USDT_PRIVATE_KEY = process.env.USDT_PRIVATE_KEY || '';
const WEBHOOK_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/webhooks/payment`;

export function useWallyPay() {
  const [rate, setRate] = useState(15800); // Fallback rate IDR
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Step 1: Fetch live USDT/IDR rate from CoinGecko
  const fetchRate = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_RATE_API_URL}?ids=tether&vs_currencies=idr`);
      if (!res.ok) throw new Error('Rate API error');
      
      const data = await res.json();
      // Add our profit margin (e.g., +6% spread)
      const marketRate = data.tether.idr;
      const sellRate = Math.floor(marketRate * 1.06); 
      setRate(sellRate);
      setError(null);
    } catch (err) {
      console.error('Rate fetch failed:', err);
      // Keep fallback rate or use last successful one
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRate();
    // Poll every 60 seconds for rate updates
    const interval = setInterval(fetchRate, 60000);
    return () => clearInterval(interval);
  }, [fetchRate]);

  // Step 2: Create payment order via WallyPay/Bit2Me API
  const createPayment = async (amountFiat, currency) => {
    if (!rate) throw new Error('Rate not loaded');
    
    setLoading(true);

    try {
      // 根据货币选择对应的支付网关 Key
      const apiKey = currency === 'IDR' ? WALLYPAY_KEY : BIT2ME_KEY;
      
      const orderData = {
        amount: amountFiat,
        currency: currency, 
        payment_method: currency === 'IDR' ? 'QRIS' : 'PROMPT_PAY',
        webhook_url: WEBHOOK_URL,
        metadata: { rate, timestamp: Date.now() }
      };

      // 调用后端 API (Next.js Route Handler)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!res.ok) throw new Error('Failed to create payment');
      
      const order = await res.json();
      return order; 

    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Withdraw USDT to user's TRC20 address
  const withdrawUSDT = async (amountUsd, recipientAddress) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/withdraw`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amountUsd, address: recipientAddress })
      });
      
      if (!res.ok) throw new Error('Withdrawal failed');
      
      const tx = await res.json();
      console.log('TX Sent:', tx.txHash);
      return tx;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  return {
    rate,
    loading,
    error,
    fetchRate,
    createPayment,
    withdrawUSDT
  };
}
