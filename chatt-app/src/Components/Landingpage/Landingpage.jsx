import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import chapie_icon from '../Assets/logo3.png'
import inner_icon from '../Assets/inner_image.jpg'
import './Landingpage.css'

const Landingpage = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    navigate('/login');
  }
  const handleSignup = () => {
    navigate('/signup');
  }

  const isLoginActive = location.pathname === '/login';
  const isSignupActive = location.pathname === '/signup'

  return (

    <div className="landing-page">
      <header className="header">
        <div className="logo">
          <img src={chapie_icon} alt="" />
          <span className="logo-icon"></span>
          <span className="logo-text">Chappie</span>
        </div>
      </header>
      
      <main className="main-content">
        <div className="content-container">
          <div className="brand-logo">
            <img src={chapie_icon} alt="" />
            <span className="logo-icon-large"></span>
            <span className="logo-text-large">Chappie</span>
          </div>
          
          <p className="tagline">
            connect everyone
          </p>
          
          <div className="action-buttons">

            <button
            className = {`login-btn $ {isLoginActive ? 'action' : ''}`} onClick={handleLogin}>Log In</button>
            <button
            className = {`signup-btn $ {isSignupActive ? 'action' : ''}`} onClick={handleSignup}>Sign Up</button>

            {/* <button className="login-btn" onClick={handleLogin}>Log In</button>
            <button className="signup-btn" onClick={handleSignup}>Sign Up</button> */}

            
          </div>
        </div>
      </main>
    </div>
  )
}

export default Landingpage