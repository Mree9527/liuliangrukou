import React, { useState } from 'react';

export default function HomePage({ user }) {
  const [amountFiat, setAmountFiat] = useState('');
  const [isBuyMode, setIsBuyMode] = useState(true);

  // Mock Rate Logic
  const rate = isBuyMode ? 15800 : 16200;
  const amountUSDT = (amountFiat / rate).toFixed(4);

  return (
    <div className="min-h-screen bg-[#181A20] text-white font-sans p-6 flex flex-col items-center">
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center font-bold text-xs">
            {user?.initials || 'K'}
          </div>
          <span className="text-sm opacity-70">{user?.name || 'User'}</span>
        </div>
        <button className="p-2 rounded-lg bg-[#242730]">
          ⚙️
        </button>
      </header>

      {/* Balance Card - Glassmorphism */}
      <div className="w-full max-w-md bg-[#242730]/80 backdrop-blur-md rounded-2xl p-6 mb-8 border border-white/10 shadow-xl">
        <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Total Balance</p>
        <div className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-[#F7931A] flex items-center justify-center text-[10px] font-bold">₮</span>
          <h2 className="text-4xl font-bold tracking-tight">{(user?.balance || 0).toFixed(2)}</h2>
          <span className="text-sm opacity-50 ml-2">USDT</span>
        </div>
      </div>

      {/* Action Area */}
      <div className="w-full max-w-md bg-[#242730] rounded-3xl p-6 border border-white/5 shadow-2xl">
        
        {/* Toggle Switch */}
        <div className="flex bg-[#181A20] rounded-xl p-1 mb-6 relative">
          <div 
            className={`absolute h-[calc(100%-8px)] top-1 w-[48%] bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg shadow-md transition-all duration-300 ${isBuyMode ? 'left-1' : 'left-[48%]'}`}
          />
          <button 
            className={`relative z-10 w-1/2 py-3 rounded-lg font-bold text-sm transition-colors ${isBuyMode ? 'text-white' : 'text-gray-500'}`}
            onClick={() => setIsBuyMode(true)}
          >
            BUY
          </button>
          <button 
            className={`relative z-10 w-1/2 py-3 rounded-lg font-bold text-sm transition-colors ${!isBuyMode ? 'text-white' : 'text-gray-500'}`}
            onClick={() => setIsBuyMode(false)}
          >
            SELL
          </button>
        </div>

        {/* Input Fields */}
        <div className="space-y-4">
          <div className="bg-[#181A20] rounded-xl p-4 border border-white/5 focus-within:border-yellow-500/50 transition-all">
            <p className="text-xs text-gray-500 mb-2">{isBuyMode ? 'You Pay' : 'You Receive'}</p>
            <input 
              type="number" 
              placeholder="0"
              value={amountFiat}
              onChange={(e) => setAmountFiat(e.target.value)}
              className="w-full bg-transparent text-2xl font-bold outline-none"
            />
            <div className="flex justify-end items-center gap-2 mt-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/10 text-gray-300">IDR</span>
            </div>
          </div>

          <div className="bg-[#181A20] rounded-xl p-4 border border-white/5 opacity-70">
            <p className="text-xs text-gray-500 mb-2">{isBuyMode ? 'You Receive' : 'You Pay'}</p>
            <div className="w-full bg-transparent text-2xl font-bold text-gray-300">
              {amountUSDT}
            </div>
            <div className="flex justify-end items-center gap-2 mt-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#F7931A]/20 text-yellow-500">USDT</span>
            </div>
          </div>
        </div>

        {/* Rate Display */}
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5 text-xs text-gray-400">
          <span>Rate (1 USD)</span>
          <div className="flex items-center gap-2">
            {rate.toLocaleString()} IDR
            <span className="text-[#00C853] text-[10px]">▲ Live</span>
          </div>
        </div>

        {/* Action Button */}
        <button 
          className={`w-full mt-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-95 ${isBuyMode ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white' : 'bg-gradient-to-r from-red-500 to-orange-600 text-white'}`}
        >
          {isBuyMode ? 'BUY USDT NOW' : 'SELL USDT NOW'}
        </button>
      </div>

      {/* Footer / Stats */}
      <div className="w-full max-w-md mt-8 flex justify-center gap-6 text-xs text-gray-500">
        <span>24h Volume: $1.2M</span>
        <span>Online Users: 1,240</span>
        <span>✅ Verified</span>
      </div>
    </div>
  );
}
