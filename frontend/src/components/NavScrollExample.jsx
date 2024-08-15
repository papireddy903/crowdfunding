import React, { useState, useEffect } from 'react';
import { Button, Container, Navbar, Nav, Form, FormControl } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FiAlignJustify } from "react-icons/fi";
import '../Navbar.css';  

function NavScrollExample() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userId = localStorage.getItem('userId');
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
    if (value) {
      setFilteredProjects(projects.filter(project =>
        project.title.toLowerCase().includes(value.toLowerCase())
      ));
    } else {
      setFilteredProjects([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <Navbar expand="lg" className="navbar-custom" style={{ backgroundColor: 'rgb(50, 50, 50)'}}>
      <Container fluid>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0 flex-grow-1 justify-content-center align-items-center">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/discover">Discover</Nav.Link>
            <Nav.Link as={Link} to="/add-project">Create Campaign</Nav.Link>
            <Nav.Link as={Link} to="/myprojects">My Campaigns</Nav.Link>
            <Navbar.Brand className="web-title mx-auto" style={{ color: 'white', fontSize:'25px'}}>
              Crowdfunding
            </Navbar.Brand>
          </Nav>
          <Form className="d-flex position-relative" onSubmit={e => e.preventDefault()} style={{ marginRight: '10px' }}>
                <FormControl
                  type="search"
                  placeholder="Search Projects"
                  aria-label="Search"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="mr-sm-2"
                  style={{ width: '300px' }}
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
              <FiAlignJustify onClick={toggleDropdown} style={{ cursor: 'pointer', color: 'white', fontSize: '25px' }} />
              {dropdownVisible && (
                <div className="dropdown-menu show" style={{  top: '100%', right: '0', marginTop: '10px', zIndex: '1000', width: '100px', backgroundColor: 'white', padding: '10px', borderRadius: '5px', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)' }}>
                  <Link to="/" onClick={handleLogout} className="dropdown-item logout-link" style={{ textDecoration: 'none', color: 'black' }}>Logout</Link>
                  <Link to="/faqs" className='dropdown-item'>Support</Link>
                </div>
              )}
            </>
          ) : (
            <Button><Link to="/login" className="login-btn">Login</Link></Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavScrollExample;
