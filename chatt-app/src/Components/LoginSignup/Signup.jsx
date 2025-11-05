import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import './Signup.css'
import user_icon from '../Assets/name_image.png'
import email_icon from '../Assets/email_image.png'
import password_icon from '../Assets/password_image.png'
import inner_icon from '../Assets/signup_image.jpg'
import google_icon from '../Assets/google_image.png'
import facebook_icon from '../Assets/facebook_image.png'

const Signup = () => {

    const [formData, setFormData] = useState({
        name:'',
        email:'',
        password:''
    });

    const [error, setError] = useState(''); // for showing validation message

    const navigate = useNavigate();

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    useEffect(() => {
        document.title = "Chappie App - Signup";
    }, []);

    const handleChange= (e)=>{
        const {name, value}=e.target;
        setFormData({
            ...formData,
             [name]: value 
        });
    };

  // Move to next input on Enter key
  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // stop form submit
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
      }
    }
  };

    // validation before API call
    const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError('⚠️ All fields are required.');
      return false;
    }
    setError('');
    return true;
  };

    const handleSubmit = async () => {

        if(!validateForm()){  // stop if invalid
            return;
        }

        try{
            const response = await fetch('http://localhost:8080/api/signup', {
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if(response.ok){
                
                alert('Signup successfull!');
                console.log('Server responser:', data);

                //Redirect to Login page after success
                navigate('/login');

            }else{
                
                alert(data.message || 'Signup failed!');
            }
        }catch(error){
            console.error('Error during signup:', error);
            alert('Something went worng. Please try again later.');
        }
    };

  return (

    <div 
      className="signup-background" 
      style={{ backgroundImage: `url(${inner_icon})` }}
    >

    <div className='signup-container'>
        <div className="signup-header">
            <div className="signup-text">Create Account</div>
            <div className="signup-underline"></div>
        </div>


        {/* Error message display
        {error && <div className="signup-error-message">{error}</div>} */}


        <div className="signup-inputs">
            <div className="signup-input">
                <img src={user_icon} alt="" />      
                <input 
                ref={nameRef}
                type="text" 
                name= "name"
                placeholder='Name'
                value= {formData.name}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, emailRef)}
                />
            </div>

            <div className="signup-input">
                <img src={email_icon} alt="" />
                <input 
                ref={emailRef}
                type="email"
                name= "email"
                placeholder='Email'
                value={formData.email}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                />
            </div>

            <div className="signup-input">
                <img src={password_icon} alt="" />
                <input 
                ref={passwordRef}
                type="password" 
                name= "password"
                placeholder='Password'
                value={formData.password}
                onChange={handleChange}
                onKeyDown={(e) => handleKeyDown(e, null)} // last input → submit
                />
            </div>


            {/* Error message display */}
            {error && <div className="signup-error-message">{error}</div>}
    
     
       </div>
        <div className="signup-forget-password">Already have an account?{" "} 
            <a 
            href="/login" style={{ 
                color: "blue",
                cursor: "pointer",
                textDecoration: "none" 
                }}
            >
            <span> Login </span>
            </a>
        </div>
        <div className="signup-submit-container">
            <div className="signup-submit"  onClick={handleSubmit}  >Sign Up</div>
        </div>
       
           <div className="signup-or-container">
            <div className="signup-texts">-----Or Sign Up With-----</div>
           </div>

            <div className="signup-google-container">
                <img src={google_icon} alt="" />
                <img src={facebook_icon} alt="" />
            </div>
        </div>

    </div>
  )
}


export default Signup
