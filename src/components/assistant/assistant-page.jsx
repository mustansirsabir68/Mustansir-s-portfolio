import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import {
  ArrowLeft,
  BarChart3,
  Bot,
  Loader2,
  Plus,
  Send,
  Sparkles,
  X,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { LLM_API_BASE_URL } from '../../config'
import { cn } from '../../lib/utils'
import { ThemeToggle } from '../ui/theme-toggle'

const intro = {
  sender: 'ai',
  text: "Hi, I'm Mustansir AI. Ask me anything about his projects, stack or career. You can also paste a job description and I'll score the match against his résumé.",
}

const prompts = [
  'What has Mustansir shipped?',
  'Summarise his .NET experience',
  'Where has he improved performance?',
  'How does he approach security?',
]

ScoreRing.propTypes = {
  score: PropTypes.number.isRequired,
}

function ScoreRing({ score }) {
  const radius = 44
  const circumference = 2 * Math.PI * radius
  const color = score > 75 ? 'var(--color-signal)' : score < 35 ? '#d92d20' : '#b7791f'
  const verdict = score > 75 ? 'Strong match' : score < 35 ? 'Weak match' : 'Partial match'

  return (
    <div className="relative mx-auto my-2 flex w-fit items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="relative size-20">
        <svg viewBox="0 0 120 120" className="size-20 -rotate-90">
          <circle cx="60" cy="60" r={radius} fill="none" stroke="var(--color-border)" strokeWidth="10" />
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - score / 100)}
          />
        </svg>
        <span className="absolute inset-0 grid place-items-center font-mono text-sm text-paper">
          {score}%
        </span>
      </div>
      <div>
        <p className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ash">Résumé analysis</p>
        <p className="mt-1 text-[0.9rem] font-medium" style={{ color }}>
          {verdict}
        </p>
      </div>
    </div>
  )
}

export function AssistantPage() {
  const [messages, setMessages] = useState([intro])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showJd, setShowJd] = useState(false)
  const [jd, setJd] = useState('')
  const [jdLoading, setJdLoading] = useState(false)
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, loading])

  useEffect(() => {
    document.title = 'Mustansir AI | Portfolio Assistant'
  }, [])

  async function send(text = input) {
    const value = text.trim()
    if (!value || loading) return

    setMessages((m) => [...m, { sender: 'user', text: value }])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post(`${LLM_API_BASE_URL}/predict`, { text: value })
      setMessages((m) => [...m, { sender: 'ai', text: res?.data?.result ?? 'No response.' }])
    } catch {
      setMessages((m) => [
        ...m,
        { sender: 'ai', text: 'I could not reach the assistant service. Please try again in a moment.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  async function compare() {
    if (!jd.trim() || jdLoading) return
    setJdLoading(true)

    try {
      const res = await axios.post(`${LLM_API_BASE_URL}/match`, { text: jd })
      const { score, details } = res.data

      setMessages((m) => [
        ...m,
        {
          sender: 'ai',
          text: `Résumé match analysis\nScore: ${score}%\n\n${details}`,
          analysis: { score },
        },
      ])
      setShowJd(false)
      setJd('')
    } catch {
      setMessages((m) => [
        ...m,
        { sender: 'ai', text: 'The résumé analysis service is unavailable right now.' },
      ])
    } finally {
      setJdLoading(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-coal">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-coal/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="group flex items-center gap-2.5 text-[0.82rem] text-paper/65 transition-colors hover:text-paper">
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
            Back to portfolio
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="grid size-7 place-items-center rounded-md bg-signal/12 font-mono text-[0.58rem] text-signal">
                AI
              </span>
              <span className="font-mono text-[0.64rem] uppercase tracking-[0.16em] text-ash">
                Mustansir AI
              </span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[260px_1fr] lg:gap-8">
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5">
              <span className="grid size-10 place-items-center rounded-xl bg-signal/12 text-signal">
                <Bot className="size-5" strokeWidth={1.7} />
              </span>
              <p className="mt-4 text-[0.9rem] font-medium">Portfolio assistant</p>
              <p className="mt-1.5 text-[0.78rem] leading-relaxed text-ash">
                Trained on Mustansir’s work. Ask about projects, stack, or fit for a role.
              </p>
            </div>

            <div>
              <p className="mono-label px-1">Try asking</p>
              <div className="mt-3 space-y-1.5">
                {prompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => send(prompt)}
                    className="w-full rounded-lg border border-transparent px-2.5 py-2 text-left text-[0.78rem] leading-snug text-paper/60 transition-colors hover:border-white/10 hover:bg-white/[0.03] hover:text-paper"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowJd(true)}
              className="flex w-full items-center gap-2.5 rounded-xl border border-signal/25 bg-signal/[0.06] px-4 py-3 text-left transition-colors hover:bg-signal/[0.1]"
            >
              <BarChart3 className="size-4 text-signal" strokeWidth={1.7} />
              <span>
                <span className="block text-[0.8rem] font-medium text-paper">Résumé match</span>
                <span className="block font-mono text-[0.56rem] uppercase tracking-[0.12em] text-ash">
                  Paste a job description
                </span>
              </span>
            </button>
          </div>
        </aside>

        <div className="flex min-h-[calc(100dvh-8rem)] flex-col rounded-2xl border border-white/8 bg-coal-2/50">
          <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
            <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ash">
              Portfolio assistant
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowJd(true)}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-ash transition-colors hover:bg-white/5 hover:text-paper lg:hidden"
              >
                <BarChart3 className="size-3" /> Match
              </button>
              <button
                type="button"
                onClick={() => setMessages([intro])}
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-ash transition-colors hover:bg-white/5 hover:text-paper"
              >
                <Plus className="size-3" /> New chat
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6" aria-live="polite">
            {messages.map((msg, i) => (
              <div key={i}>
                {msg.analysis && <ScoreRing score={msg.analysis.score} />}
                <div
                  className={cn(
                    'flex items-end gap-2.5',
                    msg.sender === 'user' ? 'justify-end' : 'justify-start',
                  )}
                >
                  {msg.sender === 'ai' && (
                    <span className="grid size-7 shrink-0 place-items-center rounded-md bg-signal/12 font-mono text-[0.54rem] text-signal">
                      MS
                    </span>
                  )}
                  <div
                    className={cn(
                      'max-w-[82%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[0.85rem] leading-relaxed',
                      msg.sender === 'user'
                        ? 'rounded-br-sm bg-signal text-coal'
                        : 'rounded-bl-sm border border-white/8 bg-white/[0.04] text-paper/85',
                    )}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-end gap-2.5">
                <span className="grid size-7 place-items-center rounded-md bg-signal/12 font-mono text-[0.54rem] text-signal">
                  MS
                </span>
                <div className="flex gap-1 rounded-2xl rounded-bl-sm border border-white/8 bg-white/[0.04] px-4 py-4">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-1.5 animate-bounce rounded-full bg-signal/70"
                      style={{ animationDelay: `${i * 120}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-white/8 p-3 sm:p-4">
            <div className="flex flex-wrap gap-1.5 pb-2.5 lg:hidden">
              {prompts.slice(0, 2).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => send(prompt)}
                  className="rounded-full border border-white/10 px-2.5 py-1 text-[0.66rem] text-paper/60"
                >
                  {prompt}
                </button>
              ))}
            </div>
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    send()
                  }
                }}
                placeholder="Ask about projects, skills, or paste a role…"
                aria-label="Message Mustansir AI"
                className="max-h-32 flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-[0.85rem] text-paper placeholder:text-ash outline-none transition-colors focus:border-signal/50"
              />
              <button
                type="button"
                onClick={() => send()}
                disabled={loading || !input.trim()}
                className="grid size-11 shrink-0 place-items-center rounded-xl bg-signal text-coal transition-opacity disabled:opacity-40"
                aria-label="Send"
              >
                <Send className="size-4" />
              </button>
            </div>
            <p className="mt-2 text-center font-mono text-[0.54rem] uppercase tracking-[0.1em] text-ash/80">
              Enter to send · Shift + Enter for a new line
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showJd && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] grid place-items-center bg-coal/80 p-4 backdrop-blur-sm"
            onClick={() => setShowJd(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Résumé match analysis"
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-coal-2 p-6 shadow-2xl"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="mono-label text-signal">Résumé match</p>
                  <h2 className="mt-2 text-xl font-medium tracking-tight">Paste a job description</h2>
                  <p className="mt-1.5 text-[0.82rem] text-ash">
                    I’ll score the fit against Mustansir’s experience and explain the gaps.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowJd(false)}
                  aria-label="Close"
                  className="grid size-8 place-items-center rounded-md text-ash hover:bg-white/5 hover:text-paper"
                >
                  <X className="size-4" />
                </button>
              </div>

              <textarea
                rows={8}
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                placeholder="Paste the job description here…"
                className="mt-5 w-full resize-none rounded-xl border border-white/10 bg-white/[0.02] p-4 text-[0.82rem] leading-relaxed text-paper placeholder:text-ash outline-none focus:border-signal/50"
              />

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowJd(false)}
                  className="rounded-full border border-white/12 px-5 py-2.5 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-paper/70 hover:border-white/30"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={compare}
                  disabled={jdLoading || !jd.trim()}
                  className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-coal disabled:opacity-50"
                >
                  {jdLoading ? <Loader2 className="size-3.5 animate-spin" /> : <Sparkles className="size-3.5" />}
                  {jdLoading ? 'Analysing' : 'Compare'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
