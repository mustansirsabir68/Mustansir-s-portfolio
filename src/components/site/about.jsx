import { ArrowUpRight, MapPin, Timer, Layers, ShieldCheck } from 'lucide-react'
import { aboutMeText, name } from '../../your_info'
import { BlurFade } from '../ui/reveal'
import { SectionHeading } from '../ui/button'
import deskImage from '../../assets/images/developer.jpg'

const facts = [
  { icon: MapPin, label: 'Based in', value: 'India, IST (UTC+5:30)' },
  { icon: Layers, label: 'Focus', value: 'Full-stack .NET and enterprise systems' },
  { icon: Timer, label: 'Delivery', value: '95% on-time in Agile teams' },
  { icon: ShieldCheck, label: 'Security', value: 'OWASP remediation and CSP hardening' },
]

export function About() {
  return (
    <section id="about" className="relative border-t border-white/8 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <BlurFade className="lg:col-span-5">
            <figure>
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <img
                  src={deskImage}
                  alt="A laptop with source code open on a desk"
                  loading="lazy"
                  className="h-[320px] w-full object-cover grayscale contrast-[1.06] sm:h-[420px]"
                />
              </div>
              <figcaption className="mt-3 font-mono text-[0.62rem] tracking-[0.08em] text-ash/70">
                The desk, most evenings.
              </figcaption>
            </figure>
          </BlurFade>

          <div className="lg:col-span-7">
            <BlurFade delay={0.08}>
              <SectionHeading title="Engineer first," accent="tinkerer always." />
            </BlurFade>

            <BlurFade delay={0.14}>
              <p className="mt-7 max-w-2xl text-[0.95rem] leading-[1.85] text-paper/65">
                {aboutMeText.infotext}
              </p>

              <blockquote className="mt-9 border-l-2 border-signal pl-5">
                <p className="text-[clamp(1.3rem,2.4vw,1.75rem)] font-light italic leading-[1.35] text-paper">
                  “{aboutMeText.power_slogan}”
                </p>
              </blockquote>
            </BlurFade>

            <BlurFade delay={0.2}>
              <dl className="mt-10 grid gap-x-8 gap-y-5 border-t border-white/8 pt-8 sm:grid-cols-2">
                {facts.map((fact) => (
                  <div key={fact.label} className="flex gap-3">
                    <fact.icon className="mt-0.5 size-4 shrink-0 text-signal" strokeWidth={1.6} />
                    <div>
                      <dt className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-ash/70">
                        {fact.label}
                      </dt>
                      <dd className="mt-1 text-[0.83rem] leading-snug text-paper/80">{fact.value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </BlurFade>

            <BlurFade delay={0.26}>
              <a
                href={name.url}
                target="_blank"
                rel="noreferrer"
                className="group mt-9 inline-flex items-center gap-2 text-[0.82rem] text-paper/85 transition-colors hover:text-signal"
              >
                <span className="border-b border-white/20 pb-0.5 transition-colors group-hover:border-signal">
                  Read the full résumé
                </span>
                <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </BlurFade>
          </div>
        </div>
      </div>
    </section>
  )
}
