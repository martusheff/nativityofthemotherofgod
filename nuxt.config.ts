// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({

  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/'],
    },
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
      send_page_view: false,
    },
    id: process.env.GA4ID
  },

  image: {
    provider: 'ipx',
    presets: {
      seo: {
        modifiers: {
          format: 'webp',
          quality: 80,
          width: 1200,
          fit: 'cover',
        },
      },
      mobile: {
        modifiers: {
          format: 'webp',
          quality: 80,
          width: 600,
          fit: 'cover',
        },
      },
    },
    placeholder: {
      modifiers: {
        format: 'webp',
        quality: 10,
        width: 100,
        blur: 5,
      },
    },
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
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
          "sizes": "72x72",
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

  // Centralized SEO configuration using @nuxtjs/seo
  site: {
    url: 'https://www.nmog.org',
    name: "Nativity of the Mother of God Russian Orthodox Church",
    description: "Worship at Nativity of the Mother of God Russian Orthodox Church in Woodburn, Oregon. Faithful services, traditional liturgy, and community fellowship.",
    defaultLocale: 'en',
  },

  // Use app.head for favicon and canonical links since @nuxtjs/seo doesn't handle them
  app: {
    head: {

      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://www.nmog.org' },
      ],
      meta: [
        { property: 'og:title', content: 'Nativity of the Mother of God Russian Orthodox Church' },
        { property: 'og:description', content: 'Old Rite Russian Orthodox Church in Woodburn, OR' },
        { property: 'og:image', content: 'https://www.nmog.org/icons/icon-512x512.png' },
        { property: 'og:url', content: 'https://www.nmog.org' },
        { property: 'og:type', content: 'website' },
      ]
    },
  },

  // Global SEO defaults - these will be used across all pages
  seo: {
    fallbackTitle: false, // Don't append site name to titles
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

  vite: {
    build: {
      target: 'esnext',
      minify: 'esbuild',
      rollupOptions: { treeshake: true },
    },
  },
  experimental: {
    treeshakeClientOnly: true,   // removes unused client-only code
    payloadExtraction: true,     // separates JSON payloads from JS
    renderJsonPayloads: true,
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
    "@nuxtjs/seo" // This should be last or near the end
  ]
})