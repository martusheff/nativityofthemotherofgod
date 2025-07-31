import { defineEventHandler, readBody } from 'h3'
import { useServerStripe } from '#stripe/server'

export default defineEventHandler(async (event) => {
  const stripe = await useServerStripe(event)
  const body = await readBody(event)

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Church Donation',
          },
          unit_amount: body.amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${body.origin}/donate-success`,
    cancel_url: `${body.origin}/donate`,
  })

  return { id: session.id }
})
