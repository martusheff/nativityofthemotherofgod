import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    pages: defineCollection({
      type: 'page',
      source: 'pages/*.md',
      schema: z.object({
        title: z.string(),
        subTitle: z.string(),
        description: z.string(),
        heroImage: z.string().optional(),
        heroImageDescription: z.string().optional(),
        heroPrimaryCTALabel: z.string().optional(),
        heroPrimaryCTAURL: z.string().optional(),
        heroSecondaryCTALabel: z.string().optional(),
        heroSecondaryCTAURL: z.string().optional(),
      })
    })
  }
})
