import React from 'react';
import heroVideo from '../assets/background_video.mp4'; // Adjust the path to where your video file is stored
import {Link} from 'react-router-dom'
const Landing = () => {
  return (
    <div>
      <header style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <video autoPlay muted loop style={{ position: 'absolute', width: '100%', left: '50%', top: '50%', height: '100%', objectFit: 'cover', transform: 'translate(-50%, -50%)', zIndex: '-1' }}>
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="container header-section" style={{ position: 'relative', zIndex: '1' }}>
          <div className="header-left">
            <h1>Crowdfunding Made Easy</h1>
            <p>Our platform simplifies the crowdfunding process, making it accessible to everyone. We provide the tools and support you need to turn your ideas into successful campaigns.</p>
            {/* <a href="/home" className="primary-button get-started-btn">Get Started</a> */}
            <Link to="/home" className="btn btn-primary ms-2">Get Started</Link>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Landing;
