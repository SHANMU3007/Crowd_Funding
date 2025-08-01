import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/project.css';

const Projects = () => {
  const navigate = useNavigate();

  const handleViewProject = (id, title, description, goal, funded, createdBy) => {
    const projectData = { 
      id,
      title,
      description,
      goal,
      funded,
      createdBy
    };
    localStorage.setItem('selectedProject', JSON.stringify(projectData));
    navigate('/project-details');
  };

  const projectList = [
    {
      id: "1",
      title: "Community Garden Project",
      description: "Help us build a community garden in the downtown area to promote urban agriculture.",
      goal: 10000,
      funded: 4500,
      createdBy: { name: "Green Thumbs Initiative" }
    },
    {
      id: "2",
      title: "Animal Shelter Renovation",
      description: "Renovate our local animal shelter to provide better care for abandoned pets.",
      goal: 15000,
      funded: 12000,
      createdBy: { name: "Paws & Care" }
    },
    {
      id: "3",
      title: "Tech Education for Kids",
      description: "Provide coding workshops for underprivileged children in our community.",
      goal: 8000,
      funded: 3000,
      createdBy: { name: "Code for Future" }
    },
    {
      id: "4",
      title: "Clean Water Initiative",
      description: "Install water purification systems in rural communities.",
      goal: 20000,
      funded: 18000,
      createdBy: { name: "Aqua for All" }
    }
  ];

  return (
    <div className="projects-app">
      <header className="projects-header">
        Crowdfunding Platform
      </header>
      <nav className="projects-nav">
        <div className="projects-nav-container">
          <div className="projects-logo">Crowdfunding</div>
          <ul className="projects-nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
          </ul>
        </div>
      </nav>

      <div className="projects-main-content">
        {projectList.map((project) => {
          const percentage = Math.min(Math.round((project.funded / project.goal) * 100), 100);

          return (
            <div className="projects-container" key={project.id}>
              <h2 className="projects-title">{project.title}</h2>
              <p className="projects-description">{project.description}</p>
              <div className="project-creator">By: {project.createdBy?.name || 'Anonymous'}</div>
              <div className="funded-amount">${project.funded.toLocaleString()} of ${project.goal.toLocaleString()}</div>
              <div className="progress-container">
                <div className="progress-text">{percentage}% funded</div>
                <div className="progress-wrapper">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
              <button
                className="projects-link-btn"
                onClick={() => handleViewProject(
                  project.id, 
                  project.title,
                  project.description,
                  project.goal,
                  project.funded,
                  project.createdBy
                )}
              >
                View Project Details
              </button>
            </div>
          );
        })}
      </div>

      <footer className="projects-footer">
        &copy; {new Date().getFullYear()} Crowdfunding Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default Projects;