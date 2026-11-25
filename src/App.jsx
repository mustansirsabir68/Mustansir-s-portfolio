import { useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { MotionConfig } from 'motion/react'

import { name } from './your_info'
import { Nav } from './components/site/nav'
import { LanyardHero } from './components/site/lanyard-hero'
import { Expertise } from './components/site/expertise'
import { Metrics } from './components/site/metrics'
import { Work } from './components/site/work'
import { About } from './components/site/about'
import { Contact } from './components/site/contact'
import { Footer } from './components/site/footer'
import { FloatingAssistant } from './components/site/floating-assistant'
import { ScrollProgress } from './components/ui/scroll-progress'
import { AssistantPage } from './components/assistant/assistant-page'

function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main id="main">
        <LanyardHero />
        <Expertise />
        <Metrics />
        <Work />
        <About />
        <Contact />
      </main>
      <Footer />
      <FloatingAssistant />
    </>
  )
}

export default function App() {
  useEffect(() => {
    document.title = `${name.firstname} ${name.lastname} | Software Engineer`
  }, [])

  return (
    <Router basename={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <MotionConfig reducedMotion="user">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-signal focus:px-5 focus:py-2.5 focus:font-mono focus:text-[0.68rem] focus:uppercase focus:tracking-[0.14em] focus:text-coal"
        >
          Skip to content
        </a>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assistant" element={<AssistantPage />} />
        </Routes>
      </MotionConfig>
    </Router>
  )
}
