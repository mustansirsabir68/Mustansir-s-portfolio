import { ArrowUpRight } from 'lucide-react'
import { projectData } from '../../your_info'
import { BlurFade } from '../ui/reveal'
import { SectionHeading } from '../ui/button'
import { Tilt } from '../ui/tilt'
import { GithubIcon } from '../ui/brand-icons'
import { cn } from '../../lib/utils'

export function Work() {
  return (
    <section id="work" className="relative border-t border-white/8 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          kicker="Selected work"
          title="Systems shipped,"
          accent="problems gone."
          description="Two builds that show how I work: find the operational pain, then remove it."
        />

        <div className="mt-16 space-y-20 sm:space-y-28">
          {projectData.map((project, i) => (
            <article key={project.title} className="grid items-center gap-9 lg:grid-cols-12 lg:gap-14">
              <BlurFade
                delay={0.05}
                className={cn('lg:col-span-7', i % 2 === 1 && 'lg:order-2')}
              >
                <Tilt max={4} className="group">
                  <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-coal-3">
                    {project.demoVideo ? (
                      <video
                        src={project.demoVideo}
                        poster={project.demoUrl}
                        autoPlay
                        muted
                        loop
                        playsInline
                        aria-label={`${project.title} preview`}
                        className="h-[260px] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.035] sm:h-[360px] lg:h-[400px]"
                      />
                    ) : (
                      <img
                        src={project.demoUrl}
                        alt={`${project.title} preview`}
                        loading="lazy"
                        className="h-[260px] w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.035] sm:h-[360px] lg:h-[400px]"
                      />
                    )}

                  </div>
                </Tilt>
              </BlurFade>

              <div className={cn('lg:col-span-5', i % 2 === 1 && 'lg:order-1')}>
                <BlurFade delay={0.12}>
                  <p className="mono-label">{project.category}</p>
                  <h3 className="mt-3 text-[clamp(1.7rem,3vw,2.4rem)] font-medium leading-[1.05] tracking-[-0.035em]">
                    {project.title.trim()}
                  </h3>
                  <p className="mt-4 text-[0.87rem] leading-[1.75] text-ash">{project.description}</p>

                  <p className="mt-6 font-mono text-[0.63rem] uppercase tracking-[0.1em] text-paper/45">
                    {project.technologies.join(' / ')}
                  </p>

                  {project.githubUrl ? (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-7 inline-flex items-center gap-2 border-b border-white/15 pb-1 text-[0.8rem] text-paper/85 transition-colors hover:border-signal hover:text-signal"
                    >
                      <GithubIcon className="size-3.5" />
                      View source
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  ) : (
                    <p className="mt-7 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-ash">
                      Featured build / source private
                    </p>
                  )}
                </BlurFade>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
