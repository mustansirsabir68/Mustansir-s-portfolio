import { useRef } from 'react'
import PropTypes from 'prop-types'
import { cn } from '../../lib/utils'

/**
 * 21st.dev-style spotlight card: a radial highlight follows the pointer
 * across a hairline-bordered surface.
 */
export function SpotlightCard({ children, className, glow = 'rgba(201,242,78,0.10)', ...props }) {
  const ref = useRef(null)

  function handleMove(event) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${event.clientX - rect.left}px`)
    el.style.setProperty('--my', `${event.clientY - rect.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      style={{ '--mx': '50%', '--my': '0%' }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.022]',
        'transition-colors duration-500 hover:border-white/16',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(460px circle at var(--mx) var(--my), ${glow}, transparent 68%)`,
        }}
      />
      {children}
    </div>
  )
}

SpotlightCard.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  glow: PropTypes.string,
}
