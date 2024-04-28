import React, { useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from './Axios';
import { useAmount } from './AmountContext'; // Assuming this is the correct path

const Fund = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setAmount } = useAmount(); // Use the context to set the amount
    const [fundingAmount, setFundingAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Simulate a funding request to the server
            const response = await AxiosInstance.post(`/fund/${id}/`, {
                funding_amount: fundingAmount
            });
            // Simulate a response check (adjust according to actual response structure)
            if (response && response.status === 200) {
                setAmount(fundingAmount); // Set the funding amount in context
                navigate('/checkout');
            } else {
                throw new Error('Failed to process the funding');
            }
        } catch (error) {
            console.error("Funding error:", error);
            setError('Failed to fund the project. Please try again.');
        } finally {
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
