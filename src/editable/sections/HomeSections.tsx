import Link from 'next/link'
import { ArrowRight, ChevronRight, Heart, Search, Sparkles, Star } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditableExcerpt, getEditablePostImage, postHref, toPlainText } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8'

function dedupePosts(posts: SitePost[]) {
  return Array.from(new Map(posts.map((post) => [post.slug || post.id || post.title, post])).values())
}

function categoryOf(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Collection'
}

function cleanSummary(post?: SitePost | null, limit = 140) {
  const value = getEditableExcerpt(post, limit)
  return value || 'Explore a composed mix of imagery, profiles, and supporting editorial detail.'
}

function primaryTaskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

function HeroSplit({ leftImage, rightImage }: { leftImage: string; rightImage: string }) {
  return (
    <div className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2">
      <div className="relative min-h-[320px] overflow-hidden bg-[#ece5db]">
        <img src={leftImage} alt="" className="editorial-pan absolute inset-0 h-full w-full object-cover opacity-95" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,240,227,0.18),rgba(248,240,227,0.03))]" />
      </div>
      <div className="relative hidden overflow-hidden bg-[#f5eddc] lg:block">
        <img src={rightImage} alt="" className="editorial-pan absolute inset-0 h-full w-full object-cover opacity-90" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(248,240,227,0.08),rgba(248,240,227,0.2))]" />
      </div>
    </div>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroPosts = pool.slice(0, 8)
  const lead = heroPosts[0]
  const leftImage = getEditablePostImage(heroPosts[0])
  const rightImage = getEditablePostImage(heroPosts[1] || heroPosts[0])
  const title = pagesContent.home.hero.title?.join(' ') || `Discover ${SITE_CONFIG.name}`

  return (
    <section className="relative overflow-hidden bg-[#f7eedf]">
      <div className="relative min-h-[calc(100vh-84px)] overflow-hidden">
        <HeroSplit leftImage={leftImage} rightImage={rightImage} />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(59,13,26,0.03),rgba(59,13,26,0.08))]" />
        <div className={`${container} relative flex min-h-[calc(100vh-84px)] items-center justify-center py-16`}>
          <div className="max-w-[820px] text-center text-[#fff8ee]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#f4dfd0]">{pagesContent.home.hero.badge}</p>
            <h1 className="editable-display mt-6 text-[4.5rem] leading-[0.9] tracking-[-0.06em] text-[#fff8ee] sm:text-[6rem] lg:text-[8rem]">
              {title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#fff2e7] sm:text-lg">{pagesContent.home.hero.description}</p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href={pagesContent.home.hero.primaryCta.href} className="rounded-full border border-[#fff2e7] px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#fff8ee] transition hover:bg-[#fff8ee] hover:text-[#3b0d1a]">
                {pagesContent.home.hero.primaryCta.label}
              </Link>
              <Link href={pagesContent.home.hero.secondaryCta.href} className="rounded-full bg-[#a7c6d7] px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#35111a] transition hover:bg-[#c0d9e6]">
                {pagesContent.home.hero.secondaryCta.label}
              </Link>
            </div>

            <form action="/search" className="mx-auto mt-10 flex w-full max-w-xl items-center gap-3 rounded-full border border-white/35 bg-[rgba(255,248,238,0.14)] px-5 py-3 backdrop-blur-md">
              <Search className="h-5 w-5 shrink-0 text-[#fff8ee]" />
              <input
                name="q"
                placeholder={pagesContent.home.hero.searchPlaceholder}
                className="min-w-0 flex-1 bg-transparent text-sm text-[#fff8ee] outline-none placeholder:text-[#f1ddd0]"
              />
              <button className="rounded-full bg-[#fff8ee] px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#3b0d1a] transition hover:bg-[#f5e6d7]">
                Search
              </button>
            </form>
          </div>
        </div>

        {lead ? (
          <Link
            href={postHref(primaryTask, lead, primaryRoute)}
            className="absolute bottom-6 right-4 hidden max-w-sm rounded-[1.75rem] border border-white/15 bg-[rgba(59,13,26,0.9)] p-5 text-[#fff6ee] shadow-[0_20px_60px_rgba(20,4,10,0.25)] backdrop-blur md:block"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#a7c6d7]">Now showing</p>
            <h2 className="editable-display mt-3 text-3xl leading-[0.95]">{lead.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#efdcd0]">{cleanSummary(lead, 110)}</p>
            <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#a7c6d7]">
              Open story <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        ) : null}
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 4)
  if (!pool.length) return null

  return (
    <section className="bg-[#fbf4ea] py-16 sm:py-20">
      <div className={container}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7f6263]">Pastai collection mood</p>
            <h2 className="editable-display mt-2 text-5xl leading-[0.92] text-[#3b0d1a] sm:text-6xl">Curated highlights</h2>
          </div>
          <Link href={primaryRoute} className="inline-flex items-center rounded-full border border-[#3b0d1a] px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#3b0d1a] transition hover:bg-[#3b0d1a] hover:text-[#fff8ee]">
            Discover the collection
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-4">
          {pool.map((post, index) => (
            <Link
              key={post.id || post.slug || index}
              href={postHref(primaryTask, post, primaryRoute)}
              className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-[2rem] bg-[#f4ead9] p-6 shadow-[0_12px_40px_rgba(59,13,26,0.06)] transition duration-500 hover:-translate-y-1.5"
            >
              <span className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full bg-[#a7c6d7] text-[#3b0d1a]">
                <Heart className="h-4 w-4" />
              </span>
              <div className="relative mt-10 flex flex-1 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[#f7efdf]">
                <img src={getEditablePostImage(post)} alt={post.title} className="h-[260px] w-full object-contain transition duration-500 group-hover:scale-105" />
              </div>
              <div className="pt-6 text-center">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#7e6661]">{categoryOf(post)}</p>
                <h3 className="mt-3 text-lg font-semibold uppercase tracking-[0.04em] text-[#3b0d1a]">{post.title}</h3>
                <p className="mt-2 text-sm text-[#8f6e63]">{index % 2 === 0 ? 'Featured selection' : 'Recent addition'}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function WordPanel({ text, className }: { text: string; className: string }) {
  return <div className={`editable-display text-[4rem] leading-[0.88] tracking-[-0.06em] text-[#a7c6d7] sm:text-[5.8rem] lg:text-[7rem] ${className}`}>{text}</div>
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const center = pool[1] || pool[0]
  const sideOne = pool[2] || pool[0]
  const sideTwo = pool[3] || pool[1] || pool[0]
  if (!center) return null

  return (
    <section className="overflow-hidden bg-[#3b0d1a] py-16 text-[#dbe8ef] sm:py-20">
      <div className={`${container} relative`}>
        <div className="mb-12 flex items-center justify-center">
          <Link href={primaryRoute} className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#d1e3ec]">
            {primaryTaskLabel(primaryTask)}
          </Link>
        </div>

        <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_460px_1fr]">
          <div className="space-y-14">
            <WordPanel text="Intimate" className="lg:text-right" />
            <WordPanel text="Playful" className="lg:pl-8" />
          </div>

          <Link href={postHref(primaryTask, center, primaryRoute)} className="group relative mx-auto block w-full max-w-[460px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-3">
            <div className="overflow-hidden rounded-[1.6rem] bg-[#f8f0e3]">
              <img src={getEditablePostImage(center)} alt={center.title} className="h-[620px] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
            </div>
          </Link>

          <div className="space-y-14">
            <WordPanel text="Essential" className="text-left" />
            <Link href={postHref(primaryTask, sideOne, primaryRoute)} className="block rounded-[2rem] border border-white/10 bg-white/5 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a7c6d7]">{categoryOf(sideOne)}</p>
              <h3 className="editable-display mt-3 text-3xl text-[#fff7ef]">{sideOne.title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#ddcfc6]">{cleanSummary(sideOne, 120)}</p>
            </Link>
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {[sideOne, sideTwo].map((post, index) => (
            <Link key={post.slug || post.id || index} href={postHref(primaryTask, post, primaryRoute)} className="rounded-[1.75rem] border border-white/10 bg-white/5 p-5 transition hover:bg-white/10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a7c6d7]">Editorial note {index + 1}</p>
              <h3 className="editable-display mt-3 text-2xl text-[#fff7ef]">{post.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedEditorialCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="overflow-hidden rounded-[2rem] bg-[#e8dfd0]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full min-h-[420px] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-col justify-between rounded-[2rem] bg-[rgba(255,250,242,0.76)] p-7 shadow-[0_12px_36px_rgba(59,13,26,0.06)]">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8f6c67]">Featured story</p>
          <h3 className="editable-display mt-4 text-5xl leading-[0.9] text-[#3b0d1a]">{post.title}</h3>
          <p className="mt-5 text-base leading-8 text-[#735b59]">{cleanSummary(post, 220)}</p>
        </div>
        <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[#3b0d1a]">
          Read feature <ChevronRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function HorizontalCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group grid gap-4 rounded-[1.75rem] bg-[rgba(255,250,242,0.8)] p-4 shadow-[0_8px_28px_rgba(59,13,26,0.06)] sm:grid-cols-[220px_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-[1.25rem] bg-[#eadfce]">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-full min-h-[180px] w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 py-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8f6c67]">{categoryOf(post)}</p>
        <h3 className="editable-display mt-2 text-3xl leading-[0.95] text-[#3b0d1a]">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#705956]">{cleanSummary(post, 160)}</p>
      </div>
    </Link>
  )
}

function CompactCard({ post, href, label }: { post: SitePost; href: string; label: string }) {
  return (
    <Link href={href} className="group rounded-[1.5rem] border border-[rgba(59,13,26,0.1)] bg-[rgba(255,250,242,0.72)] p-5 transition hover:-translate-y-1">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f6c67]">{label}</p>
      <h3 className="editable-display mt-3 text-2xl leading-[0.98] text-[#3b0d1a]">{post.title}</h3>
      <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#765f5a]">{cleanSummary(post, 120)}</p>
    </Link>
  )
}

function ImageFirstCard({ post, href }: { post: SitePost; href: string }) {
  return (
    <Link href={href} className="group overflow-hidden rounded-[1.75rem] bg-[rgba(255,250,242,0.82)] shadow-[0_12px_32px_rgba(59,13,26,0.05)]">
      <div className="overflow-hidden">
        <img src={getEditablePostImage(post)} alt={post.title} className="h-[300px] w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
      </div>
      <div className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f6c67]">{categoryOf(post)}</p>
        <h3 className="editable-display mt-3 text-3xl leading-[0.94] text-[#3b0d1a]">{post.title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#735c58]">{cleanSummary(post, 130)}</p>
      </div>
    </Link>
  )
}

function ListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className="group flex items-start gap-4 border-b border-[rgba(59,13,26,0.12)] py-5">
      <span className="editable-display text-4xl text-[#a7c6d7]">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8f6c67]">{categoryOf(post)}</p>
        <h3 className="editable-display mt-2 text-2xl leading-[0.96] text-[#3b0d1a] transition group-hover:text-[#5c2434]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-7 text-[#725a56]">{cleanSummary(post, 105)}</p>
      </div>
    </Link>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections = timeSections.length > 0 ? timeSections : [{ key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute }]
  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const lead = section.posts[0]
        const secondary = section.posts[1]
        const tertiary = section.posts[2]
        const list = section.posts.slice(3, 7)
        const background = index % 2 === 0 ? 'bg-[#f7eedf]' : 'bg-[#f3e7d6]'
        if (!lead) return null

        return (
          <section key={section.key} className={`${background} py-16 sm:py-20`}>
            <div className={container}>
              <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#8d6b66]">
                    <Sparkles className="h-4 w-4 text-[#a7c6d7]" /> {toPlainText(section.key).replace(/^\w/, (value) => value.toUpperCase()) || 'Curated'}
                  </p>
                  <h2 className="editable-display mt-3 text-5xl leading-[0.92] text-[#3b0d1a] sm:text-6xl">Magazine selection</h2>
                </div>
                <Link href={section.href || primaryRoute} className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#3b0d1a]">
                  View all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <FeaturedEditorialCard post={lead} href={postHref(primaryTask, lead, primaryRoute)} />
                <div className="grid gap-6">
                  {secondary ? <ImageFirstCard post={secondary} href={postHref(primaryTask, secondary, primaryRoute)} /> : null}
                  {tertiary ? <CompactCard post={tertiary} href={postHref(primaryTask, tertiary, primaryRoute)} label="Compact feature" /> : null}
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                {secondary ? <HorizontalCard post={secondary} href={postHref(primaryTask, secondary, primaryRoute)} /> : <div />}
                <div className="rounded-[1.75rem] bg-[rgba(255,250,242,0.78)] px-6 py-3 shadow-[0_8px_28px_rgba(59,13,26,0.05)]">
                  {list.length ? list.map((post, listIndex) => (
                    <ListCard key={post.id || post.slug || listIndex} post={post} href={postHref(primaryTask, post, primaryRoute)} index={listIndex} />
                  )) : (
                    <div className="py-8 text-sm text-[#765e5b]">More stories will appear here as new content is published.</div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}

export function EditableHomeCta() {
  return (
    <section id="get-app" className="bg-[#f9f1e4] py-20">
      <div className={`${container} text-center`}>
        <div className="mx-auto max-w-5xl rounded-[2.25rem] border border-[rgba(59,13,26,0.1)] bg-[linear-gradient(135deg,rgba(255,250,242,0.9),rgba(167,198,215,0.5))] px-6 py-14 shadow-[0_20px_70px_rgba(59,13,26,0.08)] sm:px-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#7c6260]">{pagesContent.home.cta.badge}</p>
          <h2 className="editable-display mt-4 text-5xl leading-[0.92] text-[#3b0d1a] sm:text-6xl">{pagesContent.home.cta.title}</h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#705956]">{pagesContent.home.cta.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href={pagesContent.home.cta.primaryCta.href} className="rounded-full bg-[#3b0d1a] px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#fff8ee] transition hover:bg-[#5c2434]">
              {pagesContent.home.cta.primaryCta.label}
            </Link>
            <Link href={pagesContent.home.cta.secondaryCta.href} className="rounded-full border border-[#3b0d1a] px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#3b0d1a] transition hover:bg-[#3b0d1a] hover:text-[#fff8ee]">
              {pagesContent.home.cta.secondaryCta.label}
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-[#705956]">
            <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-[#a7c6d7] text-[#a7c6d7]" /> Visual-first publishing</span>
            <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-[#a7c6d7] text-[#a7c6d7]" /> Premium profile presentation</span>
            <span className="inline-flex items-center gap-2"><Star className="h-4 w-4 fill-[#a7c6d7] text-[#a7c6d7]" /> Smooth editorial discovery</span>
          </div>
        </div>
      </div>
    </section>
  )
}
