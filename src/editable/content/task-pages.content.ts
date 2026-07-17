import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  article: {
    eyebrow: 'Magazine',
    headline: 'Editorial reading with a softer, more luxurious rhythm.',
    description: 'Article pages should feel like a premium magazine section with space, hierarchy, and beautiful transitions between stories.',
    filterLabel: 'Choose article topic',
    secondaryNote: 'Reading surfaces need quiet hierarchy and clear progression.',
    chips: ['Editorial pacing', 'Long-form stories', 'Magazine flow'],
  },
  classified: {
    eyebrow: 'Selections',
    headline: 'Notices and offers arranged with a cleaner boutique rhythm.',
    description: 'Classified content should still scan quickly, but with more polish, calmer spacing, and stronger visual balance.',
    filterLabel: 'Filter category',
    secondaryNote: 'Keep urgency, but remove clutter.',
    chips: ['Quick scan', 'Refined actions', 'Current offers'],
  },
  sbm: {
    eyebrow: 'Resources',
    headline: 'Saved links presented like a curated library shelf.',
    description: 'Bookmarks should feel purposeful and neatly composed, with enough structure to make reference material pleasant to browse.',
    filterLabel: 'Filter collection',
    secondaryNote: 'Useful content benefits from quieter presentation.',
    chips: ['Collections', 'Reference links', 'Curated finds'],
  },
  profile: {
    eyebrow: 'Profiles',
    headline: 'Identity-led profiles with warmth, trust, and presence.',
    description: 'Profile pages should lead with portrait, role, and credibility cues so people and businesses feel distinctive at a glance.',
    filterLabel: 'Filter profiles',
    secondaryNote: 'Identity should arrive before dense metadata.',
    chips: ['Identity first', 'Business-ready', 'Personal presence'],
  },
  pdf: {
    eyebrow: 'Documents',
    headline: 'Guides and files arranged like a polished reference cabinet.',
    description: 'PDF pages should feel useful and premium, with clear preview moments and calm archival structure.',
    filterLabel: 'Filter documents',
    secondaryNote: 'Keep file utility while elevating presentation.',
    chips: ['Guides', 'Downloads', 'Reference archive'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'Business listings with editorial calm and practical detail.',
    description: 'Directory pages should make comparison, trust cues, and business essentials feel easy to scan without looking generic.',
    filterLabel: 'Filter business category',
    secondaryNote: 'Make discovery polished and direct.',
    chips: ['Business discovery', 'Trust signals', 'Practical detail'],
  },
  image: {
    eyebrow: 'Gallery',
    headline: 'Image-led browsing built like a premium collection wall.',
    description: 'Visual pages should prioritize photography, generous white space, and a gallery-first rhythm inspired by editorial commerce.',
    filterLabel: 'Filter visual category',
    secondaryNote: 'Let imagery set the pace.',
    chips: ['Visual-first', 'Collection mood', 'Editorial gallery'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
