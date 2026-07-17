import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Luxury editorial imagery and profile discovery',
      description: 'Explore image-led stories, profiles, and refined editorial content through a premium visual experience.',
      openGraphTitle: 'Luxury editorial imagery and profile discovery',
      openGraphDescription: 'Discover visual posts, profiles, and editorial collections through a polished magazine-inspired interface.',
      keywords: ['editorial gallery', 'profile discovery', 'image stories', 'luxury visual website'],
    },
    hero: {
      badge: 'Curated arrivals',
      title: ['Everyday visual stories for', 'playful brands and polished profiles.'],
      description: 'A refined home for image-led discovery, personality-rich profiles, and editorial content that feels composed rather than crowded.',
      primaryCta: { label: 'Discover our world', href: '/image' },
      secondaryCta: { label: 'Read the magazine', href: '/article' },
      searchPlaceholder: 'Search stories, profiles, categories, and collections',
      focusLabel: 'Focus',
      featureCardBadge: 'cover direction',
      featureCardTitle: 'A homepage that opens like a modern editorial spread.',
      featureCardDescription: 'Large photography, airy pacing, and contrasting cream, burgundy, and powder-blue surfaces keep the experience distinctive.',
    },
    intro: {
      badge: 'House perspective',
      title: 'Built to showcase images, people, and public-facing stories with poise.',
      paragraphs: [
        'This site brings together image-first browsing, identity-focused profiles, and magazine-style storytelling in one connected surface.',
        'The layout is designed to feel composed and premium, giving each section room to breathe while still keeping discovery easy.',
        'Visitors can move naturally between visual inspiration, featured people, and supporting content without losing the sense of one clear brand world.',
      ],
      sideBadge: 'In the mix',
      sidePoints: [
        'Image-led landing layout with large editorial photography.',
        'Profile and archive pages shaped like a magazine, not a template.',
        'Varied cards for featured, compact, horizontal, list, and image-first stories.',
        'Warm, premium styling tuned for business-facing public websites.',
      ],
      primaryLink: { label: 'Browse visuals', href: '/image' },
      secondaryLink: { label: 'Meet profiles', href: '/profile' },
    },
    cta: {
      badge: 'Keep exploring',
      title: 'Move from visual discovery to profiles, resources, and editorial reading in one calm flow.',
      description: 'Every active section stays connected through one premium system, so businesses can present content with clarity and personality.',
      primaryCta: { label: 'Browse images', href: '/image' },
      secondaryCta: { label: 'Contact us', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest {label}',
      descriptionSuffix: 'Browse the newest posts in this section.',
    },
  },
  about: {
    badge: 'Our Approach',
    title: 'A more refined way to present stories, images, and profiles.',
    description: `${slot4BrandConfig.siteName} is designed for businesses that want public-facing content to feel polished, distinctive, and easy to browse.`,
    paragraphs: [
      'The experience balances editorial calm with practical discovery so visitors can move between categories without friction.',
      'Large visuals, quieter typography, and varied card layouts help each type of content feel intentional instead of repetitive.',
    ],
    values: [
      {
        title: 'Visual confidence',
        description: 'The interface gives images and profile moments enough space to carry attention without overpowering the page.',
      },
      {
        title: 'Connected discovery',
        description: 'Profiles, visual posts, articles, and resources stay linked through one consistent navigation and browsing rhythm.',
      },
      {
        title: 'Public-ready polish',
        description: 'Every surface is tuned for a business-facing audience that values clarity, trust, and presentation.',
      },
    ],
  },
  contact: {
    eyebrow: `Contact ${slot4BrandConfig.siteName}`,
    title: 'Start the conversation through a contact page that feels part of the brand world.',
    description: 'Share what you are launching, refining, or publishing and we will help guide the next step.',
    formTitle: 'Send a message',
  },
  search: {
    metadata: {
      title: 'Search',
      description: 'Search stories, profiles, images, and resources across the site.',
    },
    hero: {
      badge: 'Search the collection',
      title: 'Find stories, profiles, and visuals without losing the editorial feel.',
      description: 'Use keywords, categories, and active sections to surface the posts that matter most.',
      placeholder: 'Search by keyword, title, topic, or category',
    },
    resultsTitle: 'Search results',
  },
  create: {
    metadata: {
      title: 'Create',
      description: 'Create and submit new content for the site.',
    },
    locked: {
      badge: 'Creator access',
      title: 'Login to open the publishing workspace.',
      description: 'Use your account to create image posts, profiles, and supporting content for the active sections of the site.',
    },
    hero: {
      badge: 'Publishing workspace',
      title: 'Create content that fits the editorial system.',
      description: 'Choose a content type, add details, and prepare a polished entry with text, imagery, and supporting metadata.',
    },
    formTitle: 'Content details',
    submitLabel: 'Submit content',
    successTitle: 'Content submitted successfully.',
  },
  auth: {
    login: {
      metadataDescription: 'Login page for this site.',
      badge: 'Member access',
      title: 'Welcome back to your publishing space.',
      description: 'Login to continue managing submissions, profiles, and public-facing content.',
      formTitle: 'Login',
      submitLabel: 'Continue',
      noAccount: 'No account matched these details. Create an account first, then login.',
      success: 'Login successful. Redirecting...',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Signup page for this site.',
      badge: 'Site access',
      title: 'Create your account and start publishing.',
      description: 'Create an account to access the workspace, save your details, and submit content through the site.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters for the password.',
      success: 'Account created successfully. Redirecting...',
      loginCta: 'Login',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'Related articles',
      fallbackTitle: 'Article details',
    },
    listing: {
      relatedTitle: 'Related listings',
      fallbackTitle: 'Listing details',
    },
    image: {
      relatedTitle: 'Related visuals',
      fallbackTitle: 'Image details',
    },
    profile: {
      relatedTitle: 'Suggested profiles',
      fallbackDescription: 'Profile details will appear here once available.',
      visitButton: 'Visit site',
    },
  },
} as const
