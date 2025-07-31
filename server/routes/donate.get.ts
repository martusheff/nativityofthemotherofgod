// server/routes/donate.get.js
export default defineEventHandler(async (event) => {
  const stripePaymentUrl = 'https://donate.nativityofthemotherofgod.com/b/14A6oJakr1TD3Zs7DBeQM00'
  await sendRedirect(event, stripePaymentUrl, 302)
})