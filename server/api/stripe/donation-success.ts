import { buffer } from 'micro'
import { useServerStripe } from '#stripe/server'
import { Resend } from 'resend'
import type Stripe from 'stripe'

const runtimeConfig = useRuntimeConfig()
const resend = new Resend(runtimeConfig.resendApiKey)

export default defineEventHandler(async (event) => {
//   if (event.node.req.method !== 'POST') {
//     setResponseStatus(event, 405)
//     return { error: 'Method not allowed' }
//   }

//   const stripe = await useServerStripe(event)

//   const signature = getHeader(event, 'stripe-signature')
//   if (!signature) {
//     setResponseStatus(event, 400)
//     return { error: 'Missing Stripe signature' }
//   }

//   let stripeEvent
//   try {
//     const rawBody = await buffer(event.node.req)
//     stripeEvent = stripe.webhooks.constructEvent(
//       rawBody,
//       signature!,
//       runtimeConfig.stripeDonationWebhookSecretKey
//     )
//   } catch (err: any) {
//     console.error('⚠️ Stripe webhook verification failed:', err.message)
//     setResponseStatus(event, 400)
//     return { error: 'Invalid signature' }
//   }

// if (stripeEvent.type === 'payment_intent.succeeded') {
//   const paymentIntent = stripeEvent.data.object as Stripe.PaymentIntent
//   const donorEmail = paymentIntent.receipt_email
//   const amount = (paymentIntent.amount ?? 0) / 100

//   if (donorEmail) {
//     await resend.emails.send({
//       from: 'NMOG Receipts <no-reply@receipts.nmog.org>',
//       to: donorEmail,
//       subject: 'Thank you for your donation!',
//       html: `<p>We received your donation of <strong>$${amount.toFixed(
//         2
//       )}</strong>.</p>`,
//     })
//   }
// }


  setResponseStatus(event, 200)
  return { received: true }
})

export const config = {
  api: { bodyParser: false }, // keep this for Stripe signature verification
}
