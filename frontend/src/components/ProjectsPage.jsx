import React, { useState, useEffect } from 'react';
import AxiosInstance from './Axios'; 
import '../projects.css'; 

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalFunding, setTotalFunding] = useState(0);
  const baseUrl = import.meta.env.VITE_API_BASE_URL; 
  const userId = localStorage.getItem("userId");

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
  <div style={{ textAlign: 'center', padding: '20px', borderRadius: '10px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
    <h5 style={{ fontSize: '28px', color: 'rgb(0, 158, 116)', fontWeight: 'bold' }}>{totalProjects.toLocaleString()}</h5>
    <p style={{ fontSize: '18px', color: '#333' }}>Projects Funded</p>
  </div>
  <div style={{ textAlign: 'center', padding: '20px', borderRadius: '10px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
    <h5 style={{ fontSize: '28px', color: 'rgb(0, 158, 116)', fontWeight: 'bold' }}>${totalFunding.toLocaleString()}</h5>
    <p style={{ fontSize: '18px', color: '#333' }}>towards creative work</p>
  </div>
</div>




      <h4>Explore <span style={{ color: 'rgb(0, 158, 116)' }}>{projects.length} Projects</span></h4>
      <div className="card-container--2">
        {projects.map(project => {
          console.log(project)
          const imageUrl = `${baseUrl}${project.photo}`;
          if (project.remaining_time !== "Due date ended" && project.creator != userId) {
            console.log(project.creator);
            console.log(userId);
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
                    {/* <p>{project.creator}</p> */}
                    {/* <p>{userId}</p> */}
                    <p className="link">Click to see project</p>
                  </div>
                </a>
                <div className="card--border"></div>
              </div>
            );
          }
          return null; // 
        })}
      </div>
    </div>
  );
};

export default ProjectsPage;
