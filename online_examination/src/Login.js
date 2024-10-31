import React, { useState,useContext } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useForm } from "react-hook-form";
import {ToastContainer,toast} from "react-toastify"
import { UserContext } from './UserContext';
import { Navigate, redirect } from 'react-router-dom';

const LoginForm = () => {
  const {JwtToken,login,endpoint} = useContext(UserContext);
  const form = useForm();
  const { register, control, handleSubmit } = form;

  const HandleLogin = (data) => {
    if(!(data.username=="") && !(data.password=="")){
    axios.post(`${endpoint}/api/user/Login`, data,{
      headers: {
        "Authorization": `Bearer ${JwtToken}`
      }
    })
    .then(res => {
      if(res.status==200){
          toast.success("Login Succefull",1000)    
          login(res.data);
          setTimeout(()=>{
            if(res.data.role==="Admin"){
                window.location.href='http://localhost:3000/admin';
            }else if(res.data.role==='Student'){
              < Navigate to="/student"/>
            }
          },3000);
      }
    })
    .catch(error => {
      console.log(error);
      if(error.response.status==403)
        toast.error("Wrong Password")
      else if(error.response.status==404)
        toast.error("User Not Found")
      else if(error.response.status=423)
        toast.error("User Blocked Plese Contact Admin");
      else
        toast.error("Somting Went Wrong Plese Try Again")
    });
  }
  else{
    if(data.username=="" && data.password=="")
      toast.error("Username & Password Required")
      else if(data.username=="")
      toast.error("Username Required")
      else
      toast.error("Password Required")
  }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg p-4">
              <h2 className="text-center mb-4">Login</h2>
              <form onSubmit={handleSubmit(HandleLogin)} method='post'>
                <div className="form-group mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    {...register("username")}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    className="form-control"
                    {...register("password")}
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="rememberMe"
                      name="remember-me"
                    />
                    <label className="form-check-label" htmlFor="rememberMe">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-decoration-none">
                    Forgot?
                  </a>
                </div>

                <div className="d-grid">
                  <button className="btn btn-primary">
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
