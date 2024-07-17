import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
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
        navigate('/home'); // 
      } else {
        throw new Error('No token received');
      }
    } catch (err) {
      setError(err.response?.data.error || 'Failed to login');
    }
  };

  return (
    <MDBContainer className="p-3 my-5 d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px' }}>
        <MDBInput className='mb-4' label='Username' type='text' onChange={e => setUsername(e.target.value)} value={username} />
        <MDBInput className='mb-4' label='Password' type='password' onChange={e => setPassword(e.target.value)} value={password} />
        <MDBBtn className="w-100 mb-4" type="submit" style={{ backgroundColor: 'rgb(0, 120, 89)' }}>Sign in</MDBBtn>
        {error && <div className="text-danger">{error}</div>}
        <div className="text-center w-100">
          <Link to="/forgot-password" style={{ color: 'rgb(0, 120, 89)' }}>Forgot Password?</Link>
        </div>
      </form>
      <div className="text-center w-100">
        <p>Not a member? <Link to="/register" style={{ color: 'rgb(0, 120, 89)' }}><span>Register</span></Link></p>
      </div>
    </MDBContainer>
  );
}

export default Login;
