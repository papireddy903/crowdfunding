import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddProjectForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        funding_goal: '',
        project_type: '',
        photo: null,
        end_date: '',
        creator: '',
        rewards: '',  
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        if (userId) {
            setFormData(prev => ({ ...prev, creator: userId }));
        } else {
            navigate("/login");
        }
    }, [navigate]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === 'backers') {
            const backersIds = value.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));
            setFormData(prev => ({ ...prev, [name]: backersIds }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleFileChange = (event) => {
        setFormData(prev => ({ ...prev, photo: event.target.files[0] }));
    };

    const validateForm = () => {
        if (!formData.title || !formData.description || !formData.funding_goal || !formData.project_type || !formData.end_date || !formData.creator || !formData.rewards) {
            setError("All fields must be filled out, including a valid user ID and rewards.");
            return false;
        }
        return true;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;

        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('Authentication required. Please log in.');
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                if (Array.isArray(formData[key])) {
                    formData[key].forEach(item => data.append(`${key}[]`, item));
                } else {
                    data.append(key, formData[key]);
                }
            }
        });

        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://127.0.0.1:8000/api/projects/', {
                method: 'POST',
                headers: {
                    'Authorization': `Token ${token}`
                },
                body: data
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error('Network response was not satisfactory: ' + error);
            }

            const result = await response.json();
            console.log('Project added successfully:', result);
            alert('Project added successfully!');
            setFormData({
                title: '',
                description: '',
                funding_goal: '',
                project_type: '',
                rewards: '',
                photo: null,
                end_date: '',
                creator: ''
            });
            setSuccessMessage('Project added successfully!');
            navigate("/home");
        } catch (error) {
            console.error('Failed to add project:', error);
            setError(error.message || 'Failed to add project. Please try again.');
        } finally {
            setIsLoading(false);
        }
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
                
                <label>Rewards:</label>
                <textarea name="rewards" value={formData.rewards} onChange={handleInputChange} required />
                
                <label>Upload Photo:</label>
                <input type="file" name="photo" onChange={handleFileChange} required />
                
                <label>End Date:</label>
                <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required />
                
                <button type="submit" disabled={isLoading} style={{backgroundColor: 'rgb(0, 120, 89)'}}>Submit</button>
                
                {error && <p className="error">{error}</p>}
                {successMessage && <p className="success">{successMessage}</p>}
            </form>
        </div>
    );
}

export default AddProjectForm;
