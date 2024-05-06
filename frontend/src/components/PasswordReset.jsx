import React, { useState } from 'react';
import AxiosInstance from './Axios';
import { useNavigate, useParams } from 'react-router-dom';

const PasswordReset = () => {
    const { userId } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    console.log(userId)

    const handleResetPassword = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        if (!userId) {
            setError("User identification has failed.");
            return;
        }
        try {
            const response = await AxiosInstance.put(`/users/${userId}/`, { password });
            if (response.status === 200) {
                alert('Password reset successfully.');
                navigate('/login');
            } else {
                throw new Error('Failed to reset password.');
            }
        } catch (error) {
            setError('Failed to reset password.');
            console.error(error);
        }
    };

    return (
        <div className="reset-password-form">
            <h2>Reset Your Password</h2>
            <form onSubmit={handleResetPassword}>
                <div className="form-group">
                    <label>New Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                    <label>Confirm New Password:</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Reset Password</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default PasswordReset;
