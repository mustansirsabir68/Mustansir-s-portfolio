import PropTypes from 'prop-types'
import { cn } from '../../lib/utils'

/**
 * Section opener. The kicker is optional on purpose: the page should not wear a
 * small uppercase label above every headline.
 */
export function SectionHeading({ kicker, title, accent, description, className, align = 'left' }) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center', className)}>
      {kicker && <p className="mono-label">{kicker}</p>}
      <h2
        className={cn(
          'text-[clamp(2rem,4.4vw,3.35rem)] font-medium leading-[1.12] pb-1 tracking-[-0.04em]',
          kicker ? 'mt-4' : 'mt-0',
        )}
      >
        {title}{' '}
        {accent && <em className="font-light italic text-signal">{accent}</em>}
      </h2>
      {description && (
        <p
          className={cn(
            'mt-5 max-w-xl text-[0.95rem] leading-relaxed text-ash',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}

SectionHeading.propTypes = {
  kicker: PropTypes.string,
  title: PropTypes.string,
  accent: PropTypes.string,
  description: PropTypes.node,
  className: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center']),
}
