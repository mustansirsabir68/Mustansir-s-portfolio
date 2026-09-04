import React, { useEffect } from 'react';
import './Skillz.css';
import WOW from 'wow.js';
import { categories } from '../../../your_info';
import { Card } from 'pixel-retroui';

const Skillz = () => {
    useEffect(() => {
        new WOW().init();
    }, []);

    return (
        <section id="Skills" className="skills section">
            <div className="container">
                <div className="row">
                    <div className="col-12">
                        <div className="section-title">
                            <h3 className="wow zoomIn" data-wow-delay=".2s">
                                Skills
                            </h3>
                            <h2 className="wow fadeInUp" data-wow-delay=".4s">
                            Exploring and Expanding My area of focus
                            </h2>
                            <p className="wow fadeInUp" data-wow-delay=".6s">
                            A diverse set of skills and technologies I have acquired to develop impactful solutions
                            </p>
                        </div>
                    </div>
                </div>
                <div className="row">
                    {categories.map((category) => (
                        <div
                            key={category.name}
                            className="col-lg-4 col-md-6 col-12 d-flex"
                        >
                            <Card
                                className="single-feature wow fadeInUp flex-fill"
                                data-wow-delay=".2s"
                                bg="#fffdf5"
                                textColor="#171717"
                                borderColor="#171717"
                                shadowColor="#171717"
                            >
                                <div className="skill-icons">
                                    {category.skills.map((skill, index) => {
                                        const iconClasses = skill.icon.split(' ');
                                        return (
                                            <i
                                                key={index}
                                                className={iconClasses.join(' ')}
                                                title={skill.title}
                                            ></i>
                                        );
                                    })}
                                </div>
                                <h3>{category.title}</h3>
                                <p>{category.description}</p>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skillz;
