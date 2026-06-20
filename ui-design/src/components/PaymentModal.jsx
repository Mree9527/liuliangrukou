import React, { useState, useEffect } from 'react';

export default function PaymentModal({ isOpen, onClose, amount, rate, currency }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes countdown
  const [status, setStatus] = useState('waiting'); // waiting, detected, sent

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Mock QR Code logic
  const qrCodeContent = `TRX:${amount}USD@${rate}`; 

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-[#181A20] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 border-t sm:border border-white/10 animate-slide-up relative">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          ✕
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-white">Confirm Payment</h3>
          <p className="text-xs text-gray-400 mt-1">Scan QR or copy code to pay via {currency}</p>
        </div>

        {/* QR Code Area */}
        <div className="flex flex-col items-center justify-center bg-white p-6 rounded-xl mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          {status === 'sent' ? (
            <div className="text-center text-emerald-500 animate-pulse">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              <p className="text-xl font-bold">USDT Sent!</p>
            </div>
          ) : (
            <>
              {/* Placeholder for actual QR Generation */}
              <div className="w-48 h-48 bg-black flex items-center justify-center text-white font-mono text-xs text-center p-2 rounded-lg">
                [ DYNAMIC QR CODE ]<br/>
                {amount} {currency}<br/>
                Expires in {formatTime(timeLeft)}
              </div>
              <button className="mt-4 px-6 py-2 bg-[#F7931A] text-white rounded-lg text-sm font-bold">
                Copy Code: {qrCodeContent.slice(0, 8)}...
              </button>
            </>
          )}
        </div>

        {/* Payment Instructions */}
        <div className="space-y-3 mb-6">
          {[
            'Open your local payment app (GoPay/PromptPay)',
            'Scan the QR Code above or use the code',
            `Enter exact amount: ${amount} ${currency}`
          ].map((step, idx) => (
            <div key={idx} className="flex items-center gap-3 text-sm text-gray-300">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${status === 'sent' ? 'bg-emerald-500 text-white' : 'bg-[#242730] text-gray-500'}`}>
                {idx + 1}
              </span>
              <span>{step}</span>
            </div>
          ))}
        </div>

        {/* Status Bar */}
        <div className="bg-[#242730] p-3 rounded-lg flex justify-between items-center text-xs">
          <span className="text-gray-400">Status:</span>
          <span className={`font-bold ${status === 'sent' ? 'text-emerald-500' : 'text-yellow-500 animate-pulse'}`}>
            {status === 'waiting' && 'Waiting for payment...'}
            {status === 'detected' && 'Payment detected! Confirming...'}
          </span>
        </div>

      </div>
    </div>
  );
}
