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
import Groups from './AdminSide/Groups';
import Questions from './AdminSide/Questions';
import QuestionCategory from './AdminSide/QuestionCategory';
import ProgramingQuestion from './AdminSide/ProgramingQuestion';


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
        <ToastContainer/>
        <Loading show={loading}/>
        <BrowserRouter>
        <UserProvider>
            <Routes>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<AlredyLogin><Login/></AlredyLogin>} />
            <Route path="admin" element={<PrivateRoutesAdmin><AdminMain /></PrivateRoutesAdmin>} >
                <Route index element={<Dashboard/>}/>
                <Route path="users" element={<Users/>}/>
                <Route path="student" element={<Student/>}/>
                <Route path="group" element={<Groups/>}/>
                <Route path="mcq-question" element={<Questions/>}/>
                <Route path="mcq-question-category" element={<QuestionCategory/>}/>
                <Route path="programing-question" element={<ProgramingQuestion/>}/>
            </Route>
            <Route path="student" element={<StudentMain />} />
            <Route path="*" element={<NoPage />} />
            </Routes>
            </UserProvider>
        </BrowserRouter>
        </React.StrictMode>
    );
}

export default App;