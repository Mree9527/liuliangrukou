import React, { useState } from 'react';
import HomePage from './components/HomePage';
import PaymentModal from './components/PaymentModal';

export default function App() {
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  
  // Mock user and order state
  const user = { name: 'Kevin', balance: 450.00, initials: 'K' };
  const currentOrder = { amount: 100, rate: 15800, currency: 'IDR' };

  return (
    <div className="antialiased">
      <HomePage user={user} onBuy={() => setIsPaymentOpen(true)} />
      
      {/* Full Screen Payment Modal */}
      <PaymentModal 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        amount={currentOrder.amount}
        rate={currentOrder.rate}
        currency={currentOrder.currency}
      />
    </div>
  );
}
