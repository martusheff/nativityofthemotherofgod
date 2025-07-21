// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  css: ['~/assets/css/main.css'],

  tailwindcss: {
    cssPath: [`~/assets/css/tailwind.css`, { injectPosition: "first" }],
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

  turnstile: {
    siteKey: process.env.TURNSTYLE_SITEKEY,
  },

  runtimeConfig: {
    turnstile: {
      secretKey: process.env.TURNSTYLE_SECRETKEY,
    },
    public: {
      web3FormsAccessKey: process.env.WEB3_FORMS_ACCESS_KEY,
    }
  },

  pwa: {
    registerType: 'autoUpdate',
    strategies: 'injectManifest',
    srcDir: '.',
    filename: 'sw.js',
    manifest: {
      name: 'Nativity of the Mother of God',
      short_name: 'NMOG',
      description: 'ROCOR Old Rite Russian Orthodox Church in Woodburn, OR',

      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      scope: '/',
      start_url: '/',
      icons: [
        {
          "src": "icons/icon-48x48.png",
          "sizes": "48x48",
          "type": "image/png"
        },
        {
          "src": "icons/icon-72x72.png",
          "sizes": "app/72x72",
          "type": "image/png"
        },
        {
          "src": "icons/icon-96x96.png",
          "sizes": "96x96",
          "type": "image/png"
        },
        {
          "src": "icons/icon-128x128.png",
          "sizes": "128x128",
          "type": "image/png"
        },
        {
          "src": "icons/icon-144x144.png",
          "sizes": "144x144",
          "type": "image/png"
        },
        {
          "src": "icons/icon-152x152.png",
          "sizes": "152x152",
          "type": "image/png"
        },
        {
          "src": "icons/icon-192x192.png",
          "sizes": "192x192",
          "type": "image/png"
        },
        {
          "src": "icons/icon-256x256.png",
          "sizes": "256x256",
          "type": "image/png"
        },
        {
          "src": "icons/icon-384x384.png",
          "sizes": "384x384",
          "type": "image/png"
        },
        {
          "src": "icons/icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png"
        }
      ]
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: true,
      suppressWarnings: true,
      navigateFallbackAllowlist: [/^\/$/],
      type: 'module'
    }
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
    'nuxt-gtag',
    '@nuxtjs/turnstile',
    '@vite-pwa/nuxt'
  ]
})