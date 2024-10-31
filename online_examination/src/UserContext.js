import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [JwtToken,setJwt] =useState(null);


  const  endpoint='http://localhost:8082';

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

    axios.post(`${endpoint}/auth/login`,{
                    "email":"prime",
                    "password":"123"
                })
                .then(res=>{
                    setJwt(res.data.jwtToken);
                    console.log(res.data.jwtToken);
                })
                .catch(error=>{
                    console.log(error);
                })
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };




  return (
    <UserContext.Provider value={{ user, login, logout,endpoint,JwtToken }}>
      {children}
    </UserContext.Provider>
  );

};



