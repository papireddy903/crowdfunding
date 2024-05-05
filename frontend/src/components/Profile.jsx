import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography } from 'mdb-react-ui-kit';
import AxiosInstance from './Axios';
import defaultImage from '../assets/default.webp';
import '../profile.css';

// Context creation with default values
const UserContext = createContext({
    user: null,
    fundCollected: 0,
    updateAuth: () => {}
});

export const useUser = () => useContext(UserContext);

// Provider Component
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [fundCollected, setFundCollected] = useState(0); // Initialized fundCollected state

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
                    console.log(response.data);
                    setUser(response.data);
                    fetchFundCollected(response.data.username); // Assuming username is part of the response
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

    const fetchFundCollected = async (username) => {
        if (!username) return; // Guard clause if username is not available

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

    useEffect(() => {
        fetchUserDetails();
    }, [fetchUserDetails]);

    const updateAuth = (token, userId) => {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
        setAuth({ token, userId });
    };

    return (
        <UserContext.Provider value={{ user, fundCollected, updateAuth }}>
            {children}
        </UserContext.Provider>
    );
};

const Profile = () => {
    const { user, fundCollected } = useUser();

    if (!user) {
        return <div>Loading... or not authenticated</div>;
    }
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(user.email)}&su=${encodeURIComponent("Subject of the Email")}&body=${encodeURIComponent("Body of the Email")}`;


    return (
        <div className="profile-page" style={{ backgroundColor: '#f0f2f5', paddingBottom: '20px' }}>
            <MDBContainer className="py-5">
                <MDBRow className="justify-content-center">
                    <MDBCol md="10">
                        <MDBCard className="mb-4">
                            <MDBCardBody className="text-center">
                                <MDBCardImage 
                                    src={defaultImage} 
                                    alt="Profile Image"
                                    className="rounded-circle img-fluid" 
                                    style={{ width: '150px', border: '5px solid white' }}
                                    fluid 
                                />
                                <MDBTypography tag="h3" className="mt-2">{user.first_name} {user.last_name}</MDBTypography>
                                <p className="text-muted">@{user.username}</p>
                                <MDBBtn outline rounded className="mb-1" onClick={() => window.open(mailtoLink, '_blank')}>Send Mail</MDBBtn>
                            </MDBCardBody>
                        </MDBCard>

                        <MDBCard className="mb-4">
                            <MDBCardBody>
                                <MDBTypography tag="h5">Contact Information</MDBTypography>
                                <p className="text-muted">Email: {user.email}</p>
                            </MDBCardBody>
                        </MDBCard>
                        <MDBCard className="mb-4">
                            <MDBCardBody>
                                <MDBTypography tag="h5">Additional Information</MDBTypography>
                                <p className="text-muted">Fund Collected: ${fundCollected}</p>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        </div>
    );
};

export default Profile;
