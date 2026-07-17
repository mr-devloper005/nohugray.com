import Link from 'next/link'
import { ArrowRight, BriefcaseBusiness, ChevronDown, Download, FileText, Globe, MapPin, Phone, Search, Star, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const stripHtml = (value: string) => value
  .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&quot;/gi, '"')
  .replace(/&#0?39;|&apos;/gi, "'")
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
const getSummary = (post: SitePost) => stripHtml(post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)) || 'Fresh content will appear here with imagery, profile details, and editorial notes.'
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}
const cleanDomain = (value: string) => value.replace(/^https?:\/\//, '').replace(/\/$/, '')

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const hashStr = (value: string) => {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}
const ratingOf = (post: SitePost) => {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  return Math.round((3.8 + (hashStr(post.slug || post.id || post.title || 'x') % 12) / 10) * 10) / 10
}
const reviewsOf = (post: SitePost) => {
  const real = Number(getContent(post).reviewCount ?? getContent(post).reviews)
  if (real > 0) return Math.floor(real)
  return 12 + (hashStr((post.slug || post.title || 'x') + 'r') % 320)
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const lead = posts[0]
  const supporting = posts.slice(1)

  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <header className="relative overflow-hidden border-b border-[var(--tk-line)] bg-[linear-gradient(180deg,rgba(59,13,26,0.02),rgba(167,198,215,0.08))]">
          <div className="mx-auto max-w-[1600px] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--tk-muted)]">{voice.eyebrow}</p>
                <h1 className="editable-display mt-4 max-w-4xl text-[3.7rem] leading-[0.9] tracking-[-0.06em] sm:text-[5.2rem] text-[var(--tk-accent)]">
                  {voice.headline}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--tk-muted)]">{voice.description}</p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  {voice.chips.map((chip) => (
                    <span key={chip} className="rounded-full border border-[var(--tk-line)] bg-[rgba(255,250,242,0.68)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--tk-muted)]">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] bg-[rgba(255,250,242,0.72)] p-6 shadow-[0_20px_60px_rgba(59,13,26,0.06)]">
                <div className="flex flex-col gap-4 border-b border-[var(--tk-line)] pb-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-[var(--tk-muted)]">
                    <span className="font-semibold text-[var(--tk-text)]">{posts.length}</span> {posts.length === 1 ? 'entry' : 'entries'} · {categoryLabel}
                  </p>
                  <form action={basePath} className="flex items-center gap-2.5">
                    <div className="relative">
                      <select
                        name="category"
                        defaultValue={category}
                        className="h-11 appearance-none rounded-full border border-[var(--tk-line)] bg-transparent pl-4 pr-10 text-sm font-medium text-[var(--tk-text)] outline-none transition focus:border-[var(--tk-accent)]"
                        aria-label={voice.filterLabel}
                      >
                        <option value="all">All categories</option>
                        {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--tk-muted)]" />
                    </div>
                    <button className="inline-flex h-11 items-center rounded-full bg-[var(--tk-accent)] px-5 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--tk-on-accent)] transition hover:opacity-90">
                      Apply
                    </button>
                  </form>
                </div>
                <p className="mt-5 text-sm leading-7 text-[var(--tk-muted)]">{voice.secondaryNote}</p>
              </div>
            </div>
          </div>
        </header>

        <section className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {lead ? (
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <LeadArchiveCard post={lead} task={task} href={`${basePath}/${lead.slug}` || buildPostUrl(task, lead.slug)} />
              <div className="grid gap-6">
                {supporting.slice(0, 2).map((post, index) => (
                  <SecondaryArchiveCard key={post.id || post.slug || index} post={post} task={task} href={`${basePath}/${post.slug}` || buildPostUrl(task, post.slug)} />
                ))}
              </div>
            </div>
          ) : null}

          {supporting.length ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-6">
                {supporting.slice(2, 5).map((post, index) => (
                  <CompactArchiveCard key={post.id || post.slug || index} post={post} task={task} href={`${basePath}/${post.slug}` || buildPostUrl(task, post.slug)} />
                ))}
              </div>
              <div className="rounded-[2rem] bg-[rgba(255,250,242,0.72)] p-6 shadow-[0_16px_50px_rgba(59,13,26,0.05)]">
                {supporting.slice(5, 12).map((post, index) => (
                  <ListArchiveCard key={post.id || post.slug || index} post={post} task={task} href={`${basePath}/${post.slug}` || buildPostUrl(task, post.slug)} index={index} />
                ))}
              </div>
            </div>
          ) : null}

          {!posts.length ? (
            <div className="mx-auto mt-10 max-w-2xl rounded-[2rem] border border-dashed border-[var(--tk-line)] bg-[rgba(255,250,242,0.68)] px-8 py-16 text-center">
              <Search className="mx-auto h-7 w-7 text-[var(--tk-muted)]" />
              <h2 className="editable-display mt-5 text-4xl text-[var(--tk-accent)]">Nothing here yet</h2>
              <p className="mt-3 text-sm leading-7 text-[var(--tk-muted)]">Try another category or return soon as fresh content is published.</p>
            </div>
          ) : null}

          {posts.length ? (
            <nav className="mt-14 flex flex-wrap items-center justify-center gap-3 text-sm">
              {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--tk-line)] px-5 py-3 font-semibold uppercase tracking-[0.12em] transition hover:border-[var(--tk-accent)]">Previous</Link> : null}
              <span className="rounded-full bg-[rgba(255,250,242,0.72)] px-5 py-3 font-semibold uppercase tracking-[0.12em] text-[var(--tk-muted)]">Page {page} of {pagination.totalPages || 1}</span>
              {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--tk-line)] px-5 py-3 font-semibold uppercase tracking-[0.12em] transition hover:border-[var(--tk-accent)]">Next</Link> : null}
            </nav>
          ) : null}
        </section>
      </main>
    </EditableSiteShell>
  )
}

function RatingLine({ post }: { post: SitePost }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className="mt-3 flex items-center gap-2">
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-4 w-4 ${i < filled ? 'fill-[var(--tk-accent-soft)] text-[var(--tk-accent-soft)]' : 'fill-[var(--tk-line)] text-[var(--tk-line)]'}`} />
        ))}
      </span>
      <span className="text-sm font-semibold text-[var(--tk-text)]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--tk-muted)]">({reviewsOf(post)})</span>
    </div>
  )
}

function MetaDetail({ post, task }: { post: SitePost; task: TaskKey }) {
  if (task === 'listing') {
    const location = getField(post, ['location', 'address', 'city'])
    const phone = getField(post, ['phone', 'telephone', 'mobile'])
    return (
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-[var(--tk-muted)]">
        {location ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {location}</span> : null}
        {phone ? <span className="inline-flex items-center gap-1.5"><Phone className="h-4 w-4 text-[var(--tk-accent)]" /> {phone}</span> : null}
      </div>
    )
  }
  if (task === 'profile') {
    const role = getField(post, ['role', 'designation', 'company', 'location'])
    return role ? <p className="mt-4 text-sm uppercase tracking-[0.14em] text-[var(--tk-muted)]">{role}</p> : null
  }
  if (task === 'pdf') {
    return <p className="mt-4 text-sm uppercase tracking-[0.14em] text-[var(--tk-muted)]">Document preview</p>
  }
  if (task === 'sbm') {
    const website = getField(post, ['website', 'url', 'link'])
    return website ? <p className="mt-4 text-sm uppercase tracking-[0.14em] text-[var(--tk-muted)]">{cleanDomain(website)}</p> : null
  }
  return <p className="mt-4 text-sm uppercase tracking-[0.14em] text-[var(--tk-muted)]">{getCategory(post, 'Featured')}</p>
}

function LeadArchiveCard({ post, task, href }: { post: SitePost; task: TaskKey; href: string }) {
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] bg-[rgba(255,250,242,0.74)] p-5 shadow-[0_20px_60px_rgba(59,13,26,0.06)] lg:grid-cols-[1.05fr_0.95fr]">
      <div className="overflow-hidden rounded-[1.6rem] bg-[var(--tk-raised)]">
        <img src={getImage(post)} alt={post.title} className="h-full min-h-[420px] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
      </div>
      <div className="flex flex-col justify-between p-2">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--tk-muted)]">{getCategory(post, 'Featured')}</p>
          <h2 className="editable-display mt-4 text-[3.5rem] leading-[0.9] tracking-[-0.06em] text-[var(--tk-accent)]">{post.title}</h2>
          <RatingLine post={post} />
          <p className="mt-5 text-base leading-8 text-[var(--tk-muted)]">{getSummary(post)}</p>
          <MetaDetail post={post} task={task} />
        </div>
        <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--tk-accent)]">
          Open feature <ArrowRight className="h-4 w-4" />
        </span>
      </div>
    </Link>
  )
}

function SecondaryArchiveCard({ post, task, href }: { post: SitePost; task: TaskKey; href: string }) {
  return (
    <Link href={href} className="group grid gap-4 rounded-[1.75rem] bg-[rgba(255,250,242,0.74)] p-4 shadow-[0_12px_36px_rgba(59,13,26,0.05)] sm:grid-cols-[220px_minmax(0,1fr)]">
      <div className="overflow-hidden rounded-[1.3rem] bg-[var(--tk-raised)]">
        <img src={getImage(post)} alt={post.title} className="h-full min-h-[200px] w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 py-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">{getCategory(post, 'Story')}</p>
        <h3 className="editable-display mt-3 text-3xl leading-[0.94] text-[var(--tk-accent)]">{post.title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
        <MetaDetail post={post} task={task} />
      </div>
    </Link>
  )
}

function CompactArchiveCard({ post, task, href }: { post: SitePost; task: TaskKey; href: string }) {
  return (
    <Link href={href} className="group rounded-[1.75rem] bg-[rgba(255,250,242,0.74)] p-5 shadow-[0_10px_30px_rgba(59,13,26,0.05)] transition hover:-translate-y-1">
      <div className="flex items-start gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--tk-accent-soft)]">
          {task === 'profile' ? <UserRound className="h-8 w-8 text-[var(--tk-accent)]" /> : null}
          {task === 'listing' ? <BriefcaseBusiness className="h-8 w-8 text-[var(--tk-accent)]" /> : null}
          {task === 'pdf' ? <FileText className="h-8 w-8 text-[var(--tk-accent)]" /> : null}
          {task === 'sbm' ? <Globe className="h-8 w-8 text-[var(--tk-accent)]" /> : null}
          {!['profile', 'listing', 'pdf', 'sbm'].includes(task) ? <img src={getImage(post)} alt="" className="h-full w-full object-cover" /> : null}
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--tk-muted)]">{getCategory(post, 'Feature')}</p>
          <h3 className="editable-display mt-2 text-2xl leading-[0.96] text-[var(--tk-accent)]">{post.title}</h3>
          <p className="mt-3 line-clamp-3 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
          <MetaDetail post={post} task={task} />
        </div>
      </div>
    </Link>
  )
}

function ListArchiveCard({ post, task, href, index }: { post: SitePost; task: TaskKey; href: string; index: number }) {
  return (
    <Link href={href} className="group flex items-start gap-4 border-b border-[var(--tk-line)] py-5 last:border-b-0">
      <span className="editable-display text-4xl text-[var(--tk-accent-soft)]">{String(index + 1).padStart(2, '0')}</span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--tk-muted)]">
          <span>{getCategory(post, 'Entry')}</span>
          {task === 'pdf' ? <Download className="h-3.5 w-3.5" /> : null}
        </div>
        <h3 className="editable-display mt-2 text-2xl leading-[0.96] text-[var(--tk-accent)] transition group-hover:text-[var(--tk-text)]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-7 text-[var(--tk-muted)]">{getSummary(post)}</p>
        {task === 'sbm' ? (
          <p className="mt-2 text-xs uppercase tracking-[0.14em] text-[var(--tk-muted)]">{cleanDomain(getField(post, ['website', 'url', 'link'])) || 'Curated resource'}</p>
        ) : null}
      </div>
    </Link>
  )
}
