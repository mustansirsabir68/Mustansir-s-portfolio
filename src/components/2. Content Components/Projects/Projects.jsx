import React, { useRef, useState } from 'react';
import './Projects.css';
import { projectData } from '../../../your_info';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Projects = () => {
  const sliderRef = useRef(null);
  const [activeProject, setActiveProject] = useState(0);
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // Aangepaste waarde
    slidesToScroll: 1,
    afterChange: (index) => setActiveProject(index % projectData.length),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  

  const renderDemoContent = (project) => {
    if (isImageURL(project.demoUrl)) {
      return <img src={project.demoUrl} alt="Project Thumbnail" />;
    } else {
      return <iframe src={project.demoUrl} title="Project Demo" allowFullScreen />;
    }
  };

  const isImageURL = (url) => {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    return imageExtensions.some((extension) => url.toLowerCase().endsWith(extension));
  };

  return (
    <section id="Projects" className="projects section">
      <div className="container">
        <div className="section-title">
          <h3 className="wow zoomIn" data-wow-delay=".2s">
            Personal Projects
          </h3>
          <p className="wow fadeInUp" data-wow-delay=".6s">
            A diverse set of skills and technologies I have acquired to develop impactful solutions
          </p>
        </div>
        <Slider ref={sliderRef} {...settings}>
          {projectData.map((project, index) => (
            <div key={index} className="project-slide">
              <article className="card project-card">
                <div className="card-content">
                  <div className="project-meta">
                    <span>0{index + 1} / {projectData.length}</span>
                    <span>{project.category}</span>
                  </div>
                  <div className="project-layout">
                    <div className="project-copy">
                      <div className="card-header">
                        <h5 className="card-title">{project.title}</h5>
                        <p className="card-description">{project.description}</p>
                      </div>
                      <div className="project-tags" aria-label="Technologies used">
                        {project.technologies.map((technology) => <span key={technology}>{technology}</span>)}
                      </div>
                    </div>
                  <div className="demo-container">
                    {renderDemoContent(project)}
                  </div>
                  </div>
                  <div className="card-footer">
                    {project.githubUrl ? (
                      <a href={project.githubUrl} className="btn btn-primary" target="_blank" rel="noreferrer">
                        View source <span aria-hidden="true">↗</span>
                      </a>
                    ) : <span className="project-note">Featured build / source private</span>}
                  </div>
                </div>
              </article>
            </div>
          ))}
        </Slider>
        <div className="project-navigation" aria-label="Project navigation">
          <button type="button" onClick={() => sliderRef.current?.slickPrev()} aria-label="Show previous project">
            <span aria-hidden="true">←</span> Previous project
          </button>
          <span className="project-counter">0{activeProject + 1} <b>/</b> 0{projectData.length}</span>
          <button type="button" onClick={() => sliderRef.current?.slickNext()} aria-label="Show next project">
            Next project <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Projects;
