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

  // State to hold error messages
  const [errors, setErrors] = useState({
    username: ''
  });

  // Update state on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "username") {
      // Check for invalid characters
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
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!errors.username) {
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
    }
  };

  return (
    <MDBContainer fluid className='p-4'>
      <MDBRow>
        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
          <h1 className="my-5 display-3 fw-bold ls-tight px-3">
            The best offer <br />
            <span className="text-primary">for your business</span>
          </h1>
          <p className='px-3' style={{ color: 'hsl(217, 10%, 50.8%)' }}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
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

                <MDBBtn className='w-100 mb-4' size='md' type="submit">Sign Up</MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Signup;
