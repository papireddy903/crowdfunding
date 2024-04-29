import React, { useState } from 'react';

function AddProjectForm() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        funding_goal: '',
        project_type: '',
        photo: null,
        end_date: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (event) => {
        setFormData(prev => ({ ...prev, photo: event.target.files[0] }));
    };

    // Validation for form fields
    const validateForm = () => {
        const { title, description, funding_goal, project_type, end_date } = formData;
        if (!title || !description || !funding_goal || !project_type || !end_date) {
            setError("All fields must be filled out");
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return; // Client-side validation

        const token = localStorage.getItem('userToken');
        if (!token) {
            setError('No authentication token found');
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        setIsLoading(true);
        setError('');

        fetch('http://127.0.0.1:8000/api/projects/', {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`
            },
            body: data
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Project added successfully:', data);
            alert('Project added successfully!');
            setFormData({
                title: '',
                description: '',
                funding_goal: '',
                project_type: '',
                photo: null,
                end_date: ''
            }); // Reset form on success
        })
        .catch(error => {
            console.error('Failed to add project:', error);
            setError(error.message || 'Failed to add project. Please try again.');
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <div className="add-project-container">
            <h2>Add a New Project</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <label>Title:</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
                <label>Description:</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} required />
                <label>Funding Goal:</label>
                <input type="number" name="funding_goal" value={formData.funding_goal} onChange={handleInputChange} required />
                <label>Project Type:</label>
                <select name="project_type" value={formData.project_type} onChange={handleInputChange} required>
                    <option value="">Select a Type</option>
                    <option value="technology">Technology</option>
                    <option value="art">Art</option>
                    <option value="comics">Comics</option>
                    <option value="games">Games</option>
                    <option value="publishing">Publishing</option>
                </select>
                <label>Upload Photo:</label>
                <input type="file" name="photo" onChange={handleFileChange} required />
                <label>End Date:</label>
                <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required />
                <button type="submit" disabled={isLoading}>Submit</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default AddProjectForm;
