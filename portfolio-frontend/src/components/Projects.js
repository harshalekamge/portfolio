import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaFigma } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Sales Shoe Mart – Mobile App UI',
      description:
        'A visually balanced Figma mobile UI for a shoe retailer featuring golden-ratio layouts, smooth transitions, custom branding, and high-quality product visuals optimized for modern mobile devices.',
      gradient: 'from-pink-500 to-red-500',
      image: '/images/demoFIGMA.png',
      technologies: ['Figma', 'UI Design', 'Prototyping', 'Golden Ratio'],
      figma:
        'https://www.figma.com/design/vplOGgFsPXLNrstrGGs4gL/MAD_lab_test_01',
      live:
        'https://www.figma.com/proto/vplOGgFsPXLNrstrGGs4gL/MAD_lab_test_01'
    },
    {
      id: 2,
      title: 'Saloon Ceylonima Web Site',
      description:
        'A luxury salon website built with React and TypeScript, featuring refined visuals, elegant typography, and smooth interactions. Designed with Tailwind CSS and responsive layouts to deliver a polished, high-end digital experience across all devices.',
      gradient: 'from-green-500 to-teal-600',
      image: '/images/SaloonCeylonima.png',
      technologies: ['React', 'Firebase', 'UI/UX Design', 'Brand Identity'],
      live: 'https://testsaloonceylonima.web.app/'
    },
    {
      id: 3,
      title: 'Saloon Velora Web Site',
      description:
        'A premium, AI-powered salon website developed with React 19 and TypeScript. Combines luxury design, real-time 3D visuals, and an intelligent AI beauty assistant to create an immersive, modern, and responsive brand experience',
      gradient: 'from-purple-500 to-pink-600',
      image: '/images/SaloonVelora.png',
      technologies: ['React', 'Firebase', 'Responsive Design', 'Branding', 'TypeScript', 'Tested'],
      live: 'https://testsaloonvelora.web.app/'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { delayChildren: 0.3, staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <section id="projects" className="projects">
      <div className="container">
        <motion.div
          className="projects-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 className="section-title" variants={itemVariants}>
            Featured Projects
          </motion.h2>

          <motion.div className="projects-grid" variants={itemVariants}>
            {projects.map(project => (
              <motion.div
                key={project.id}
                className="project-card"
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`project-image bg-gradient-to-br ${project.gradient}`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="project-preview"
                  />
                </div>

                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>

                  <div className="project-technologies">
                    {project.technologies.map(tech => (
                      <span key={tech} className="tech-tag">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="project-links">
                    {project.figma && (
                      <a
                        href={project.figma}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaFigma /> Figma
                      </a>
                    )}
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FaExternalLinkAlt /> Live Site
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Projects;
