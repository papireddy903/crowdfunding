import React, { useState, useEffect } from 'react';
import AxiosInstance from './Axios'; // Adjust the import path to where your AxiosInstance is defined
import '../projects.css'; // Ensure the path to your CSS is correct

const ProjectsPage = () => {
  // State for storing projects data
  const [projects, setProjects] = useState([]);
  const baseUrl = import.meta.env.VITE_API_BASE_URL; // Moved here for scope visibility

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await AxiosInstance.get('/'); // Fetch projects data from API using AxiosInstance
        setProjects(response.data); // Set projects data to state
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchData(); // Fetch data when component mounts
  }, []);

  return (
    <div className="body">
      <h4>
        Explore <span style={{ color: 'rgb(0, 158, 116)' }}>{projects.length} Projects</span>
      </h4>
      <div className="card-container--2">
        {projects.map(project => {
          const imageUrl = `${baseUrl}${project.photo}`; // Define imageUrl inside the map function
          return (
            <div className="card--2" key={project.id}>
              <a href={`/discover/${project.id}`}>
                <div className="card--display">
                  <img className="card-image" src={imageUrl} alt="thumbnail for the project" />
                  <h2>{project.title}</h2>
                  <p>{project.creator.username}</p>
                  <span>
                    <i className="bx bx-time-five"></i> {project.remaining_time}
                  </span>
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
