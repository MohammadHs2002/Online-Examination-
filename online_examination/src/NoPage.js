import React from 'react';
import { Link } from 'react-router-dom';

const NoPage = () => {

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light text-center">
      <div>
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead mb-4">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link className="btn btn-primary" to="/">
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NoPage;
