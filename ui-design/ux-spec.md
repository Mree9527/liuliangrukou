# UI/UX Design Specification: USDT OTC Exchange (TG Mini App)

## 1. Design Philosophy (Crypto Dark Theme)
*   **Visual Identity**: "Neon Fintech". High-contrast, low-fatigue dark mode optimized for crypto traders who stare at screens all day.
*   **Trust Signals**: Clean data presentation, verified badges, and smooth micro-interactions (e.g., success checkmark animations).
*   **Core UX Principle**: **"One Thumb Operation"**. Every critical action (Buy/Sell) must be reachable with a single hand on a mobile device.

## 2. Color Palette
| Role | Hex Code | Usage |
|------|----------|-------|
| **Primary BG** | `#181A20` | Telegram Mini App Background / Card Backing |
| **Surface/Cards** | `#242730` | Input boxes, Order Modals, Dashboard Panels |
| **Accent (Buy/Win)** | `#00C853` (Green) | Buy Button, Positive Balance, Success States |
| **Accent (Sell/Loss)** | `#FF3D00` (Red) | Sell Price Highlight, Danger States |
| **Crypto Gold** | `#F7931A` | Bitcoin/USDT Logo Accents |
| **Text Primary** | `#FFFFFF` | Headings, Balances, Action Buttons |
| **Text Secondary** | `#8E929B` | Labels, Secondary Info, Timestamps |

## 3. Typography & Layout
*   **Font Family**: System Fonts (SF Pro for iOS, Roboto for Android) or Inter.
*   **Data Display**: Numbers must use "Tabular Figures" so they align perfectly during rapid price updates.
*   **Layout**: Vertical Stack with Card-based architecture.

## 4. Key Screens & Flow

### Screen A: The Home Dashboard (Conversion Engine)
*   **Header**: User Profile (Avatar + ID), Quick Settings (Language/Country).
*   **Balance Card**: Glassmorphism effect showing "Available Balance" in USDT.
*   **The Action Area (Bottom Half)**: 
    *   Massive Toggle Switch: **BUY / SELL**.
    *   Input Box 1: Amount in Fiat (IDR/THB).
    *   Input Box 2: Amount in USDT (Live conversion, read-only).
    *   **Rate Display**: "1 USD = {rate} {Currency}" with a small green arrow.
    *   **Action Button**: Full-width, glowing button "BUY NOW".

### Screen B: Payment Modal (The "Trust" Layer)
*   **Trigger**: Clicking "BUY NOW".
*   **Dynamic QR Code**: Center screen, large, high-contrast black/white.
*   **Countdown Timer**: "Expires in 09:59" (FOMO element).
*   **Instruction Steps**: 
    1. Open GoPay/OVO/PromptPay App.
    2. Scan QR or copy code {CODE}.
    3. Pay exact amount: {Amount} {Currency}.
*   **Status Bar**: Waiting for payment... -> Payment Found! -> Confirming...

### Screen C: Referral/Viral Center (Optional)
*   "Invite & Earn" tab in the bottom navigation.
*   Copyable Link with a massive "Copy" button.

## 5. Component Library (Shadcn/UI + Tailwind)
*   `Card`: Rounded corners, subtle border (`border-slate-800`), shadow-lg.
*   `Input`: Dark mode inputs with focus rings in Cyan/Gold.
*   `Button`: Gradient backgrounds for primary actions.
