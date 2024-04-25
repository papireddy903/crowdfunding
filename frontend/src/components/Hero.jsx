import React, { useState, useEffect } from 'react';
import axios from './Axios'; // Adjust the import path to where your Axios instance is defined
import heroImage from '../assets/asset 12.jpeg';

const Hero = () => {
  // State for storing total projects and total funding
  const [totalProjects, setTotalProjects] = useState(0);
  const [totalFunding, setTotalFunding] = useState(0);

  // Function to fetch data
  const fetchData = async () => {
    try {
      const response = await axios.get('/'); // Make sure your endpoint is correct
      const data = response.data;
      
      // Calculate total funded projects (projects with any funding)
      const fundedProjects = data.filter(project => parseFloat(project.current_funding) > 0).length;

      // Calculate total funding
      const funding = data.reduce((acc, project) => acc + parseFloat(project.current_funding), 0);

      setTotalProjects(fundedProjects);
      setTotalFunding(funding.toFixed(2)); // Formatting to two decimal places
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  // Polling the API every 30 seconds to update the state
  useEffect(() => {
    fetchData(); // initial fetch
    const interval = setInterval(fetchData, 3000); // 30 seconds

    // Cleanup on unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="hero" style={{ marginTop: '10px', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'white', padding: '20px' }}>
        <div style={{ textAlign: 'center', padding: '10px', borderRadius: '10px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h5 style={{ fontSize: '24px', color: '#3498db', fontWeight: 'bold' }}>{totalProjects}</h5>
            <p style={{ fontSize: '36px', color: '#333' }}>Projects Funded</p>
        </div>
        <div style={{ textAlign: 'center', padding: '10px', borderRadius: '10px', backgroundColor: 'white', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
            <h5 style={{ fontSize: '24px', color: '#e74c3c', fontWeight: 'bold' }}>₹{totalFunding}</h5>
            <p style={{ fontSize: '36px', color: '#333' }}>towards creative work</p>
        </div>
      </div>

      <header>
        <div className="container header-section">
            <div className="header-left">
                <h1>Crowdfunding Made Easy</h1>
                <p>Our platform simplifies the crowdfunding process, making it accessible to everyone. We provide the tools and support you need to turn your ideas into successful campaigns.</p>
                <a href="#" className="primary-button get-started-btn">Get Started</a>
            </div>
            <div className="header-right">
                <img src={heroImage} alt="Hero" />
            </div>
        </div>
      </header>
    </div>
  );
}

export default Hero;
