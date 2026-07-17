import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Cormorant Garamond', Georgia, serif"
const BODY_FONT = "'Manrope', system-ui, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#f8f0e3',
  surface: 'rgba(255, 250, 242, 0.82)',
  raised: '#efe5d5',
  text: '#31111b',
  muted: '#7e6661',
  line: 'rgba(49, 17, 27, 0.12)',
  accent: '#3b0d1a',
  accentSoft: '#a7c6d7',
  onAccent: '#f9f0e3',
  glow: 'rgba(167,198,215,0.18)',
  radius: '1.6rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Magazine', note: 'Long reads and editorial storytelling with generous pace.' },
  listing: { ...base, kicker: 'Directory', note: 'Businesses presented through a polished, comparison-friendly layout.' },
  classified: { ...base, kicker: 'Selections', note: 'Offers and notices surfaced with boutique clarity.' },
  image: { ...base, kicker: 'Gallery', note: 'Visual stories arranged like a refined collection wall.' },
  sbm: { ...base, kicker: 'Resources', note: 'Curated references, links, and useful saves.' },
  pdf: { ...base, kicker: 'Documents', note: 'Files and guides housed in a premium reference library.' },
  profile: { ...base, kicker: 'Profiles', note: 'Identity-first pages with portrait, presence, and trust cues.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.article
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
