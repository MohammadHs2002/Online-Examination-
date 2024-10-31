import { useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";


const PrivateRoutesAdmin=({children}) =>{
    const navigate = useNavigate();
    const {user} = useContext(UserContext);
    if(user)
    return user.role==="Admin" ? children:navigate('/login');
    else
        navigate('/login');
};

export default PrivateRoutesAdmin;