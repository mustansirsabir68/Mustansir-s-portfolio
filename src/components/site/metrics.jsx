import { BlurFade, Counter } from '../ui/reveal'

const metrics = [
  { value: 95, suffix: '%', label: 'On-time delivery', note: 'Agile teams, production releases' },
  { value: 73, suffix: '%', label: 'Faster queries', note: 'Execution time removed by tuning' },
  { value: 99.9, suffix: '%', decimals: 1, label: 'Uptime held', note: 'High-volume enterprise apps' },
  { value: 4, suffix: '', label: 'Years shipping', note: 'Across the .NET ecosystem' },
]

export function Metrics() {
  return (
    <section id="numbers" className="relative overflow-hidden bg-signal py-16 text-coal sm:py-20">
      <div aria-hidden className="absolute inset-0 opacity-[0.16]">
        <div className="grid-bg absolute inset-0 [background-image:linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-mono text-[0.68rem] uppercase tracking-[0.24em] text-coal/70">
            Measured in production
          </h2>
          <p className="max-w-xs text-[0.8rem] leading-snug text-coal/65">
            Query plans, uptime and delivery data from systems in production.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-y-10 border-t border-coal/15 pt-10 lg:grid-cols-4">
          {metrics.map((metric, i) => (
            <BlurFade
              key={metric.label}
              delay={i * 0.06}
              className={i > 0 ? 'lg:border-l lg:border-coal/15 lg:pl-8' : ''}
            >
              <p className="text-[clamp(2.6rem,5vw,4.2rem)] font-medium leading-none tracking-[-0.045em]">
                <Counter value={metric.value} suffix={metric.suffix} decimals={metric.decimals ?? 0} />
              </p>
              <p className="mt-3 text-[0.86rem] font-medium">{metric.label}</p>
              <p className="mt-1 max-w-[13rem] text-[0.72rem] leading-snug text-coal/55">
                {metric.note}
              </p>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  )
}
