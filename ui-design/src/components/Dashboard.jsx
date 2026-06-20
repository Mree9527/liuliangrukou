import React, { useState } from 'react';
import { useWallyPay } from '../hooks/useWallyPay';
import DynamicQRModal from './DynamicQRModal';

export default function Dashboard() {
  const [balance, setBalance] = useState(450.00);
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('IDR');
  const [isBuyMode, setIsBuyMode] = useState(true);
  
  // Payment State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState('');

  // Hook Integration
  const { rate, loading, error, createPayment } = useWallyPay();
  
  // Calculations
  const usdtReceive = amount ? (parseFloat(amount) / rate).toFixed(4) : '0';
  const profitSpread = parseFloat(usdtReceive) * 0.06; // Approx profit per transaction

  // Handle Buy/Sell Action
  const handleAction = async () => {
    if (!amount || !rate) return;
    
    setIsModalOpen(true);
    
    // Simulate order creation in background
    try {
      // In real app: const order = await createPayment(amount, currency);
      console.log('Order created with rate:', rate);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#181A20] text-white font-sans p-4 max-w-md mx-auto flex flex-col">
      
      {/* Header */}
      <header className="flex justify-between items-center py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F7931A] to-orange-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-yellow-500/20">K</div>
          <div>
            <p className="text-xs text-gray-400">Welcome back</p>
            <h1 className="font-bold text-base">Kevin</h1>
          </div>
        </div>
        <button className="w-8 h-8 rounded-lg bg-[#242730] flex items-center justify-center border border-white/5 text-gray-400">⚙️</button>
      </header>

      {/* Balance Card */}
      <div className="bg-[#242730]/80 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/10 shadow-xl relative overflow-hidden mt-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#F7931A]/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Total Balance</p>
        <div className="flex items-center gap-3">
          <span className="w-8 h-8 rounded-full bg-[#F7931A] flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-yellow-500/30">₮</span>
          <h2 className="text-4xl font-bold tracking-tight">{balance.toFixed(2)}</h2>
          <span className="text-sm opacity-60 ml-1">USDT</span>
        </div>
      </div>

      {/* Main Action Card */}
      <div className="flex-1 bg-[#242730] rounded-3xl p-6 border border-white/5 shadow-2xl relative mt-auto mb-6">
        
        {/* Toggle Switch */}
        <div className="flex bg-[#181A20]/50 rounded-xl p-1 mb-6 relative">
          <div className={`absolute h-[calc(100%-8px)] top-1 w-[48%] ${isBuyMode ? 'bg-emerald-500' : 'bg-red-500'} rounded-lg shadow-lg transition-all duration-300 ${isBuyMode ? 'left-1' : 'left-[48%]'}`}></div>
          <button 
            className={`relative z-10 w-1/2 py-3 font-bold text-sm transition-colors ${isBuyMode ? 'text-white' : 'text-gray-500'}`}
            onClick={() => setIsBuyMode(true)}
          >BUY</button>
          <button 
            className={`relative z-10 w-1/2 py-3 font-bold text-sm transition-colors ${!isBuyMode ? 'text-white' : 'text-gray-500'}`}
            onClick={() => setIsBuyMode(false)}
          >SELL</button>
        </div>

        {/* Currency Selector */}
        <div className="flex gap-2 mb-4">
          {['IDR', 'THB'].map((c) => (
            <button 
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${currency === c ? 'bg-[#F7931A] border-[#F7931A] text-white' : 'bg-[#181A20] border-white/5 text-gray-500'}`}
            >{c}</button>
          ))}
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="bg-[#181A20]/50 rounded-xl p-4 border border-white/5 focus-within:border-[#F7931A] transition-all">
            <p className="text-xs text-gray-500 mb-1">{isBuyMode ? 'You Pay' : 'You Receive'}</p>
            <div className="flex justify-between items-center">
              <input 
                type="number" 
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-transparent text-2xl font-bold outline-none"
              />
              <span className="text-xs font-semibold px-2 py-1 rounded bg-white/10 text-gray-300">{currency}</span>
            </div>
          </div>

          <div className="bg-[#181A20]/50 rounded-xl p-4 border border-white/10 opacity-80">
            <p className="text-xs text-gray-500 mb-1">{isBuyMode ? 'You Receive (approx)' : 'You Pay'}</p>
            <div className="flex justify-between items-center">
              <span className="w-full text-2xl font-bold text-yellow-500">{usdtReceive} USDT</span>
            </div>
          </div>
        </div>

        {/* Live Rate & Spread */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5 text-xs">
          <span className="text-gray-500">Market Rate</span>
          <div className="flex items-center gap-2">
            {loading ? 'Updating...' : `1 USD = ${rate?.toLocaleString()} ${currency}`}
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-500 font-bold">LIVE</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          disabled={!amount || parseFloat(amount) <= 0 || loading}
          onClick={handleAction}
          className={`w-full mt-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 ${isBuyMode ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' : 'bg-gradient-to-r from-red-500 to-orange-600 text-white'} ${(!amount || parseFloat(amount) <= 0) && 'opacity-50 cursor-not-allowed'}`}
        >
          {isBuyMode ? `BUY USDT (${currency})` : `SELL USDT`}
        </button>

        {/* Fee Info */}
        <p className="text-center text-[10px] text-gray-500 mt-2">Platform fee included in rate (6%)</p>
      </div>

      {/* Dynamic QR Modal */}
      <DynamicQRModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        amountFiat={amount}
        currency={currency}
      />

    </div>
  );
}
