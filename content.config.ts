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
    }),
    articles: defineCollection({
      type: "page",
      source: 'articles/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string(),
        date: z.date(),
        image: z.string(),
        signature: z.string()
      })
    }),
    events: defineCollection({
      type: "data",
      source: "events/*.json",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date()
      })
    }),
    timeline: defineCollection({
      type: "data",
      source: "timeline/*.json",
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date()
      })
    })
  }
})
