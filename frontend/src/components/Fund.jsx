import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from './Axios'; // Make sure this path is correct
import { useUser } from './UserContext'; // Adjust the import path as needed

const Fund = () => {
    const { id } = useParams(); // Getting the project ID from the URL
    const { user, isLoading: userLoading } = useUser();
    const navigate = useNavigate();

    const [fundingAmount, setFundingAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!userLoading && !user) {
            navigate('/login');
        }
    }, [user, userLoading, navigate]);

    const handleFundingAmountChange = (e) => {
        setFundingAmount(e.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!fundingAmount) return; // Prevents submission without an amount
        
        setIsLoading(true);
        setError('');

        try {
            const response = await AxiosInstance.post(`/fund/${id}/`, {
                funding_amount: fundingAmount
            }, {
                headers: { Authorization: `Token ${localStorage.getItem('authToken')}` }
            });
            
            if (response.status === 200) {
                navigate('/success'); // Redirect to success page or handle as needed
            } else {
                throw new Error('Failed to process the funding');
            }
        } catch (error) {
            console.error("Funding error:", error);
            setError(error.response?.data?.detail || 'Failed to fund the project. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (userLoading) {
        return <div>Loading...</div>; // Loading indicator while checking user authentication
    }

    return (
        <div className="fund-container">
            <h1>Fund Project</h1>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="fundingAmount">Enter Amount:</label>
                    <input
                        type="number"
                        className="form-control"
                        id="fundingAmount"
                        value={fundingAmount}
                        onChange={handleFundingAmountChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Funding...' : 'Fund'}
                </button>
            </form>
        </div>
    );
};

export default Fund;
