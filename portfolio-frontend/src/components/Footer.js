import React from 'react';
import { FaLinkedin, FaGithub, FaCode, FaDatabase, FaRocket } from 'react-icons/fa';
import { SiReact, SiPython, SiGooglecloud, SiNodedotjs } from 'react-icons/si';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Main footer content */}
        <div className="footer-main">
          {/* Brand & Philosophy */}
          <div className="footer-section brand-section">
            <div className="brand-content">
              <h3 className="footer-logo">HL</h3>
              <div className="brand-text">
                <p className="philosophy">"Code is poetry, data tells stories"</p>
                <p className="mission">Building digital solutions that bridge technology and human needs</p>
              </div>
            </div>
          </div>
          
          {/* Tech Stack Showcase */}
          <div className="footer-section tech-section">
            <h4 className="section-title-footer">Tech Arsenal</h4>
            <div className="tech-grid">
              <div className="tech-item">
                <SiReact className="tech-icon react" />
                <span>React</span>
              </div>
              <div className="tech-item">
                <SiPython className="tech-icon python" />
                <span>Python</span>
              </div>
              <div className="tech-item">
                <SiGooglecloud className="tech-icon javascript" />
                <span>Google Cloud</span>
              </div>
              <div className="tech-item">
                <SiNodedotjs className="tech-icon nodejs" />
                <span>Node.js</span>
              </div>
            </div>
          </div>
          
          {/* Current Status */}
          <div className="footer-section status-section">
            <h4 className="section-title-footer">Current Focus</h4>
            <div className="status-items">
              <div className="status-item">
                <FaRocket className="status-icon" />
                <div>
                  <p className="status-title">Building</p>
                  <p className="status-desc">Next-gen web applications</p>
                </div>
              </div>
              <div className="status-item">
                <FaDatabase className="status-icon" />
                <div>
                  <p className="status-title">Exploring</p>
                  <p className="status-desc">AI/ML integrations</p>
                </div>
              </div>
              <div className="status-item">
                <FaCode className="status-icon" />
                <div>
                  <p className="status-title">Open to</p>
                  <p className="status-desc">Collaboration & opportunities</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Connect Section */}
          <div className="footer-section connect-section">
            <h4 className="section-title-footer">Let's Connect</h4>
            <p className="connect-text">Always excited to discuss innovative projects and emerging technologies</p>
            <div className="footer-social">
              <a 
                href="https://linkedin.com/in/harsha-lekamge" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link-linkedin big-icon"
                aria-label="LinkedIn"
              >
                <FaLinkedin />
              </a>
              <a 
                href="https://github.com/harsha-lekamge" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-link-github big-icon"
                aria-label="GitHub"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>
        
        {/* Bottom signature */}
        <div className="footer-bottom">
          <div className="footer-signature">
            <p>
              © {currentYear} • Crafted with passion by <span className="highlight">Harsha Lekamge</span> • 
              <span className="location"> Sri Lanka</span>
            </p>
            <div className="footer-tagline">
              <span className="code-symbol">&lt;/&gt;</span>
              <span>Turning ideas into digital reality</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;