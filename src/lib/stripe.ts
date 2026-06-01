import Stripe from "stripe"

function createStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error("Stripe secret key not configured")
  }
  return new Stripe(key, {
    apiVersion: "2026-05-27.dahlia",
    typescript: true,
  })
}

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    _stripe = createStripe()
  }
  return _stripe
}

export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
}
