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
import React, { useEffect, useState } from 'react';
import AlredyLogin from './AlredyLogin';
import Student from './AdminSide/Student';
import Loading from './Loading';
import axios from 'axios';


function App() {
    const [loading,setLoading] =useState(false);

    useEffect(()=>{
        //request interceptor
        axios.interceptors.request.use(
            (config)=>{
                setLoading(true);
                return config;
            },
            (error)=>{
                return Promise.reject(error);
            }
        );
        //response interceptor
        axios.interceptors.response.use(
            (config)=>{
                setLoading(false);
                return config;
            },
            (error)=>{
                setLoading(false);
                return Promise.reject(error);
            }
        );
    },[]);

    return ( 
        <React.StrictMode>
        <UserProvider>
        <ToastContainer/>
        <Loading show={loading}/>
        <BrowserRouter>
            <Routes>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<AlredyLogin><Login/></AlredyLogin>} />
            <Route path="admin" element={<PrivateRoutesAdmin><AdminMain /></PrivateRoutesAdmin>} >
                <Route index element={<Dashboard/>}/>
                <Route path="users" element={<Users/>}/>
                <Route path="student" element={<Student/>}/>
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