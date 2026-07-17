'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile')
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="relative overflow-hidden bg-[#a7c6d7] text-[#34111a]">
      <div className="absolute inset-x-0 top-0 h-10 bg-[linear-gradient(180deg,rgba(255,248,238,0.9),rgba(255,248,238,0))]" />
      <div className="absolute inset-x-0 bottom-[8.5rem] h-10 bg-[radial-gradient(circle_at_40px_0px,#3b0d1a_0_39px,transparent_40px)] [background-size:140px_100%] opacity-100" />
      <div className="mx-auto grid max-w-[1600px] gap-10 px-6 pb-28 pt-20 lg:grid-cols-[1.2fr_0.9fr_0.9fr_0.9fr_1.2fr] lg:px-8">
        <div className="max-w-xs">
          <Link href="/" className="inline-flex flex-col items-start">
            <span className="flex h-28 w-28 items-center justify-center">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-24 w-24 object-contain" />
            </span>
            <span className="mt-1 pl-2 text-[0.9rem] font-semibold uppercase tracking-[0.28em] text-[#3b0d1a]">
              studio
            </span>
          </Link>
          <p className="mt-6 text-sm leading-7 text-[#4f3940]">{globalContent.footer.description}</p>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3b0d1a]">Shop</h3>
          <div className="mt-5 grid gap-2.5">
            {taskLinks.slice(0, 5).map((task) => (
              <Link key={task.key} href={task.route} className="text-[1.05rem] leading-7 text-[#3f262f] transition hover:text-[#fff8ee]">
                {task.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3b0d1a]">Our World</h3>
          <div className="mt-5 grid gap-2.5">
            {globalContent.footer.columns[1].links.map((link) => (
              <Link key={link.href} href={link.href} className="text-[1.05rem] leading-7 text-[#3f262f] transition hover:text-[#fff8ee]">
                {link.label}
              </Link>
            ))}
            {session ? (
              <button type="button" onClick={logout} className="text-left text-[1.05rem] leading-7 text-[#3f262f] transition hover:text-[#fff8ee]">
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="text-[1.05rem] leading-7 text-[#3f262f] transition hover:text-[#fff8ee]">Login</Link>
                <Link href="/signup" className="text-[1.05rem] leading-7 text-[#3f262f] transition hover:text-[#fff8ee]">Create account</Link>
              </>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3b0d1a]">Info</h3>
          <div className="mt-5 grid gap-2.5">
            {globalContent.footer.columns[0].links.map((link) => (
              <Link key={link.href} href={link.href} className="text-[1.05rem] leading-7 text-[#3f262f] transition hover:text-[#fff8ee]">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#3b0d1a]">Newsletter</h3>
          <p className="mt-5 max-w-sm text-[1.05rem] leading-8 text-[#3f262f]">
            Join the community for fresh image stories, featured profiles, and thoughtful updates from the collection.
          </p>
          <form action="/search" className="mt-8">
            <input
              name="q"
              placeholder="E-mail"
              className="h-12 w-full rounded-full border border-[#7d9eb3] bg-transparent px-5 text-sm outline-none placeholder:text-[#617c8c]"
            />
            <button className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#3b0d1a] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-[#f8f0e3] transition hover:bg-[#532031]">
              Discover the latest
            </button>
          </form>
          <p className="mt-5 text-sm leading-6 text-[#5f7483]">
            By joining, you confirm you are happy to receive occasional editorial updates.
          </p>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1600px] flex-col gap-4 px-6 pb-7 text-sm text-[#3b0d1a] sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <p>© {year} {SITE_CONFIG.name}</p>
        <p>{globalContent.footer.bottomNote}</p>
      </div>
    </footer>
  )
}
