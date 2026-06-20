# 🎨 USDT OTC Mini App Design System

This folder contains the professional UI/UX design specifications and React components for your Telegram Mini App.

## 🛠️ How to Use

1. **Preview**: Open `HomePage.jsx` in a React environment (like Vite or Next.js) with Tailwind CSS enabled.
2. **Theme**: The app uses a "Neon Fintech" dark theme (`#181A20` background).
3. **Components**:
   - `HomePage.jsx`: The main dashboard with live conversion and glassmorphism cards.
   - `PaymentModal.jsx`: The automated payment interface with countdown timer and QR generation placeholders.

## 🚀 Next Steps

- Replace the mock rate logic in `HomePage.jsx` with a real API call (e.g., CoinGecko).
- Integrate WallyPay/Bit2Me SDK or Webhook to generate real dynamic QR codes in `PaymentModal.jsx`.
- Connect Telegram WebApp SDK for native UI integration.
