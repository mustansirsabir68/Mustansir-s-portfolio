import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { name, socialProfiles } from '../../your_info'

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-coal-2/40">
      <div className="mx-auto max-w-7xl px-5 pb-24 pt-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg border border-signal/30 bg-signal/10 font-mono text-[0.7rem] text-signal">
                MS
              </span>
              <span className="text-[0.95rem] font-medium tracking-tight">
                {name.firstname} {name.lastname}
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-[0.82rem] leading-relaxed text-ash">
              Building fast, secure, and reliable systems that scale with confidence.
            </p>
          </div>

          <div className="lg:col-span-3">
            <p className="mono-label">Sections</p>
            <ul className="mt-4 space-y-2.5">
              {[
                ['Work', '#work'],
                ['Expertise', '#expertise'],
                ['About', '#about'],
                ['Contact', '#contact'],
              ].map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="text-[0.82rem] text-paper/60 transition-colors hover:text-signal">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="mono-label">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              {socialProfiles.map((profile) => (
                <li key={profile.name}>
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 text-[0.82rem] text-paper/60 transition-colors hover:text-signal"
                  >
                    {profile.name}
                    <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
              <li>
                <Link to="/assistant" className="text-[0.82rem] text-paper/60 transition-colors hover:text-signal">
                  Assistant
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="mono-label">Availability</p>
            <p className="mt-4 text-[0.82rem] text-paper/70">Open to full-time roles</p>
            <a
              href={name.url}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-[0.82rem] text-paper/60 transition-colors hover:text-signal"
            >
              Résumé <ArrowUpRight className="size-3" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ash/70">
            © {new Date().getFullYear()} {name.firstname} {name.lastname}. Built with React, Tailwind & Motion.
          </p>
          <a
            href="#top"
            className="inline-flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ash transition-colors hover:text-signal"
          >
            Back to top <ArrowUp className="size-3" />
          </a>
        </div>
      </div>
    </footer>
  )
}
