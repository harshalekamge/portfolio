import React from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaChartLine, FaShoppingCart, FaBrain, FaMobileAlt, FaNewspaper, FaServer } from 'react-icons/fa';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Sales Analytics Dashboard',
      description: 'A comprehensive data visualization dashboard built with Python and Streamlit to analyze sales performance, customer behavior, and market trends.',
      icon: FaChartLine,
      gradient: 'from-blue-500 to-purple-600',
      technologies: ['Python', 'Streamlit', 'Pandas'],
      github: 'https://github.com',
      live: 'https://example.com'
    },
    {
      id: 2,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with user authentication, payment integration, inventory management, and real-time order tracking.',
      icon: FaShoppingCart,
      gradient: 'from-green-500 to-teal-600',
      technologies: ['React', 'Node.js', 'MongoDB'],
      github: 'https://github.com',
      live: 'https://example.com'
    },
    {
      id: 3,
      title: 'Machine Learning Model',
      description: 'Developed a predictive model for customer churn analysis using advanced machine learning algorithms with 92% accuracy and deployed using Flask API.',
      icon: FaBrain,
      gradient: 'from-purple-500 to-pink-600',
      technologies: ['Python', 'Scikit-learn', 'Flask'],
      github: 'https://github.com',
      live: 'https://example.com'
    },
    {
      id: 4,
      title: 'Task Management App',
      description: 'A responsive web application for project management with drag-and-drop functionality, real-time collaboration, and progress tracking features.',
      icon: FaMobileAlt,
      gradient: 'from-red-500 to-orange-600',
      technologies: ['React', 'Express', 'Socket.io'],
      github: 'https://github.com',
      live: 'https://example.com'
    },
    {
      id: 5,
      title: 'News Sentiment Analyzer',
      description: 'Natural Language Processing application that analyzes news articles sentiment using BERT model and provides real-time sentiment trends and insights.',
      icon: FaNewspaper,
      gradient: 'from-indigo-500 to-blue-600',
      technologies: ['Python', 'BERT', 'FastAPI'],
      github: 'https://github.com',
      live: 'https://example.com'
    },
    {
      id: 6,
      title: 'API Gateway Service',
      description: 'Microservices architecture with API gateway, authentication middleware, rate limiting, and monitoring capabilities built with Node.js and Docker.',
      icon: FaServer,
      gradient: 'from-teal-500 to-cyan-600',
      technologies: ['Node.js', 'Docker', 'Redis'],
      github: 'https://github.com',
      live: 'https://example.com'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
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
          <br/>
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
                  <project.icon className="project-icon" />
                </div>
                
                <div className="project-content">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  
                  <div className="project-technologies">
                    {project.technologies.map(tech => (
                      <span key={tech} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  
                  <div className="project-links">
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <FaGithub /> GitHub
                    </a>
                    <a href={project.live} target="_blank" rel="noopener noreferrer">
                      <FaExternalLinkAlt /> Live Demo
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
