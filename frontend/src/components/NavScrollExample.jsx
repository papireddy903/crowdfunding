import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import '../Navbar.css'


function NavScrollExample() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/projects/');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error("Failed to fetch projects:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    if (event.target.value === "") {
      setFilteredProjects([]);
    } else {
      const filtered = projects.filter(project =>
        project.title.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <Navbar expand="lg" variant="dark" bg="dark">
      <Container fluid>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/discover">Discover</Nav.Link>
            <Nav.Link as={Link} to="/add-project">Create Campaign</Nav.Link>
          </Nav>
          <Form className="d-flex position-relative" onSubmit={(e) => e.preventDefault()}>
            <Form.Control
              type="search"
              placeholder="Search Projects"
              className="me-2"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearch}
            />
            {/* <Button variant="outline-success">Search</Button> */}
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
