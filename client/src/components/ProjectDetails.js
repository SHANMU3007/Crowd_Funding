import React from 'react';
import '../styles/projectDetails.css';

const ProjectDetails = () => {
  const project = JSON.parse(localStorage.getItem("selectedProject"));

  if (!project) {
    return <h1 className="project-details-error">No project selected!</h1>;
  }

  const percentage = Math.min(Math.round((project.funded / project.goal) * 100), 100);
  const fullyFunded = project.funded >= project.goal;

  return (
    <div className="project-details-container">
      <h1 className="project-details-title">{project.title}</h1>
      <p className="project-details-description">{project.description}</p>
      <div className="project-details-creator">By: {project.createdBy?.name || 'Anonymous'}</div>
      <div className="project-details-amount">${project.funded.toLocaleString()} raised of ${project.goal.toLocaleString()} goal</div>
      <div className="progress-container">
        <div className="progress-text">{percentage}% funded</div>
        <div className="progress-wrapper">
          <div 
            className="progress-fill" 
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
      <div className="project-details-status">
        {fullyFunded ? (
          <div className="fully-funded-badge">Goal Reached!</div>
        ) : (
          <div className="funding-needed">Still needs ${(project.goal - project.funded).toLocaleString()}</div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;