import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [examUser, setExamUser] = useState(null);
  const [JwtToken, setJwt] = useState(null);
  const endpoint = 'http://localhost:8082';
  const SESSION_TIMEOUT = 24*60*60*1000; // 1 day in milliseconds
  const EXAM_SESSION_TIMEOUT=1*60*60*1000;
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data and validate session
    const storedUser = localStorage.getItem('user');
    const loginTimestamp = localStorage.getItem('loginTimestamp');
    if (storedUser && loginTimestamp) {
      const now = new Date().getTime();

      if (now - parseInt(loginTimestamp, 10) < SESSION_TIMEOUT) {
        setUser(JSON.parse(storedUser));
      } else {
        // Session expired
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimestamp');
        alert('Session Expires Please Login Again!');
        navigate('/login');
        toast.error('Session expired. Please log in again.');
      }
    }
    generateJwt();
  }, []);

  const login = (userData) => { 
    const now = new Date().getTime(); // Current timestamp
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('loginTimestamp', now.toString());
  };

  const Examlogin=(userData)=>{
    const now = new Date().getTime(); // Current timestamp
    setExamUser(userData);
    localStorage.setItem('examData',JSON.stringify(userData));
    localStorage.setItem('ExamloginTimestamp', now.toString());
  }

  const Examlogout = () => {
    setExamUser(null);
    localStorage.removeItem('examData');
    localStorage.removeItem('ExamloginTimestamp');
    toast.success('Logged out successfully.');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('loginTimestamp');
    toast.success('Logged out successfully.');
  };

  const showError = (message = "Something went wrong. Please try again later!", time = 1000, type = "error") => {
    if (type === "error")
      toast.error(message, time);
    else if (type === "success")
      toast.success(message, time);
  };

  const generateJwt = () => {
    axios.post(`${endpoint}/auth/login`, {
      "email": "prime",
      "password": "123"
    })
      .then(res => {
        setJwt(res.data.jwtToken);
        localStorage.setItem('JwtToken', res.data.jwtToken);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <UserContext.Provider value={{ user, login, logout, endpoint, JwtToken, showError, generateJwt,Examlogin,Examlogout,examUser }}>
      {children}
    </UserContext.Provider>
  );
};
