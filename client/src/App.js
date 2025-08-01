import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./components/Home";
import Projects from "./components/Projects";
import Welcome from "./components/Welcome";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ProjectDetails from "./components/ProjectDetails";
import "./App.css";

function App() {
  return (
      <div className="App">
    <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/project-details" element={<ProjectDetails />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
    </Router>
      </div>
  );
}

export default App;