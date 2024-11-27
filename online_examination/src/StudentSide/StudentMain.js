import { Button } from 'bootstrap'
import React, { useContext } from 'react'
import { UserContext } from '../UserContext'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StudentMain = () => {
  const {logout,user,endpoint,JwtToken} = useContext(UserContext);
  const navigate=useNavigate();

  const handleLogout=()=>{
    logout();
    if(window.confirm("Are You Sure. Want To Logout!")){
      axios.post(`${endpoint}/api/log/logout`,user,{
        headers:{
          "Authorization":`Bearer ${JwtToken}`
        }
      })
    }
    logout();
    navigate('/login');
  }
  return (
    <>
    <div>StudentMain</div>
    <button className='btn btn-outline-danger' onClick={handleLogout}>Logout</button>
    </>
  )
}

export default StudentMain