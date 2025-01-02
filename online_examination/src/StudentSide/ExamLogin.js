import React, { useState, useContext,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';


const ExamLogin = () => {
  //getting importtant objects that nedded
  const { JwtToken, login, endpoint, showError,Examlogin } = useContext(UserContext);
  const form = useForm();
  const { register, control, handleSubmit } = form;
  const [examData,setExamData]=useState([]);
  const navigate=useNavigate();

  //show  toast message function


  //function that handlee login and form requierd funcnality
  //data is geted from form form library use
  const HandleLogin = (data) => {
      const exam=JSON.parse(localStorage.getItem("exam"));
      const allotmentId=exam[0].allotment.allotmentId;
    //checking if username and password are not null
    if (!(data.username == "") && !(data.password == "")) {

      //sending api request to backednd for login
      axios.post(`${endpoint}/api/exam/examLogin/${allotmentId}`, data, {
        headers: {
          "Authorization": `Bearer ${JwtToken}`
        }
      })
        .then(res => {
          //checking resposnse of backend
          if (res.status == 200) {
            showError("Login Succefull", 1000, "success");
            //storing session in localstorage
            Examlogin(res.data);
            //redirecting user to start exam 
            setTimeout(() => {
              if (res.data.role === "Student") {
                window.location.href = "http://localhost:3000/student/exam-instruction";
              } else {
                showError("Somthing went Wrong !")
              }
            }, 1000);
          }
        })
        //checking why user was not able to login 
        .catch(error => {
            if(error.status===409){
              showError(error.response.data);
            }else{
              showError("Somthing went wrong please try again later");
            }
        });
    }
    else {
      if (data.username == "" && data.password == "")
        showError("Username & Password Required");
      else if (data.username == "")
        showError("Username Required");
      else
        showError("Password Required");
    }
  };

  useEffect(() => {
    setExamData(localStorage.getItem("exam"));
  }, []);
  

  return (
    <div className="d-flex align-items-center justify-content-center vh-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow-lg p-4">
              <h2 className="text-center mb-4">Exam Login</h2>
              <form onSubmit={handleSubmit(HandleLogin)} method='post'>
                <div className="form-group mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    id="username"
                    placeholder='Enter Username'
                    className="form-control"
                    {...register("username")}
                  />
                </div>

                <div className="form-group mb-3">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder='Enter Password'
                    className="form-control"
                    {...register("password")}
                  />
                </div>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="form-check">
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

export default ExamLogin;
