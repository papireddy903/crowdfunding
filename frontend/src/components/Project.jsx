import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AxiosInstance from './Axios';  

const Project = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [creator, setCreator] = useState(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    AxiosInstance.get(`/projects/${id}`)
      .then(response => {
        setProject(response.data);
        console.log(response.data[0].creator);
        
        if (response.data[0].creator) {
          fetchCreator(response.data[0].creator);
        }
      })
      .catch(error => {
        console.error('Error fetching project:', error);
      });
  }, [id]);

  const fetchCreator = (creatorId) => {
    AxiosInstance.get(`/creators/${creatorId}`)
      .then(response => {
        console.log(response);
        setCreator(response.data.username);
      })
      .catch(error => {
        console.error('Error fetching creator:', error);
      });
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  const formatCurrency = (value) => {
    return `$${Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  const progressWidth = `${project[0].percentage_funded || 0}%`;
  const imageUrl = `${baseUrl}${project[0].photo}`;

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 text-center">
          <h1>{project[0].title}</h1>
          <p>{project[0].description}</p>
          <hr />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <img src={imageUrl} alt={project[0].title} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h3>Project Details</h3>
          <ul className="list-unstyled">
            <li><strong>Project Type:</strong> {project[0].project_type}</li>
            <li><strong>End Date:</strong> {project[0].end_date}</li>
            <li><strong>Funding Goal:</strong> {formatCurrency(project[0].funding_goal)}</li>
            <li><strong>Current Funding:</strong> {formatCurrency(project[0].current_funding)}</li>
            <li><strong>Remaining Time:</strong> {project[0].remaining_time}</li>
            <li><strong>Rewards:</strong> {project[0].rewards}</li>
          </ul>
          {creator && (
            <div>
              <hr />
              <p><strong>Creator:</strong> {creator}</p>
            </div>
          )}
          <div className="progress">
            <div className="progress-bar" style={{ width: progressWidth }} aria-valuenow={project.current_funding} aria-valuemin="0" aria-valuemax={project.funding_goal}></div>
          </div>
          <div>
            <Link to={`/fund/${project[0].id}`} className="btn btn-primary ms-2">Back this Project</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
