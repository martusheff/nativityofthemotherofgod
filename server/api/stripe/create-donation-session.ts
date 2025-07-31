import Stripe from 'stripe'

export default defineEventHandler(async (event) => {
  const { amount, donorName, donorEmail } = await readBody(event)
  const config = useRuntimeConfig()
  
  const stripe = new Stripe(config.stripeSecretKey)
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Church Donation',
            description: 'Thank you for supporting our Orthodox parish',
          },
          unit_amount: amount, // Amount in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${getHeader(event, 'origin')}/donate/success`,
      cancel_url: `${getHeader(event, 'origin')}/donate`,
      customer_email: donorEmail || undefined,
      metadata: {
        donorName: donorName || 'Anonymous',
        purpose: 'Church Donation'
      }
    })

    return { url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create checkout session'
    })
  }
})