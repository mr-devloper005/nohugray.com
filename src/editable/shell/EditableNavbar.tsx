'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, LogIn, Menu, Search, ShoppingBag, User, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const topLinks = globalContent.nav.primaryLinks

function isActive(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(`${href}/`))
}

export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()
  const taskLinks = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && task.key !== 'profile').slice(0, 5).map((task) => ({ label: task.label, href: task.route })),
    []
  )

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.08)] bg-[rgba(59,13,26,0.96)] text-[#d9e8f1] backdrop-blur-xl">
      <nav className="mx-auto flex min-h-[84px] w-full max-w-[1600px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="hidden items-center gap-7 lg:flex">
          {topLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-[12px] font-semibold uppercase tracking-[0.2em] transition ${
                isActive(pathname, item.href) ? 'text-white' : 'text-[#b9d0de] hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/5 text-[#d9e8f1] lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link href="/" className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <span className="editable-display text-[3rem] leading-none tracking-[-0.06em] text-[#a7c6d7] sm:text-[3.5rem]">
            {SITE_CONFIG.name}
          </span>
          <span className="mt-[-0.4rem] text-[9px] font-semibold uppercase tracking-[0.35em] text-[#d5b9c0]">
            studio
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <form action="/search" className="hidden items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2.5 md:flex">
            <Search className="h-4 w-4 text-[#a7c6d7]" />
            <input
              name="q"
              type="search"
              placeholder="Search"
              className="w-28 bg-transparent text-sm text-white outline-none placeholder:text-[#b9d0de]"
            />
          </form>
          <Link href={session ? '/profile' : '/login'} className="rounded-full p-2.5 text-[#b9d0de] transition hover:bg-white/10 hover:text-white" aria-label="Account">
            <User className="h-4 w-4" />
          </Link>
          <Link href="/image" className="rounded-full p-2.5 text-[#b9d0de] transition hover:bg-white/10 hover:text-white" aria-label="Favorites">
            <Heart className="h-4 w-4" />
          </Link>
          <Link href="/image" className="rounded-full p-2.5 text-[#b9d0de] transition hover:bg-white/10 hover:text-white" aria-label="Collection">
            <ShoppingBag className="h-4 w-4" />
          </Link>
          {!session ? (
            <>
              <Link href="/login" className="hidden rounded-full border border-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d9e8f1] transition hover:bg-white/10 sm:inline-flex">
                <LogIn className="mr-2 h-3.5 w-3.5" /> Login
              </Link>
              <Link href="/signup" className="hidden rounded-full bg-[#a7c6d7] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#2f1018] transition hover:bg-[#bad7e4] sm:inline-flex">
                <UserPlus className="mr-2 h-3.5 w-3.5" /> Join
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={logout}
              className="hidden rounded-full border border-white/15 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#d9e8f1] transition hover:bg-white/10 sm:inline-flex"
            >
              Logout
            </button>
          )}
        </div>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-[#3b0d1a] px-4 py-5 lg:hidden">
          <form action="/search" className="mb-4 flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-3">
            <Search className="h-4 w-4 text-[#a7c6d7]" />
            <input name="q" type="search" placeholder="Search" className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#b9d0de]" />
          </form>
          <div className="grid gap-2">
            {[{ label: 'Home', href: '/' }, ...topLinks, ...taskLinks].map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-[1.25rem] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] ${
                  isActive(pathname, item.href) ? 'bg-[#a7c6d7] text-[#301018]' : 'bg-white/5 text-[#d9e8f1]'
                }`}
              >
                {item.label}
              </Link>
            ))}
            {!session ? (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-[1.25rem] border border-white/12 px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#d9e8f1]">
                  Login
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-[1.25rem] bg-[#a7c6d7] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#301018]">
                  Create account
                </Link>
              </>
            ) : (
              <button type="button" onClick={logout} className="rounded-[1.25rem] border border-white/12 px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.16em] text-[#d9e8f1]">
                Logout
              </button>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
