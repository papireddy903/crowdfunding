import React, { useState } from 'react';
import AxiosInstance from './Axios'; // Assuming AxiosInstance is correctly set up

function AddProjectForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        funding_goal: '',
        project_type: '',
        photo: null,
        end_date: ''
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFileChange = (event) => {
        setFormData({
            ...formData,
            photo: event.target.files[0]
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('funding_goal', formData.funding_goal);
        data.append('project_type', formData.project_type);
        data.append('photo', formData.photo);
        data.append('end_date', formData.end_date);

        try {
            const response = await AxiosInstance.post('/projects', data);
            console.log(response.data);
            alert('Project added successfully!');
        } catch (error) {
            console.error('Failed to add project:', error);
            alert('Error adding project');
        }
    };

    return (
        <div className="add-project-container">
            <h2 className="add-project-heading">Add a New Project</h2>
            <form onSubmit={handleSubmit} className="add-project-form" encType="multipart/form-data">
                <p>
                    <label>Title:</label>
                    <input type="text" name="title" value={formData.title} onChange={handleInputChange} />
                </p>
                <p>
                    <label>Description:</label>
                    <textarea name="description" rows="4" value={formData.description} onChange={handleInputChange}></textarea>
                </p>
                <p>
                    <label>Funding Goal:</label>
                    <input type="number" name="funding_goal" value={formData.funding_goal} onChange={handleInputChange} />
                </p>
                <p>
                    <label>Project Type:</label>
                    <select name="project_type" value={formData.project_type} onChange={handleInputChange}>
                        <option value="">Select a Type</option>
                        <option value="technology">Technology</option>
                        <option value="art">Art</option>
                        <option value="comics">Comics</option>
                        <option value="games">Games</option>
                        <option value="publishing">Publishing</option>
                    </select>
                </p>
                <p>
                    <label>Upload Photo:</label>
                    <input type="file" name="photo" onChange={handleFileChange} />
                </p>
                <p>
                    <label>End Date:</label>
                    <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} />
                </p>
                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
}

export default AddProjectForm;
