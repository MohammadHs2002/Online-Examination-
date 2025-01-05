import React, { useContext, useEffect, useState, useMemo, useRef } from 'react'
import BasicTable from './BasicTable'
import { UserContext } from '../UserContext';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { saveAs } from "file-saver";
import Papa from "papaparse";


const Exams = () => {

    const { JwtToken, endpoint, showError, generateJwt } = useContext(UserContext);
    const tooltipRef = useRef(null);
    //form for create , update 
    const createExamForm = useForm({
        defaultValues: {
            examName: '',
            examStartDateTime: '',
            examDuration: '',
            examType: '',
            examDifficulty: '',
            studentGroup: '',
            mcqCategorie: '',
            numberOfQuestions: '',
            totalMarks: '',
            passingMarks: '',
            status: ''
        }
    });

    //exam Tabel Columns
    const examColumn = useMemo(() => [
        {
            Header: 'Exam ID',
            accessor: 'examId',
            Footer: 'Exam ID',
        },
        {
            Header: 'Exam Name',
            accessor: 'examName',
            Footer: 'Exam Name',
        },
        {
            Header: 'Start DateTime',
            accessor: 'examStartDateTime',
            Footer: 'Start DateTime',
            Cell: ({ value }) => format(new Date(value), 'dd/MM/yyyy HH:mm:ss')
        },
        {
            Header: 'Exam Type',
            accessor: 'examType',
            Footer: 'Exam Type',
        },
        {
            Header: 'Difficulty',
            accessor: 'examDifficulty',
            Footer: 'Difficulty',
        },
        {
            Header: 'Student Group',
            accessor: 'studentGroup.name',
            Footer: 'Student Group',
        },
        {
            Header: 'Exam Status',
            accessor: 'status',
            Footer: 'Exam Status',
        },
        {
            Header: 'MCQ Category',
            accessor: 'mcqCategorie.name',
            Footer: 'Role',
        },
        {
            Header: 'Result Declared',
            accessor: 'resultDeclared',
            Footer: 'Result Declared',
            Cell: ({ value }) => value ? "Yes" : "No"
        },
        {
            Header: 'View More',
            Cell: ({ row }) => (<div className="d-flex justify-content-around">
                {/* Update Icon */}
                <span
                    className="text-warning"
                    style={{ cursor: 'pointer', fontSize: '18px' }}
                    onClick={() => ViewExamData(row.original.examId)}
                >
                    <FontAwesomeIcon icon={faEye} />
                </span>
            </div>),
            Footer: 'View More',
        },
        {
            Header: 'Creation Time',
            accessor: 'createdAt', // Fix here
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
                        onClick={() => handleUpdate(row.original.examId)}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </span>

                    {/* Delete Icon */}
                    <span
                        className="text-danger"
                        style={{ cursor: 'pointer', fontSize: '18px', marginLeft: '10px' }}
                        onClick={() => handleDelete(row.original.examId)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </span>
                </div>
            ),
        }
    ], []);

    //Exam form
    const { register, control, reset, handleSubmit, setValue, getValues } = createExamForm;
    //for model open and Exam updateid
    const [createNewExamModel, setCreateNewExamModel] = useState(false);
    const [updateExamModel, setUpdateExamModel] = useState(false);
    const [updateExamId, setUpdateExamId] = useState(null);
    const [viewExamModel, setViewExamModel] = useState(false);
    const [viewExamData, setViewExamData] = useState(null);
    //for filtering
    const [filterCategoryId, setFilterCategoryId] = useState(0);

    //Exam tabel data
    const [data, setData] = useState([]);
    const [filterData, setFilterData] = useState([]);
    const [categoryData, setCategoryData] = useState([]);
    const [studentGroup, setStudentGroup] = useState([]);
    const [currentDateTime, setCurrentDateTime] = useState("");
    const [updateExamStatus, setUpdateExamStatus] = useState("");
    const [updateExamResult, setUpdateExamResult] = useState("");
    const [filteredExamTypeData, setFilterExamTypeData] = useState([]);

    //Create , update , delete Functions
    //new Exam Creation
    const HandleNewExamCreation = async (data) => {
        await axios.post(
            `${endpoint}/api/exam`, data,
            {
                headers: {
                    Authorization: `Bearer ${JwtToken}`,
                },
            }
        ).then(res => {
            if (res.status === 200) {
                showError("New Exam Created Successfully", 1000, "success");
                closeModels();
                LoadData();
            }
        })
            .catch(error => {
                showError(error.response.data)
            })
    };

    //Update Exam
    const handleUpdate = (id) => {
        axios.get(`${endpoint}/api/exam/${id}`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        }).then(res => {
            setUpdateExamStatus(res.data.status)
            setUpdateExamResult(res.data.resultDeclared)
            setUpdateExamId(id);
            setUpdateExamModel(true);
        })
            .catch(error => {
                console.log(error)
                showError("Somthing went wrong while Updating Exam");
                if (error.status === 401) {
                    generateJwt();
                }
            })
    };

    //Exam Status chnage function
    const ExamStatusHandling = (event) => {
        setUpdateExamStatus(event.target.value);
        axios.put(`${endpoint}/api/exam/status/${updateExamId}`, { status: event.target.value }, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        }).then(res => {
            if (res.status === 200) {
                closeModels()
                LoadData()
                showError("Exam Status Changed Sucessfulyy", 1000, 'success');
                setUpdateExamId(null);
            }
        }).catch(error => {
            showError("Somthing went wrong while changing exam status");
        })
    }

    //Exam Result Status Handling
    const ExamResultHandling = (event) => {
        setUpdateExamResult(event.target.value);
        axios.put(`${endpoint}/api/exam/result/${updateExamId}`, { result: event.target.value }, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        }).then(res => {
            if (res.status === 200) {
                closeModels()
                LoadData()
                showError("Exam Result Status Changed Sucessfulyy", 1000, 'success');
                setUpdateExamId(null);
            }
        }).catch(error => {
            showError("Somthing went wrong while changing exam status");
        })
    }

    //view Exam Data
    const ViewExamData = (Id) => {
        axios.get(`${endpoint}/api/exam/${Id}`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`,
            }
        }).then(res => {
            setViewExamData(res.data);
            setViewExamModel(true);
        }).catch(error => {
            showError("Somthing went wrong Plese Try Again Letter");
        })
    };

    //Delete Exam

    const handleDelete = (Id) => {
        axios.delete(`${endpoint}/api/exam/${Id}`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`,
            }
        }).then(res => {
            showError("Exam Deleted Succefully", 1000, "success");
            LoadData();
        }).catch(error => {
            showError("Somthing went wrong Plese Try Again Letter");
        })
    };
    //delete multiple Exams
    const deleteMultipleExam = (selectedFlatRows) => {
        const examList = selectedFlatRows.map(row => row.original);
        axios.post(`${endpoint}/api/exam/multiple`, examList, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`,
            }
        })
            .then(res => {
                toast("Multiple Exams Deleted Sucessfully", 1000, "success");
                setTimeout(() => {
                    LoadData();
                }, 1000);
            })
            .catch(error => {
                toast("Somthing went wrong While Deleting Multiple Exam");
            })
    }

    // Loading Exams
    const LoadData = async () => {
        await axios.get(`${endpoint}/api/exam`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        })
            .then(res => {
                setData(res.data);
                setFilterData(res.data);
                setFilterExamTypeData(res.data);
            })
            .catch(error => {
                if (error.status === 404) {
                    setData([]);
                    setFilterData([]);
                    showError("No Exam Found");
                } else showError("Somthing wrong while loading Exams")
            })
    }

    //Loading Student Group for for filtering
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

    //Loading mcq Category
    const LoadMcqCategory = async () => {
        await axios.get(`${endpoint}/api/MCQCategory`, {
            headers: {
                "Authorization": `Bearer ${JwtToken}`
            }
        })
            .then(res => {
                setCategoryData(res.data);
            })
            .catch(error => {
                if (error.status === 404) {
                    showError("No Mcq Category Found");
                } else showError("Somthing wrong while loading Mcq Category")
            })
    }

    //use Effect
    useEffect(() => {
        LoadData();
        LoadMcqCategory();
        LoadStudentGroup();
        //its a clean up function when component unmount
        if (tooltipRef.current) {
            const tooltip = new window.bootstrap.Tooltip(tooltipRef.current);
            return () => tooltip.dispose();
        }

        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        // Set the current datetime in the required format
        setCurrentDateTime(`${year}-${month}-${day}T${hours}:${minutes}`);
    }, []);

    //Extra function
    //question downloading function
    const downloadQuestionList = (questions) => {
        let csvData = null;
        if (viewExamData.examType === "MCQ") {
            csvData = questions.map((q) => ({
                QuestionID: q.mcqQuestion.quesionId,
                Text: q.mcqQuestion.text,
                Difficulty: q.mcqQuestion.difficulty,
                Category: q.mcqQuestion.catagory.name,
                Options: q.mcqQuestion.options.map((o) => `${o.text} (${o.correct ? "Correct" : "Wrong"})`).join("; "),
                CreatedAt: q.mcqQuestion.createdAt,
                UpdatedAt: q.mcqQuestion.updatedAt,
            }));
        } else {
            csvData = questions.map((q) => ({
                QuestionID: q.programQuestion.id,
                Title: q.programQuestion.title,
                Description: q.programQuestion.description,
                SampleOutput: q.programQuestion.sampleInput,
                SampleInput: q.programQuestion.sampleOutput,
                hints: q.programQuestion.hints,
                ReferenceAnswer: q.programQuestion.referenceAnswer,
                Difficulty: q.programQuestion.difficulty,
            }));
        }
        // Convert JSON to CSV
        const csv = Papa.unparse(csvData);

        // Download the file
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "questions.csv");
    };

    //student list downloading function
    const downloadResult = (data) => {
        // Prepare data for CSV
        const allotments=data.allotments;
        const csvData = allotments.map((a) => ({
            AllotmentID: a.allotmentId,
            UniqueID: a.studentId.unique_id,
            StudentName: a.studentId.name,
            Marks: a.results.rightQuestions,
            TotalMarks: data.totalMarks,
            passOrFailed: a.results.resultStatus
        }));

        // Convert JSON to CSV
        const csv = Papa.unparse(csvData);

        // Download the file
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "result.csv");
    };


    //student list downloading function
    const downloadStudentList = (allotments) => {
        // Prepare data for CSV
        const csvData = allotments.map((a) => ({
            AllotmentID: a.allotmentId,
            UniqueID: a.studentId.unique_id,
            StudentName: a.studentId.name,
            Program: a.studentId.program,
            Semester: a.studentId.semester,
            Division: a.studentId.division,
            ContactNumber: a.studentId.number,
            Username: a.studentId.user.username,
            ActiveStatus: a.studentId.user.active,
            GroupName: a.studentId.group.name,
            CreatedAt: a.studentId.createdAt,
            UpdatedAt: a.studentId.updatedAt,
        }));

        // Convert JSON to CSV
        const csv = Papa.unparse(csvData);

        // Download the file
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "students.csv");
    };


    //no of quetion to same no of marks for mcq
    const questionToMarks = () => {
        if (getValues('examType') === "MCQ") setValue("totalMarks", getValues("numberOfQuestions"))
    }

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    //filter by catagory
    const filterByCategory = (categoryId) => {
        if (categoryId === "0") {
            setFilterData(data);
            setFilterCategoryId(categoryId);
        } else {
            setFilterCategoryId(categoryId);
            const filteredStudentList = data.filter(question => question.catagory.id.toString() === categoryId);
            setFilterData(filteredStudentList);
        }
    }
    //filter by exam type(mcq,programing)
    const filterByExamType = (type) => {
        let filterExamList = null;
        if (type === "All") {
            filterExamList = data;
            setFilterData(filterExamList);
            setFilterExamTypeData(filterExamList);
            return;
        }
        filterExamList = data.filter(exam => exam.examType === type);
        setFilterData(filterExamList);
        setFilterExamTypeData(filterExamList);
    }

    ///filter by difficulty
    const filterByDificulty = (dificulty) => {
        if (dificulty === "0") {
            if (filterCategoryId === 0)
                setFilterData(filteredExamTypeData);
        } else {
            const filteredExamList = filteredExamTypeData.filter(exam => exam.examDifficulty.toString() === dificulty);
            setFilterData(filteredExamList);
        }
    }

    ///filter by ExamStatus(scheduled,running,closed)
    const filterByExamStatus = (status) => {
        if (status === "0") {
            setFilterData(data);
        } else {
            const filteredExamList = data.filter(exam => exam.status.toString() === status);
            setFilterData(filteredExamList);
        }
    }
    //filter by student group 
    const filterByGroup = (grouid) => {
        if (grouid === "0") {
            setFilterData(data);
        } else {
            const filtereStudentGroupData = data.filter(exam => exam.studentGroup.id.toString() === grouid);
            setFilterData(filtereStudentGroupData);
        }
    }

    //closing all model its data
    const closeModels = () => {
        setCreateNewExamModel(false);
        setUpdateExamModel(false);
        setViewExamModel(false);
        reset({
            examName: '',
            examStartDateTime: '',
            examDuration: '',
            examType: '',
            examDifficulty: '',
            studentGroup: '',
            mcqCategorie: '',
            numberOfQuestions: '',
            totalMarks: '',
            passingMarks: '',
            status: ''
        });
        setViewExamData(null);
        setUpdateExamId(null);
    }
    return (
        <>
            <div className="container-fluid" id="container-wrapper">
                <div className="d-sm-flex align-items-center justify-content-between mb-4 ml-200">
                    <div className='row'>
                        <h3 className="mb-3 text-center">Exam Managment</h3>
                        <div className='d-flex justify-content-end '>
                            <button type='button' className='btn btn-outline-primary' onClick={() => setCreateNewExamModel(true)}>Create Exam</button>
                        </div>
                        <div>
                            <BasicTable data={filterData} columns={examColumn} deleteMultiUser={deleteMultipleExam} filterByExamType={filterByExamType} filterByDificulty={filterByDificulty} groups={studentGroup} filterByGroup={filterByGroup} filterByExamStatus={filterByExamStatus} />
                        </div>
                    </div>
                </div>
            </div>
            {createNewExamModel && (
                <div className="modal-overlay">
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Create New Exam</h5>
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
                                    <form onSubmit={handleSubmit(HandleNewExamCreation)} method="post">
                                        <div className="row g-2">
                                            <div className="col-md-6">
                                                <label htmlFor="examName" className="form-label">Exam Name</label>
                                                <input
                                                    type="text"
                                                    id="examName"
                                                    required
                                                    placeholder='Enter Exam Name'
                                                    className="form-control"
                                                    {...register("examName", { required: true })}
                                                />
                                            </div>

                                            {/* Password Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="examStartDateTime" className="form-label">Exam Start Date & Time</label>
                                                <input
                                                    type="datetime-local"
                                                    id="examStartDateTime"
                                                    required
                                                    placeholder='Enter Exam Start Date Time'
                                                    min={currentDateTime}
                                                    className="form-control"
                                                    {...register("examStartDateTime", { required: true })}
                                                />
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Name Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="examDuration" className="form-label">Duration(Minuts)</label>
                                                <input
                                                    type="number"
                                                    id="examDuration"
                                                    required
                                                    placeholder='Enter Exam Duration'
                                                    className="form-control"
                                                    {...register("examDuration", { required: true })}
                                                />
                                            </div>

                                            {/* Unique ID Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="examType" className="form-label">Exam Type</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                                                    </span>
                                                    <select
                                                        className="form-select"
                                                        id="examType"
                                                        {...register("examType", { required: true })}
                                                    >
                                                        <option value="">Select Exam Type</option>
                                                        <option key="MCQ" value="MCQ">MCQ</option>
                                                        <option key="PROGRAMMING" value="PROGRAMMING" >PROGRAMMING</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Program Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="examDifficulty" className="form-label">Difficulty</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                                                    </span>
                                                    <select
                                                        className="form-select"
                                                        id="examDifficulty"
                                                        {...register("examDifficulty", { required: true })}
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

                                            {/* Semester Field */}
                                            <div className="col-md-6">
                                                <label htmlFor="studentGroup" className="form-label">Student Group</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                                                    </span>
                                                    <select
                                                        className="form-select"
                                                        id="studentGroup"
                                                        {...register("studentGroup")}
                                                    >
                                                        <option value="">Select Student Group</option>
                                                        {studentGroup.map((group) => (
                                                            <option key={group.id} value={group.id}>
                                                                {group.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row g-2 mt-2">
                                            {/* Group Dropdown  */}
                                            <div className="col-md-6">
                                                <label htmlFor="mcqCategorie" className="form-label">Mcq Category(for Mcq)</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                                                    </span>
                                                    <select
                                                        className="form-select"
                                                        id="mcqCategorie"
                                                        {...register("mcqCategorie")}
                                                    >
                                                        <option value="">Select Mcq Category</option>
                                                        {categoryData.map((category) => (
                                                            <option key={category.id} value={category.id}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="numberOfQuestions" className="form-label">Number Of Question</label>
                                                <input
                                                    type="number"
                                                    id="numberOfQuestions"
                                                    required
                                                    placeholder='Enter Number Of Question'
                                                    className="form-control"
                                                    {...register("numberOfQuestions", { required: true, onChange: () => { questionToMarks() } })}
                                                />
                                            </div>
                                        </div>
                                        <div className="row g-2 mt-2">
                                            {/* Group Dropdown  */}
                                            <div className="col-md-6">
                                                <label htmlFor="totalMarks" className="form-label">Total Marks</label>
                                                <input
                                                    type="number"
                                                    id="totalMarks"
                                                    required
                                                    placeholder='Enter Total Marks'
                                                    className="form-control"
                                                    {...register("totalMarks", { required: true })}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label htmlFor="passingMarks" className="form-label">Passing Marks</label>
                                                <input
                                                    type="number"
                                                    id="passingMarks"
                                                    required
                                                    placeholder='Enter Number Of Question'
                                                    className="form-control"
                                                    {...register("passingMarks", { required: true, })}
                                                />
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



            {updateExamModel && (
                <div className="modal-overlay">
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Update Exam</h5>
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
                                    <form>
                                        {/* Unique ID Field */}
                                        <div className="row g-2 mt-2">
                                            <div className="col-md-6">
                                                {updateExamStatus !== "Closed" ? (
                                                    <>
                                                        <label htmlFor="ExamStatus" className="form-label">Exam Status</label>
                                                        <div className="input-group">
                                                            <span className="input-group-text">
                                                                <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                                                            </span>
                                                            <select
                                                                className="form-select"
                                                                id="ExamStatus"
                                                                value={updateExamStatus}
                                                                onChange={(e) => ExamStatusHandling(e)}
                                                            >
                                                                {['Scheduled', 'Running', 'Closed'].map((status) => (
                                                                    <option key={status} value={status}>
                                                                        {status}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </>
                                                ) : "Exam Declared Alredy"} {/* If status is "Closed", render nothing */}
                                            </div>


                                            <div className="col-md-6">
                                                <label htmlFor="Result" className="form-label">Result Status</label>
                                                <div className="input-group">
                                                    <span className="input-group-text">
                                                        <i className="bi bi-people" x></i> {/* Bootstrap group icon */}
                                                    </span>
                                                    <select
                                                        className="form-select"
                                                        id="Result"
                                                        value={updateExamResult}
                                                        onChange={(e) => ExamResultHandling(e)}
                                                    >
                                                        <option key="true" value="true">
                                                            Declared
                                                        </option>
                                                        <option key="false" value="false">
                                                            Not Declared
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}



            {viewExamModel && (
                <div className="modal-overlay">
                    <div className="modal show d-block" tabIndex="-1" role="dialog">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">View Exam</h5>
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
                                                <p><strong>Exam ID:</strong>  {viewExamData.examId}</p>
                                                <p><strong>Exam Name:</strong>{viewExamData.examName}</p>
                                                <p><strong>Exam Start Date &amp; Time:</strong> {format(new Date(viewExamData.examStartDateTime), 'dd/MM/yyyy HH:mm:ss')}</p>
                                                <p><strong>Duration (Minuts):</strong> {viewExamData.examDuration}</p>
                                                <p><strong>Total Marks:</strong> {viewExamData.totalMarks}</p>
                                                <p><strong>Student Group:</strong> {viewExamData.studentGroup.name}</p>
                                                <p><strong>Created At:</strong> {format(new Date(viewExamData.createdAt), 'dd/MM/yyyy HH:mm:ss')}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <p><strong>Exam Type:</strong> {viewExamData.examType}</p>
                                                <p><strong>Difficulty:</strong> {viewExamData.examDifficulty}</p>
                                                <p><strong>Status:</strong> {viewExamData.status}</p>
                                                <p><strong>Result Declared:</strong> {viewExamData.resultDeclared ? "YES" : "No"}</p>
                                                <p><strong>Number of Questions:</strong> {viewExamData.numberOfQuestions}   </p>
                                                <p><strong>Passing Marks:</strong> {viewExamData.passingMarks}</p>
                                                <p><strong>Updated At:</strong> {format(new Date(viewExamData.updatedAt), 'dd/MM/yyyy HH:mm:ss')}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        {/* Allotments and Questions */}
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h5>Allotments</h5>
                                                <p><strong>Count:</strong> {viewExamData.allotments.length}</p>
                                            </div>
                                            <div className="col-md-6">
                                                <h5>Questions</h5>
                                                <p><strong>Count:</strong> {viewExamData.questions.length}</p>
                                            </div>
                                        </div>
                                        <hr />
                                        {/* Buttons */}
                                        <div className="d-flex justify-content-end">
                                            <button className="btn btn-success me-2" onClick={() => downloadStudentList(viewExamData.allotments)}>
                                                <i className="bi bi-download" /> Student List
                                            </button>
                                            <button className="btn btn-info me-2" onClick={() => downloadQuestionList(viewExamData.questions)}>
                                                <i className="bi bi-download" /> Question List
                                            </button>
                                            <button className="btn btn-warning me-2" onClick={() => downloadResult(viewExamData)}  disabled={!viewExamData.resultDeclared}>
                                                <i className="bi bi-download" /> Result
                                            </button>
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

export default Exams