

import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from './UserContext';

const AlredyLogin = ({children}) => {
  const navigate = useNavigate();
  const {user}=useContext(UserContext);
  if(user){
    if(user.role==="Admin"){
         navigate('/admin');
    }else{
         navigate('/student');
    }
  }else{
    return children;
  }
}

export default AlredyLogin