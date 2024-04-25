import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import AxiosInstance from './Axios'; // Make sure the path matches where you've defined AxiosInstance

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);  // Set based on token presence
    if (token) {
      navigate('/'); // Navigate to home
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await AxiosInstance.post('/login/', {
        username: username,
        password: password
      });
      localStorage.setItem('authToken', response.data.token);
      console.log('Token:', response.data.token);
      setIsAuthenticated(true);  // Update authentication state
      setError('');
      navigate('/'); // Navigate to home or dashboard after login
    } catch (err) {
      if (err.response) {
        setError(err.response.data.detail || 'Failed to login');
      } else {
        setError('The server is not responding.');
      }
      console.error('Login error:', err);
      setIsAuthenticated(false);
    }
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
      {!isAuthenticated && (
        <form onSubmit={handleLogin}>
          <MDBInput 
            wrapperClass='mb-4' 
            label='Username' 
            id='form1' 
            type='text'
            onChange={e => setUsername(e.target.value)} 
            value={username}
          />
          <MDBInput 
            wrapperClass='mb-4' 
            label='Password' 
            id='form2' 
            type='password'
            onChange={e => setPassword(e.target.value)} 
            value={password}
          />

          

          <MDBBtn className="mb-4" type="submit">Sign in</MDBBtn>
          {error && <div className="text-danger">{error}</div>}
        </form>
      )}

      <div className="text-center">
        <p>Not a member? <a href="#!">Register</a></p>
        <p>or sign up with:</p>

        <div className='d-flex justify-content-between mx-auto' style={{width: '40%'}}>
          {/* Icons could be linked to OAuth login mechanisms in future enhancements */}
          <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
            <MDBIcon fab icon='facebook-f' size="sm"/>
          </MDBBtn>

          <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
            <MDBIcon fab icon='twitter' size="sm"/>
          </MDBBtn>

          <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
            <MDBIcon fab icon='google' size="sm"/>
          </MDBBtn>

          <MDBBtn tag='a' color='none' className='m-1' style={{ color: '#1266f1' }}>
            <MDBIcon fab icon='github' size="sm"/>
          </MDBBtn>
        </div>
      </div>
    </MDBContainer>
  );
}

export default Login;
