import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub, FaWhatsapp, FaGlobe, FaPaperPlane } from 'react-icons/fa';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for your message! I will get back to you soon.');
      setFormData({ firstName: '', lastName: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

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
    <section id="contact" className="contact">
      <div className="container">
        <motion.div
          className="contact-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="contact-header" variants={itemVariants}>
            <h2 className="section-title">Get In Touch</h2><br/>
            <p className="contact-subtitle">
              I'm always open to discussing new opportunities, innovative projects, and collaborations. 
              Let's connect and create something amazing together!
            </p>
          </motion.div>
          
          <div className="contact-wrapper">
            <motion.div className="contact-info" variants={itemVariants}>
              <div className="contact-card">
                <h3>Contact Information</h3>
                
                <div className="contact-details">
                  <div className="contact-item">
                    <div className="contact-icon bg-blue-100">
                      <FaEnvelope />
                    </div>
                    <div>
                      <h4>Email</h4>
                      <p>lekamge.h2024@gmail.com
</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="contact-icon bg-green-100">
                      <FaPhone />
                    </div>
                    <div>
                      <h4>Phone</h4>
                      <p>+94 (77) 875-3792</p>
                    </div>
                  </div>
                  
                  <div className="contact-item">
                    <div className="contact-icon bg-purple-100">
                      <FaMapMarkerAlt />
                    </div>
                    <div>
                      <h4>Location</h4>
                      <p>Malabe, Western Province, Sri Lanka</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="social-card">
                <h3>Let's Connect</h3>
                
                <div className="social-links-horizontal">
                  <a href="https://www.linkedin.com/in/harsha-lekamge/" target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                    <FaLinkedin />
                    <span>LinkedIn</span>
                  </a>
                  
                  <a href="https://github.com/harshalekamge" target="_blank" rel="noopener noreferrer" className="social-link github">
                    <FaGithub />
                    <span>GitHub</span>
                  </a>
                      {/* WhatsApp */}
                  <a href="https://wa.me/94778753792" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                    <FaWhatsapp/><span>WhatsApp</span>
                  </a>
                  {/* Blog */}
                  <a href="" target="_blank" rel="noopener noreferrer" className="social-link blog">
                    <FaGlobe className="mr-2" /><span> Blog</span>
                  </a>
                </div>
              </div>
              
            </motion.div>
            
            <motion.form className="contact-form" onSubmit={handleSubmit} variants={itemVariants}>
              {
              //<h3>Send Me a Message</h3>
              }
              <h4 style={{color: 'red' }}>⚠️ Note: The contact form is currently under maintenance.</h4><br/><h6 style={{color: 'red' }}> I apologize for the inconvenience — it’s not working at the moment, but I’ll have it fixed soon. In the meantime, please feel free to reach out via my social links. Thank you for your understanding! 💬</h6>
              <br/>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" style={{ textDecoration: 'line-through' }}>First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName" style={{ textDecoration: 'line-through' }}>Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email" style={{ textDecoration: 'line-through' }}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="subject" style={{ textDecoration: 'line-through' }}>Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message" style={{ textDecoration: 'line-through' }}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="submit-btn"
                disabled={isSubmitting}
              >
                <FaPaperPlane />
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
