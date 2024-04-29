import React, { createContext, useContext, useState, useEffect } from 'react';
import AxiosInstance from './Axios'; // Adjust the import path as necessary

const UserContext = createContext(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const token = localStorage.getItem('authToken');
            const userId = localStorage.getItem('userId'); // Get the user ID from local storage
            if (token && userId) {
                try {
                    const response = await AxiosInstance.get(`/users/${userId}/`, {
                        headers: { 'Authorization': `Token ${token}` }
                    });
                    if (response.status === 200) {
                        setUser(response.data);
                    } else {
                        throw new Error('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                    setUser(null); // Optionally handle error, e.g., clear user state
                }
            } else {
                // No token or user ID found, user is not logged in
                setUser(null);
            }
        };

        fetchUserDetails();
    }, []);

    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    );
};
