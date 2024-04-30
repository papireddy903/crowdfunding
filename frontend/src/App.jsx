import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { AmountProvider } from './components/AmountContext';
import { UserProvider } from './components/Profile';  // Make sure this import is correct
import NavScrollExample from './components/NavScrollExample';
import Landing from './components/Landing';
import ProjectsPage from './components/ProjectsPage';
import Project from './components/Project';
import Login from './components/Login';
import Signup from './components/Signup';
import Fund from './components/Fund';
import Funding_success from './components/Funding_success';
import PayPalButton from './components/PayPalButton';
import AddProject from './components/AddProject';
import Profile from './components/Profile';
import 'bootstrap/dist/css/bootstrap.min.css';
import './hero.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './addproject.css';
// import './fund.css'
import './paypal.css'
import Discover from './components/Discover';

function App() {
  const clientId = "AeLpCh8VYNzm9tjwpk02UmD35CYRsqRwyXFOZRn81qAOWzoZyTLILrepeaaycTbZLSgo22emdeIFn1ra"; // Use your actual PayPal client ID

  return (
    <Router>
      <PayPalScriptProvider options={{ "client-id": clientId }}>
        <AmountProvider>
          <UserProvider>   
            <AppContent />
          </UserProvider>
        </AmountProvider>
      </PayPalScriptProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/' && <NavScrollExample />}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<ProjectsPage />} />
        <Route path="/discover/:id" element={<Project />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/fund/:id" element={<Fund />} />
        <Route path="/success" element={<Funding_success />} />
        <Route path="/checkout" element={<PayPalButton />} />
        <Route path="/add-project" element={<AddProject />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/discover" element={<Discover />} />
      </Routes>
    </>
  );
}

export default App;
