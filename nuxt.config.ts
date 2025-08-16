// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  app: {
    head: {
      title: 'Nativity of the Mother of God', // Default site title
      htmlAttrs: {
        lang: 'en', // Set language for accessibility and SEO
      },
      meta: [
        { charset: 'utf-8' }, // Ensure charset is explicitly set
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }, // Ensure responsive viewport
        { name: 'description', content: 'ROCOR Old Rite Russian Orthodox Church in Woodburn, OR' }, // Default meta description
        { name: 'keywords', content: 'Russian Orthodox Church, Nativity of the Mother of God, ROCOR, Old Rite, Woodburn, Oregon' }, // Relevant keywords
        { property: 'og:site_name', content: 'Nativityhalbof the Mother of God' }, // Open Graph site name
        { property: 'og:type', content: 'website' }, // Open Graph type
        { property: 'og:image', content: 'https://www.nmog.org/icons/icon-512x512.png' }, // Default social image
        { name: 'twitter:card', content: 'summary_large_image' }, // Twitter card type
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }, // Favicon
        { rel: 'canonical', href: 'https://www.nmog.org' }, // Canonical URL for the homepage
      ],
    },
  },

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
    config: {
      send_page_view: true,
    },
    id: process.env.GA4ID
  },

  image: {
    provider: 'ipx', // Use Nuxt's default provider for optimization
    presets: {
      seo: {
        modifiers: {
          format: 'webp', // Use WebP for faster loading
          quality: 80, // Balance quality and size
          width: 1200, // Optimize for typical display sizes
        },
      },
    },
  },

  turnstile: {
    siteKey: process.env.TURNSTYLE_SITEKEY,
  },

  runtimeConfig: {
    resendApiKey: process.env.RESEND_API_KEY,
    stripeDonationWebhookSecretKey: process.env.STRIPE_DONATION_WEBHOOK_SECRET_KEY,
    turnstile: {
      secretKey: process.env.TURNSTYLE_SECRETKEY,
    },
    public: {
      web3FormsAccessKey: process.env.WEB3_FORMS_ACCESS_KEY,
    }
  },

  stripe: {
    server: {
      key: process.env.STRIPE_SECRET_KEY,
      options: {},
    },
    client: {
      key: process.env.STRIPE_PUBLIC_KEY,
      options: {},
    },
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
        },
        {
          src: 'icons/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable'
        },
        {
          src: 'icons/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
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

  site: {
    url: 'https://www.nmog.org',
    name: 'Russian Orthodox Church of the Nativity of the Mother of God',
    description: 'ROCOR Old Rite Russian Orthodox Church in Woodburn, OR',
    indexable: true,
    defaultLocale: 'en',
  },

  sitemap: {
    sources: [
      '/api/__sitemap__/urls',
    ]
  },

  robots: {
    enabled: true,
    allow: ['/'],
    sitemap: 'https://www.nmog.org/sitemap.xml',
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
    '@vite-pwa/nuxt',
    '@pinia/nuxt',
    "@unlok-co/nuxt-stripe",
    "@nuxtjs/sitemap",
    "@nuxtjs/robots",
    "@nuxtjs/seo"
  ]
})