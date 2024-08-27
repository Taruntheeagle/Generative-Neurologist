import React, { useState } from 'react';
import {useNavigate} from "react-router-dom";
import './LoginRegistration.css';
import axios from 'axios';

const LoginRegistration = () => {
  let history = useNavigate();
  const [action, setAction] = useState("Login");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phno: '' // Added phno field to formData
  });
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}${action === "Login" ? "login" : "signUp"}`, formData);
      history('/home');
      console.log(response.data);
      // Optionally, you can redirect the user or perform other actions based on the response
    } catch (error) {
      if (error.response) {
        setError(error.response.data);
      } else {
        setError('Failed to connect to the server.');
      }
    }
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const toggleAction = () => {
    setAction(action === "Login" ? "Registration" : "Login");
  };

  return (
    <div className='background-container'>
    <div className='container'>
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>
      <form className="inputs" onSubmit={handleSubmit}>
        {action === "Login" ? null :
          <div className="input">
            <label htmlFor="name">Username:</label>
            <input
              type="text"
              id="name"
              placeholder="Enter the name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
        }
        <div className="input">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="input">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {action === "Registration" && // Only render for Registration
          <div className="input">
            <label htmlFor="phno">Phone Number:</label>
            <input
              type="text"
              id="phno"
              placeholder="Enter phone number"
              name="phno"
              value={formData.phno}
              onChange={handleChange}
            />
          </div>
        }

        <div className="submit-container">
          <button
            type="submit"
            className="submit"
          >
            {action === "Login" ? "Login" : "Register"}
          </button>
          <button
            type="button"
            className="submit gray"
            onClick={toggleAction}
          >
            {action === "Login" ? "Registration" : "Login"}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
    </div>
  );
};

export default LoginRegistration;

