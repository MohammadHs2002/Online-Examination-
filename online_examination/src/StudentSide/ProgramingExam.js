import React, { useContext, useEffect, useState, useRef } from 'react';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';
import ExamLogin from './ExamLogin';
import CodeEditor from './CodeEditor';

const ProgramingExam = () => {
  const [examData, setExamData] = useState(null);
  const [timer, setTimer] = useState(0); // Timer in seconds
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [answers, setAnswers] = useState([]); // Store answers for each question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { endpoint, JwtToken, showError, Examlogout } = useContext(UserContext);
  const [allotmentId, setAllotmentId] = useState(0);
  const isConfirmTriggeredRef = useRef(false);
  const [compiledOutput, setCompiledOutput] = useState(null);
  const [selectedLanguage, setSelectedLanguag] = useState("python");

  const [pyodide, setPyodide] = useState(null);
  // Calculate Completed and Remaining Questions
  const completedQuestions = answers.filter((answer) => answer.selectedOptionId).length;
  const remainingQuestions = totalQuestions - completedQuestions;

  const navigate = useNavigate();
  // Fetch exam data from localStorage and initialize timer
  useEffect(() => {
    const fetchExam = async () => {
      let exam = JSON.parse(localStorage.getItem('exam'));
      try {
        const response = await axios.get(`${endpoint}/api/exam/allotments/${exam[0].allotment.allotmentId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('JwtToken')}`,
          },
        });
        exam=response.data;
      } catch (error) {
        console.error('Error fetching exam data:', error);
      }

      if (exam) {
        const currentExam = exam;
        setExamData(currentExam);

        // Set total questions
        const total = currentExam.exam.numberOfQuestions;
        setTotalQuestions(total);
        setAllotmentId(currentExam.allotment.allotmentId);

        // Initialize timer (convert duration to seconds)
        setTimer((currentExam.exam.examDuration - currentExam.allotment.usedTime) * 60); // Assuming duration is in minutes
        fetchExamData(currentExam.allotment.allotmentId); // Fetch answers after examData is set
      }
    };

    fetchExam(); // Call the async function
  }, [endpoint, allotmentId]); // Dependency array for `useEffect`


  // Fetch exam data from API
  const fetchExamData = async (allotmentId) => {
    try {
      const response = await axios.get(`${endpoint}/api/exam/allotments/${allotmentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('JwtToken')}`,
        },
      });
      const data = response.data;
      setAnswers(data.allotment.answers); // Store the answers for all questions
    } catch (error) {
      console.error('Error fetching  exam data:', error);
    }
  };

  // Timer logic
  useEffect(() => {
    let timerInterval;
    if (timer > 0) {
      timerInterval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      if (timer % 60 === 0) {
        console.log('hello');
        const minutsUsed = examData.exam.examDuration - Math.floor(timer / 60);
        updateUsedTime(minutsUsed);
        console.log(allotmentId);
      }
    } else {
      if (examData != null) updateUsedTime(examData.exam.examDuration);
      closeExam();
    }
    return () => clearInterval(timerInterval);
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };


  const updateUsedTime = (minutsUsed) => {
    axios.post(`${endpoint}/api/exam/updateStudentTimer/${allotmentId}`, { time: minutsUsed }, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('JwtToken')}`
      }
    })
      .then(res => {
        // console.log(res);
      })
      .catch(error => {
        // console.log(error);
      })
  }


  const closeExam = () => {
    axios.get(`${endpoint}/api/exam/submitExam/${allotmentId}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem('JwtToken')}`
      }
    }).then(res => {
      // console.log(res);
      localStorage.removeItem('exam');
      window.location.href = "http://localhost:3000/student";
      Examlogout();
    })
      .catch(error => {
        console.log(error);
      })
  }


  const handleCodeChange = (index, newCode) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index].programmingAnswerText = newCode;
    setAnswers(updatedAnswers);
  };

  const saveUpdatedCode=async(answerId,code)=>{
    try {
            const response = await axios.post(
              `${endpoint}/api/exam/submitProgramingAnswer/${answerId}`,
              { code: code },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('JwtToken')}`,
                },
              }
            );
    
            if (response.status === 200) {
              fetchExamData(examData.allotment.allotmentId); // Re-fetch the updated exam data
            }
          } catch (error) {
            console.error('Error submitting answer:', error);
          }
  }


  const submitCode = async (answerId, code) => {
    try {
      saveUpdatedCode(answerId,code);
      if (pyodide) {
        try {
          // Redirect stdout to capture print output
          pyodide.globals.set('output', '');
          pyodide.globals.set('print', (text) => {
            pyodide.globals.set('output', pyodide.globals.get('output') + text + '\n');
          });
          // Use Pyodide's runPython method
          await pyodide.runPythonAsync(code);
          const result = pyodide.globals.get('output');
          setCompiledOutput(result);
        } catch (error) {
          setCompiledOutput('Error executing Python code: ' + error.message);
        }
      } else {
        setCompiledOutput('Pyodide is still loading...');
      }
    } catch (error) {
      setCompiledOutput("Error in code compilation.");
    }
  };


  const resetCode = () => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex].programmingAnswerText = "";
    setAnswers(updatedAnswers);
  };




  const logSecurityViolation = async (actionType,allotId) => {
    await axios.post(`${endpoint}/api/exam/securityLog/${allotId}`, {
      action: actionType
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('JwtToken')}`,
      }
    })
      .then(res => {
        if(res.data.isSuspicious){
          closeExam();
        }
      })
      .catch(error => {
        console.log(error);
      })
  }


  const preventCopyPasting = (e) => {
    e.preventDefault();
    showError("Copy Pasting is Not Allowd During Exam");
  };
  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) elem.requestFullscreen();
  };

  useEffect(() => {
    const handleViolation = () => {
      if (!isConfirmTriggeredRef.current) {
        showError("Violation Detected: This will cause you to close the exam.");
        logSecurityViolation("tab-change",allotmentId);
      }
    };

    // Override `window.confirm` to suppress blur handling
    const originalConfirm = window.confirm;
    window.confirm = (...args) => {
      isConfirmTriggeredRef.current = true; // Suppress blur for confirm
      const result = originalConfirm(...args);
      setTimeout(() => {
        isConfirmTriggeredRef.current = false; // Reset after confirm closes
      }, 0); // Reset after current JS execution cycle
      return result;
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && !isConfirmTriggeredRef.current) {
        handleViolation();
      }
    };

    const preventReload = (e) => {
      e.preventDefault();
      showError("Page reload is not allowed during the exam.");
    };

    window.addEventListener("blur", handleViolation); // Handle tab change
    document.addEventListener("visibilitychange", handleVisibilityChange); // Handle visibility change
    window.addEventListener("beforeunload", preventReload); // Prevent reload
    document.addEventListener("keydown", (e) => {
      if (e.key === "F5" || (e.ctrlKey && e.key === "r")) {
        preventReload(e);
      }
    });

    const loadPyodideLibrary = async () => {
      try {
        // Dynamically load the Pyodide script from CDN
        const pyodideScript = document.createElement('script');
        pyodideScript.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.2/full/pyodide.js';
        pyodideScript.onload = async () => {
          try {
            // Wait for Pyodide to load
            const pyodideInstance = await window.loadPyodide();
            setPyodide(pyodideInstance);
          } catch (error) {
            setCompiledOutput('Failed to load python ! Your Code not runnable');
          }
        };
        // Append script to body
        document.body.appendChild(pyodideScript);
      } catch (error) {
        console.error('Error loading the script:', error);
        setCompiledOutput('Failed to load the script for python');
      }
    };

    loadPyodideLibrary();

    return () => {
      // Cleanup
      window.removeEventListener("blur", handleViolation);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", preventReload);
      document.removeEventListener("keydown", preventReload);
      window.confirm = originalConfirm; // Restore original `window.confirm`
    };
  }, [allotmentId]);

  useEffect(() => enterFullScreen(), []);

  return (
    <div onCopy={preventCopyPasting}
      onCut={preventCopyPasting}
      onPaste={preventCopyPasting}
      style={{ userSelect: 'none' }}>
      <Navbar />
      {examData ? (
        <div className="container mt-4">
          {/* Top Section: Exam Details, Timer, and Stats */}
          <div className="row">
            <div className="col-md-4">
              <h3>Exam Details</h3>
              <p><strong>Exam Name:</strong> {examData.exam.examName}</p>
              <p><strong>Student Name:</strong> {examData.allotment.studentId.name}</p>
              <p><strong>Exam Duration:</strong> {examData.exam.examDuration} minutes</p>
              <p><strong>Total Marks:</strong> {examData.exam.totalMarks}</p>
            </div>
            <div className="col-md-4 text-center">
              <h4>Timer</h4>
              <div style={{ fontSize: '2rem', padding: '10px', border: '2px solid #007bff', borderRadius: '5px', display: 'inline-block' }}>
                {formatTime(timer)}
              </div>
              <div className="d-flex justify-content-around mt-4">
                <div><h5>Total Questions</h5><div className="btn btn-primary">{totalQuestions}</div></div>
                <div><h5>Completed</h5><div className="btn btn-success">{completedQuestions}</div></div>
                <div><h5>Remaining</h5><div className="btn btn-warning">{remainingQuestions}</div></div>
              </div>
              <div className="d-flex justify-content-center mt-4">
                <div><div className="btn btn-outline-primary" onClick={() => window.confirm("are you realy want to final submit") ? closeExam() : ''} >Final Submit</div></div>
              </div>
            </div>
            {/* Exam Navigator */}
            <div className="col-md-4">
              <h4>Question Navigator</h4>
              <div className="d-flex flex-wrap"
                style={{
                  maxHeight: '300px', // Fixed height for the container
                  overflowY: 'auto', // Scrollable if content overflows
                  border: '1px solid #ccc', // Optional border for clarity
                  padding: '10px',
                  justifyContent: 'center', // Center the buttons within the container
                }}
              >
                {answers.map((_, index) => (
                  <button
                    key={index}
                    className={`btn m-1 ${index === currentQuestionIndex ? 'btn-info' : answers[index]?.selectedOptionId ? 'btn-success' : 'btn-secondary'}`}
                    onClick={() => setCurrentQuestionIndex(index)}
                    style={{
                      flex: '1 0 40px', // Buttons shrink and grow as needed; default width is 40px
                      height: '40px', // Fixed height
                      minWidth: '30px', // Ensure a minimum button size
                      maxWidth: '40px', // Prevent buttons from growing too large
                    }}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="container mt-4">
            <div className="row">
              {answers[currentQuestionIndex] && (
                <>
                  {/* Question Definition */}
                  <div className="col-md-4">
                    <h4>Question {currentQuestionIndex + 1}: {answers[currentQuestionIndex]?.question?.programQuestion?.title}</h4>
                    <p><strong>Description:</strong> {answers[currentQuestionIndex]?.question?.programQuestion?.description}</p>
                    <p><strong>Sample Input:</strong></p>
                    <pre>{answers[currentQuestionIndex]?.question?.programQuestion?.sampleInput}</pre>
                    <p><strong>Sample Output:</strong></p>
                    <pre>{answers[currentQuestionIndex]?.question?.programQuestion?.sampleOutput}</pre>
                    <p><strong>Hints:</strong> {answers[currentQuestionIndex]?.question?.programQuestion?.hints}</p>
                  </div>

                  {/* Code Editor */}
                  <div className="col-md-4">
                    <h4>Code Editor</h4>
                    <CodeEditor value={answers[currentQuestionIndex]?.programmingAnswerText || ""} selectedIndex={currentQuestionIndex} handleValue={handleCodeChange} setSelectedLanguag={setSelectedLanguag}  selectedLanguage={selectedLanguage }/>
                    <div className="mt-3">
                      <button
                        className="btn btn-secondary mr-2 m-2"
                        onClick={() => setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0))}
                        disabled={currentQuestionIndex === 0}
                      >
                        Previous
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={() => submitCode(answers[currentQuestionIndex]?.answerId, answers[currentQuestionIndex]?.programmingAnswerText)}
                        disabled={!answers[currentQuestionIndex]?.programmingAnswerText}
                      >
                        Save & Compile
                      </button>
                      <button
                        className="btn btn-primary ml-2 m-2"
                        onClick={() => setCurrentQuestionIndex((prev) => Math.min(prev + 1, answers.length - 1))}
                        disabled={currentQuestionIndex === answers.length - 1}
                      >
                        Next
                      </button>
                      <button
                        className="btn btn-warning ml-2 m-2"
                        onClick={() => resetCode()}
                        disabled={!answers[currentQuestionIndex]?.programmingAnswerText}
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Compiled Output */}
                  <div className="col-md-4">
                    <h4>Compiled Output</h4>
                    {compiledOutput ? (
                      <pre className="bg-light p-3">{compiledOutput}</pre>
                    ) : (
                      <p>No output yet. Compile your code to see the result.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Question Section */}
        </div>
      ) : (
        <div className="container mt-4">
          <h3>Loading exam data...</h3>
        </div>
      )}
    </div>
  );
};

export default ProgramingExam;
