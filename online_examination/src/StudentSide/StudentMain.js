import React from "react";
import { Outlet } from 'react-router-dom';
const StudentMain = () => {


  return(
    <>
      <div id="wrapper">
        <div id="content-wrapper" className="d-flex flex-column">
          <div id="content">
            {/* Container Fluid*/}
              <Outlet/>
            {/*-Container Fluid*/}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentMain;
