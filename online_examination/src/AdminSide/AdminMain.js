import React, { useContext } from 'react';
import { UserContext } from '../UserContext';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SideBar from './SideBar';
import NavBar from './NavBar';
import Foter from './Foter.js';

const AdminMain = () => {


  return (
    <>
      <div id="wrapper">
        {/* Sidebar */}
        <SideBar/>
        {/* Sidebar */}
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            {/* TopBar */}
            <NavBar/>
            {/* Topbar */}
            {/* Container Fluid*/}
              <Outlet/>
            {/*-Container Fluid*/}
          </div>
          {/* Footer */}
          <Foter/>
          {/* Footer */}
        </div>
      </div>

    </>
  );
};

export default AdminMain;
