import React, { useState, useEffect } from 'react';
import AxiosInstance from './Axios'; 
import '../projects.css'; 

const Discover = () => {
  const [projects, setProjects] = useState([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get('/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData();
  }, []);


  const projectTypes = projects.reduce((acc, project) => {
    const type = project.project_type;
    if (acc[type]) {
      acc[type].push(project);
    } else {
      acc[type] = [project];
    }
    return acc;
  }, {});

  return (
    <div className="body">
      {Object.entries(projectTypes).map(([type, projects]) => (
        <div key={type}>
          <h2 className="project-type-title">{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
          <div className="card-container--2">
            {projects.map((project) => {
              if (project.remaining_time != "Due date ended"){
              const imageUrl = `${baseUrl}${project.photo}`;
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
            }})}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Discover;
