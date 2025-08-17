<script setup lang="ts">
import Divider from '../components/divider.vue';

// Set up SEO meta tags for the homepage
useSeoMeta({
  title: 'Nativity of the Mother of God Russian Orthodox Church | Woodburn, OR',
  description: 'ROCOR Old Rite Russian Orthodox Church in Woodburn, OR. Faithful services, traditional liturgy, and community fellowship.',
  keywords: 'Russian Orthodox Church, Nativity of the Mother of God, ROCOR, Old Rite, Woodburn, Oregon',
  
  // Open Graph tags for social media and Google
  ogTitle: 'Nativity of the Mother of God Russian Orthodox Church',
  ogDescription: 'ROCOR Old Rite Russian Orthodox Church in Woodburn, OR',
  ogImage: 'https://www.nmog.org/icons/icon-512x512.png',
  ogImageAlt: 'Nativity of the Mother of God Church Icon',
  ogImageWidth: 512,
  ogImageHeight: 512,
  ogUrl: 'https://www.nmog.org',
  ogSiteName: 'Nativity of the Mother of God',
  ogType: 'website',  
})

// Set structured data for Google
useSchemaOrg([
  defineOrganization({
    name: 'Nativity of the Mother of God Russian Orthodox Church',
    url: 'https://www.nmog.org',
    logo: 'https://www.nmog.org/icons/icon-512x512.png',
    description: 'ROCOR Old Rite Russian Orthodox Church in Woodburn, OR',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Woodburn',
      addressRegion: 'OR',
      addressCountry: 'US'
    },
    sameAs: [
      "https://www.instagram.com/nativityofthemotherofgod",
      "https://www.facebook.com/rocnmog"
    ]
  })
])
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-stone-50 py-0 flex flex-col gap-8">
    <HeroHome />
    <CtaHorizontal title="Want to Visit?"
      subtitle="While our parish is still in its early stages, we are open to visitors. Please contact us in advance if you'd like to visit a service, or follow the link to learn more about what to expect during your visit."
      primarylabel="Contact" primaryurl="/contact" />
    <Timeline :expanded="false" />
    <Events />
    <About />
    <Articles />
    <div class="w-full max-w-8xl mx-auto md:px-8 py-12">
      <Divider size="text-6xl" iconSize="w-14 h-14" class="md:mt-4 mb-14 " />
    </div>
  </div>
</template>

<style scoped></style>