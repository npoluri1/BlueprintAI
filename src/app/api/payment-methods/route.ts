import { NextResponse } from "next/server"

const PAYMENT_METHODS: Record<string, { id: string; name: string; icon: string; countries: string[] }[]> = {
  global: [
    { id: "credit-card", name: "Credit Card", icon: "💳", countries: ["*"] },
    { id: "debit-card", name: "Debit Card", icon: "🏦", countries: ["*"] },
    { id: "paypal", name: "PayPal", icon: "🅿️", countries: ["*"] },
    { id: "google-pay", name: "Google Pay", icon: "📱", countries: ["*"] },
    { id: "apple-pay", name: "Apple Pay", icon: "🍎", countries: ["US", "GB", "CA", "AU", "SG", "JP", "KR", "HK", "NZ", "AE", "SA"] },
  ],
  crypto: [
    { id: "bitcoin", name: "Bitcoin (BTC)", icon: "₿", countries: ["*"] },
    { id: "ethereum", name: "Ethereum (ETH)", icon: "♦️", countries: ["*"] },
    { id: "usdt", name: "USDT (ERC-20)", icon: "💵", countries: ["*"] },
    { id: "usdc", name: "USDC (Solana)", icon: "◎", countries: ["*"] },
    { id: "solana", name: "Solana (SOL)", icon: "◎", countries: ["*"] },
  ],
  regional: [
    { id: "paynow", name: "PayNow", icon: "🇸🇬", countries: ["SG"] },
    { id: "grabpay", name: "GrabPay", icon: "🟢", countries: ["SG", "MY", "TH", "PH", "VN"] },
    { id: "gcash", name: "GCash", icon: "🇵🇭", countries: ["PH"] },
    { id: "dana", name: "DANA", icon: "🇮🇩", countries: ["ID"] },
    { id: "truemoney", name: "TrueMoney", icon: "🇹🇭", countries: ["TH"] },
    { id: "upi", name: "UPI", icon: "🇮🇳", countries: ["IN"] },
    { id: "alipay", name: "Alipay", icon: "🇨🇳", countries: ["CN", "HK", "MY", "SG"] },
    { id: "wechat-pay", name: "WeChat Pay", icon: "💬", countries: ["CN", "HK"] },
    { id: "paytm", name: "Paytm", icon: "🇮🇳", countries: ["IN"] },
    { id: "touchngo", name: "Touch 'n Go", icon: "🇲🇾", countries: ["MY"] },
    { id: "kakao-pay", name: "KakaoPay", icon: "🇰🇷", countries: ["KR"] },
    { id: "line-pay", name: "LINE Pay", icon: "🇯🇵", countries: ["JP", "TW", "TH"] },
    { id: "bank-transfer", name: "Bank Transfer", icon: "🏛️", countries: ["*"] },
    { id: "ideal", name: "iDEAL", icon: "🇳🇱", countries: ["NL"] },
    { id: "giropay", name: "Giropay", icon: "🇩🇪", countries: ["DE"] },
    { id: "bancontact", name: "Bancontact", icon: "🇧🇪", countries: ["BE"] },
    { id: "eps", name: "EPS", icon: "🇦🇹", countries: ["AT"] },
    { id: "sepa", name: "SEPA Direct Debit", icon: "🇪🇺", countries: ["DE", "FR", "NL", "BE", "AT", "ES", "IT", "PT", "IE", "FI", "EE", "LV", "LT", "LU", "MT", "CY", "SI", "SK", "HR", "GR", "BG", "RO", "HU", "PL", "CZ", "DK", "SE", "NO", "CH", "IS", "LI"] },
  ],
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const country = url.searchParams.get("country") || "SG"

  const globalMethods = PAYMENT_METHODS.global.filter(m => m.countries.includes("*"))
  const cryptoMethods = PAYMENT_METHODS.crypto
  const regionalMethods = PAYMENT_METHODS.regional.filter(m => m.countries.includes("*") || m.countries.includes(country))

  return NextResponse.json({
    country,
    methods: {
      global: globalMethods,
      crypto: cryptoMethods,
      regional: regionalMethods,
    },
    all_methods: [...globalMethods, ...regionalMethods, ...cryptoMethods],
  })
}
