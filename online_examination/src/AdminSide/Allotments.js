import React, { useContext, useEffect, useState, useMemo, useRef } from 'react'
import BasicTable from './BasicTable'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { UserContext } from '../UserContext';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { saveAs } from "file-saver";
import Papa from "papaparse";


const Allotments = () => {

  const { JwtToken, endpoint, showError, generateJwt } = useContext(UserContext);
  const tooltipRef = useRef(null);
  const [viewSuspeciousModel, setViewSuspeciousModel] = useState(false);
  const [viewResultModel, setViewResultModel] = useState(false);
  //for filtering
  //Question tabel data
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [suspeciusData,setSuspeciusData]=useState(null);
  const [resultData,setResultData]=useState(null);
  const [studentGroup, setStudentGroup] = useState([]);
  const [tempData,setTempData] = useState([]);

  //exam allotment Tabel Columns
  const examColumn = useMemo(() => [
    {
      Header: 'Allotment ID',
      accessor: 'allotment.allotmentId',
      Footer: 'Allotment ID',
    },
    {
      Header: 'Unique Id',
      accessor: 'allotment.studentId.unique_id',
      Footer: 'Unique Id',
    },
    {
      Header: 'Student Name',
      accessor: 'allotment.studentId.name',
      Footer: 'Student Name'
    },
    {
      Header: 'Exam Id',
      accessor: 'exam.examId',
      Footer: 'Exam Id',
    },
    {
      Header: 'Exam Name',
      accessor: 'exam.examName',
      Footer: 'Exam Name'
    },
    {
      Header: 'Student Group',
      accessor: 'allotment.studentId.group.name',
      Footer: 'Student Group',
    },
    {
      Header: 'Used Time',
      accessor: 'allotment.usedTime',
      Footer: 'Used Time',
    },
    {
      Header: 'Is Apeared',
      accessor: 'allotment.isAppeared',
      Footer: 'Is Apeared',
      Cell: ({ value }) => value ? "Yes" : "No"
    },
    {
      Header: 'Is Submited',
      accessor: 'allotment.isSubmited',
      Footer: 'Is Submited',
      Cell: ({ value }) => value ? "Yes" : "No"
    },
    {
      Header: 'View Suspecius',
      Cell: ({ row }) => (<div className="d-flex justify-content-around">
        {/* Update Icon */}
        <span
          className="text-warning"
          style={{ cursor: 'pointer', fontSize: '18px' }}
          onClick={() => ViewSuspeciusActivity(row.original.allotment)}
        >
          <FontAwesomeIcon icon={faEye} />
        </span>
      </div>),
      Footer: 'View Result',
    },
    {
      Header: 'View Result',
      Cell: ({ row }) => (<div className="d-flex justify-content-around">
        {/* Update Icon */}
        <span
          className="text-warning"
          style={{ cursor: 'pointer', fontSize: '18px' }}
          onClick={() => ViewResult(row.original.allotment)}
        >
          <FontAwesomeIcon icon={faEye} />
        </span>
      </div>),
      Footer: 'View Result',
    },
    {
      Header: 'Update Time',
      accessor: 'allotment.updatedAt', // Fix here
      Footer: 'Creation Time',
      Cell: ({ value }) => format(new Date(value), 'dd/MM/yyyy HH:mm:ss'), // Formatting date correctly
    },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="d-flex justify-content-around">
          {/* Delete Icon */}
          <span
            className="text-danger"
            style={{ cursor: 'pointer', fontSize: '18px', marginLeft: '10px' }}
            onClick={() => handleDelete(row.original.allotment.allotmentId)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </span>
        </div>
      ),
    }
  ], []);




  //Delete Question

  const handleDelete = (Id) => {
    axios.delete(`${endpoint}/api/exam/allotments/${Id}`, {
      headers: {
        "Authorization": `Bearer ${JwtToken}`,
      }
    }).then(res => {
      showError("Allotment Deleted Succefully", 1000, "success");
      LoadData();
    }).catch(error => {
      showError("Somthing went wrong Plese Try Again Letter");
    })
  };
  //delete multiple question
  const deleteMultipleExam = (selectedFlatRows) => {
    const allotments = selectedFlatRows.map(row => row.original.allotment);
    axios.post(`${endpoint}/api/exam/allotments/multiple`, allotments, {
      headers: {
        "Authorization": `Bearer ${JwtToken}`,
      }
    })
      .then(res => {
        toast("Multiple Allotments Deleted Sucessfully", 1000, "success");
        setTimeout(() => {
          LoadData();
        }, 1000);
      })
      .catch(error => {
        toast("Somthing went wrong While Deleting Multiple Question");
      })
  }

  // Loading Allotments
  const LoadData = async () => {
    await axios.get(`${endpoint}/api/exam/allotments`, {
      headers: {
        "Authorization": `Bearer ${JwtToken}`
      }
    })
      .then(res => {
        setData(res.data);
        setFilterData(res.data);
        setTempData(res.data);
      })
      .catch(error => {
        if (error.status === 404) {
          setData([]);
          setFilterData([]);
          showError("No Allotment Found");
        } else showError("Somthing wrong while loading Question")
      })
  }

  //loading student group
  const LoadStudentGroup = async () => {
    await axios.get(`${endpoint}/api/group`, {
      headers: {
        "Authorization": `Bearer ${JwtToken}`
      }
    })
      .then(res => {
        setStudentGroup(res.data);
      })
      .catch(error => {
        if (error.status === 404) {
          showError("No Student Group Found");
        } else showError("Somthing wrong while loading Student Group")
      })
  }

  //use Effect
  useEffect(() => {
    LoadData();
    LoadStudentGroup();
    //its a clean up function when component unmount
    if (tooltipRef.current) {
      const tooltip = new window.bootstrap.Tooltip(tooltipRef.current);
      return () => tooltip.dispose();
    }
  }, []);

  //Extra funcction
  //filter by student group 
  const filterByGroup = (grouid) => {
    console.log(data);
    if (grouid === "0") {
      setFilterData(data);
    } else {
      const filtereStudentGroupData = data.filter(exam => exam.allotment.studentId.group.id.toString() === grouid);
      setFilterData(filtereStudentGroupData);
    }
  }


  //loading data of pertcular allotment
  const ViewResult = (allotment) => {
        setResultData(allotment.results);
        setViewResultModel(true);
  }

  const ViewSuspeciusActivity=(allotment)=>{
    setSuspeciusData(allotment.securityLog);
    setViewSuspeciousModel(true);
  }

  //closing all model and clering temp data
  const closeModels = () => {
    setViewSuspeciousModel(false);
    setViewResultModel(null);
    setResultData(null);
    setSuspeciusData(null);
  }
  return (
    <>
      <div className="container-fluid" id="container-wrapper">
        <div className="d-sm-flex align-items-center justify-content-between mb-4 ml-200">
          <div className='row'>
            <h3 className="mb-3 text-center">Allotment Managment</h3>
            <div>
              <BasicTable data={filterData} columns={examColumn} deleteMultiUser={deleteMultipleExam} groups={studentGroup} filterByGroup={filterByGroup} />
            </div>
          </div>
        </div>
      </div>
{/* Viewing Result of student */}
      {viewResultModel && (
        <div className="modal-overlay">
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">View Result</h5>
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
                        <p><strong>Result ID:</strong>  {resultData.resultId}</p>
                        <p><strong>No Of Right Questions:</strong>{resultData.rightQuestions}</p>
                        <p><strong>Upated At:</strong> {format(new Date(resultData.updatedAt), 'dd/MM/yyyy HH:mm:ss')}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>marks:</strong> {resultData.marks}</p>
                        <p><strong>No Of Wrong Questions:</strong> {resultData.wrongQuestions}</p>
                        <p><strong>Result Status:</strong> {resultData.resultStatus}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Viewing suspeciusData of student */}
      {viewSuspeciousModel && (
        <div className="modal-overlay">
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">View Suspecius Activity</h5>
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
                        <p><strong>security Log ID:</strong>  {suspeciusData.securityLogId}</p>
                        <p><strong>tab Switch Count:</strong>{suspeciusData.tabSwitchCount}</p>
                        <p><strong>isSuspicious:</strong> {suspeciusData.isSuspicious ?"Yes":"No"}</p>
                        <p><strong>updatedAt:</strong> {format(new Date(suspeciusData.updatedAt), 'dd/MM/yyyy HH:mm:ss')}</p>
                      </div>
                      <div className="col-md-6">
                        <p><strong>browser Closed Count:</strong> {suspeciusData.browserClosed}</p>
                        <p><strong>first Login Ip:</strong> {suspeciusData.firstLoginIp}</p>
                        <p><strong>login Able:</strong> {suspeciusData.loginAble ? "Yes":"No"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Allotments