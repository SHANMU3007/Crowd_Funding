import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/home.css";

const Welcome = () => {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));
  const [projects, setProjects] = useState([
    {
      _id: "1",
      title: "Community Garden Project",
      description: "Help us build a community garden in the downtown area to promote urban agriculture.",
      goal: 10000,
      funded: 4500,
      createdBy: { name: "Green Thumbs Initiative" },
    },
    {
      _id: "2",
      title: "Animal Shelter Renovation",
      description: "Renovate our local animal shelter to provide better care for abandoned pets.",
      goal: 15000,
      funded: 12000,
      createdBy: { name: "Paws & Care" },
    },
    {
      _id: "3",
      title: "Tech Education for Kids",
      description: "Provide coding workshops for underprivileged children in our community.",
      goal: 8000,
      funded: 3000,
      createdBy: { name: "Code for Future" },
    },
    {
      _id: "4",
      title: "Clean Water Initiative",
      description: "Install water purification systems in rural communities.",
      goal: 20000,
      funded: 18000,
      createdBy: { name: "Aqua for All" },
    },
    {
      _id: "5",
      title: "Local Art Exhibition",
      description: "Support local artists by funding a month-long art exhibition.",
      goal: 5000,
      funded: 2500,
      createdBy: { name: "Art Collective" },
    },
    {
      _id: "6",
      title: "School Library Books",
      description: "Provide new books for our elementary school library.",
      goal: 3000,
      funded: 3000,
      createdBy: { name: "Education First" },
    },
  ]);
  const navigate = useNavigate();

  const handleDonate = async (projectId, amount) => {
    try {
      // Create Razorpay order
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/payment/orders`, {
        amount,
      });

      const { id: order_id, currency, amount: order_amount } = response.data;

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Add this to your client .env file
        amount: order_amount,
        currency,
        name: "Crowdfunding Platform",
        description: "Support a project",
        order_id,
        handler: async (response) => {
          const paymentData = {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          };

          // Verify payment
          const verifyResponse = await axios.post(
            `${process.env.REACT_APP_API_URL}/payment/verify`,
            paymentData
          );

          if (verifyResponse.data.message === "Payment verified successfully") {
            alert("Payment successful!");

            // Update project funding locally
            setProjects((prevProjects) =>
              prevProjects.map((project) => {
                if (project._id === projectId) {
                  const newFunded = Math.min(project.funded + amount, project.goal);
                  return {
                    ...project,
                    funded: newFunded,
                  };
                }
                return project;
              })
            );
          } else {
            alert("Payment verification failed!");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error initiating payment:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="app-container">
      <header className="header">Crowdfunding Platform</header>
      <nav className="nav">
        <div className="nav-container">
          <div className="logo">Crowdfunding</div>
          <ul className="nav-links">
            <li>
              <Link to="/welcome">Home</Link>
            </li>
            <li>
              <Link to="/projects">Projects</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/search">Search Projects</Link>
            </li>
          </ul>
          <div className="user-section">
            <span className="welcome-username">Hello, {user.name}!</span>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="welcome-message">
        Welcome back, <span className="welcome-username">{user.name}</span>! Ready to support some
        projects?
      </div>

      <main className="main-content">
        <section className="projects-grid">
          {projects.map((project) => {
            const percentage = Math.min(Math.round((project.funded / project.goal) * 100), 100);
            const fullyFunded = project.funded >= project.goal;

            return (
              <div className="project-card" key={project._id}>
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-creator">
                  By: {project.createdBy?.name || "Anonymous"}
                </div>
                <div className="funded-amount">
                  ${project.funded.toLocaleString()} of ${project.goal.toLocaleString()}
                </div>
                <div className="progress-container">
                  <div className="progress-text">{percentage}% funded</div>
                  <div className="progress-wrapper">
                    <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
                <button
                  onClick={() => handleDonate(project._id, 500)}
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

export default Welcome;