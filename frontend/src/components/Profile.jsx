import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import AxiosInstance from './Axios'; 
import defaultImage from '../assets/default.webp'

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

// Provider Component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [auth, setAuth] = useState({
        token: localStorage.getItem('authToken'),
        userId: localStorage.getItem('userId')
    });

    const fetchUserDetails = useCallback(async () => {
        const { token, userId } = auth;
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
                setUser(null);
            }
        } else {
            setUser(null);
        }
    }, [auth]);

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    const updateAuth = (token, userId) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
        setAuth({ token, userId });
    };

    return (
        <UserContext.Provider value={{ user, updateAuth }}>
            {children}
        </UserContext.Provider>
    );
};


const Profile = () => {
    const { user } = useUser();

    if (!user) {
        return <div>Loading... or not authenticated</div>;
    }

    return (
        <div className="vh-100" style={{ backgroundColor: '#eee' }}>
            <MDBContainer className="container py-5 h-100">
                <MDBRow className="justify-content-center align-items-center h-100">
                    <MDBCol md="12" xl="4">
                        <MDBCard style={{ borderRadius: '15px' }}>
                            <MDBCardBody className="text-center">
                                <div className="mt-3 mb-4">
                                    <MDBCardImage 
                                        src={defaultImage} 
                                        className="rounded-circle" 
                                        fluid 
                                        style={{ width: '100px' }}
                                    />
                                </div>
                                <MDBTypography tag="h4">{user.username}</MDBTypography>
                                <MDBCardText className="text-muted mb-4">
                                    
                                    <p>{user.first_name} {user.last_name}</p>
                                    
                                </MDBCardText>
                                {/* <MDBBtn rounded size="lg">Message now</MDBBtn> */}
                                {/* <div className="d-flex justify-content-center text-center mt-5 mb-2">
                                    <a href={`mailto:${user.email}`} className="btn btn-primary">Email Now</a>
                                </div> */}

                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
};

export default Profile;
