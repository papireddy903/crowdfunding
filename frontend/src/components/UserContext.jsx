import React, { createContext, useContext, useState, useEffect } from 'react';
import AxiosInstance from './Axios';

const UserContext = createContext({
  user: null,
  isLoading: false,
  error: null,
  fundCollected: 0,
  login: () => {},
  logout: () => {},
  fetchUserDetails: () => {},
  fetchFundCollected: () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fundCollected, setFundCollected] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchUserDetails(token);
        }
    }, []);

    const fetchUserDetails = async (token) => {
        setIsLoading(true);
        setError(null);
        try {
            // Assuming the user ID needs to be extracted from the token or stored elsewhere
            const userId = extractUserId(token); // You need to implement this according to your auth logic
            const response = await AxiosInstance.get(`/users/${userId}/`, {
                headers: { 'Authorization': `Token ${token}` }
            });
            if (response.status === 200) {
                setUser(response.data);
                fetchFundCollected(response.data.username);
            } else {
                throw new Error('Failed to fetch user data');
            }
        } catch (error) {
            console.error("Failed to fetch user data:", error);
            setError(error.message);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFundCollected = async (username) => {
        if (!username) return;

        try {
            const response = await AxiosInstance.get('/creators/');
            if (response.status === 200) {
                const creatorData = response.data.find(creator => creator.user && creator.user.username === username);
                if (creatorData) {
                    setFundCollected(creatorData.fund_collected);
                } else {
                    setFundCollected(0);
                }
            } else {
                throw new Error('Failed to fetch creators data');
            }
        } catch (error) {
            console.error("Failed to fetch creators data:", error);
            setFundCollected(0);
        }
    };

    const login = async (username, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await AxiosInstance.post('/auth/login/', {
                username,
                password
            });
            if (response.status === 200) {
                localStorage.setItem('authToken', response.data.token);
                fetchUserDetails(response.data.token);
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setUser(null);
        setFundCollected(0);
    };

    return (
        <UserContext.Provider value={{ user, fundCollected, isLoading, error, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};