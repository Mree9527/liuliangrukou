const { execSync } = require('child_process');

const gateways = [
  { name: "NowPayments", url: "https://nowpayments.io" },
  { name: "Cryptomus", url: "https://cryptomus.com" },
  { name: "Plisio", url: "https://plisio.net" },
  { name: "CoinPayments", url: "https://coinpayments.net" },
  { name: "Coinremitter", url: "https://coinremitter.com" },
  { name: "FixedFloat", url: "https://fixedfloat.io" },
  { name: "ChangeNOW", url: "https://changenow.io" },
  { name: "Simplex", url: "https://simplex.tech" },
  { name: "Transak", url: "https://transak.com" },
  { name: "MoonPay", url: "https://moonpay.com" },
  { name: "Ramp Network", url: "https://ramp.network" },
  { name: "Banxa", url: "https://banxa.com" },
  { name: "Xanego (Wyre)", url: "https://xanego.com" },
  { name: "Coinbase Commerce", url: "https://commerce.coinbase.com" },
  { name: "Bit2Me", url: "https://bit2me.io" },
  { name: "FoxPayments", url: "https://foxpayments.io" },
  { name: "CoinGate", url: "https://coingate.com" },
  { name: "Coins.ph", url: "https://coinsph.com" },
  { name: "Bit2Pay", url: "https://bit2pay.com" },
  { name: "Gate.io Merchant", url: "https://gate.io/merchant" },
  { name: "Bitget Merchant", url: "https://bitget.com/merchant" },
  { name: "MEXC Global", url: "https://mexc.com" },
  { name: "Bitrue", url: "https://bitrue.com" },
  { name: "LBank", url: "https://lbank.info" },
  { name: "HotBit", url: "https://hotbit.com" },
  { name: "CoinEx", url: "https://coinex.com" }
];

console.log("Opening all gateways...\n");

gateways.forEach((g, i) => {
  try {
    execSync(`open "${g.url}"`, { stdio: 'ignore' });
    console.log(`${i + 1}. ✅ Opened: ${g.name}`);
  } catch (e) {
    console.error(`${i + 1}. ❌ Failed to open: ${g.name} - ${e.message.split('\n')[0]}`);
  }
});

console.log("\nDone! All links have been opened in your browser.");
