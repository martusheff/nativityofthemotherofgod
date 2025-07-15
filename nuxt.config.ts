// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  devServer: {
    host: '0.0.0.0',
    port: 3000 
  },
  nitro: {
    preset: "cloudflare-pages"
  },

  css: ['~/assets/css/main.css'],

  tailwindcss: {
    cssPath: [`$assets/css/tailwind.css`, { injectPosition: "first" }],
    config: {},
    viewer: true,
    exposeConfig: false,
  },

  fonts: {
    families: [
      {
        name: 'Cormorant Garamond',
        provider: 'google',
        weights: ['300', '400', '500', '600', '700', '800', '900'],
        styles: ['normal', 'italic']
      }
    ],
  },

  gtag: {
    id: process.env.GA4ID
  },
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
    'vue3-carousel-nuxt',
    'nuxt-swiper',
    'nuxt-gtag'
  ]
})