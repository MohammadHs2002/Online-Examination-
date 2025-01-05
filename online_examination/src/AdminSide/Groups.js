import React, { useContext, useEffect, useState, useMemo } from 'react'
import BasicTable from './BasicTable'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { UserContext } from '../UserContext';
import axios from 'axios';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const Groups = () => {
    //essential data
    const { JwtToken, endpoint, showError, generateJwt } = useContext(UserContext);
    const [data, setData] = useState([]);
    const [group, setGroup] = useState("");

    //models for update,delete
    const [createModel, setCreateModel] = useState(false);
    const [updateModel, setUpdateModel] = useState(false);
    const [deleteModel, setDeleteModel] = useState(false);
    const [updateGroupId, setUpdateGroupId] = useState(null);
    const [deleteGroupId, setDeleteGroupId] = useState(null);
    const [multipleGroups,setMultipleGroups] =useState(null);


    // Goup tables column
    const groupColumn = useMemo(() => [
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
                </div>
            ),
        }
    ], []);



    // Loading Groups Data
    const LoadGroup = async () => {
        await axios.get(`${endpoint}/api/group`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        })
            .then(res => {
                setData(res.data);
            })
            .catch(error => {
                if(error.status===404){
                    showError("No Group Found");
                    setData([]);
                }else showError("Somthing wrong while loading Group")
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
                    closeModels();
                }
            })
            .catch(error => {
                if (error.status === 409) {
                    showError("Group name Alredy Exists");
                } else showError("Somthing went Wrong Durring Adding Group");
            })
    }



    //Update Student
    const handleUpdate = (id) => {
        axios.get(`${endpoint}/api/group/${id}`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        }).then(res => {
            const group = res.data;
            setGroup(group.name);
            setUpdateGroupId(id);
            setUpdateModel(true);
        })
            .catch(error => {
                showError("Somthing went wrong while Updating Group");
                if (error.status === 401) {
                    generateJwt();
                }
            })
    };

    // handling update submit
    const HandleUpdateSubmit = (data) => {
        console.log(data);
        axios.put(`${endpoint}/api/group/${updateGroupId}`, { name: group }, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`,
            }
        }).then(res => {
            if (res.status === 200) {
                closeModels();
                LoadGroup();
                showError("Group Updated Sucessfully", 1000, 'success');
            }
        }).catch(error => {
            if (error.status === 409) {
                console.log(error);
                showError(error.response.data);
            } else {
                showError("Somthing went wrong while Updating Group");
            }
            if (error.status === 401) {
                generateJwt();
            }
        })
    }


    //Delete Group

    const handleDelete = (Id) => {
        setDeleteGroupId(Id);
        setDeleteModel(true);
    };


    const deleteMultiGroup = (selectedFlatRows) => {
        setMultipleGroups(selectedFlatRows.map(row => row.original));
        setDeleteModel(true);
    }

    const handleDeleteGroup=()=>{
        if(deleteGroupId!=null){
            axios.delete(`${endpoint}/api/group/${deleteGroupId}`, {
                headers: {
                    "Authorization": `Bearer ${JwtToken}`,
                }
            }).then(res => {
                showError("Group Deleted Succefully", 1000, "success");
                setTimeout(() => {
                    LoadGroup();
                }, 3000);
                closeModels();
            }).catch(error => {
                showError("Somthing went wrong Plese Try Again Letter");
            })
        }
        else if(multipleGroups!=null){
            axios.post(`${endpoint}/api/group/multiple`, multipleGroups, {
                headers: {
                    "Authorization": `Bearer ${JwtToken}`,
                }
            })
                .then(res => {
                    toast("Multiple Groups Deleted Sucessfully", 1000, "success");
                    closeModels();
                    setTimeout(() => {
                        LoadGroup();
                    }, 3000);
                })
                .catch(error => {
                    toast("Somthing went wrong While Deleting Multiple Groups");
                })
        }
    }


    const closeModels = () => {
        setDeleteModel(false);
        setUpdateModel(false);
        setCreateModel(false);
        setUpdateGroupId(null);
        setDeleteGroupId(null);
        setMultipleGroups(null);
        setGroup(null);
    }

    //use Effect
    useEffect(() => {
        LoadGroup();
    }, []);



    return (
        <>
            <div className="container-fluid" id="container-wrapper">
                <div className="d-sm-flex align-items-center justify-content-between mb-4 ml-200">
                    <div className='row'>
                        <h3 className="mb-3 text-center">Groups Managment</h3>
                        <div className='d-flex justify-content-end '>
                            <button type='button' className='btn btn-outline-primary' onClick={() => setCreateModel(true)}>Add Group</button>
                        </div>
                        <div>
                            <BasicTable data={data} columns={groupColumn} deleteMultiUser={deleteMultiGroup} />
                        </div>
                    </div>
                </div>
            </div>
            {createModel && (
                <div className="modal-overlay">
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Group</h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={() => closeModels()}
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

            {updateModel && (
                <div className="modal-overlay">
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Group</h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={() => closeModels()}
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
                                        <button type='button' onClick={() => HandleUpdateSubmit()} className="btn btn-primary">
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {deleteModel && (
                <div className="modal-overlay">
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Delete Group</h5>
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
                                    <p className="text-danger fw-bold">
                                        Warning: Deleting this group will also delete all Student associated with it.
                                        This action is irreversible!
                                    </p>
                                    <p>Are you sure you want to proceed?</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => closeModels()}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteGroup()}
                                    >
                                        Delete Group
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </>
    )
}

export default Groups