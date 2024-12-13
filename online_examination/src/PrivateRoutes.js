import { useContext,useEffect } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";


const PrivateRoutesAdmin=({children}) =>{
    const navigate = useNavigate();
    const {user,logout} = useContext(UserContext);

    useEffect(() => {
        const loginTimestamp = localStorage.getItem('loginTimestamp');
        const SESSION_TIMEOUT = 24*60*60*1000; // 1 day in milliseconds
        const now = Date.now();
    
        if (loginTimestamp && now - parseInt(loginTimestamp, 10) >= SESSION_TIMEOUT) {
        alert("Session Expires Please Login Again!");
          logout(); 
        }
      }, [logout]);

    
    if(user)
    return user.role==="Admin" ? children:navigate('/login');
    else
        navigate('/login');
};

export default PrivateRoutesAdmin;