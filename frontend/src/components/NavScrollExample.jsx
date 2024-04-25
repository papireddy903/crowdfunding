import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import {Link, BrowserRouter} from 'react-router-dom';

function NavScrollExample() {
  
  return (
    <Navbar expand="lg" variant="dark" bg="dark">
      <Container fluid>
        <Navbar.Brand href="#">Navbar scroll</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
            >
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/discover">Discover</Nav.Link>
            <Nav.Link href="#action3">CreateCampaign</Nav.Link>
          </Nav>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          <div></div>
          </Form>
            {/* <Link to = 'http://127.0.0.1:8000/login/'>Login</Link> */}
            <a href="http://127.0.0.1:8000/login/"><button className="btn btn-primary">Login</button></a>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
  
}

export default NavScrollExample;
