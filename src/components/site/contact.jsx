import { useRef, useState } from 'react'
import axios from 'axios'
import { motion } from 'motion/react'
import { ArrowUpRight, Check, Loader2, Send } from 'lucide-react'
import { socialProfiles } from '../../your_info'
import { LLM_API_BASE_URL } from '../../config'
import { SectionHeading } from '../ui/button'
import { BlurFade } from '../ui/reveal'
import { SpotlightCard } from '../ui/spotlight'
import { GithubIcon, LinkedinIcon } from '../ui/brand-icons'

const icons = { LinkedIn: LinkedinIcon, GitHub: GithubIcon }

const field =
  'w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-[0.88rem] text-paper placeholder:text-ash outline-none transition-colors focus:border-signal/60 focus:bg-white/[0.04]'

export function Contact() {
  const formRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus('sending')
    setError('')

    try {
      const formData = new FormData(formRef.current)
      await axios.post(`${LLM_API_BASE_URL}/send`, formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
      setStatus('sent')
      formRef.current.reset()
    } catch (err) {
      console.error(err)
      setError('Message could not be sent. Please try again, or reach me on LinkedIn.')
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="relative border-t border-white/8 py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <BlurFade>
            <SectionHeading
              kicker="Contact"
              title="Have a system"
              accent="worth fixing?"
              description="Open to full-time roles and interesting problems. Tell me what is slow, fragile or about to break, and I will tell you how I would approach it."
            />
          </BlurFade>

          <BlurFade delay={0.1}>
            <p className="mt-8 max-w-md text-[0.85rem] leading-relaxed text-ash">
              Based in India, IST (UTC+5:30).
            </p>
          </BlurFade>

          <BlurFade delay={0.16}>
            <div className="mt-9 border-t border-white/8 pt-7">
              <p className="mono-label">Elsewhere</p>
              <div className="mt-4 flex flex-col gap-1">
                {socialProfiles.map((profile) => {
                  const Icon = icons[profile.name] ?? ArrowUpRight
                  return (
                    <a
                      key={profile.name}
                      href={profile.url}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between border-b border-white/8 py-3 text-[0.86rem] text-paper/75 transition-colors hover:text-paper"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="size-4 text-ash transition-colors group-hover:text-signal" strokeWidth={1.6} />
                        {profile.name}
                      </span>
                      <ArrowUpRight className="size-3.5 text-ash transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
                    </a>
                  )
                })}
              </div>
            </div>
          </BlurFade>
        </div>

        <BlurFade delay={0.12} className="lg:col-span-6">
          <SpotlightCard className="rounded-3xl p-6 sm:p-8">
            {status === 'sent' ? (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[24rem] flex-col items-start justify-center"
              >
                <span className="grid size-12 place-items-center rounded-full bg-signal/15 text-signal">
                  <Check className="size-5" />
                </span>
                <h3 className="mt-5 text-2xl font-medium tracking-tight">Message sent.</h3>
                <p className="mt-2 max-w-sm text-[0.88rem] leading-relaxed text-ash">
                  Thanks for reaching out. It landed in my inbox and I’ll reply shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-6 rounded-full border border-white/15 px-5 py-2.5 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-paper/75 transition-colors hover:border-white/35 hover:text-paper"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit}>
                <div className="flex items-center justify-between">
                  <p className="mono-label">Direct message</p>
                  <span className="hidden font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ash/60 sm:inline">
                    Replies in a day or two
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="name" className="mb-2 block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ash">
                      Name
                    </label>
                    <input id="name" name="name" required placeholder="Your name" className={field} />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ash">
                      Email
                    </label>
                    <input id="email" name="email" type="email" required placeholder="you@company.com" className={field} />
                  </div>
                  <div>
                    <label htmlFor="message" className="mb-2 block font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ash">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      required
                      placeholder="What are you building, and what's getting in the way?"
                      className={`${field} resize-none`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="group mt-6 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-signal px-6 py-3.5 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-coal transition-colors hover:bg-signal-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" /> Sending
                    </>
                  ) : (
                    <>
                      Send message
                      <Send className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>

                {status === 'error' && (
                  <p role="alert" className="mt-3 text-[0.76rem] leading-relaxed text-destructive">
                    {error}
                  </p>
                )}

                <p className="mt-3 text-center text-[0.72rem] leading-relaxed text-ash/70">
                  Name, email and message only. Nothing is stored beyond the inbox.
                </p>
              </form>
            )}
          </SpotlightCard>
        </BlurFade>
      </div>
    </section>
  )
}
