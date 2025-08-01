import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password } = formData;

    if (!name || !email || !password) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/signup`, { name, email, password });
      
      if (response.data.user) {
        alert("Signup Successful! You can now login.");
        navigate("/login");
      } else {
        setError(response.data.message || "Signup failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h1>Create Account</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"                                                                                                                                                                                                                                                                                       
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Create a password (min 6 chars)"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="submit-btn">
            Sign Up
          </button>
        </form>
        <Link to="/login" className="auth-link">Already have an account? Log in</Link>
      </div>
    </div>
  );
};

export default Signup;