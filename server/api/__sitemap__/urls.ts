import { defineSitemapEventHandler } from "#imports"
import type { SitemapUrlInput } from '#sitemap/types'
import { useAsyncData } from "nuxt/app"

export default defineEventHandler(async (event) => {
  const articles = await queryCollection(event, 'articles').all()

  const sitemapUrls: SitemapUrlInput[] = articles.map(
    (item: any) => ({
      loc: `${item.path}`
    })
  )

  return sitemapUrls
})
