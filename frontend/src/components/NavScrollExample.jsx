import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Nav, Navbar } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import '../Navbar.css';  

function NavScrollExample() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId')
    setIsAuthenticated(!!token);
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/projects/');
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const handleSearch = (event) => {
    const { value } = event.target;
    setSearchQuery(value);
    setFilteredProjects(value ? 
      projects.filter(project =>
        project.title.toLowerCase().includes(value.toLowerCase())
      ) : []
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId')
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <Navbar expand="lg" variant="dark" bg="dark" className="navbar-custom">
      <Container fluid>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/discover">Discover</Nav.Link>
            <Nav.Link as={Link} to="/add-project">Create Campaign</Nav.Link>
          </Nav>
          <Form className="d-flex position-relative" onSubmit={e => e.preventDefault()}>
            <Form.Control
              type="search"
              placeholder="Search Projects"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearch}
              className="mr-sm-2"  
            />
            {filteredProjects.length > 0 && (
              <div className="search-results dropdown-menu show">
                {filteredProjects.map(project => (
                  <div key={project.id} onClick={() => navigate(`/discover/${project.id}`)} className="dropdown-item">
                    {project.title}
                  </div>
                ))}
              </div>
            )}
          </Form>
          {isAuthenticated ? (
            <>
              <Nav.Link as={Link} to="/profile" className="profile-link">My Profile</Nav.Link>
              <Button onClick={handleLogout} variant="outline-danger">Logout</Button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary ms-2">Login</Link>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
