import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { animate, motion, useInView } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1]

/** Fades + lifts content into place the first time it enters the viewport. */
export function BlurFade({
  children,
  className,
  delay = 0,
  y = 18,
  blur = 8,
  once = true,
  as = 'div',
}) {
  const MotionTag = motion[as] ?? motion.div

  return (
    <MotionTag
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-60px' }}
      transition={{ duration: 0.75, delay, ease: EASE }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}

BlurFade.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  delay: PropTypes.number,
  y: PropTypes.number,
  blur: PropTypes.number,
  once: PropTypes.bool,
  as: PropTypes.string,
}

/** Animates a number from zero to its value when scrolled into view. */
export function Counter({ value, suffix = '', prefix = '', decimals = 0, duration = 1.8, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, Number(value), {
      duration,
      ease: EASE,
      onUpdate: (latest) => setDisplay(latest),
    })
    return () => controls.stop()
  }, [inView, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toFixed(decimals)}
      {suffix}
    </span>
  )
}

Counter.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  suffix: PropTypes.string,
  prefix: PropTypes.string,
  decimals: PropTypes.number,
  duration: PropTypes.number,
  className: PropTypes.string,
}
