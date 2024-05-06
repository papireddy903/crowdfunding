import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AxiosInstance from './Axios';
import { useAmount } from './AmountContext';  // Context to store the amount

const Fund = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { setAmount } = useAmount();  // Use context to set the amount

    const [fundingAmount, setFundingAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

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
                setAmount(fundingAmount);  // Set the funding amount in the context
                navigate('/checkout');  // Navigate to checkout page
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
                    {isLoading ? 'Processing...' : 'Proceed to Payment'}
                </button>
            </form>
        </div>
    );
};

export default Fund;
