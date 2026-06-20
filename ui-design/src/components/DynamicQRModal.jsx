import React, { useState, useEffect } from 'react';

export default function DynamicQRModal({ isOpen, onClose, amountFiat, currency }) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 min countdown
  const [status, setStatus] = useState('waiting'); 
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    
    // Generate Mock QR data on open
    setQrData({
      code: `TRX:${amountFiat}IDR@${Date.now()}`,
      image: `/api/qr/${Math.random().toString(36).substring(7)}.png`
    });

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Simulate payment detection after 8 seconds for demo
    const detectTimer = setTimeout(() => {
      setStatus('detected');
      setTimeout(() => {
        setStatus('sent');
        setTimeout(() => {
          setStatus('done');
        }, 3000);
      }, 2000);
    }, 8000);

    return () => {
      clearInterval(timer);
      clearTimeout(detectTimer);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const copyToClipboard = () => {
    if (qrData) {
      navigator.clipboard.writeText(qrData.code);
      alert('Code copied!');
    }
  };

  // Status Colors & Messages
  const statusConfig = {
    waiting: { color: 'text-yellow-500', msg: 'Waiting for payment...' },
    detected: { color: 'text-blue-400', msg: 'Payment detected! Confirming...' },
    sent: { color: 'text-emerald-500', msg: 'USDT Sent successfully!' },
    done: { color: 'text-white', msg: 'Order Complete' }
  };

  const currentStatus = statusConfig[status];

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
      <div className="bg-[#181A20] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 border-t sm:border border-white/10 animate-slide-up relative min-h-[90vh] sm:min-h-auto flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-white">Confirm Payment</h3>
          <button onClick={onClose} className="p-2 rounded-full bg-surface border border-white/5 text-gray-400 hover:text-white">✕</button>
        </div>

        {/* Timer & Status */}
        <div className="flex justify-between items-center mb-6 px-2">
          <span className={`font-mono text-lg font-bold ${currentStatus.color}`}>{formatTime(timeLeft)}</span>
          <span className={`text-sm font-semibold ${currentStatus.color}`}>{currentStatus.msg}</span>
        </div>

        {/* QR Code Area */}
        <div className="flex-1 flex flex-col items-center justify-center bg-surface rounded-2xl p-8 border border-white/5 mb-6">
          {status === 'sent' ? (
            <div className="text-center text-emerald-500 animate-pulse">
              <svg className="w-20 h-20 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              <p className="text-xl font-bold text-white">USDT Sent!</p>
            </div>
          ) : (
            <>
              {/* Dynamic QR Code Display */}
              <div className="w-56 h-56 bg-white p-2 rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center">
                <div className="w-full h-full bg-black rounded-lg relative overflow-hidden flex items-center justify-center text-center">
                  {/* Simulated QR Pattern */}
                  <div className="grid grid-cols-8 grid-rows-8 gap-0.5 w-[70%] h-[70%]">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div key={i} className={`rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}></div>
                    ))}
                  </div>
                  <div className="absolute bottom-2 text-[10px] font-mono bg-black px-2 py-0.5 rounded">WallyPay</div>
                </div>
              </div>

              <p className="text-gray-400 text-xs mt-4 text-center">Scan with GoPay, OVO, BCA or PromptPay</p>

              {/* Copy Button */}
              {qrData && (
                <button 
                  onClick={copyToClipboard}
                  className="mt-6 px-8 py-3 bg-[#F7931A] text-white rounded-xl font-bold text-sm shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform flex items-center gap-2"
                >
                  📋 Copy Code: {qrData.code.substring(0, 6)}...
                </button>
              )}
            </>
          )}
        </div>

        {/* Payment Steps */}
        <div className="space-y-3 mb-4">
          {[
            'Open your local payment app (GoPay/PromptPay)',
            'Scan QR or use the copied code',
            `Enter exact amount: ${amountFiat} ${currency}`
          ].map((step, idx) => {
            const isCompleted = ['detected', 'sent', 'done'].includes(status);
            return (
              <div key={idx} className="flex items-center gap-3 text-sm p-2 rounded-lg bg-surface/50 border border-white/5">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${status === 'sent' && idx > 1 ? 'bg-gray-700 text-gray-500' : 'bg-primary text-white'}`}>
                  {idx + 1}
                </span>
                <span className={status === 'sent' && idx > 1 ? 'text-gray-500 line-through' : 'text-gray-200'}>{step}</span>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-white/10 flex gap-3">
          {status === 'done' ? (
             <button onClick={onClose} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold shadow-lg">Done</button>
          ) : status !== 'sent' && (
            <button 
              onClick={() => setStatus('detected')}
              className="flex-1 py-3 bg-surface border border-white/10 text-gray-400 rounded-xl font-bold text-sm active:scale-95 transition-transform"
            >
              Simulate Payment Found
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
