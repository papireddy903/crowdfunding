import React, { useState, useEffect } from 'react';
import AxiosInstance from './Axios'; // Adjust the import path to where your AxiosInstance is defined
import '../projects.css'; // Ensure the path to your CSS is correct

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalFunding, setTotalFunding] = useState(0);
  const baseUrl = import.meta.env.VITE_API_BASE_URL; // This assumes you have this defined in your environment variables

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get('/projects');
        const projects = response.data;
        setProjects(projects);
        const fundedProjects = projects.filter(project => parseFloat(project.current_funding) > 0).length;
        const funding = projects.reduce((acc, project) => acc + parseFloat(project.current_funding), 0);
        setTotalProjects(fundedProjects);
        setTotalFunding(funding.toFixed(2));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="body">
      <div className="hero" style={{ marginTop: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'white', padding: '20px' }}>
        <div style={{ textAlign: 'center', padding: '10px', borderRadius: '10px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h5 style={{ fontSize: '24px', color: '#3498db', fontWeight: 'bold' }}>{totalProjects}</h5>
          <p style={{ fontSize: '36px', color: '#333' }}>Projects Funded</p>
        </div>
        <div style={{ textAlign: 'center', padding: '10px', borderRadius: '10px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
          <h5 style={{ fontSize: '24px', color: '#e74c3c', fontWeight: 'bold' }}>₹{totalFunding}</h5>
          <p style={{ fontSize: '36px', color: '#333' }}>towards creative work</p>
        </div>
      </div>
      <h4>Explore <span style={{ color: 'rgb(0, 158, 116)' }}>{projects.length} Projects</span></h4>
      <div className="card-container--2">
        {projects.map(project => {
          const imageUrl = `${baseUrl}${project.photo}`; // Correct place to define imageUrl
          return (
            <div className="card--2" key={project.id}>
              <a href={`/discover/${project.id}`}>
                <div className="card--display">
                  <img className="card-image" src={imageUrl} alt={`thumbnail for ${project.title}`} />
                  <h2>{project.title}</h2>
                  <p>{project.creator.username}</p>
                  <span><i className="bx bx-time-five"></i> {project.remaining_time}</span>
                  <br />
                  <span>{project.percentage_funded}% funded</span>
                </div>
                <div className="card--hover">
                  <h2>{project.title}</h2>
                  <p>{project.description}</p>
                  <p className="link">Click to see project</p>
                </div>
              </a>
              <div className="card--border"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsPage;
