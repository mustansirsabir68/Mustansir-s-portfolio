import { Code2, Gauge, ShieldCheck } from 'lucide-react'
import { categories } from '../../your_info'
import { BlurFade } from '../ui/reveal'
import { SectionHeading } from '../ui/button'

const icons = [Code2, Gauge, ShieldCheck]
// The legacy data file labels the third category "brands"; use accurate section labels instead.
const labels = ['Development', 'Performance', 'Security']

export function Expertise() {
  return (
    <section id="expertise" className="relative border-t border-white/8 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          title="Three disciplines,"
          accent="one engine."
          description="Backend depth, measurable performance and defensive security. The work sits where those three meet."
        />

        <div className="mt-14 border-t border-white/10">
          {categories.map((category, i) => {
            const Icon = icons[i] ?? Code2

            return (
              <BlurFade key={category.title} delay={i * 0.06}>
                <article className="grid gap-6 border-b border-white/10 py-9 md:grid-cols-12 md:gap-8 md:py-11">
                  <div className="md:col-span-4">
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-4 text-signal" strokeWidth={1.6} />
                      <p className="mono-label">{labels[i] ?? category.name}</p>
                    </div>
                    <h3 className="mt-4 text-[1.5rem] font-medium leading-[1.15] tracking-[-0.025em]">
                      {category.title}
                    </h3>
                  </div>

                  <p className="text-[0.88rem] leading-[1.75] text-ash md:col-span-5">
                    {category.description}
                  </p>

                  <ul className="flex flex-wrap content-start gap-x-5 gap-y-2 md:col-span-3 md:justify-end">
                    {category.skills.map((skill) => (
                      <li
                        key={skill.title}
                        className="font-mono text-[0.63rem] uppercase tracking-[0.1em] text-paper/45"
                      >
                        {skill.title}
                      </li>
                    ))}
                  </ul>
                </article>
              </BlurFade>
            )
          })}
        </div>
      </div>
    </section>
  )
}
