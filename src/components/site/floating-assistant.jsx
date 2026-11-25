import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowUpRight, MessageSquare, Send, Sparkles, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { LLM_API_BASE_URL } from '../../config'
import { cn } from '../../lib/utils'

const seed = {
  sender: 'ai',
  text: "Hi, I'm Mustansir AI. Ask me a quick question about his work, stack or experience.",
}

export function FloatingAssistant() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([seed])
  const [loading, setLoading] = useState(false)
  const listRef = useRef(null)

  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, open])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    setMessages((m) => [...m, { sender: 'user', text }])
    setInput('')
    setLoading(true)

    try {
      const res = await axios.post(`${LLM_API_BASE_URL}/predict`, { text })
      setMessages((m) => [...m, { sender: 'ai', text: res?.data?.result ?? 'No response.' }])
    } catch {
      setMessages((m) => [
        ...m,
        { sender: 'ai', text: 'The assistant is offline right now. Try the full page or email me via the contact form.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close Mustansir AI' : 'Open Mustansir AI'}
        aria-expanded={open}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'fixed bottom-5 right-5 z-[70] flex items-center gap-2.5 rounded-full border px-4 py-3 shadow-2xl backdrop-blur-xl transition-colors',
          open
            ? 'border-white/15 bg-coal-3 text-paper'
            : 'border-signal/40 bg-signal text-coal',
        )}
      >
        {open ? <X className="size-4" /> : <Sparkles className="size-4" strokeWidth={1.9} />}
        <span className="font-mono text-[0.64rem] font-medium uppercase tracking-[0.14em]">
          {open ? 'Close' : 'Ask AI'}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="Mustansir AI quick chat"
            className="fixed bottom-20 right-3 z-[70] flex h-[min(30rem,calc(100vh-7rem))] w-[calc(100vw-1.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-white/10 bg-coal-2/95 shadow-2xl backdrop-blur-2xl sm:right-5"
          >
            <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 place-items-center rounded-lg bg-signal/12 font-mono text-[0.62rem] text-signal">
                  MS
                </span>
                <div>
                  <p className="text-[0.8rem] font-medium leading-tight">Mustansir AI</p>
                  <p className="font-mono text-[0.56rem] uppercase tracking-[0.14em] text-ash">
                    portfolio assistant
                  </p>
                </div>
              </div>
              <Link
                to="/assistant"
                className="grid size-7 place-items-center rounded-md text-ash transition-colors hover:bg-white/5 hover:text-signal"
                aria-label="Open full assistant page"
              >
                <ArrowUpRight className="size-3.5" />
              </Link>
            </div>

            <div ref={listRef} className="flex flex-1 flex-col gap-3 overflow-y-auto p-4" aria-live="polite">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={cn(
                    'max-w-[85%] rounded-xl px-3.5 py-2.5 text-[0.8rem] leading-relaxed',
                    msg.sender === 'user'
                      ? 'self-end rounded-br-sm bg-signal text-coal'
                      : 'self-start rounded-bl-sm border border-white/8 bg-white/[0.04] text-paper/85',
                  )}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="self-start rounded-xl rounded-bl-sm border border-white/8 bg-white/[0.04] px-3.5 py-2.5">
                  <span className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="size-1.5 animate-bounce rounded-full bg-signal/70"
                        style={{ animationDelay: `${i * 120}ms` }}
                      />
                    ))}
                  </span>
                </div>
              )}
            </div>

            <div className="border-t border-white/8 p-3">
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
                  placeholder="Ask about Mustansir…"
                  aria-label="Message"
                  className="max-h-24 flex-1 resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-[0.8rem] text-paper placeholder:text-ash outline-none focus:border-signal/50"
                />
                <button
                  type="button"
                  onClick={send}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="grid size-9 shrink-0 place-items-center rounded-xl bg-signal text-coal transition-opacity disabled:opacity-40"
                >
                  <Send className="size-3.5" />
                </button>
              </div>
              <div className="mt-2 flex items-center gap-1.5 px-1">
                <MessageSquare className="size-2.5 text-ash/60" />
                <p className="font-mono text-[0.54rem] uppercase tracking-[0.1em] text-ash/60">
                  Powered by a custom LLM endpoint
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
