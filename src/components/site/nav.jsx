import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { name } from '../../your_info'
import { cn } from '../../lib/utils'
import { ThemeToggle } from '../ui/theme-toggle'

const links = [
  { label: 'Work', href: '#work' },
  { label: 'Expertise', href: '#expertise' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'border-b transition-all duration-500',
          scrolled
            ? 'border-white/8 bg-coal/92 backdrop-blur-xl'
            : 'border-transparent bg-transparent',
        )}
      >
        <nav
          aria-label="Primary"
          className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:h-[72px] sm:px-8"
        >
          <Link
            to="/"
            className="group flex items-center gap-3"
            onClick={() => setOpen(false)}
            aria-label={`${name.firstname} ${name.lastname}, home`}
          >
            <span className="grid size-8 place-items-center rounded-lg border border-signal/30 bg-signal/10 font-mono text-[0.7rem] font-medium text-signal transition-colors group-hover:bg-signal/20">
              MS
            </span>
            <span className="hidden text-[0.82rem] font-medium tracking-tight sm:block">
              {name.firstname} {name.lastname}
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={location.pathname === '/' ? link.href : `/${link.href}`}
                className="rounded-full px-4 py-2 text-[0.82rem] text-paper/60 transition-colors hover:text-paper"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/assistant"
              className="rounded-full px-4 py-2 text-[0.82rem] text-paper/60 transition-colors hover:text-signal"
            >
              Assistant
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <a
              href={name.url}
              target="_blank"
              rel="noreferrer"
              className="hidden items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-paper/80 transition-colors hover:border-signal/60 hover:text-signal sm:inline-flex"
            >
              Résumé
              <ArrowUpRight className="size-3" />
            </a>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid size-9 place-items-center rounded-full border border-white/15 text-paper md:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-white/8 bg-coal/97 px-5 pb-7 pt-4 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col">
              {links.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={location.pathname === '/' ? link.href : `/${link.href}`}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center justify-between border-b border-white/8 py-4 text-lg"
                >
                  {link.label}
                </motion.a>
              ))}
              <Link
                to="/assistant"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-white/8 py-4 text-lg"
              >
                Assistant
                <span className="mono-label text-signal">AI</span>
              </Link>
              <a
                href={name.url}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-coal"
              >
                Résumé <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
