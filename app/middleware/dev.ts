// middleware/dev-only.ts
export default defineNuxtRouteMiddleware((to) => {
  // Only allow access in development
  if (process.env.NODE_ENV === 'production') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found'
    })
  }
})