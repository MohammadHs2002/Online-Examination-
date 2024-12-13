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

const QuestionCategory = () => {
    //Essential data
    const { JwtToken, endpoint, showError, generateJwt } = useContext(UserContext);
    const [data, setData] = useState([]);
    const [category, setCategory] = useState("");

    //models for create,update,delete
    const [createModel, setCreateModel] = useState(false);
    const [updateModel, setUpdateModel] = useState(false);
    const [deleteModel, setDeleteModel] = useState(false);
    const [updateCategoryId, setUpdateCategoryId] = useState(null);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [multipleCategory,setMultipleCategory] =useState(null);


    // Category tables column
    const catgoryColumn = useMemo(() => [
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
            Cell: ({ value }) => format(new Date(value), 'dd/MM/yyyy HH:mm:ss'), 
        },
        {
            Header: 'Update Time',
            accessor: 'updatedAt', 
            Footer: 'Creation Time',
            Cell: ({ value }) => format(new Date(value), 'dd/MM/yyyy HH:mm:ss'), 
        },
        {
            Header: 'Actions',
            Cell: ({ row }) => (
                <div className="d-flex justify-content-around">
                    <span
                        className="text-warning"
                        style={{ cursor: 'pointer', fontSize: '18px' }}
                        onClick={() => handleUpdate(row.original.id)}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </span>
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



    // Loading Category Data
    const LoadGroup = async () => {
        await axios.get(`${endpoint}/api/MCQCategory`, {
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

    //create new Category
    const HandleNewCategorySubmit = async () => {
        await axios.post(`${endpoint}/api/MCQCategory`, { name: category }, {
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



    //Update Category
    const handleUpdate = (id) => {
        axios.get(`${endpoint}/api/MCQCategory/${id}`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        }).then(res => {
            const group = res.data;
            setCategory(group.name);
            setUpdateCategoryId(id);
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
        axios.put(`${endpoint}/api/MCQCategory/${updateCategoryId}`, { name: category }, {
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
                showError("Somthing went wrong while Updating Student");
            }
            if (error.status === 401) {
                generateJwt();
            }
        })
    }


    //Delete Category model

    const handleDelete = (Id) => {
        setDeleteCategoryId(Id);
        setDeleteModel(true);
    };

//Delete Multple Category Model
    const deleteMultiCategory = (selectedFlatRows) => {
        setMultipleCategory(selectedFlatRows.map(row => row.original));
        setDeleteModel(true);
    }
//Delete Category
    const handleDeleteCategory=()=>{
        if(deleteCategoryId!=null){
            axios.delete(`${endpoint}/api/MCQCategory/${deleteCategoryId}`, {
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
        else if(multipleCategory!=null){
            axios.post(`${endpoint}/api/MCQCategory/deleteMultiple`, multipleCategory, {
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
                    toast("Somthing went wrong While Deleting Multiple User");
                })
        }
    }
//closing all model 

    const closeModels = () => {
        setDeleteModel(false);
        setUpdateModel(false);
        setCreateModel(false);
        setUpdateCategoryId(null);
        setDeleteCategoryId(null);
        setMultipleCategory(null);
        setCategory(null);
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
                        <h3 className="mb-3 text-center">MCQ Category Managment</h3>
                        <div className='d-flex justify-content-end '>
                            <button type='button' className='btn btn-outline-primary' onClick={() => setCreateModel(true)}>Add Category</button>
                        </div>
                        <div>
                            <BasicTable data={data} columns={catgoryColumn} deleteMultiUser={deleteMultiCategory} />
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
                                    <h5 className="modal-title">Add New Category</h5>
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
                                            <label htmlFor="username" className="form-label">Category Name</label>
                                            <input
                                                type="text"
                                                id="username"
                                                required
                                                placeholder='Enter User name'
                                                className="form-control"
                                                value={category}
                                                onChange={e => { setCategory(e.target.value) }}
                                            />
                                        </div>
                                    </div>
                                    <div className="d-grid mt-2">
                                        <button type='button' onClick={() => HandleNewCategorySubmit()} className="btn btn-primary">
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
                                    <h5 className="modal-title">Update New Category</h5>
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
                                            <label htmlFor="username" className="form-label">Category Name</label>
                                            <input
                                                type="text"
                                                id="username"
                                                required
                                                placeholder='Enter User name'
                                                className="form-control"
                                                value={category}
                                                onChange={e => { setCategory(e.target.value) }}
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
                                    <h5 className="modal-title">Delete Category</h5>
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
                                        Warning: Deleting this Category will also delete all MCQ Question associated with it.
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
                                        onClick={() => handleDeleteCategory()}
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

export default QuestionCategory