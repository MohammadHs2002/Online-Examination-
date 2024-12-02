import React, { useContext, useEffect, useState, useMemo, useRef } from 'react'
import BasicTable from './BasicTable'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { UserContext } from '../UserContext';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck, faTimes, faL } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const Student = () => {
    const { JwtToken, endpoint, showError, generateJwt } = useContext(UserContext);
    const tooltipRef = useRef(null);
    //form for update delete
    const createStudentForm = useForm({
        defaultValues: {
            username: '',
            password: '',
            name: '',
            unique_id: '',
            program: "",
            semester: 1,
            division: '',
            groupid: '',
            number: null,
        }
    });
    const { register, control, reset, handleSubmit } = createStudentForm;
    //for model open and Student updateid group
    const [createStudentModel, setCreateStudentModel] = useState(false);
    const [updateStudentModel, setUpdateStudentModel] = useState(false);
    const [updateStudentId, setUpdateStudentId] = useState(null);
    const [addGroupModel, setAddGroupModel] = useState(false);
    const [createMultipleStudentModel, setCreateMultipleStudentModel] = useState(false);

    //Student tabel data
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [groupsData, setGroupData] = useState([]);
    const [group, setGroup] = useState('');
    const [studentFile, setStudentFile] = useState();
    const [multipleStudentGroupId, setMultipleStudentGroupId] = useState("");
    const [multipleStudentError, setMultipleStudentError] = useState("");
    const [copied, setCopied] = useState(false);

    // Student Tabel Columns


    const userColumn = useMemo(() => [
        {
            Header: 'ID',
            accessor: 'id',
            Footer: 'ID',
        },
        {
            Header: 'name',
            accessor: 'name',
            Footer: 'name',
        },
        {
            Header: 'Unique id',
            accessor: 'unique_id',
            Footer: 'Unique id',
        },
        {
            Header: 'username',
            accessor: 'user.username',
            Footer: 'username',
        },
        {
            Header: 'Password',
            accessor: 'user.password',
            Footer: 'Password',
            Cell: () => "Encrypted",
        },
        {
            Header: 'Course',
            accessor: 'program',
            Footer: 'Course',
        },
        {
            Header: 'Sem',
            accessor: 'semester',
            Footer: 'Sem',
        },
        {
            Header: 'Div',
            accessor: 'division',
            Footer: 'Div',
        },
        {
            Header: 'Group',
            accessor: 'group.name',
            Footer: 'Group',
        },
        {
            Header: 'Mobile',
            accessor: 'number',
            Footer: 'Mobile',
        },
        {
            Header: 'Creation Time',
            accessor: 'createdAt',
            Footer: 'Creation Time',
            Cell: ({ value }) => format(new Date(value), 'dd/MM/yyyy HH:mm:ss'), // Formatting date correctly
        },
        {
            Header: 'Update Time',
            accessor: 'updatedAt', // Fix here
            Footer: 'Creation Time',
            Cell: ({ value }) => format(new Date(value), 'dd/MM/yyyy HH:mm:ss'), // Formatting date correctly
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <div className="d-flex justify-content-around">
                    {/* Update Icon */}
                    <span
                        className="text-warning"
                        style={{ cursor: 'pointer', fontSize: '18px' }}
                        onClick={() => handleUpdate(row.original.id)}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </span>

                    {/* Delete Icon */}
                    <span
                        className="text-danger"
                        style={{ cursor: 'pointer', fontSize: '18px', marginLeft: '10px' }}
                        onClick={() => handleDelete(row.original.id)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </span>

                    {/* Activation/Deactivation Icon */}
                    <span
                        className={`text-${row.original.active ? 'success' : 'secondary'}`}
                        style={{ cursor: 'pointer', fontSize: '18px', marginLeft: '10px' }}
                        onClick={() => toggleActivation(row.original.user.userId)}
                    >
                        <FontAwesomeIcon icon={row.original.user.active ? faCheck : faTimes} />
                    </span>
                </div>
            ),
        }
    ], []);


    //Create , Update , Delete , Active/Deactive Student Function

    //Create Student


    const HandleNewStudentSubmit = async (data) => {
        await axios.post(
            `${endpoint}/api/student`, data,
            {
                headers: {
                    Authorization: `Bearer ${JwtToken}`,
                },
            }
        ).then(res => {
            if (res.status === 201) {
                showError("Student Created Successfully", 1000, "success");
                closeModels();
                LoadData();
            }
        })
            .catch(error => {
                showError(error.response.data)
            })
    };


    //Update Student
    const handleUpdate = (id) => {
        axios.get(`${endpoint}/api/student/${id}`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        }).then(res => {
            const student = res.data;
            reset({
                username: student.user.username,
                password: '',
                name: student.name,
                unique_id: student.unique_id,
                program: student.program,
                semester: student.semester,
                division: student.division,
                number: student.number,
                groupid:student.group.id
            })
            setUpdateStudentId(id);
            setUpdateStudentModel(true);
        })
            .catch(error => {
                showError("Somthing went wrong while Updating User");
                if (error.status === 401) {
                    generateJwt();
                }
            })
    };

    // handling update submit
    const HandleUpdateSubmit = (data) => {
        console.log(data);
        axios.put(`${endpoint}/api/student/${updateStudentId}`, data, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`,
            }
        }).then(res => {
            if (res.status === 200) {
                setUpdateStudentModel(false);
                LoadData();
                showError("Student Updated Sucessfully", 1000, 'success');
                reset();
            }
        }).catch(error => {
            if (error.status === 409) {
                console.log(error);
                showError(error.response.data);
            } else {
                showError("Somthing went wrong while Updating Student");
            }
            if (error.status === 401) {
                generateJwt();
            }
        })
    }

    //Delete Student

    const handleDelete = (Id) => {
        console.log(Id);
        axios.delete(`${endpoint}/api/student/${Id}`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`,
            }
        }).then(res => {
            showError("User Deleted Succefully", 1000, "success");
            LoadData();
        }).catch(error => {
            showError("Somthing went wrong Plese Try Again Letter");
        })
    };

    const deleteMultiStudent = (selectedFlatRows) => {
        const studentList = selectedFlatRows.map(row => row.original);
        axios.post(`${endpoint}/api/student/multiple`, studentList, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`,
            }
        })
            .then(res => {
                toast("Multiple User Deleted Sucessfully", 1000, "success");
                setTimeout(() => {
                    LoadData();
                }, 3000);
            })
            .catch(error => {
                console.log(error);
                toast("Somthing went wrong While Deleting Multiple User");
            })
    }

    //Active Deactive Student
    const toggleActivation = (userId) => {
        axios.get(`${endpoint}/api/user/activate/${userId}`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        })
            .then(res => {
                showError("User Activation Status Changed Succesfully", 1000, "success");
                LoadData();
            })
            .catch(error => {
                showError("Somthing went wrong please try Again!");
                if (error.status === 401) {
                    generateJwt();
                }
            })
    };


    const deActiveMultipleUser = (selectedFlatRows) => {
        const userList = selectedFlatRows.map(row => row.original.user);
        axios.post(`${endpoint}/api/user/deactiveMultipleUser`, userList, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`,
            }
        })
            .then(res => {
                if (res.status === 200) {
                    showError("Selected User Deactivated Sucessfully", 1000, "success");
                    setTimeout(() => {
                        LoadData();
                    }, 1000);
                }
            })
            .catch(error => {
                showError("Somthing went wrong while Deactivating users");
            })
    }

    const activeMultipleUser = (selectedFlatRows) => {
        const userList = selectedFlatRows.map(row => row.original.user);
        axios.post(`${endpoint}/api/user/activeMultipleUser`, userList, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`,
            }
        })
            .then(res => {
                if (res.status === 200) {
                    showError("Selected User activated Sucessfully", 1000, "success");
                    setTimeout(() => {
                        LoadData();
                    }, 1000);
                }
            })
            .catch(error => {
                showError("Somthing went wrong while activating users");
                setTimeout(() => {
                    LoadData();
                }, 1000);
            })
    }




    // Loading student Tabel Data
    const LoadData = async () => {
        await axios.get(`${endpoint}/api/student`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        })
            .then(res => {
                setData(res.data);
                setFilterData(res.data);
                setTimeout(() => {

                }, 3000);
            })
            .catch(error => {
                if (error.status === 404) {
                    setData([]);
                    showError("No Student Found");
                }else showError("Somthing wrong while loading Student")
            })
    }

    // Loading Groups Data
    const LoadGroup = async () => {
        await axios.get(`${endpoint}/api/group`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        })
            .then(res => {
                setGroupData(res.data);
            })
            .catch(error => {
                
            })
    }

    //create new group
    const HandleNewGroupSubmit = async () => {
        await axios.post(`${endpoint}/api/group`, { name: group }, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setTimeout(() => {
                        LoadGroup()
                    }, 2000);
                    showError("New Group Added Successfulyy", 1000, "success");
                    setAddGroupModel(false);
                }
            })
            .catch(error => {
                if(error.status===409){
                    showError("Group name Alredy Exists");
                }else showError("Somthing went Wrong Durring Adding Group");
            })
    }

    //Multiple Student Submit
    const HandleMultipleStudentSubmit = async () => {
        if (studentFile !== undefined && multipleStudentGroupId !== "") {


            console.log(studentFile);
            console.log(multipleStudentGroupId);
            const formData = new FormData();
            formData.append("file", studentFile);
            formData.append("groupId", multipleStudentGroupId);
            await axios.post(`${endpoint}/api/student/upload-csv`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${JwtToken}`,
                },
            })
                .then((res) => {
                    if (res.status === 200) {
                        multipleStudentGroupId("");
                        setCreateMultipleStudentModel(false);
                        showError("Multiple Student Uploded SuccessFulyy", 1000, "success");
                        studentFile();
                        LoadData();
                    }
                })
                .catch((error) => {
                    console.log(error);
                    setMultipleStudentGroupId("");
                    setCreateMultipleStudentModel(false);
                    setMultipleStudentError(error.response.data.error);
                    const insertedRecord=error.response.data.recordInserted;
                    if(insertedRecord!==0){
                        showError(" "+insertedRecord+" Student Record Inserted Succefulyy",1000,"success");
                    }
                    LoadData();
                });
        } else {
            showError("Plese Provide File And Select Group")
        }
    }


    //Extra Functions

    const filterByGroup = (groupId) => {
        if (groupId === "0") {
            setFilterData(data);
        } else {
            const filteredStudentList = data.filter(student => student.group.id.toString() === groupId);
            setFilterData(filteredStudentList);
        }
    }

    const copyToClipboard=()=>{
        navigator.clipboard.writeText(multipleStudentError.split(";").join("\n")) // Use clipboard API to copy
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset "copied" state after 2 seconds
      })
      .catch(err => {
        showError('Error copying to clipboard');
      });
    }

    const closeModels = () => {
        setCreateStudentModel(false);
        setUpdateStudentModel(false);
        reset({
            username: '',
            password: '',
            name: '',
            unique_id: '',
            program: "",
            semester: 1,
            division: '',
            groupid: '',
            number: null
        });
        setAddGroupModel(false);
        setUpdateStudentId(null);
        setGroup(null);
    }

    //use Effect
    useEffect(() => {
        LoadData();
        LoadGroup();
        //its a clean up function when component unmount
        if (tooltipRef.current) {
            const tooltip = new window.bootstrap.Tooltip(tooltipRef.current);
            return () => tooltip.dispose(); // Cleanup on component unmount
        }
    }, []);

    return (
        <>
            <div className="container-fluid" id="container-wrapper">
                <div className="d-sm-flex align-items-center justify-content-between mb-4 ml-200">
                    <div className='row'>
                        <h3 className="mb-3 text-center">Student Managment</h3>
                        <div className='d-flex justify-content-end '>
                            <button type='button' className='btn btn-outline-success' onClick={() => setCreateMultipleStudentModel(true)}>Add Multiple Student</button>
                            <button type='button' className='btn btn-outline-primary' onClick={() => setCreateStudentModel(true)}>Add Student</button>
                        </div>
                        <div>
                            <BasicTable data={filterData} columns={userColumn} deActiveMultipleUser={deActiveMultipleUser} activeMultipleUser={activeMultipleUser} deleteMultiUser={deleteMultiStudent} filterByGroup={filterByGroup} groups={groupsData} />
                        </div>
                    </div>
                </div>
            </div>
            {createStudentModel && (
                <div className="modal-overlay">
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Student</h5>
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
                                    <form onSubmit={handleSubmit(HandleNewStudentSubmit)} method="post">
                                        <div className="row g-2">
                                            {/* Username Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="username" className="form-label">Username</label>
                                                <input
                                                    type="text"
                                                    id="username"
                                                    required
                                                    placeholder='Enter User name'
                                                    className="form-control"
                                                    {...register("username", { required: true })}
                                                />
                                            </div>

                                            {/* Password Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="password" className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    required
                                                    placeholder='Enter Password'
                                                    className="form-control"
                                                    {...register("password", { required: true })}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Name Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="name" className="form-label">Student Name</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    required
                                                    placeholder='Enter Full Name'
                                                    className="form-control"
                                                    {...register("name", { required: true })}
                                                />
                                            </div>

                                            {/* Unique ID Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="unique_id" className="form-label">Unique ID</label>
                                                <input
                                                    type="text"
                                                    id="unique_id"
                                                    required
                                                    placeholder='Enter Unique Id'
                                                    className="form-control"
                                                    {...register("unique_id", { required: true })}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Program Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="program" className="form-label">Course</label>
                                                <input
                                                    type="text"
                                                    id="program"
                                                    placeholder='Enter Course name'
                                                    className="form-control"
                                                    {...register("program", { required: true })}
                                                />
                                            </div>

                                            {/* Semester Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="semester" className="form-label">Semester</label>
                                                <input
                                                    type="number"
                                                    id="semester"
                                                    min="1"
                                                    max="8"
                                                    className="form-control"
                                                    {...register("semester", { required: true })}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Division Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="division" className="form-label">Division</label>
                                                <input
                                                    type="text"
                                                    placeholder='Enter Divison'
                                                    id="division"
                                                    className="form-control"
                                                    {...register("division", { required: true })}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="mobile" className="form-label">Mobile</label>
                                                <input
                                                    type="number"
                                                    placeholder='Enter Mobile'
                                                    id="mobile"
                                                    className="form-control"
                                                    {...register("number", { required: true })}
                                                />
                                            </div>
                                        </div>
                                        <div className="row g-2 mt-2">
                                            {/* Group Dropdown  */}
                                            <div className="col-md-6">
                                                <label htmlFor="groupid" className="form-label">Group</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                                                    </span>
                                                    <select
                                                        className="form-select"
                                                        id="groupid"
                                                        {...register("groupid", { required: true })}
                                                    >
                                                        <option value="">Select a group</option>
                                                        {groupsData.map((group) => (
                                                            <option key={group.id} value={group.id}>
                                                                {group.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className='form-label'></label>
                                                <div className=''>
                                                    <button type="button" className='btn btn-outline-success mt-10' onClick={() => setAddGroupModel(true)}>Add New Group</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-grid mt-3">
                                            <button type="submit" className="btn btn-primary">
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {updateStudentModel && (
                <div className="modal-overlay">
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Update User</h5>
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
                                <form onSubmit={handleSubmit(HandleUpdateSubmit)} method="post">
                                        <div className="row g-2">
                                            {/* Username Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="username" className="form-label">Username</label>
                                                <input
                                                    type="text"
                                                    id="username"
                                                    required
                                                    placeholder='Enter User name'
                                                    className="form-control"
                                                    {...register("username", { required: true })}
                                                />
                                            </div>

                                            {/* Password Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="password" className="form-label">Password</label>
                                                <input
                                                    type="password"
                                                    id="password"
                                                    placeholder='Leave a blank to keep unchanged'
                                                    className="form-control"
                                                    {...register("password")}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Name Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="name" className="form-label">Student Name</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    required
                                                    placeholder='Enter Full Name'
                                                    className="form-control"
                                                    {...register("name", { required: true })}
                                                />
                                            </div>

                                            {/* Unique ID Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="unique_id" className="form-label">Unique ID</label>
                                                <input
                                                    type="text"
                                                    id="unique_id"
                                                    required
                                                    placeholder='Enter Unique Id'
                                                    className="form-control"
                                                    {...register("unique_id", { required: true })}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Program Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="program" className="form-label">Course</label>
                                                <input
                                                    type="text"
                                                    id="program"
                                                    placeholder='Enter Course name'
                                                    className="form-control"
                                                    {...register("program", { required: true })}
                                                />
                                            </div>

                                            {/* Semester Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="semester" className="form-label">Semester</label>
                                                <input
                                                    type="number"
                                                    id="semester"
                                                    min="1"
                                                    max="8"
                                                    className="form-control"
                                                    {...register("semester", { required: true })}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Division Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="division" className="form-label">Division</label>
                                                <input
                                                    type="text"
                                                    placeholder='Enter Divison'
                                                    id="division"
                                                    className="form-control"
                                                    {...register("division", { required: true })}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="mobile" className="form-label">Mobile</label>
                                                <input
                                                    type="number"
                                                    placeholder='Enter Mobile'
                                                    id="mobile"
                                                    className="form-control"
                                                    {...register("number", { required: true })}
                                                />
                                            </div>
                                        </div>
                                        <div className="row g-2 mt-2">
                                            {/* Group Dropdown */}
                                            <div className="col-md-6">
                                                <label htmlFor="groupid" className="form-label">Group</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                                                    </span>
                                                    <select
                                                        className="form-select"
                                                        id="groupid"
                                                        {...register("groupid", { required: true })}
                                                    >
                                                        {groupsData.map((group) => (
                                                            <option key={group.id} value={group.id}>
                                                                {group.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label className='form-label'></label>
                                                <div className=''>
                                                    <button type="button" className='btn btn-outline-success mt-10' onClick={() => setAddGroupModel(true)}>Add New Group</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-grid mt-3">
                                            <button type="submit" className="btn btn-primary">
                                                Submit
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {createMultipleStudentModel && (
                <div className="modal-overlay">
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add Multiple Student</h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={() => setCreateMultipleStudentModel(false)}
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <form method="post">
                                    <div className="row g-2">
                                        <div className="col-md-6 position-relative">
                                            <label htmlFor="File" className="form-label">
                                                Select File
                                                <span
                                                    ref={tooltipRef}
                                                    className="ms-2 text-primary"
                                                    data-bs-toggle="tooltip"
                                                    data-bs-placement="top"
                                                    title={`File must be CSV. It should contain columns:
                                                        -Column Order Must be This
                                                        -student name
                                                        -uniqueId
                                                        -program
                                                        -semester
                                                        -division
                                                        -number
                                                        --Student usernam is Default uniqueid
                                                        --student password is deafult mobile numbers Last 7 digit
                                                        `}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    &#9432;
                                                </span>
                                            </label>
                                            <input
                                                type="file"
                                                id="File"
                                                required
                                                accept=".csv"
                                                className="form-control mt-2"
                                                onChange={(e) => setStudentFile(e.target.files[0])}
                                            />
                                        </div>
                                    </div>
                                    <div className="row g-2 mt-2">
                                        {/* Group Dropdown  */}
                                        <div className="col-md-6">
                                            <label htmlFor="groupid" className="form-label">Group</label>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                                                </span>
                                                <select
                                                    className="form-select"
                                                    id="groupid"
                                                    value={multipleStudentGroupId}
                                                    onChange={e => setMultipleStudentGroupId(e.target.value)}
                                                >
                                                    <option value="">Select a group</option>
                                                    {groupsData.map((group) => (
                                                        <option key={group.id} value={group.id}>
                                                            {group.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <label className='form-label'></label>
                                            <div className=''>
                                                <button type="button" className='btn btn-outline-success mt-10' onClick={() => setAddGroupModel(true)}>Add New Group</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-grid mt-2">
                                        <button type='button' onClick={() => HandleMultipleStudentSubmit()} className="btn btn-primary m-20">
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {addGroupModel && (
                <div className="modal-overlay">
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Group</h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={() => setAddGroupModel(false)}
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <form>
                                    <div className="row g-2">
                                        {/* Group name Field */}
                                        <div className="col-md-6">
                                            <label htmlFor="username" className="form-label">Group Name</label>
                                            <input
                                                type="text"
                                                id="username"
                                                required
                                                placeholder='Enter User name'
                                                className="form-control"
                                                value={group}
                                                onChange={e => { setGroup(e.target.value) }}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-grid mt-2">
                                        <button type='button' onClick={() => HandleNewGroupSubmit()} className="btn btn-primary">
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
{/* multiple student upload error show hear */}
            {multipleStudentError !== "" && (
                <div className="modal-overlay">
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Problem in Some Record While Uplaoding csv</h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={() => setMultipleStudentError("")}
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body" style={{ paddingTop: '10px' }}>
                                    {multipleStudentError.split(';').length > 0 ? (
                                        <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                                            {multipleStudentError.split(';').map((error, index) => (
                                                <li key={index} style={{ marginBottom: '5px' }}>
                                                    {error.trim()}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No errors found.</p>
                                    )}
                                    <button
                                        onClick={copyToClipboard}
                                        style={{
                                            backgroundColor: '#4fa94d',
                                            color: 'white',
                                            padding: '8px 16px',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            marginTop: '10px',
                                        }}
                                    >
                                        {copied ? <i className='fa fa-check'></i> : <i className="fa fa-copy"></i>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
export default Student