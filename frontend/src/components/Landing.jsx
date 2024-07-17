import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../landing.css';
import arrow_btn from '../assets/arrow_btn.png';
import Video1 from '../assets/Video.mp4';
// import Video2 from '../assets/videeo2.mp4';
// import ImageDonate from '../assets/photo.jpg';

const Landing = () => {
  const [currentVideo, setCurrentVideo] = useState(1);

  useEffect(() => {
    // Change background video every 10 seconds
    const interval = setInterval(() => {
      setCurrentVideo((prevVideo) => (prevVideo % 3) + 1);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const getVideoSource = () => {
    switch (currentVideo) {
      case 1:
        return Video1;
      // case 2:
      //   return Video2;
      // case 3:
      //   return ImageDonate; // Use the image as a fallback
      // default:
      //   return Video1;
    }
  };

  return (
    <div className="landing">
      <header style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
        <video className="video" autoPlay muted loop style={{ position: 'absolute', width: '100%', left: '50%', top: '50%', height: '100%', objectFit: 'cover', transform: 'translate(-50%, -50%)', zIndex: '-1' }}>
          <source src={getVideoSource()} type="video/mp4" />
        </video>
        <div className="landing-page-1">
          <div className="header-left-1">
            <h1 className="hero-text-1">Crowd Funding Made Easy</h1>
            <div className="hero-explore-1">
              <Link to="/home">Get Started</Link>
              <Link to="/home"><img src={arrow_btn} alt="" /></Link>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Landing;