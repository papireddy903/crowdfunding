import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import AxiosInstance from './Axios';
import '../project.css'; // Importing the CSS file

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    AxiosInstance.get(`/projects/${id}`)
      .then(response => {
        // Assuming the API returns an array, take the first item
        setProject(response.data[0]);
      })
      .catch(error => {
        console.error('Error fetching project:', error);
      });
  }, [id]);

  if (!project) {
    return <div>Loading...</div>;
  }

  // Format the currency correctly
  const formatCurrency = (value) => {
    return `₹${Number(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`;
  };

  const progressWidth = (project.percentage_funded || 0).toFixed(2);

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12 text-center">
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          <hr />
        </div>
      </div>
      <div className="row">
        <div className="col-md-6">
          <img src={project.photo || '/path/to/default/image.jpg'} alt={project.title} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h3>Project Details</h3>
          <ul className="list-unstyled">
            <li><strong>Project Type:</strong> {project.project_type}</li>
            <li><strong>End Date:</strong> {project.end_date}</li>
            <li><strong>Funding Goal:</strong> {formatCurrency(project.funding_goal)}</li>
            <li><strong>Current Funding:</strong> {formatCurrency(project.current_funding)}</li>
            <li><strong>Remaining Time:</strong> {project.remaining_time}</li>
          </ul>
          {project.creator && (
            <div>
              <hr />
              <p><strong>Creator:</strong> {project.creator.username}</p>
            </div>
          )}
          <div className="progress">
            <div className="progress-bar" style={{ width: `${progressWidth}%` }} aria-valuenow={project.current_funding} aria-valuemin="0" aria-valuemax={project.funding_goal}></div>
          </div>
          <div>
            <Link to={`/fund/${project.id}`} className="btn btn-primary ms-2">Back this Project</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
