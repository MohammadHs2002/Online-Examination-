import './App.css';
import LandingPage from './LandingPage';
import {BrowserRouter,Routes,Route} from 'react-router-dom'; 
import Login from './Login';
import NoPage from './NoPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserProvider } from './UserContext';
import AdminMain from './AdminSide/AdminMain';
import StudentMain from './StudentSide/StudentMain';
import PrivateRoutesAdmin from './PrivateRoutes';
import Users from './AdminSide/Users';
import Dashboard from './AdminSide/Dashboard';
import React from 'react';


function App() {
    return ( 
        <React.StrictMode>
        <UserProvider>
        <ToastContainer/>
        <BrowserRouter>
            <Routes>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<Login />} />
            <Route path="admin" element={<PrivateRoutesAdmin><AdminMain /></PrivateRoutesAdmin>} >
                <Route index element={<Dashboard/>}/>
                <Route path="users" element={<Users/>}/>
            </Route>
            <Route path="student" element={<StudentMain />} />
            <Route path="*" element={<NoPage />} />
            </Routes>
        </BrowserRouter>
        </UserProvider>
        </React.StrictMode>
    );
}

export default App;