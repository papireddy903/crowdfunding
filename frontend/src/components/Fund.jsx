import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AxiosInstance from './Axios';
import { useNavigate } from 'react-router-dom'; // Correctly imported

const Fund = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // Use 'navigate' as the conventional name
    const [fundingAmount, setFundingAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const response = await AxiosInstance.post(`/fund/${id}`, {
                funding_amount: fundingAmount
            });
            // After successful funding, navigate to the success page
            navigate('/success'); // Use a relative path that matches your routing configuration
            setIsLoading(false);
        } catch (error) {
            console.error("Funding error:", error);
            setError('Failed to fund the project. Please try again.');
            setIsLoading(false);
        }
    };

    const handleFundingAmountChange = (e) => {
        setFundingAmount(e.target.value);
    };

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
