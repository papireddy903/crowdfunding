import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBIcon
} from 'mdb-react-ui-kit';
import { useNavigate, Link } from 'react-router-dom';
import AxiosInstance from './Axios'; // Ensure this path is correct

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/'); // Navigate to home if already authenticated
    }
  }, [navigate]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await AxiosInstance.post('/login/', { username, password });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        navigate('/'); // Navigate to home after login
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      setError(err.response?.data.error || 'Failed to login');
      console.error('Login error:', err);
    }
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column w-50">
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
      <div className="text-center">
        <p>Not a member? <Link to="/register">Register</Link></p>
        <p>or sign up with:</p>
        {/* Social login placeholders */}
        <div className='d-flex justify-content-between mx-auto' style={{width: '40%'}}>
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
