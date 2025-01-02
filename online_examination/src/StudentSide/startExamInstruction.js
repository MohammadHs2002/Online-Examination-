import React, { useContext, useEffect, useState } from 'react';
import Navbar from './Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

const StartExamInstruction = () => {
  const [isAgreed, setIsAgreed] = useState(false);
  const { Examlogout, generateJwt } = useContext(UserContext);
  const navigate = useNavigate();

  const handleCheckboxChange = () => {
    setIsAgreed(!isAgreed);
  };

  const handleStartExam = () => {
    if (isAgreed) {
      navigate("/student/mcq-exam");
    }
  };

  useEffect(() => {
    const validateSession = async () => {
      try {
        const storedUser = localStorage.getItem('examData');
        const loginTimestamp = localStorage.getItem('ExamloginTimestamp');
        if (storedUser && loginTimestamp) {
          const now = new Date().getTime();

          if (now - parseInt(loginTimestamp, 10) > 1*60*60*1000) {
            await Examlogout(); // Handle async properly if needed
            alert('Session Expired. Please Login Again!');
            navigate('/student');
          }
        }
        await generateJwt(); // Ensure this is also awaited if async
      } catch (error) {
        console.error('Error validating session:', error);
      }
    };

    validateSession();
  }, [Examlogout, generateJwt, navigate]); // Add dependencies here

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4">Exam Instructions</h1>
        <ol>
          <li>Ensure you are in a quiet and well-lit environment for the duration of the exam.</li>
          <li>Keep your ID card ready for verification before starting the exam.</li>
          <li>Do not attempt to open any new tabs or browsers during the exam. Any tab change will be flagged.</li>
          <li>Avoid using mobile phones, smartwatches, or any other electronic devices unless explicitly permitted.</li>
          <li>Keep your camera and microphone on throughout the exam if required by the proctoring system.</li>
          <li>Make sure your internet connection is stable to avoid interruptions.</li>
          <li>Do not leave the exam screen or minimize the browser. Any such activity may lead to disqualification.</li>
          <li>Do not attempt to copy, take screenshots, or share exam content. This is strictly prohibited.</li>
          <li>Follow all instructions displayed on the exam screen carefully and proceed as directed.</li>
          <li>Contact the support team immediately if you encounter any technical issues during the exam.</li>
        </ol>
        <p className="text-danger">
          <strong>Note:</strong> Any suspicious activity such as switching tabs, opening new windows, or trying to navigate away will result in immediate termination of your exam.
        </p>

        <div className="form-check mt-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="agreeCheckbox"
            checked={isAgreed}
            onChange={handleCheckboxChange}
          />
          <label className="form-check-label" htmlFor="agreeCheckbox">
            I agree to the terms and conditions
          </label>
        </div>

        <button
          className={`btn mt-3 ${isAgreed ? 'btn-success' : 'btn-secondary'}`}
          onClick={handleStartExam}
          disabled={!isAgreed}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
};

export default StartExamInstruction;
