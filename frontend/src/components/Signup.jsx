import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';
import AxiosInstance from './Axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    username: '',
    password: []
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      if (/[^a-zA-Z]/.test(value)) {
        setErrors({
          ...errors,
          username: 'Username must contain only letters.'
        });
      } else {
        setErrors({
          ...errors,
          username: ''
        });
      }
      setFormData({
        ...formData,
        [name]: value.replace(/[^a-zA-Z]/g, '')
      });
    } else if (name === "password") {
      let passwordErrors = [];
      if (!/[A-Z]/.test(value)) {
        passwordErrors.push('Password must include at least one uppercase letter.');
      }
      if (!/[0-9]/.test(value)) {
        passwordErrors.push('Password must include at least one number.');
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        passwordErrors.push('Password must include at least one special character.');
      }
      if (value.length < 8) {
        passwordErrors.push('Password must be at least 8 characters long.');
      }

      setErrors({
        ...errors,
        password: passwordErrors
      });

      setFormData({
        ...formData,
        [name]: value
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.username || errors.password.length) {
      alert("Please correct the errors in the form.");
      return;
    }

    try {
      const response = await AxiosInstance.post('/users/', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      console.log(response.data);
      navigate('/login');
    } catch (error) {
      console.error('Error posting data:', error.response);
    }
  };

  return (
    <MDBContainer fluid className='p-4'>
      <MDBRow>
        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
        <h1 className="my-5 display-3 fw-bold ls-tight px-3">
            Unlock Your Project's Potential <br />
            <span style={{ color: 'rgb(0, 158, 116)' }}>with Community Support</span>
        </h1>
        <p className='px-3' style={{ color: 'hsl(217, 10%, 50.8%)' }}>
            Join a thriving community where innovators and backers come together to bring incredible ideas to life. Your journey towards making an impact starts here.
        </p>


        </MDBCol>

        <MDBCol md='6'>
          <MDBCard className='my-5'>
            <MDBCardBody className='p-5'>
              <form onSubmit={handleSubmit}>
                <MDBRow>
                  <MDBCol col='6'>
                    <MDBInput wrapperClass='mb-4' label='First name' id='form1' type='text' name='firstName' onChange={handleInputChange}/>
                  </MDBCol>
                  <MDBCol col='6'>
                    <MDBInput wrapperClass='mb-4' label='Last name' id='form2' type='text' name='lastName' onChange={handleInputChange}/>
                  </MDBCol>
                </MDBRow>

                <MDBInput wrapperClass='mb-4' label='Email' id='form3' type='email' name='email' onChange={handleInputChange}/>
                <MDBInput wrapperClass='mb-4' label='Username' id='form4' type='text' name='username' onChange={handleInputChange}/>
                {errors.username && <div style={{ color: 'red' }}>{errors.username}</div>}
                <MDBInput wrapperClass='mb-4' label='Password' id='form5' type='password' name='password' onChange={handleInputChange}/>
                {errors.password.length > 0 && (
                  <ul style={{ color: 'red' }}>
                    {errors.password.map((error, index) => <li key={index}>{error}</li>)}
                  </ul>
                )}
                <label>Who is your favourite cricketer?</label>
                <MDBInput wrapperClass='mb-4'  id='form3' type='text' name='security' onChange={handleInputChange}/>


            <MDBBtn 
                className='w-100 mb-4' 
                size='md' 
                type="submit" 
                style={{ backgroundColor: 'rgb(0, 158, 116)' }}>Sign Up</MDBBtn>

              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Signup;
