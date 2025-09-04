import React from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaGithub, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa';
import './Hero.css';

const Hero = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 className="hero-title" variants={itemVariants}>
            Harsha Lekamge
          </motion.h1>
          
          <motion.h2 className="hero-subtitle" variants={itemVariants}>
            Software Engineer & Data Scientist
          </motion.h2>
          
          <motion.p className="hero-description" variants={itemVariants}>
            Passionate about building innovative solutions through code and transforming data into actionable insights. 
            I create scalable software applications and extract meaningful patterns from complex datasets.
          </motion.p>
          

          {/* <motion.div className="hero-buttons" variants={itemVariants}>
            <button className="btn btn-primary">
              <FaDownload /> Download Resume
            </button>
          </motion.div>
          */}


        </motion.div>
        
        <motion.div
          className="hero-photo"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="photo-container">
            <div className="photo-placeholder">
              <span>Your Photo</span>
              <p>Add your professional photo here</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
