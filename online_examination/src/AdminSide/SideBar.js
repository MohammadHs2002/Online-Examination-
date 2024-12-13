import React from 'react'
import { NavLink } from 'react-router-dom'

const SideBar = () => {
    return (
        <>
            <ul className="navbar-nav sidebar sidebar-light accordion" id="accordionSidebar">
                <a className="sidebar-brand d-flex align-items-center justify-content-center">
                    <div className="sidebar-brand-icon">
                        <img src={`${process.env.PUBLIC_URL}/assets/admin/img/logo/logo.png`} />
                    </div>
                </a>
                <hr className="sidebar-divider my-0" />
                <li className="nav-item active">
                    <NavLink className="nav-link" to="http://localhost:3000/admin" > <i className="fas fa-fw fa-tachometer-alt" /><span>Dashboard</span></NavLink>
                    <a className="nav-link" href="index.html">
                    </a>
                </li>
                <hr className="sidebar-divider" />
                <div className="sidebar-heading">
                    Features
                </div>
                <li className="nav-item">
                    <NavLink className="nav-link collapsed" to="users" data-target="#collapseBootstrap" aria-expanded="true" aria-controls="collapseBootstrap">
                        <i className="far fa-solid fa-user" />
                        <span>Users</span>
                    </NavLink>
                </li><br/>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseForm" aria-expanded="true" aria-controls="collapseForm">
                        <i className="fas fa-fw fa-table" />
                        <span>Student</span>
                    </a>
                    <div id="collapseForm" className="collapse" aria-labelledby="headingForm" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Student</h6>
                            <NavLink className="nav-link collapsed" to="student" data-target="#collapseBootstrap" aria-expanded="true" aria-controls="collapseBootstrap">
                                <span>Student</span>
                            </NavLink>
                            <NavLink className="nav-link collapsed" to="group" data-target="#collapseBootstrap" aria-expanded="true" aria-controls="collapseBootstrap">
                                <span>Groups</span>
                            </NavLink>
                        </div>
                    </div>
                </li>
                <br/>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#openQuestion" aria-expanded="true" aria-controls="collapseForm">
                        <i className="fas fa-fw fa-table" />
                        <span>MCQ</span>
                    </a>
                    <div id="openQuestion" className="collapse" aria-labelledby="headingForm" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Question</h6>
                            <NavLink className="nav-link collapsed" to="mcq-question" data-target="#collapseBootstrap" aria-expanded="true" aria-controls="collapseBootstrap">
                                <span>Question</span>
                            </NavLink>
                            <NavLink className="nav-link collapsed" to="mcq-question-category" data-target="#collapseBootstrap" aria-expanded="true" aria-controls="collapseBootstrap">
                                <span>Category</span>
                            </NavLink>
                        </div>  
                    </div>
                </li>
                {/*
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseTable" aria-expanded="true" aria-controls="collapseTable">
                        <i className="fas fa-fw fa-table" />
                        <span>Tables</span>
                    </a>
                    <div id="collapseTable" className="collapse" aria-labelledby="headingTable" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Tables</h6>
                            <a className="collapse-item" href="simple-tables.html">Simple Tables</a>
                            <a className="collapse-item" href="datatables.html">DataTables</a>
                        </div>
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="ui-colors.html">
                        <i className="fas fa-fw fa-palette" />
                        <span>UI Colors</span>
                    </a>
                </li>
                <hr className="sidebar-divider" />
                <div className="sidebar-heading">
                    Examples
                </div>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapsePage" aria-expanded="true" aria-controls="collapsePage">
                        <i className="fas fa-fw fa-columns" />
                        <span>Pages</span>
                    </a>
                    <div id="collapsePage" className="collapse" aria-labelledby="headingPage" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <h6 className="collapse-header">Example Pages</h6>
                            <a className="collapse-item" href="login.html">Login</a>
                            <a className="collapse-item" href="register.html">Register</a>
                            <a className="collapse-item" href="404.html">404 Page</a>
                            <a className="collapse-item" href="blank.html">Blank Page</a>
                        </div>
                    </div>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="charts.html">
                        <i className="fas fa-fw fa-chart-area" />
                        <span>Charts</span>
                    </a>
                </li> */}
                <hr className="sidebar-divider" />
                <div className="version" id="version-ruangadmin" />
            </ul>
        </>
    )
}

export default SideBar