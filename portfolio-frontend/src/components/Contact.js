import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGithub,
  FaWhatsapp,
  FaGlobe,
  FaPaperPlane,
  FaFacebook,
  FaInstagram
} from 'react-icons/fa';
// Import supabase from the parent folder (src/)
import { supabase } from '../supabaseClient'; 
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
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

    // Validation: Ensure either email or phone is provided
    if (!formData.email && !formData.phone) {
      alert('Please provide either an Email Address or a Phone Number so I can get back to you.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Sending data to Supabase table
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            phone: formData.phone, 
            message: formData.message 
          }
        ]);

      if (error) throw error;

      alert('Thank you! Your message has been sent successfully.');
      // Reset form
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (error) {
      console.error('Error:', error.message);
      alert('Oops! Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
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
                      <p>lekamge.h2024@gmail.com</p>
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

                  <a href="https://wa.me/94778753792" target="_blank" rel="noopener noreferrer" className="social-link whatsapp">
                    <FaWhatsapp/><span>WhatsApp</span>
                  </a>

                  <a href="#" target="_blank" rel="noopener noreferrer" className="social-link blog">
                    <FaGlobe className="mr-2" /><span> Blog</span>
                  </a>
                  <a
                    href="https://www.facebook.com/harsha.lekamgeiii.1?mibextid=rS40aB7S9Ucbxw6v"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link facebook"
                  >
                    <span>Facebook</span>
                  </a>

                  <a
                    href="https://www.instagram.com/harsha_lekamge?igsh=enJyeW45N25sY3lm&utm_source=ig_contact_invite"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link instagram"
                  >
                    <FaInstagram />
                    <span>Instagram</span>
                  </a>

                  <a
                    href="https://www.onebillionlabs.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-link website"
                  >
                    <FaGlobe />
                    <span>OneBillionLabs</span>
                  </a>

                </div>
              </div>
            </motion.div>
            
            <motion.form className="contact-form" onSubmit={handleSubmit} variants={itemVariants}>
              <h3>Send Me a Message</h3>
              <p style={{ fontSize: '0.85rem', marginBottom: '1.5rem', color: '#666' }}>
                Please provide your name and at least one way to contact you (Email or Phone).
              </p>

              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="+94 ..."
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  placeholder="Tell me about your project or inquiry..."
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
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <FaPaperPlane style={{ marginRight: '8px' }} />
                    Send Message
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;