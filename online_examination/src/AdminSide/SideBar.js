import React from 'react'
import { NavLink } from 'react-router-dom'

const SideBar = () => {
    return (
        <>
            <ul className="navbar-nav sidebar sidebar-light accordion" id="accordionSidebar">
                <a className="sidebar-brand d-flex align-items-center justify-content-center">
                    <div className="sidebar-brand-icon">
                        <img style={{width:'100%'}} src={`${process.env.PUBLIC_URL}/assets/admin/img/logo/logo.png`} />
                    </div>
                </a>
                <hr className="sidebar-divider my-0" />
                <li className="nav-item active">
                    <NavLink className="nav-link" to="http://localhost:3000/admin" > <i className="fas fa-fw fa-tachometer-alt" /><span>Dashboard</span></NavLink>
                </li>
                <hr className="sidebar-divider" />
                <div className="sidebar-heading">
                    User Managment
                </div>
                <li className="nav-item">
                    <NavLink className="nav-link collapsed" to="users" data-target="#collapseBootstrap" aria-expanded="true" aria-controls="collapseBootstrap">
                        <i className="far fa-solid fa-user" />
                        <span>Admin</span>
                    </NavLink>
                </li>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#collapseForm" aria-expanded="true" aria-controls="collapseForm">
                        <i className="fas fa-fw fa-user-graduate" />
                        <span>Student</span>
                    </a>
                    <div id="collapseForm" className="collapse" aria-labelledby="headingForm" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
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
                <div className="sidebar-heading">
                    Question Managment
                </div>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#openQuestion" aria-expanded="true" aria-controls="collapseForm">
                        <i className="fas fa-fw fa-palette" />
                        <span>MCQ</span>
                    </a>
                    <div id="openQuestion" className="collapse" aria-labelledby="headingForm" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <NavLink className="nav-link collapsed" to="mcq-question" data-target="#collapseBootstrap" aria-expanded="true" aria-controls="collapseBootstrap">
                                <span>Question</span>
                            </NavLink>
                            <NavLink className="nav-link collapsed" to="mcq-question-category" data-target="#collapseBootstrap" aria-expanded="true" aria-controls="collapseBootstrap">
                                <span>Category</span>
                            </NavLink>
                        </div>  
                    </div>
                </li>
                <li className="nav-item">
                    <NavLink className="nav-link collapsed" to="programing-question" data-target="#collapseBootstrap" aria-expanded="true" aria-controls="collapseBootstrap">
                        <i className="fas fa-fw fa-question" />
                        <span>Programing</span>
                    </NavLink>
                </li>
                <br/>
                <div className="sidebar-heading">
                    Exam Managment
                </div>
                <li className="nav-item">
                    <a className="nav-link collapsed" href="#" data-toggle="collapse" data-target="#openExam" aria-expanded="true" aria-controls="collapseForm">
                        <i className="fas fa-fw fa-book-open" />
                        <span>Exams</span>
                    </a>
                    <div id="openExam" className="collapse" aria-labelledby="headingForm" data-parent="#accordionSidebar">
                        <div className="bg-white py-2 collapse-inner rounded">
                            <NavLink className="nav-link collapsed" to="exams" data-target="#collapseBootstrap" aria-expanded="true" aria-controls="collapseBootstrap">
                                <span>Exams</span>
                            </NavLink>
                            <NavLink className="nav-link collapsed" to="allotments" data-target="#collapseBootstrap" aria-expanded="true" aria-controls="collapseBootstrap">
                                <span>Allotments</span>
                            </NavLink>
                        </div>  
                    </div>
                </li>
                <hr className="sidebar-divider" />
                <div className="version" id="version-ruangadmin" />
            </ul>
        </>
    )
}

export default SideBar