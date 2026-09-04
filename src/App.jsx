import React, { useState, useEffect } from 'react';

// 1. Header Components
import Hero from './components/1. Header Components/Hero/Hero';

// 2. Content Components
import Skillz from './components/2. Content Components/Skillz/Skillz';
import Achievement from './components/2. Content Components/Achievement/Achievement';
import Projects from './components/2. Content Components/Projects/Projects';


// 3. Footer Component
import AboutMe from './components/3. Footer Components/AboutMe/AboutMe';

// 4. Utility Components
import Spinner from './components/4. Utility Components/Spinner/Spinner';
import AIAssistant from './components/4. Utility Components/AIAssistant/AIassistant';
import FloatingAssistant from './components/4. Utility Components/AIAssistant/FloatingAssistant';
import { name } from './your_info';
import ScrollToTopButton from './components/4. Utility Components/ScrollToTopButton/ScrollToTopButton';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function Home() {
  return (
    <>
      <Hero />
      <Skillz />
      <ScrollToTopButton />
      <Achievement />
      <Projects />
      <AboutMe />
      <FloatingAssistant />
      <footer className="site-footer">
        <span>Mustansir Sabir</span>
        <p>&copy; {new Date().getFullYear()}. Built with care.</p>
      </footer>
    </>
  );
}
function App() {
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    document.title = `${name.firstname} ${name.lastname}`;
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, []);

  return (
    <Router>
      {loading ? (
        <Spinner />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assistant" element={<AIAssistant />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;


