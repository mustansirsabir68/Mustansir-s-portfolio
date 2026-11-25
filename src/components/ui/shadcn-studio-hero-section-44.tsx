import { lazy, Suspense, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowRightIcon } from 'lucide-react'

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

const focusRing =
  'focus-visible:ring-ring/60 focus-visible:border-ring outline-none focus-visible:ring-[3px]'

// The physics/WebGL stack (three, fiber, drei, rapier) is heavy, so the card is
// its own async chunk. The hero copy paints immediately without waiting for it.
const IdCard = lazy(() => import('./lanyard-card'))

/* -------------------------------------------------------------------------- */
/*                               Greeting rotator                             */
/* -------------------------------------------------------------------------- */

const GreetingWord = ({ greetings, intervalMs = 2200 }: { greetings: string[]; intervalMs?: number }) => {
  const [index, setIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion || greetings.length < 2) return

    const timer = setInterval(() => setIndex(prev => (prev + 1) % greetings.length), intervalMs)

    return () => clearInterval(timer)
  }, [greetings.length, intervalMs, reduceMotion])

  return (
    <>
      <span className='sr-only'>{greetings[0]}</span>
      {/* In normal inline flow there is nothing to clip, overlap, or mis-baseline. */}
      <span aria-hidden='true' className='mr-2 inline-block'>
        <AnimatePresence mode='wait' initial={false}>
          <motion.span
            key={greetings[index]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeInOut' }}
            className='inline-block whitespace-nowrap'
          >
            {greetings[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Marquee                                   */
/* -------------------------------------------------------------------------- */

const MARQUEE_REPEAT = 4
const MARQUEE_GAP_REM = 2

const LogoMarquee = ({ logos, durationSeconds = 25 }: { logos: BrandLogo[]; durationSeconds?: number }) => (
  <div
    className='group flex overflow-hidden p-3'
    style={{ gap: `${MARQUEE_GAP_REM}rem` }}
    role='group'
    aria-label='Technology stack'
  >
    <style>{`@keyframes hero-section-44-marquee{from{transform:translateX(0)}to{transform:translateX(calc(-100% - ${MARQUEE_GAP_REM}rem))}}@media (prefers-reduced-motion:reduce){.hero-section-44-marquee{animation:none!important}}`}</style>
    {Array.from({ length: MARQUEE_REPEAT }, (_, copy) => (
      <div
        key={copy}
        aria-hidden={copy > 0 || undefined}
        className='hero-section-44-marquee flex shrink-0 justify-around group-hover:[animation-play-state:paused]'
        style={{
          gap: `${MARQUEE_GAP_REM}rem`,
          animation: `hero-section-44-marquee ${durationSeconds}s linear infinite`
        }}
      >
        {logos.map((logo, index) => (
          <div key={`${logo.image}-${index}`} className='bg-muted flex size-16 shrink-0 items-center justify-center rounded-md'>
            <img
              src={logo.image}
              alt={copy === 0 ? logo.name : ''}
              loading='eager'
              decoding='async'
              draggable={false}
              className='marquee-logo size-10 object-contain'
            />
          </div>
        ))}
      </div>
    ))}
  </div>
)

/* -------------------------------------------------------------------------- */
/*                                 Hero section                               */
/* -------------------------------------------------------------------------- */

export type BrandLogo = {
  image: string
  name: string
}

export type ActionLink = {
  label: string
  href: string
}

export type HeroSection44Props = {
  greetings?: string[]
  name?: string
  role?: string
  description?: ReactNode
  availabilityLabel?: string
  profileImage?: string
  downloadAction?: ActionLink
  connectAction?: ActionLink
  brandLogos?: BrandLogo[]
  className?: string
}

// Fallbacks so the component still renders when mounted without props (e.g. in a preview sandbox).
const CDN_BASE = 'https://cdn.shadcnstudio.com/ss-assets/template/landing-page/zolt'

const DEFAULT_BRAND_LOGOS: BrandLogo[] = Array.from({ length: 20 }, (_, index) => {
  const position = String(index + 1).padStart(2, '0')

  return { image: `${CDN_BASE}/logo-${position}.png`, name: `Tech stack logo ${position}` }
})

export const HeroSection44 = ({
  greetings = ['Hello', 'नमस्ते', '你好', 'Ciao'],
  name = 'Zolt',
  role = 'Design engineer',
  description = "Design engineer based in Austin. I don't just bridge design and engineering - I own the entire experience, from the first sketch to the final shipped product.",
  availabilityLabel = 'Available',
  profileImage = `${CDN_BASE}/profile.png`,
  downloadAction = { label: 'Download CV', href: '#' },
  connectAction = { label: "Let's connect", href: '#' },
  brandLogos = DEFAULT_BRAND_LOGOS,
  className
}: HeroSection44Props) => {
  // Beside the copy on desktop, in flow under the CTAs on phones. The card's
  // camera fits itself to the canvas, so the same draggable badge works in both.
  const cardClassName =
    'mx-auto mt-8 h-[26rem] w-full max-w-sm sm:max-w-md lg:absolute lg:-top-31 lg:right-0 lg:left-0 lg:z-10 lg:mt-0 lg:h-182 lg:max-w-none'

  return (
    <section className={cn('bg-background text-foreground overflow-x-clip lg:relative', className)}>
      <div className='max-sm:pt-20 sm:py-16 lg:pt-24 lg:pb-24'>
        <div className='mx-auto max-w-5xl px-4 sm:px-6 lg:px-8'>
          <div className='space-y-6 lg:max-w-lg'>
            <span className='bg-card text-primary border-border inline-flex h-6.5 w-fit items-center gap-1 rounded-full border px-2 text-xs font-medium'>
              <span className='relative inline-flex size-1.5' aria-hidden='true'>
                <span className='bg-primary/40 absolute -inset-0.5 rounded-full opacity-75 motion-safe:animate-[ping_1.8s_cubic-bezier(0,0,0.2,1)_infinite]' />
                <span className='bg-primary relative inline-flex size-1.5 rounded-full' />
              </span>
              {availabilityLabel}
            </span>

            <h1 className='mb-2 text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-[56px] lg:font-bold'>
              <GreetingWord greetings={greetings} />{' '}I am {name}
            </h1>

            <p className='text-muted-foreground text-xl font-medium sm:text-2xl lg:text-3xl'>{role}</p>

            <p className='text-muted-foreground mb-8 max-w-2xl text-base'>{description}</p>

            <div className='flex items-center gap-2.5 pt-2'>
              <a
                href={downloadAction.href}
                className={cn(
                  'border-border bg-background hover:bg-muted inline-flex h-11 items-center justify-center rounded-full border px-4 text-base font-medium whitespace-nowrap transition-colors',
                  focusRing
                )}
              >
                {downloadAction.label}
              </a>

              <a
                href={connectAction.href}
                className={cn(
                  'border-border bg-card group inline-flex h-11 items-center justify-center gap-2.5 rounded-full border pr-4 pl-4 text-base font-medium whitespace-nowrap shadow-sm transition-[padding] duration-300 hover:pl-2 focus-visible:pl-2',
                  focusRing
                )}
              >
                <span className='bg-primary relative flex size-2.5 items-center justify-center overflow-hidden rounded-full transition-all duration-300 group-hover:size-6.5 group-focus-visible:size-6.5'>
                  <ArrowRightIcon
                    aria-hidden='true'
                    className='text-primary-foreground absolute size-4.5 -translate-x-3 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100'
                  />
                </span>
                {connectAction.label}
              </a>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<div aria-hidden='true' className={cardClassName} />}>
        <IdCard frontImage={profileImage} className={cardClassName} />
      </Suspense>

      <div className='relative mx-auto mt-10 mb-10 w-full max-w-5xl'>
        <div className='from-background pointer-events-none absolute inset-y-0 left-0 z-1 w-16 bg-linear-to-r to-transparent sm:w-35' />
        <div className='from-background pointer-events-none absolute inset-y-0 right-0 z-1 w-16 bg-linear-to-l to-transparent sm:w-35' />
        <div className='mx-auto w-full max-w-5xl overflow-hidden'>
          <LogoMarquee logos={brandLogos} />
        </div>
      </div>
    </section>
  )
}

export default HeroSection44
