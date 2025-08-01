import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const Login = () => {
  const [formData, setFormData] = useState({
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

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please provide both email and password");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/welcome");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <div className="form-container">
        <h1>Welcome Back</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            Log In
          </button>
        </form>
        <Link to="/signup" className="auth-link">Don't have an account? Sign up</Link>
      </div>
    </div>
  );
};

export default Login;