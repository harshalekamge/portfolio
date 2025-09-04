import React from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaGraduationCap, FaCode, FaChartLine, FaHeart } from 'react-icons/fa';
import './About.css';

const About = () => {
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
    <section id="about" className="about">
      <div className="container">
        <motion.div
          className="about-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="about-header" variants={itemVariants}>
            <h2 className="section-title">About Me</h2>
          </motion.div>
          
          <div className="about-wrapper">
            <motion.div className="about-text" variants={itemVariants}>
              <p className="about-description">
                I'm a passionate Software Engineer and Data Scientist with expertise in building scalable applications 
                and extracting insights from complex datasets. My journey in technology spans across full-stack 
                development, machine learning, and data analytics.
              </p>
              
              <p className="about-description">
                With a strong foundation in computer science and mathematics, I enjoy tackling challenging problems 
                and creating solutions that make a real impact. I'm constantly learning new technologies and 
                methodologies to stay at the forefront of the rapidly evolving tech landscape.
              </p>
              
              <p className="about-description">
                When I'm not coding or analyzing data, I enjoy exploring new technologies, contributing to open-source 
                projects, and sharing knowledge with the developer community. I believe in continuous learning and 
                the power of collaboration to solve complex problems.
              </p>
            </motion.div>
            
            <motion.div className="about-facts" variants={itemVariants}>
              <h3>Quick Facts</h3>
              <div className="facts-list">
                <div className="fact-item">
                  <FaMapMarkerAlt className="fact-icon" />
                  <span>Based in Sri Lanka</span>
                </div>
                <div className="fact-item">
                  <FaGraduationCap className="fact-icon" />
                  <span>Computer Science Background</span>
                </div>
                <div className="fact-item">
                  <FaCode className="fact-icon" />
                  <span>Full-Stack Development</span>
                </div>
                <div className="fact-item">
                  <FaChartLine className="fact-icon" />
                  <span>Data Science & Analytics</span>
                </div>
                <div className="fact-item">
                  <FaHeart className="fact-icon" />
                  <span>Open Source Contributor</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
