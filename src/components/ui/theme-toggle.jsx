import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { AnimatePresence, motion } from 'motion/react'
import { Moon, Sun } from 'lucide-react'
import { cn } from '../../lib/utils'

const STORAGE_KEY = 'theme'

const readTheme = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')

export function ThemeToggle({ className }) {
  const [theme, setTheme] = useState(readTheme)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    root.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f4f3ec' : '#08090c')
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // Storage can be unavailable in private modes; the in-session theme still applies.
    }
  }, [theme])

  return (
    <button
      type="button"
      onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      aria-pressed={theme === 'light'}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className={cn(
        'relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-full border border-white/15 text-paper/80 transition-colors hover:border-signal/60 hover:text-signal',
        className,
      )}
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={theme}
          initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="grid place-items-center"
        >
          {theme === 'dark' ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

ThemeToggle.propTypes = {
  className: PropTypes.string,
}
