import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaCode, FaGlobe, FaChartBar, FaDatabase, FaTools, FaCloud,
  FaReact, FaNodeJs, FaJs, FaHtml5, FaCss3Alt, FaPython,
  FaGitAlt, FaDocker, FaAws, FaJava, FaRProject, FaBootstrap
} from 'react-icons/fa';
import { SiMongodb, SiExpress, SiTypescript, SiTailwindcss, SiPandas, SiNumpy, SiTensorflow, SiScikitlearn, SiPostgresql, SiMysql, SiRedis, SiJupyter, SiLinux, SiNextdotjs, SiVuedotjs, SiAngular, SiSpring, SiFlask, SiDjango, SiFastapi, SiKubernetes, SiJenkins, SiGithubactions } from 'react-icons/si';
import './Skills.css';

const Skills = () => {
  const skillCategories = [
    {
      title: 'Programming Languages',
      icon: FaCode,
      color: 'blue',
      skills: [
        { name: 'Python', level: 'Expert', icon: FaPython },
        { name: 'JavaScript', level: 'Advanced', icon: FaJs },
        { name: 'TypeScript', level: 'Intermediate', icon: SiTypescript },
        { name: 'Java', level: 'Intermediate', icon: FaJava },
        { name: 'SQL', level: 'Advanced', icon: FaDatabase },
        { name: 'R', level: 'Beginner', icon: FaRProject }
      ]
    },
    {
      title: 'Frontend Development',
      icon: FaGlobe,
      color: 'green',
      skills: [
        { name: 'React.js', level: 'Advanced', icon: FaReact },
        { name: 'Next.js', level: 'Intermediate', icon: SiNextdotjs },
        { name: 'Vue.js', level: 'Beginner', icon: SiVuedotjs },
        { name: 'Angular', level: 'Beginner', icon: SiAngular },
        { name: 'HTML5', level: 'Expert', icon: FaHtml5 },
        { name: 'CSS3', level: 'Advanced', icon: FaCss3Alt },
        { name: 'Tailwind CSS', level: 'Advanced', icon: SiTailwindcss },
        { name: 'Bootstrap', level: 'Intermediate', icon: FaBootstrap }
      ]
    },
    {
      title: 'Backend Development',
      icon: FaTools,
      color: 'purple',
      skills: [
        { name: 'Node.js', level: 'Advanced', icon: FaNodeJs },
        { name: 'Express.js', level: 'Advanced', icon: SiExpress },
        { name: 'Spring Boot', level: 'Intermediate', icon: SiSpring },
        { name: 'Flask', level: 'Intermediate', icon: SiFlask },
        { name: 'Django', level: 'Beginner', icon: SiDjango },
        { name: 'FastAPI', level: 'Intermediate', icon: SiFastapi }
      ]
    },
    {
      title: 'Data Science & ML',
      icon: FaChartBar,
      color: 'red',
      skills: [
        { name: 'Pandas', level: 'Advanced', icon: SiPandas },
        { name: 'NumPy', level: 'Advanced', icon: SiNumpy },
        { name: 'Scikit-learn', level: 'Advanced', icon: SiScikitlearn },
        { name: 'TensorFlow', level: 'Intermediate', icon: SiTensorflow },
        { name: 'Matplotlib', level: 'Advanced', icon: FaChartBar },
        { name: 'Jupyter', level: 'Advanced', icon: SiJupyter }
      ]
    },
    {
      title: 'Databases',
      icon: FaDatabase,
      color: 'yellow',
      skills: [
        { name: 'PostgreSQL', level: 'Advanced', icon: SiPostgresql },
        { name: 'MongoDB', level: 'Advanced', icon: SiMongodb },
        { name: 'MySQL', level: 'Advanced', icon: SiMysql },
        { name: 'Redis', level: 'Intermediate', icon: SiRedis }
      ]
    },
    {
      title: 'DevOps & Cloud',
      icon: FaCloud,
      color: 'indigo',
      skills: [
        { name: 'Git', level: 'Advanced', icon: FaGitAlt },
        { name: 'Docker', level: 'Intermediate', icon: FaDocker },
        { name: 'Kubernetes', level: 'Beginner', icon: SiKubernetes },
        { name: 'AWS', level: 'Intermediate', icon: FaAws },
        { name: 'Jenkins', level: 'Beginner', icon: SiJenkins },
        { name: 'GitHub Actions', level: 'Intermediate', icon: SiGithubactions },
        { name: 'Linux', level: 'Advanced', icon: SiLinux }
      ]
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

  const getColorClasses = (color) => {
    const colors = {
      blue: 'text-blue-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      red: 'text-red-600',
      yellow: 'text-yellow-600',
      indigo: 'text-indigo-600'
    };
    return colors[color] || 'text-gray-600';
  };

  const getLevelClass = (level) => {
    return level.toLowerCase();
  };

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
          </motion.h2><br/>
          
          <motion.div className="skills-grid" variants={itemVariants}>
            {skillCategories.map((category, index) => (
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
                  {category.skills.map((skill, skillIndex) => (
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
