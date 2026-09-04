import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { name } from '../../../your_info';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { url } = name;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <nav className={`navbar navbar-expand-lg  ${isMenuOpen ? 'navbar-open' : ''}`}>
        <div className="container-fluid">
          <a className="brand" href="#Home" aria-label="Mustansir Sabir home">
            <span className="brand-mark">MS</span>
            <span className="brand-copy">
              <strong>Mustansir Sabir</strong>
              <small>software engineer</small>
            </span>
          </a>
          <button
            className={`navbar-toggler custom-toggler ${isMenuOpen ? 'open' : ''}`}
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle navigation"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div className={`collapse navbar-collapse justify-content-center ${isMenuOpen ? 'show slide-in' : ''}`}>
            <ul className="navbar-nav">
              <li className="nav-item">
                <a href="#Skills" className={`nav-link ${isMenuOpen ? 'not-blurred' : ''}`}>
                  <span className='link-span'>Skills</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#Projects" className={`nav-link ${isMenuOpen ? 'not-blurred' : ''}`}>

                  <span className='link-span'>Projects</span>
                </a>
              </li>
              <li className="nav-item">
                <a href="#AboutMe" className={`nav-link ${isMenuOpen ? 'not-blurred' : ''}`}>
                  <span className='link-span'>About Me</span>
                </a>
              </li>
              <li className="nav-item">
                <a href={url} className={`nav-link ${isMenuOpen ? 'not-blurred' : ''}`}>
                  <span className='link-span'>
                    Resume<i className="icon lni lni-download"></i>
                  </span>
                </a>
              </li>
              <li className="nav-item">
                 <Link to="/assistant" className={`nav-link mustansir-ai ${isMenuOpen ? 'not-blurred' : ''}`}>
                  <span className='link-span'>Mustansir AI</span>
                </Link>
              </li>
            </ul>
            <span className="nav-status"><i></i> available for select projects</span>
          </div>
        </div>
      </nav>
      {isMenuOpen && <div className="hero-blur" />}
    </>
  );
};

export default Navbar;
