import { useRef } from 'react'
import PropTypes from 'prop-types'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'motion/react'
import { cn } from '../../lib/utils'

/** 21st.dev-style tilt card: a few degrees of pointer-linked rotation, with a soft glare. */
export function Tilt({ children, className, max = 6, glare = true, scale = 1.01 }) {
  const ref = useRef(null)
  const rotateX = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 })
  const rotateY = useSpring(useMotionValue(0), { stiffness: 220, damping: 20 })
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)
  const glareBackground = useMotionTemplate`radial-gradient(340px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.10), transparent 60%)`

  function handleMove(event) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const px = (event.clientX - rect.left) / rect.width
    const py = (event.clientY - rect.top) / rect.height
    rotateY.set((px - 0.5) * max * 2)
    rotateX.set((0.5 - py) * max * 2)
    glareX.set(px * 100)
    glareY.set(py * 100)
  }

  function reset() {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={{ scale }}
      transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className={cn('group relative [transform-style:preserve-3d]', className)}
    >
      {children}
      {glare && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: glareBackground }}
        />
      )}
    </motion.div>
  )
}

Tilt.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  max: PropTypes.number,
  glare: PropTypes.bool,
  scale: PropTypes.number,
}
