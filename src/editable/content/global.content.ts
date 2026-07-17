import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'Refined visual stories and profiles',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'Image and profile stories, edited with clarity',
    primaryLinks: [
      { label: 'Shop', href: '/image' },
      { label: 'About', href: '/about' },
      { label: 'Magazine', href: '/article' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Discover the collection', href: '/image' },
      secondary: { label: 'View profiles', href: '/profile' },
    },
  },
  footer: {
    tagline: 'An editorial home for imagery, profiles, and considered discovery.',
    description: 'Browse image-led stories, featured profiles, and curated pages through a calm luxury editorial system designed for modern businesses.',
    columns: [
      {
        title: 'Shop',
        links: [
          { label: 'All imagery', href: '/image' },
          { label: 'Featured stories', href: '/article' },
          { label: 'Latest magazine', href: '/article' },
          { label: 'Guides', href: '/pdf' },
        ],
      },
      {
        title: 'Our World',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
          { label: 'Resources', href: '/sbm' },
        ],
      },
    ],
    bottomNote: 'Thoughtful presentation for public-facing business content.',
  },
  commonLabels: {
    readMore: 'Read more',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Latest',
    related: 'Related',
    published: 'Published',
  },
} as const
