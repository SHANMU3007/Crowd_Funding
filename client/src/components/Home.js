import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import '../styles/home.css';

const Home = () => {
  const [projects] = useState([
    {
      _id: "1",
      title: "Community Garden Project",
      description: "Help us build a community garden in the downtown area to promote urban agriculture.",
      goal: 10000,
      funded: 4500,
      createdBy: { name: "Green Thumbs Initiative" }
    },
    {
      _id: "2",
      title: "Animal Shelter Renovation",
      description: "Renovate our local animal shelter to provide better care for abandoned pets.",
      goal: 15000,
      funded: 12000,
      createdBy: { name: "Paws & Care" }
    },
    {
      _id: "3",
      title: "Tech Education for Kids",
      description: "Provide coding workshops for underprivileged children in our community.",
      goal: 8000,
      funded: 3000,
      createdBy: { name: "Code for Future" }
    },
    {
      _id: "4",
      title: "Clean Water Initiative",
      description: "Install water purification systems in rural communities.",
      goal: 20000,
      funded: 18000,
      createdBy: { name: "Aqua for All" }
    },
    {
      _id: "5",
      title: "Local Art Exhibition",
      description: "Support local artists by funding a month-long art exhibition.",
      goal: 5000,
      funded: 2500,
      createdBy: { name: "Art Collective" }
    },
    {
      _id: "6",
      title: "School Library Books",
      description: "Provide new books for our elementary school library.",
      goal: 3000,
      funded: 3000,
      createdBy: { name: "Education First" }
    }
  ]);
  const navigate = useNavigate();

  const handleDonate = (projectId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/welcome");
  };

  return (
    <div className="app-container">
      <header className="header">
        Crowdfunding Platform
      </header>
      <nav className="nav">
        <div className="nav-container">
          <div className="logo">
            Crowdfunding
          </div>
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/search">Search Projects</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <section className="projects-grid">
          {projects.map((project) => {
            const percentage = Math.min(Math.round((project.funded / project.goal) * 100), 100);
            const fullyFunded = project.funded >= project.goal;

            return (
              <div className="project-card" key={project._id}>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
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
                  onClick={() => handleDonate(project._id)}
                  disabled={fullyFunded}
                  className="donate-btn"
                >
                  {fullyFunded ? "Goal Reached" : "Donate $500"}
                </button>
              </div>
            );
          })}
        </section>
      </main>

      <footer className="footer">
        &copy; {new Date().getFullYear()} Crowdfunding Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;