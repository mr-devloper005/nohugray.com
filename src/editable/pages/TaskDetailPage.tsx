import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, Bookmark, Building2, Camera, Download, ExternalLink, FileText, Mail, MapPin, Phone, Star, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { taskThemeStyle } from '@/editable/theme/task-themes'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value
  .replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)

const linkifyText = (value: string) => linkifyMarkdown(value)
  .replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)

const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})

const sanitizeHtml = (html: string) => hardenLinks(html
  .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
  .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
  .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value
    .split(/\n{2,}/)
    .map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`)
    .join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  return lead && lead !== stripHtml(getBody(post)) ? lead : ''
}
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
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

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        <section className="border-b border-[var(--tk-line)] bg-[linear-gradient(180deg,rgba(59,13,26,0.02),rgba(167,198,215,0.08))]">
          <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
            <BackLink task={task} />
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--tk-muted)]">{categoryOf(post, getTaskConfig(task)?.label || 'Story')}</p>
                <h1 className="editable-display max-w-4xl text-[3.6rem] leading-[0.9] tracking-[-0.06em] text-[var(--tk-accent)] sm:text-[5.2rem]">{post.title}</h1>
                <DetailMeta post={post} category={categoryOf(post, getTaskConfig(task)?.label || task)} />
                {leadText(post) ? <p className="max-w-2xl text-base leading-8 text-[var(--tk-muted)]">{leadText(post)}</p> : null}
                <QuickFacts task={task} post={post} />
              </div>
              <CoverPanel task={task} post={post} />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
            <article className="min-w-0 rounded-[2rem] bg-[rgba(255,250,242,0.74)] p-6 shadow-[0_18px_55px_rgba(59,13,26,0.06)] sm:p-8">
              {task === 'image' ? <GalleryMasonry images={getImages(post)} /> : null}
              {task !== 'image' && getImages(post)[0] ? (
                <img src={getImages(post)[0]} alt={post.title} className="mb-8 aspect-[16/9] w-full rounded-[1.6rem] object-cover" />
              ) : null}
              <BodyContent post={post} compact={task === 'image'} />
              {task === 'article' ? <EditableArticleComments slug={post.slug} comments={comments} /> : null}
              {task !== 'image' ? <ImageStrip images={getImages(post).slice(1)} label="Additional visuals" /> : null}
            </article>

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <ActionPanel task={task} post={post} />
              {task === 'listing' && mapSrcFor(post) ? <MapBox src={mapSrcFor(post)} label={getField(post, ['address', 'location', 'city']) || post.title} /> : null}
              <RelatedPanel task={task} post={post} related={related} />
            </aside>
          </div>
        </section>

        <RelatedStrip task={task} related={related} />
      </main>
    </EditableSiteShell>
  )
}

function DetailMeta({ post, category }: { post: SitePost; category?: string }) {
  const rating = ratingOf(post)
  const filled = Math.round(rating)
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      <span className="inline-flex items-center gap-[3px]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-[18px] w-[18px] ${i < filled ? 'fill-[var(--tk-accent-soft)] text-[var(--tk-accent-soft)]' : 'fill-[var(--tk-line)] text-[var(--tk-line)]'}`} />
        ))}
      </span>
      <span className="text-sm font-semibold text-[var(--tk-text)]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--tk-muted)]">{reviewsOf(post)} reviews</span>
      {category ? (
        <>
          <span className="h-1 w-1 rounded-full bg-[var(--tk-muted)] opacity-50" />
          <span className="text-sm text-[var(--tk-muted)]">{category}</span>
        </>
      ) : null}
    </div>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)] transition hover:text-[var(--tk-text)]">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function QuickFacts({ task, post }: { task: TaskKey; post: SitePost }) {
  const facts: Array<{ label: string; value: string }> = []
  if (task === 'listing') {
    facts.push({ label: 'Location', value: getField(post, ['address', 'location', 'city']) })
    facts.push({ label: 'Phone', value: getField(post, ['phone', 'telephone', 'mobile']) })
    facts.push({ label: 'Website', value: getField(post, ['website', 'url']) })
  }
  if (task === 'profile') {
    facts.push({ label: 'Role', value: getField(post, ['role', 'designation', 'company']) })
    facts.push({ label: 'Location', value: getField(post, ['location', 'city']) })
  }
  if (task === 'classified') {
    facts.push({ label: 'Price', value: getField(post, ['price', 'amount', 'budget']) })
    facts.push({ label: 'Condition', value: getField(post, ['condition', 'availability', 'type']) })
  }
  if (task === 'pdf') {
    facts.push({ label: 'Format', value: categoryOf(post, 'Document') })
  }
  const visible = facts.filter((fact) => fact.value)
  if (!visible.length) return null

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {visible.map((fact) => (
        <div key={fact.label} className="rounded-[1.4rem] border border-[var(--tk-line)] bg-[rgba(255,250,242,0.65)] px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--tk-muted)]">{fact.label}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--tk-text)]">{fact.value}</p>
        </div>
      ))}
    </div>
  )
}

function CoverPanel({ task, post }: { task: TaskKey; post: SitePost }) {
  const images = getImages(post)
  const image = images[0]
  const role = getField(post, ['role', 'designation', 'company'])
  const file = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])

  if (task === 'profile') {
    return (
      <div className="rounded-[2rem] bg-[#3b0d1a] p-8 text-center text-[#fff7ef] shadow-[0_20px_70px_rgba(59,13,26,0.2)]">
        <div className="mx-auto flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/10">
          {image ? <img src={image} alt={post.title} className="h-full w-full object-cover" /> : <UserRound className="h-14 w-14 text-[#a7c6d7]" />}
        </div>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a7c6d7]">{role || 'Featured profile'}</p>
      </div>
    )
  }

  if (task === 'pdf') {
    return (
      <div className="rounded-[2rem] bg-[#3b0d1a] p-8 text-[#fff7ef] shadow-[0_20px_70px_rgba(59,13,26,0.2)]">
        <div className="flex h-24 w-24 items-center justify-center rounded-[1.5rem] bg-[#a7c6d7] text-[#3b0d1a]">
          <FileText className="h-10 w-10" />
        </div>
        <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#a7c6d7]">Document preview</p>
        {file ? <p className="mt-3 text-sm leading-7 text-[#e9dbcf]">Open the full file from the action panel to review or download.</p> : null}
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[2rem] bg-[rgba(255,250,242,0.72)] p-3 shadow-[0_18px_55px_rgba(59,13,26,0.06)]">
      <div className="overflow-hidden rounded-[1.6rem] bg-[var(--tk-raised)]">
        {image ? (
          <img src={image} alt={post.title} className="h-[460px] w-full object-cover" />
        ) : (
          <div className="flex h-[460px] items-center justify-center text-[var(--tk-muted)]">
            {task === 'listing' ? <Building2 className="h-14 w-14" /> : null}
            {task === 'image' ? <Camera className="h-14 w-14" /> : null}
            {task === 'sbm' ? <Bookmark className="h-14 w-14" /> : null}
            {task === 'classified' ? <Tag className="h-14 w-14" /> : null}
            {!['listing', 'image', 'sbm', 'classified'].includes(task) ? <FileText className="h-14 w-14" /> : null}
          </div>
        )}
      </div>
    </div>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return (
    <div
      className={`article-content max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-8'}`}
      dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }}
    />
  )
}

function GalleryMasonry({ images }: { images: string[] }) {
  const gallery = images.length ? images : ['/placeholder.svg?height=900&width=1200']
  return (
    <div className="mb-8 columns-1 gap-4 [column-fill:_balance] sm:columns-2">
      {gallery.map((image, index) => (
        <figure key={`${image}-${index}`} className="mb-4 break-inside-avoid overflow-hidden rounded-[1.5rem]">
          <img src={image} alt="" className="w-full object-cover" />
        </figure>
      ))}
    </div>
  )
}

function ImageStrip({ images, label }: { images: string[]; label: string }) {
  if (!images.length) return null
  return (
    <section className="mt-10">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">{label}</p>
      <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-4">
        {images.slice(0, 8).map((image, index) => (
          <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.2rem] object-cover" />
        ))}
      </div>
    </section>
  )
}

function ActionPanel({ task, post }: { task: TaskKey; post: SitePost }) {
  const website = getField(post, ['website', 'url', 'link'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  const primaryHref = task === 'pdf' ? fileUrl : website
  const primaryLabel = task === 'pdf' ? 'Download file' : 'Visit website'

  return (
    <div className="rounded-[2rem] bg-[rgba(255,250,242,0.74)] p-6 shadow-[0_16px_50px_rgba(59,13,26,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">Quick actions</p>
      <div className="mt-5 grid gap-3">
        {primaryHref ? (
          <Link href={primaryHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--tk-on-accent)] transition hover:opacity-90">
            {primaryLabel} {task === 'pdf' ? <Download className="h-4 w-4" /> : <ExternalLink className="h-4 w-4" />}
          </Link>
        ) : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--tk-text)] transition hover:border-[var(--tk-accent)]"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--tk-text)] transition hover:border-[var(--tk-accent)]"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] bg-[rgba(255,250,242,0.74)] shadow-[0_16px_50px_rgba(59,13,26,0.05)]">
      <div className="flex items-center gap-2 p-5 text-sm font-semibold"><MapPin className="h-4 w-4 text-[var(--tk-accent)]" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-72 w-full border-0" />
    </div>
  )
}

function RelatedPanel({ task, post, related }: { task: TaskKey; post: SitePost; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] bg-[rgba(255,250,242,0.74)] p-6 shadow-[0_16px_50px_rgba(59,13,26,0.05)]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--tk-muted)]">About this page</p>
        <div className="mt-4 grid gap-3 text-sm text-[var(--tk-muted)]">
          <p className="inline-flex items-center gap-2"><Tag className="h-4 w-4 text-[var(--tk-accent)]" /> {categoryOf(post, taskConfig?.label || task)}</p>
          <p className="inline-flex items-center gap-2"><Building2 className="h-4 w-4 text-[var(--tk-accent)]" /> {SITE_CONFIG.name}</p>
        </div>
      </div>
      {related.length ? (
        <div className="rounded-[2rem] bg-[rgba(255,250,242,0.74)] p-6 shadow-[0_16px_50px_rgba(59,13,26,0.05)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="editable-display text-3xl text-[var(--tk-accent)]">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--tk-muted)]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  if (!related.length) return null
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)] bg-[rgba(255,250,242,0.3)]">
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <h2 className="editable-display text-4xl text-[var(--tk-accent)]">More {(taskConfig?.label || 'posts').toLowerCase()}</h2>
          <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--tk-muted)]">View all <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} grid />)}
        </div>
      </div>
    </section>
  )
}

function RelatedCard({ task, post, grid = false }: { task: TaskKey; post: SitePost; grid?: boolean }) {
  const image = getImages(post)[0]
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  if (grid) {
    return (
      <Link href={href} className="group block overflow-hidden rounded-[1.75rem] bg-[rgba(255,250,242,0.74)] shadow-[0_12px_36px_rgba(59,13,26,0.05)] transition hover:-translate-y-1">
        <div className="aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
          {image ? <img src={image} alt={post.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center"><FileText className="h-7 w-7 text-[var(--tk-muted)]" /></div>}
        </div>
        <div className="p-5">
          <h3 className="editable-display line-clamp-2 text-2xl leading-[0.95] text-[var(--tk-accent)]">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
        </div>
      </Link>
    )
  }
  return (
    <Link href={href} className="group flex gap-3 rounded-[1.4rem] border border-[var(--tk-line)] p-3 transition hover:border-[var(--tk-accent)]">
      {image && task !== 'sbm' ? <img src={image} alt={post.title} className="h-16 w-16 shrink-0 rounded-[1rem] object-cover" /> : <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1rem] bg-[var(--tk-raised)]"><FileText className="h-5 w-5 text-[var(--tk-muted)]" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{post.title}</h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-[var(--tk-muted)]">{stripHtml(summaryText(post))}</p>
      </div>
    </Link>
  )
}
