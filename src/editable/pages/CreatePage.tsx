'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, Lock, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass =
  'w-full rounded-[1.5rem] border border-[rgba(59,13,26,0.12)] bg-[rgba(255,250,242,0.88)] px-5 py-3.5 text-sm font-medium text-[#34111a] outline-none transition placeholder:text-[#8b7370] focus:border-[#3b0d1a] focus:bg-white'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[#f8f0e3] px-4 py-16 text-[#34111a] sm:px-6 lg:px-8">
          <section className="mx-auto grid max-w-6xl gap-8 rounded-[2.8rem] border border-[rgba(59,13,26,0.1)] bg-[rgba(255,250,242,0.76)] p-7 shadow-[0_30px_90px_rgba(59,13,26,0.08)] md:grid-cols-[0.92fr_1.08fr] md:p-10">
            <div className="flex min-h-72 flex-col justify-between rounded-[2.1rem] bg-[#3b0d1a] p-8 text-[#fff7ef]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
                <Lock className="h-7 w-7 text-[#a7c6d7]" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a7c6d7]">{pagesContent.create.locked.badge}</p>
                <p className="mt-3 max-w-sm text-sm leading-7 text-[#e8d8cf]">
                  Sign in to open the publishing workspace and prepare new entries with the same editorial polish used across the site.
                </p>
              </div>
            </div>
            <div className="self-center">
              <h1 className="editable-display text-5xl leading-[0.9] tracking-[-0.06em] text-[#3b0d1a] sm:text-7xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#715956]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[#3b0d1a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#fff8ee]">
                  Login <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[rgba(59,13,26,0.12)] bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#34111a]">
                  Sign up
                </Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#f8f0e3] text-[#34111a]">
        <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
            <aside className="rounded-[2.5rem] bg-[#3b0d1a] p-8 text-[#fff7ef] shadow-[0_30px_90px_rgba(59,13,26,0.18)] sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#a7c6d7]">{pagesContent.create.hero.badge}</p>
              <h1 className="editable-display mt-5 text-5xl leading-[0.9] tracking-[-0.06em] text-[#fff8ee] sm:text-7xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#e8d8cf]">{pagesContent.create.hero.description}</p>

              <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/5 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#a7c6d7] text-[#3b0d1a]">
                    <Sparkles className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#a7c6d7]">Publishing lane</p>
                    <p className="mt-1 text-xl font-semibold text-[#fff8ee]">{activeTask?.label || 'Post'}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-7 text-[#e8d8cf]">
                  The page now opens directly into the editor, so the old task chooser cards have been removed for a cleaner submission flow.
                </p>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.7rem] bg-white/5 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a7c6d7]">What to prepare</p>
                  <p className="mt-3 text-sm leading-7 text-[#e8d8cf]">A strong title, concise summary, destination link, optional image, and your full content block.</p>
                </div>
                <div className="rounded-[1.7rem] bg-white/5 p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a7c6d7]">Publishing note</p>
                  <p className="mt-3 text-sm leading-7 text-[#e8d8cf]">Drafts are stored locally so you can refine the page copy and structure before moving on.</p>
                </div>
              </div>
            </aside>

            <form onSubmit={submit} className="rounded-[2.5rem] border border-[rgba(59,13,26,0.1)] bg-[rgba(255,250,242,0.78)] p-6 shadow-[0_30px_90px_rgba(59,13,26,0.08)] sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[rgba(59,13,26,0.1)] pb-5">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8b706c]">Create {activeTask?.label || 'post'}</p>
                  <h2 className="editable-display mt-2 text-4xl leading-[0.94] tracking-[-0.05em] text-[#3b0d1a]">{pagesContent.create.formTitle}</h2>
                </div>
                <div className="rounded-full bg-[#a7c6d7] px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#301018]">
                  {session.name}
                </div>
              </div>

              <div className="mt-6 grid gap-5">
                <div className="grid gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6d69]">Title</label>
                  <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give the post a clear, public-facing title" required />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6d69]">Category</label>
                    <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category or theme" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6d69]">Link</label>
                    <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
                  </div>
                </div>

                <div className="grid gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6d69]">Image</label>
                  <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
                </div>

                <div className="grid gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6d69]">Summary</label>
                  <textarea className={`${fieldClass} min-h-28`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Write a concise intro or preview line" required />
                </div>

                <div className="grid gap-2">
                  <label className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6d69]">Main content</label>
                  <textarea className={`${fieldClass} min-h-56`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Add the full content, description, notes, or editorial copy" required />
                </div>
              </div>

              {created ? (
                <div className="mt-6 rounded-[1.7rem] border border-[#c9e0cd] bg-[#eef7ef] p-5 text-[#23452b]">
                  <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.12em]">
                    <CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}
                  </p>
                  <p className="mt-2 text-base font-medium">{created.title}</p>
                </div>
              ) : null}

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 text-sm text-[#7a605c]">
                  <FileText className="h-4 w-4 text-[#3b0d1a]" />
                  Saved locally after submit
                </div>
                <button type="submit" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#3b0d1a] px-7 text-sm font-semibold uppercase tracking-[0.16em] text-[#fff8ee] transition hover:bg-[#532031]">
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
