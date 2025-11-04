import React from 'react';
import { motion } from 'framer-motion';
import './Skills.css';

// ================= ICON IMPORTS =================
import {
  FaCode, FaPython, FaJava, FaJs, FaHtml5, FaDatabase, FaReact,
  FaGitAlt, FaGithub, FaGithubSquare, FaTerminal, FaCloud,
  FaDocker, FaLinux, FaRobot, FaMicrochip, FaLaptopCode,
  FaPalette, FaCogs, FaFigma, FaBrain, FaVuejs
} from 'react-icons/fa';

import {
  SiTypescript, SiMongodb, SiFastapi, SiTailwindcss, SiMysql,
  SiKubernetes, SiCanva, SiCplusplus,
  SiOpenai, SiGoogle
} from 'react-icons/si';

import { FaRProject } from 'react-icons/fa6';

// ================= MAIN COMPONENT =================
const Skills = () => {
  const skillCategories = [
    // 🧠 Programming & Software Development
    {
      title: 'Programming & Software Development',
      icon: FaCode,
      color: 'blue',
      skills: [
        { name: 'Python', level: 'Advanced', icon: FaPython },
        { name: 'Java', level: 'Advanced', icon: FaJava },
        { name: 'C / C++', level: 'Advanced', icon: SiCplusplus },
        { name: 'JavaScript', level: 'Advanced', icon: FaJs },
        { name: 'TypeScript', level: 'Intermediate', icon: SiTypescript },
        { name: 'HTML, CSS, JS', level: 'Advanced', icon: FaHtml5 },
        { name: 'SQL', level: 'Advanced', icon: FaDatabase },
        { name: 'R', level: 'Advanced', icon: FaRProject }
      ]
    },
    
// ⚛️ Web & App Development
{
  title: 'Web & App Development',
  icon: FaLaptopCode,
  color: 'purple',
  skills: [
    { name: 'MERN Stack (MongoDB, Express, React, Node.js)', level: 'Advanced', icon: SiMongodb },
    { name: 'React.js', level: 'Advanced', icon: FaReact },
    { name: 'Vue.js', level: 'Intermediate', icon: FaVuejs },
    { name: 'FastAPI', level: 'Intermediate', icon: SiFastapi },
    { name: 'Tailwind CSS', level: 'Intermediate', icon: SiTailwindcss },
    { name: 'OOP Concepts', level: 'Advanced', icon: FaCogs }
  ]
},

// 🐍 Python Libraries & Frameworks
{
  title: 'Python Libraries & Frameworks',
  icon: FaPython,
  color: 'yellow',
  skills: [
    { name: 'NumPy', level: 'Advanced' },
    { name: 'Pandas', level: 'Advanced' },
    { name: 'Matplotlib', level: 'Intermediate' }, // Plotly as an alternative
    { name: 'Scikit-Learn', level: 'Intermediate' },
    { name: 'TensorFlow', level: 'Intermediate'},
    { name: 'PyTorch', level: 'Intermediate' },
    { name: 'FastAPI', level: 'Intermediate'},
    { name: 'Django', level: 'Intermediate' },
    { name: 'Flask', level: 'Intermediate'}
  ]
},

// ☁️ Cloud Computing & DevOps
{
  title: 'Cloud Computing & DevOps',
  icon: FaCloud,
  color: 'cyan',
  skills: [
    { name: 'AWS', level: 'Intermediate'}, 
    { name: 'Azure', level: 'Intermediate'}, 
    { name: 'Docker', level: 'Beginner', icon: FaDocker },
    { name: 'Kubernetes', level: 'Beginner', icon: SiKubernetes },
    { name: 'Linux', level: 'Learning', icon: FaLinux }
  ]
},

// 🎨 UI/UX Design
{
  title: 'UI/UX Design',
  icon: FaPalette,
  color: 'pink',
  skills: [
    { name: 'Figma', level: 'Advanced', icon: FaFigma },
    { name: 'Canva', level: 'Advanced', icon: SiCanva }
  ]
},

// ⚙️ Version Control & Collaboration
{
  title: 'Version Control & Collaboration',
  icon: FaGitAlt,
  color: 'orange',
  skills: [
    { name: 'GitHub', level: 'Advanced', icon: FaGithub },
    { name: 'GitHub Desktop', level: 'Advanced', icon: FaGithubSquare },
    { name: 'Git Bash', level: 'Intermediate', icon: FaTerminal }
  ]
},

// 🤖 AI, LLMs & Data Technologies
{
  title: 'AI, LLMs & Data Technologies',
  icon: FaRobot,
  color: 'green',
  skills: [
    { name: 'OpenAI', level: 'Used', icon: SiOpenai },
    { name: 'Qwen', level: 'Used', icon: FaBrain },
    { name: 'Gemini', level: 'Used', icon: SiGoogle },
    { name: 'Grok', level: 'Used', icon: FaMicrochip }
  ]
},
// 🗄️ Database Technologies
{
  title: 'Database Technologies',
  icon: FaDatabase,
  color: 'teal',
  skills: [
    { name: 'MySQL', level: 'Intermediate', icon: SiMysql },
    { name: 'MongoDB', level: 'Advanced', icon: SiMongodb },
    { name: 'SQL', level: 'Advanced', icon: FaDatabase }
  ]
},



  ];

  // ================= ANIMATIONS =================
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
    visible: { y: 0, opacity: 1 }
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      indigo: 'text-indigo-600',
      pink: 'text-pink-600',
      orange: 'text-orange-600',
      cyan: 'text-cyan-600',
      teal: 'text-teal-600'
    };
    return colors[color] || 'text-gray-600';
  };

  const getLevelClass = (level) => level.toLowerCase();

  // ================= RENDER =================
  return (
    <section id="skills" className="skills">
      <div className="container">
        <motion.div
          className="skills-content"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.h2 className="section-title" variants={itemVariants}>
            Skills & Technologies
          </motion.h2>
          <br />
          <motion.div className="skills-grid" variants={itemVariants}>
            {skillCategories.map((category) => (
              <motion.div
                key={category.title}
                className="skill-category"
                variants={itemVariants}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`category-icon ${getColorClasses(category.color)}`}>
                  <category.icon />
                </div>
                <h3 className="category-title">{category.title}</h3>
                <div className="skills-list">
                  {category.skills.map((skill) => (
                    <div key={skill.name} className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className={`skill-level ${getLevelClass(skill.level)}`}>
                          {skill.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Skills;
