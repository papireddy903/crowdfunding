import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';

function NavScrollExample() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);  // Check for token and update authentication state
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');  // Remove the stored token
    setIsAuthenticated(false);            // Update the authentication state
    navigate('/');                         // Navigate to the home page
  };

  return (
      <Navbar expand="lg" variant="dark" bg="dark">
        <Container fluid>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              <Nav.Link as={Link} to="/">Home</Nav.Link>
              <Nav.Link as={Link} to="/discover">Discover</Nav.Link>
              <Nav.Link as={Link} to="/create">Create Campaign</Nav.Link>
            </Nav>
            <Form className="d-flex">
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <Button variant="outline-success">Search</Button>
            </Form>
            {isAuthenticated ? (
              <Button onClick={handleLogout} className="ms-2 btn btn-outline-danger">Logout</Button>
            ) : (
              <Link to="/login" className="btn btn-primary ms-2">Login</Link>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    
  );
}

export default NavScrollExample;
