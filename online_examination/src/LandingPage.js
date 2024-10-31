import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="bg-light">
      <header id="header" className="header d-flex align-items-center fixed-top">
        <div className="header-container container-fluid container-xl position-relative d-flex align-items-center justify-content-between">
          <a href="index.html" className="logo d-flex align-items-center me-auto me-xl-0">
            <h1 className="sitename text-decoration-none" >E-Exam</h1>
          </a>
          <nav id="navmenu" className="navmenu">
            <ul>
              <li><Link  to="/" className="active">Home</Link></li>
              <li><Link >About</Link></li>   
              <li><Link >Contact</Link></li>
            </ul>
            <i className="mobile-nav-toggle d-xl-none bi bi-list" />
          </nav>
          <Link className="btn-getstarted" to="Login">Login</Link>
        </div>
      </header>

      {/* Main Section */}
      <main className="main pt-5 mt-5"> {/* Adds padding and margin to push content below the navbar */}
        <section id="hero" className="bg-light text-dark py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <h1 className="display-4 fw-bold">Welcome to Online Examination Hub</h1>
                <p className="lead mt-3">
                  Join a community of learners and get access to quality online exams designed for all levels. 
                  Track your progress, review your scores, and enhance your learning experience.
                </p>
                <div className="mt-4">
                  <a href="#register" className="btn btn-primary me-2">Get Started</a>
                  <a href="#learn-more" className="btn btn-outline-secondary">Learn More</a>
                </div>
              </div>
              <div className="col-lg-6">
                <img src="./assets/img/illustration-1.webp" alt="Online Exam Illustration" className="img-fluid rounded shadow-sm" />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer id="footer" className="footer">
        <div className="container footer-top">
          <div className="row gy-4">
            <div className="col-lg-4 col-md-6 footer-about">
              <a href="index.html" className="logo d-flex align-items-center">
                <span className="sitename">E-Exam</span>
              </a>
              <div className="footer-contact pt-3">
                <p>A108 Adam Street</p>
                <p>New York, NY 535022</p>
                <p className="mt-3"><strong>Phone:</strong> <span>+1 5589 55488 55</span></p>
                <p><strong>Email:</strong> <span>info@example.com</span></p>
              </div>
              <div className="social-links d-flex mt-4">
                <a href="#"><i className="bi bi-twitter-x" /></a>
                <a href="#"><i className="bi bi-facebook" /></a>
                <a href="#"><i className="bi bi-instagram" /></a>
                <a href="#"><i className="bi bi-linkedin" /></a>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 footer-links">
              <h4>Useful Links</h4>
              <ul>
                <li><a href="#">Home</a></li>
                <li><a href="#">About us</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Terms of service</a></li>
                <li><a href="#">Privacy policy</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container copyright text-center mt-4">
          <p>© <span>Copyright</span> <strong className="px-1 sitename">E-Exam</strong> <span>All Rights Reserved</span></p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
