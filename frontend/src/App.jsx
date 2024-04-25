import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavScrollExample from './components/NavScrollExample';
import Hero from './components/Hero';
import ProjectsPage from './components/ProjectsPage';
import Project from './components/Project'; // This handles the details of a single project
import 'bootstrap/dist/css/bootstrap.min.css';
import './hero.css';

function App() {
  const heroProps = {
    total_projects: 5,
    total_funding: 5000
  };

  return (
    <Router>
      <NavScrollExample />
      <Routes>
        <Route path="/" element={<Hero {...heroProps} />} />
        <Route path="/discover" element={<ProjectsPage />} />
        <Route path="/discover/:id" element={<Project />} />
      </Routes>
    </Router>
  );
}

export default App;
