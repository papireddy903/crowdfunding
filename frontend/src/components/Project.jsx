import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AxiosInstance from './Axios';
import '../project.css'; // Importing the CSS file

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    AxiosInstance.get(`/${id}`)
      .then(response => {
        setProject(response.data);
      })
      .catch(error => {
        console.error('Error fetching project:', error);
      });
  }, [id]);

  if (!project) {
    return <div>Loading...</div>;
  }

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
          <img src={project[0].photoUrl} alt={project[0].title} className="img-fluid" />
        </div>
        <div className="col-md-6">
          <h3>project Details</h3>
          <ul className="list-unstyled">
            <li><strong>project Type:</strong> {project[0].project_type}</li>
            <li><strong>End Date:</strong> {project[0].end_date}</li>
            <li><strong>Funding Goal:</strong> ₹{project[0].funding_goal}</li>
            <li><strong>Current Funding:</strong> ₹{project[0].current_funding}</li>
          </ul>
          <p>{project[0].creator}</p>

          {project[0].creator && project[0].creator.username !== 'currentUser' && (
            <div>
              <hr />
              <div style={{ marginBottom: '20px' }}>
                <p><strong>Creator:</strong> <a href={`/users/${project[0].creator.id}`}>{project[0].creator.username}</a></p>
                <p><strong>Remaining Time:</strong> {project[0].remaining_time}</p>
                <a href={`/fund/${project[0].id}`} className="btn btn-success">Fund this project[0]</a>
              </div>
            </div>
          )}
          <div className="progress">
            <div className="progress-bar" style={{ width: `${project[0].progressWidth}%` }} aria-valuenow={project.current_funding} aria-valuemin="0" aria-valuemax={project.funding_goal}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
