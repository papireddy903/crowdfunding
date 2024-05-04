import React, { createContext, useContext, useState, useEffect } from 'react';
import AxiosInstance from './Axios'; // Make sure this path is correctly imported

const UserContext = createContext({
  user: null,
  isLoading: false,
  error: null,
  login: () => {},
  logout: () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            fetchUserDetails(token);
        } else {
            setUser(null);
        }
    }, []);

    const fetchUserDetails = async (token) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await AxiosInstance.get(`/users/${userId}/`, { // Adjust endpoint as necessary
                headers: { 'Authorization': `Token ${token}` }
            });
            if (response.status === 200) {
                setUser(response.data);
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
    };

    return (
        <UserContext.Provider value={{ user, isLoading, error, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
