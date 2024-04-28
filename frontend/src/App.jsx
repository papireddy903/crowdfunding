// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { AmountProvider } from './components/AmountContext'; // Import the AmountProvider
import NavScrollExample from './components/NavScrollExample';
import Landing from './components/Landing';
import ProjectsPage from './components/ProjectsPage';
import Project from './components/Project';
import Login from './components/Login';
import Signup from './components/Signup';
import Fund from './components/Fund';
import Funding_success from './components/Funding_success';
import PayPalButton from './components/PayPalButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import './hero.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const clientId = "AeLpCh8VYNzm9tjwpk02UmD35CYRsqRwyXFOZRn81qAOWzoZyTLILrepeaaycTbZLSgo22emdeIFn1ra"; // Replace with your actual PayPal client ID

  return (
    <Router>
      <PayPalScriptProvider options={{ "client-id": clientId }}>
        <AmountProvider>  
          <AppContent />
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
        <Route path="/checkout" element={<PayPalButton />} />  // PayPal button is now part of the checkout route
      </Routes>
    </>
  );
}

export default App;
