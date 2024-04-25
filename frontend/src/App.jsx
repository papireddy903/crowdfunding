import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavScrollExample from './components/NavScrollExample';
// import Hero from './components/Hero';
import Landing from './components/Landing';
import ProjectsPage from './components/ProjectsPage';
import Project from './components/Project';
import Login from './components/Login';
import Signup from './components/Signup';
import 'bootstrap/dist/css/bootstrap.min.css';
import './hero.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Fund from './components/Fund';
import Funding_success from './components/Funding_success';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && <NavScrollExample />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<ProjectsPage />} />
        <Route path="/discover/:id" element={<Project />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fund/:id" element={<Fund />} />
        <Route path="/success" element={<Funding_success />} />
      </Routes>
    </>
  );
}

export default App;
