import React from 'react'

const Navbar = () => {
  return (
    <div>
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
    </div>
  </nav>
  </div>
  )
}

export default Navbar