import React, { useState, useRef, useEffect } from 'react'
import './Login.css'
import email_icon from '../Assets/email_image.png'
import password_icon from '../Assets/password_image.png'
import inner_icon from '../Assets/login_image.jpg'
import { useNavigate } from 'react-router-dom'
import Homepage from '../feature/pages/homepage/Homepage'

const Login = () => {

    const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
          document.title = "Chappie App - Login";
      }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextRef && nextRef.current) nextRef.current.focus();
    }
  };

  // Handle Login button click
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login successful!');
        console.log('Server response:', data);

        // Save user email locally for later use
        // localStorage.setItem('userEmail', formData.email);
        localStorage.setItem("userEmail", formData.email);


        navigate('/ui');

        // Example: redirect to dashboard
        // window.location.href = '/dashboard';
      } else {
        alert(data.message || 'Invalid email or password.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('Error connecting to server. Please try again later.');
    }
  };

  return (

     <div 
          className="login-background" 
          style={{ backgroundImage: `url(${inner_icon})` }}
        >
    
    <div className='login-container'>
            <div className="login-header">
                <div className="login-text">Login</div>
                <div className="login-underlines"></div>
            </div>
            <div className="login-inputs">
    
                <div className="login-input">
                    <img src={email_icon} alt="" />
                    <input 
                    ref={emailRef}
                    type="email"
                    name="email"
                    placeholder='Email'
                    value={formData.email}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                    />
                </div>
    
                <div className="login-input">
                    <img src={password_icon} alt="" />
                    <input 
                    ref={passwordRef}
                    type="password" 
                    name= 'password'
                    placeholder='Password'
                    value={formData.password}
                    onChange={handleChange}
                    onKeyDown={(e) => handleKeyDown(e, null)} // last → submit
                    />
                </div>
            </div>
            <div className="login-forget-password">forget password?<span> Click Here! </span></div>
            
            <div className="login-submit-container">
                <div className="login-submit" onClick={handleLogin}>Login</div>
            </div>
            <div className="login-new-user">new user?{" "} 
                <a
                 href="/signup" style={{ 
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "none" }}
                    >
            <span> Signup </span>
            </a>
            </div>
    
        </div>
        </div>
  )
}

export default Login