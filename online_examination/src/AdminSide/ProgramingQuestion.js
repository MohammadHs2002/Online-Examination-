import React, { useContext, useEffect, useState, useMemo, useRef } from 'react'
import BasicTable from './BasicTable'
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { UserContext } from '../UserContext';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';


const ProgramingQuestion = () => {

    const { JwtToken, endpoint, showError, generateJwt } = useContext(UserContext);
    const tooltipRef = useRef(null);
    //form for update delete
    const crateQuestionForm = useForm({
        defaultValues: {
            title: '',
            description: '',
            sampleInput: '',
            sampleOutput: '',
            hints: '',
            referenceAnswer: '',
            difficulty: ''
        }
    });


    //question form
    const { register, control, reset, handleSubmit } = crateQuestionForm;
    //for model open and Question updateid
    const [createNewQuestionModel, setCreateNewQuestionModel] = useState(false);
    const [updateQuestionModel, setUpdateQuestionModel] = useState(false);
    const [updateQuestionId, setUpdateQuestionId] = useState(null);
    const [createMultipleQuestionModel, setCreateMultipleQuestionModel] = useState(false);

    //Question tabel data
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);


    // Programing Question Tabel Columns
    const questionColumn = useMemo(() => [
        {
            Header: 'ID',
            accessor: 'id',
            Footer: 'ID',
        },
        {
            Header: 'Title',
            accessor: 'title',
            Footer: 'Title',
        },
        {
            Header: 'Description',
            accessor: 'description',
            Footer: 'Description',
        },
        {
            Header: 'Sample Input',
            accessor: 'sampleInput',
            Footer: 'Sample Input',
        },
        {
            Header: 'Sample Output',
            accessor: 'sampleOutput',
            Footer: 'Sample Output',
        },
        {
            Header: 'Hints',
            accessor: 'hints',
            Footer: 'Hints',
        },
        {
            Header: 'Reference Answer',
            accessor: 'referenceAnswer',
            Footer: 'Reference Answer',
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

    //Create , update , delete Functions
    //new Programing Question Creation
    const HandleNewQuestionCreation = async (data) => {
        await axios.post(
            `${endpoint}/api/programQuestion`, data,
            {
                headers: {
                    Authorization: `Bearer ${JwtToken}`,
                },
            }
        ).then(res => {
            if (res.status === 200) {
                showError("Question Created Successfully", 1000, "success");
                closeModels();
                LoadData();
            }
        })
            .catch(error => {
                showError(error.response.data)
            })
    };


    //Update Question
    const handleUpdate = (id) => {
        axios.get(`${endpoint}/api/programQuestion/${id}`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        }).then(res => {
            const question = res.data;
            reset({
                title: question.title,
                description: question.description,
                sampleInput: question.sampleInput,
                sampleOutput: question.sampleOutput,
                hints: question.hints,
                referenceAnswer: question.referenceAnswer,
                difficulty: question.difficulty
            })
            setUpdateQuestionId(id);
            setUpdateQuestionModel(true);
        })
            .catch(error => {
                showError("Somthing went wrong while Updating Question");
                if (error.status === 401) {
                    generateJwt();
                }
            })
    };

    // handling update submit
    const HandleUpdateSubmit = (data) => {
        axios.put(`${endpoint}/api/programQuestion/${updateQuestionId}`, data, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`,
            }
        }).then(res => {
            if (res.status === 200) {
                closeModels()
                LoadData();
                showError("Question Updated Sucessfully", 1000, 'success');
                reset();
            }
        }).catch(error => {
            if (error.status === 409) {
                showError(error.response.data);
            } else {
                showError("Somthing went wrong while Updating Question");
            }
            if (error.status === 401) {
                generateJwt();
            }
        })
    }

    //Delete Question

    const handleDelete = (Id) => {
        axios.delete(`${endpoint}/api/programQuestion/${Id}`, {
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
    //delete multiple question
    const deleteMultiQuestion = (selectedFlatRows) => {
        const questionList = selectedFlatRows.map(row => row.original);
        axios.post(`${endpoint}/api/programQuestion/multiple`, questionList, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`,
            }
        })
            .then(res => {
                toast("Multiple Question Deleted Sucessfully", 1000, "success");
                setTimeout(() => {
                    LoadData();
                }, 1000);
            })
            .catch(error => {
                toast("Somthing went wrong While Deleting Multiple Question");
            })
    }

    // Loading Programing Question
    const LoadData = async () => {
        await axios.get(`${endpoint}/api/programQuestion`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        })
            .then(res => {
                setData(res.data);
                setFilterData(res.data);
            })
            .catch(error => {
                if (error.status === 404) {
                    setData([]);
                    setFilterData([]);
                    showError("No Question Found");
                } else showError("Somthing wrong while loading Question")
            })
    }

    //use Effect
    useEffect(() => {
        LoadData();
        //its a clean up function when component unmount
        if (tooltipRef.current) {
            const tooltip = new window.bootstrap.Tooltip(tooltipRef.current);
            return () => tooltip.dispose();
        }
    }, []);

    ///filter by difficulty
    const filterByDificulty = (dificulty) => {
        let filteredCategorList = null;
        if (dificulty === "0") {
            setFilterData(data);
        } else {
            const filteredQuestionList = data.filter(question => question.difficulty.toString() === dificulty);
            setFilterData(filteredQuestionList);
        }
    }


    //closing all model its data
    const closeModels = () => {
        setCreateNewQuestionModel(false);
        setUpdateQuestionModel(false);
        reset({
            title: '',
            description: '',
            sampleInput: '',
            sampleOutput: '',
            hints: '',
            referenceAnswer: '',
            difficulty: ''
        });
        setUpdateQuestionId(null);
    }
    return (
        <>
            <div className="container-fluid" id="container-wrapper">
                <div className="d-sm-flex align-items-center justify-content-between mb-4 ml-200">
                    <div className='row'>
                        <h3 className="mb-3 text-center">Programing Question Managment</h3>
                        <div className='d-flex justify-content-end '>
                            <button type='button' className='btn btn-outline-primary' onClick={() => setCreateNewQuestionModel(true)}>Add Question</button>
                        </div>
                        <div>
                            <BasicTable data={filterData} columns={questionColumn} filterByDificulty={filterByDificulty} deleteMultiUser={deleteMultiQuestion} />
                        </div>
                    </div>
                </div>
            </div>
            {createNewQuestionModel && (
                <div className="modal-overlay">
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Add New Question</h5>
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
                                    <form onSubmit={handleSubmit(HandleNewQuestionCreation)} method="post">
                                        <div className="row g-2">
                                            <div className="col-md-6">
                                                <label htmlFor="title" className="form-label">Title</label>
                                                <input
                                                    type="text"
                                                    id="title"
                                                    required
                                                    placeholder='Enter Question Title'
                                                    className="form-control"
                                                    {...register("title", { required: true })}
                                                />
                                            </div>

                                            {/* Password Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="description" className="form-label">Description</label>
                                                <input
                                                    type="text"
                                                    id="description"
                                                    row='5'
                                                    columns="4"
                                                    required
                                                    placeholder='Enter Description'
                                                    className="form-control"
                                                    {...register("description", { required: true })}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Name Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="sampleInput" className="form-label">Sample Input</label>
                                                <input
                                                    type="text"
                                                    id="sampleInput"
                                                    placeholder='Enter Sample Input'
                                                    className="form-control"
                                                    {...register("sampleInput")}
                                                />
                                            </div>

                                            {/* Unique ID Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="sampleOutput" className="form-label">Sample Output</label>
                                                <input
                                                    type="text"
                                                    id="sampleOutput"
                                                    placeholder='Enter Sample Output'
                                                    className="form-control"
                                                    {...register("sampleOutput")}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Program Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="hints" className="form-label">Hint</label>
                                                <input
                                                    type="text"
                                                    id="hints"
                                                    placeholder='Enter hint for Question'
                                                    className="form-control"
                                                    {...register("hints")}
                                                />
                                            </div>

                                            {/* Semester Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="referenceAnswer" className="form-label">Reference Answer</label>
                                                <input
                                                    type="text"
                                                    id="referenceAnswer"
                                                    placeholder='Enter Answer'
                                                    className="form-control"
                                                    required
                                                    {...register("referenceAnswer", { required: true })}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Group Dropdown  */}
                                            <div className="col-md-6">
                                                <label htmlFor="difficulty" className="form-label">difficulty</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                                                    </span>
                                                    <select
                                                        className="form-select"
                                                        id="difficulty"
                                                        required
                                                        {...register("difficulty", { required: true })}
                                                    >
                                                        <option value="">Select a Difficulty</option>
                                                        {["HARD", "MEDIUM", "EASY"].map((difi) => (
                                                            <option key={difi} value={difi}>
                                                                {difi}
                                                            </option>
                                                        ))}
                                                    </select>
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


            {updateQuestionModel && (
                <div className="modal-overlay">
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Update Question</h5>
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
                                            <div className="col-md-6">
                                                <label htmlFor="title" className="form-label">Title</label>
                                                <input
                                                    type="text"
                                                    id="title"
                                                    required
                                                    placeholder='Enter Question Title'
                                                    className="form-control"
                                                    {...register("title", { required: true })}
                                                />
                                            </div>

                                            {/* Password Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="description" className="form-label">Description</label>
                                                <input
                                                    type="text"
                                                    id="description"
                                                    required
                                                    placeholder='Enter Description'
                                                    className="form-control"
                                                    {...register("description", { required: true })}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Name Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="sampleInput" className="form-label">Sample Input</label>
                                                <input
                                                    type="text"
                                                    id="sampleInput"
                                                    placeholder='Enter Sample Input'
                                                    className="form-control"
                                                    {...register("sampleInput")}
                                                />
                                            </div>

                                            {/* Unique ID Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="sampleOutput" className="form-label">Sample Output</label>
                                                <input
                                                    type="text"
                                                    id="sampleOutput"
                                                    placeholder='Enter Sample Output'
                                                    className="form-control"
                                                    {...register("sampleOutput")}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Program Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="hints" className="form-label">Hint</label>
                                                <input
                                                    type="text"
                                                    id="hints"
                                                    placeholder='Enter hint for Question'
                                                    className="form-control"
                                                    {...register("hints")}
                                                />
                                            </div>

                                            {/* Semester Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="referenceAnswer" className="form-label">Reference Answer</label>
                                                <input
                                                    type="text"
                                                    id="referenceAnswer"
                                                    placeholder='Enter Answer'
                                                    className="form-control"
                                                    required
                                                    {...register("referenceAnswer", { required: true })}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Group Dropdown  */}
                                            <div className="col-md-6">
                                                <label htmlFor="difficulty" className="form-label">difficulty</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                                                    </span>
                                                    <select
                                                        className="form-select"
                                                        id="difficulty"
                                                        required
                                                        {...register("difficulty", { required: true })}
                                                    >
                                                        <option value="">Select a Difficulty</option>
                                                        {["HARD", "MEDIUM", "EASY"].map((difi) => (
                                                            <option key={difi} value={difi}>
                                                                {difi}
                                                            </option>
                                                        ))}
                                                    </select>
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
        </>
    )
}

export default ProgramingQuestion