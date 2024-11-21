import React, { createContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from "react-toastify"
import { format } from 'date-fns';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [JwtToken, setJwt] = useState(null);


  const endpoint = 'http://localhost:8082';

  useEffect(() => {
    // Load user data from localStorage if available
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    generateJwt();

  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const showError = (message = "Somting went wrong plese Try Again Leter!", time = 1000, type = "error") => {
    if (type === "error")
      toast.error(message, time);
    else if (type === "success")
      toast.success(message, time);
  }

  const generateJwt = () => {
    axios.post(`${endpoint}/auth/login`, {
      "email": "prime",
      "password": "123"
    })
      .then(res => {
        setJwt(res.data.jwtToken);
      })
      .catch(error => {
        console.log(error);
      })
  }


  return (
    <UserContext.Provider value={{ user, login, logout, endpoint, JwtToken, showError,generateJwt }}>
      {children}
    </UserContext.Provider>
  );

};



