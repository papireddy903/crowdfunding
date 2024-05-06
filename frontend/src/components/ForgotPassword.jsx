import React, { useState } from 'react';
import AxiosInstance from './Axios'; 
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
    const [username, setUsername] = useState('');
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();



    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const profilesResponse = await AxiosInstance.get('/user_profiles/');
            const userProfile = profilesResponse.data.find(profile => profile.user.username === username);
            if (!userProfile) {
                setError('Username not found.');
                return;
            }
            if (userProfile.favorite_cricketer.toLowerCase() === answer.toLowerCase()) {
                navigate(`/reset-password-form/${userProfile.user.id}`); // Passing userId
                console.log(userProfile.user.id)
            } else {
                setError('Incorrect answer.');
            }
        } catch (err) {
            setError('Error verifying user details.');
            console.error(err);
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
                    <label>Favorite Cricketer:</label>
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
