import React, { useState, useEffect } from 'react';
import AxiosInstance from './Axios';  // Ensure correct import path
import { useNavigate } from 'react-router-dom';
import '../forgotpwd.css';

const ForgotPassword = () => {
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {
            // Fetch all user profiles to find the matching username and security question answer
            const profilesResponse = await AxiosInstance.get('/user_profiles/');
            const userProfile = profilesResponse.data.find(profile => profile.user.username === username);

            if (!userProfile) {
                setError('Username not found.');
                return;
            }

            if (userProfile.favorite_cricketer.toLowerCase() === answer.toLowerCase()) {
                navigate('/reset-password-form'); // Navigate to set new password page
            } else {
                setError('Security answer is incorrect.');
            }
        } catch (err) {
            setError('Failed to verify user details.');
            console.error('Error fetching user profiles:', err);
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Reset Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Username:</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <label>Who is your favorite cricketer?</label>
                    <input
                        type="text"
                        className="form-control"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
                {error && <p className="text-danger">{error}</p>}
            </form>
        </div>
    );
};

export default ForgotPassword;
