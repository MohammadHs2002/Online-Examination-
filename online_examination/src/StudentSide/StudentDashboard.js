import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const StudentDashboard = () => {

  const { endpoint, showError, user, logout, generateJwt } = useContext(UserContext);
  const navigate = useNavigate();

  //important use states
  const [examData, setExamData] = useState([]);
  const [scheduledExams, setScheduledExams] = useState([]);
  const [runningExams, setRunningExams] = useState([]);
  const [closedExams, setClosedExams] = useState([]);
  const [JwtToken, setJwtToken] = useState("");
  const [viewSheduledExamModel, setViewSheduledExamModel] = useState(false);
  const [viewSheduledExam, setViewSheduledExam] = useState([]);
  const [viewCompletedExamModel, setViewCompletedExamModel] = useState(false);
  const [viewCompletedExam, setViewCompletedExam] = useState([]);

  const handleLogout = () => {
    if (window.confirm("Are You Sure Want To Logout ?")) {
      axios.post(`${endpoint}/api/log/logout`, user, {
        headers: {
          "Authorization": `Bearer ${JwtToken}`
        }
      })
      logout();
      navigate('/login');
    }
  };


  const LoadData = () => {
    axios.post(`${endpoint}/api/exam/get_allotments`, user, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("JwtToken")}`
      }
    }).then(res => {
      const allotments = res.data;
      setExamData(allotments);
      let filteredData = allotments.filter(exam => exam.exam.status === "Scheduled");
      setScheduledExams(filteredData);
      filteredData = allotments.filter(exam => exam.exam.status === "Running");
      setRunningExams(filteredData);
      filteredData = allotments.filter(exam => exam.exam.status === "Closed");
      setClosedExams(filteredData);
    }).catch(error => {
      showError("No Alloted Exam Found for You!")
      if (error.status === 401) generateJwt();
    })
  }

  const viewSheduledExamDetailes = (examId) => {
    const exam = scheduledExams.filter(exam => exam.exam.examId === examId);
    setViewSheduledExam(exam);
    setViewSheduledExamModel(true);
  }

  const startExam = (examId) => {
      const exam=runningExams.filter(exam => exam.exam.examId === examId);
      localStorage.setItem("exam",JSON.stringify(exam));
      console.log(exam);
      navigate("/examLogin");
  }

  const viewCompletedExamDetaile = (examId) => {
    const exam = closedExams.filter(exam => exam.exam.examId === examId);
    console.log(exam);
    setViewCompletedExam(exam);
    setViewCompletedExamModel(true);
  }

  const closeModels = () => {
    setViewSheduledExamModel(false);
    setViewSheduledExam(null);
    setViewCompletedExam(null);
    setViewCompletedExamModel(false);
  }

  //use Effect
  useEffect(() => {
    LoadData();
  }, []);



  return (
    <>
      <div>
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
          <div className="container">
            <a className="navbar-brand" href="#">
              <div className="sidebar-brand-icon">
                <img style={{ width: '15%' }} src={`${process.env.PUBLIC_URL}/assets/admin/img/logo/logo.png`} />
              </div>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" onClick={() => handleLogout()}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="bg-primary text-white text-center py-4">
          <h1>Welcome, {user ? user.username : "Student"}!</h1>
          <p>Track and manage your exams easily</p>
        </div>
        {/* Content Section */}
        <div className="container mt-4">
          <div className="row">
            {/* Scheduled Exams */}
            <div className="col-md-4 mb-4">
              <h5 className="text-primary">Scheduled Exams</h5>
              <div className="border rounded shadow-sm p-3" style={{ height: "300px", overflowY: "auto" }}>
                {scheduledExams.map((exam) => (
                  <div className="row">
                    <div key={exam.exam.examId} className="col-9 mb-2">
                      <strong>Exam Name :- {exam.exam.examName}</strong>
                      <br />
                      <strong>Type:-{exam.exam.examType}</strong>
                      <br />
                      <strong>Start Date/Time:-</strong><small className="text-muted">{format(new Date(exam.exam.examStartDateTime), 'dd/MM/yyyy HH:mm:ss')}</small>
                    </div>
                    <div className="col-3">
                      <button className="btn-outline-primary" onClick={() => viewSheduledExamDetailes(exam.exam.examId)}>View details</button>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>

            {/* Running Exams */}
            <div className="col-md-4 mb-4">
              <h5 className="text-primary">Running Exams</h5>
              <div className="border rounded shadow-sm p-3" style={{ height: "300px", overflowY: "auto" }}>
                {runningExams.map((exam) => (
                  <div className="row">
                    <div key={exam.exam.examId} className="col-9 mb-2">
                      <strong>Exam Name :- {exam.exam.examName}</strong>
                      <br />
                      <strong>Type:-{exam.exam.examType}</strong>
                      <br />
                      <strong>Start Date/Time:-</strong><small className="text-muted">{format(new Date(exam.exam.examStartDateTime), 'dd/MM/yyyy HH:mm:ss')}</small>
                    </div>
                    <div className="col-3">
                      <button className="btn-outline-success" onClick={() => startExam(exam.exam.examId)}>Start Exam</button>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>

            {/* Completed Exams */}
            <div className="col-md-4 mb-4">
              <h5 className="text-primary">Completed Exams</h5>
              <div className="border rounded shadow-sm p-3" style={{ height: "300px", overflowY: "auto" }}>
                {closedExams.map((exam) => (
                  <div className="row">
                    <div key={exam.exam.examId} className="col-9 mb-2">
                      <strong>Exam Name :- {exam.exam.examName}</strong>
                      <br />
                      <strong>Type:-{exam.exam.examType}</strong>
                      <br />
                      <strong>Closed Date/Time:-</strong><small className="text-muted">{format(new Date(exam.exam.examStartDateTime), 'dd/MM/yyyy HH:mm:ss')}</small>
                    </div>
                    <div className="col-3">
                      <button className="btn-outline-dark" onClick={() => viewCompletedExamDetaile(exam.exam.examId)}>Check Result</button>
                    </div>
                    <hr />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


      {viewSheduledExamModel && (
        <div className="modal-overlay">
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">View Exam details</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => closeModels()}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="card-body">
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <p><strong>Exam Name:</strong>{viewSheduledExam[0].exam.examName}</p>
                        <p><strong>Duration (Minuts):</strong> {viewSheduledExam[0].exam.examDuration}</p>
                        <p><strong>Exam Start Date &amp; Time:</strong> {format(new Date(viewSheduledExam[0].exam.examStartDateTime), 'dd/MM/yyyy HH:mm:ss')}</p>
                        <p><strong>Total Marks:</strong> {viewSheduledExam[0].exam.totalMarks}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>Exam Type:</strong> {viewSheduledExam[0].exam.examType}</p>
                        <p><strong>Difficulty:</strong> {viewSheduledExam[0].exam.examDifficulty}</p>
                        <p><strong>Status:</strong> {viewSheduledExam[0].exam.status}</p>
                        <p><strong>Number of Questions:</strong> {viewSheduledExam[0].exam.numberOfQuestions}   </p>
                        <p><strong>Passing Marks:</strong> {viewSheduledExam[0].exam.passingMarks}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewCompletedExamModel && (
        !viewCompletedExam[0].exam.resultDeclared ? (
          // Modal for "Result Not Declared Yet"
          <div className="modal-overlay">
            <div className="modal show d-block" tabIndex="-1" role="dialog">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">View Result</h5>
                    <button
                      type="button"
                      className="close"
                      onClick={closeModels}
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="card-body">
                      Result not Declared Yet!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Modal for displaying exam details
          <div className="modal-overlay">
            <div className="modal show d-block" tabIndex="-1" role="dialog">
              <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">View Result</h5>
                    <button
                      type="button"
                      className="close"
                      onClick={closeModels}
                      aria-label="Close"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="card-body">
                      <div className="row mb-3">
                        {/* Left column */}
                        <div className="col-md-6">
                          <p><strong>Exam Name:</strong> {viewCompletedExam[0].exam.examName}</p>
                          <p><strong>Duration (Minutes):</strong> {viewCompletedExam[0].exam.examDuration}</p>
                          <p>
                            <strong>Exam Start Date &amp; Time:</strong>{" "}
                            {format(new Date(viewCompletedExam[0].exam.examStartDateTime), 'dd/MM/yyyy HH:mm:ss')}
                          </p>
                          <p><strong>Total Marks:</strong> {viewCompletedExam[0].exam.totalMarks}</p>
                        </div>
                        {/* Right column */}
                        <div className="col-md-6">
                          <p><strong>Exam Type:</strong> {viewCompletedExam[0].exam.examType}</p>
                          <p><strong>Difficulty:</strong> {viewCompletedExam[0].exam.examDifficulty}</p>
                          <p><strong>Status:</strong> {viewCompletedExam[0].exam.status}</p>
                          <p><strong>Number of Questions:</strong> {viewCompletedExam[0].exam.numberOfQuestions}</p>
                          <p><strong>Passing Marks:</strong> {viewCompletedExam[0].exam.passingMarks}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default StudentDashboard;
