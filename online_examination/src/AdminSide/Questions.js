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


const Questions = () => {

  const { JwtToken, endpoint, showError, generateJwt } = useContext(UserContext);
  const tooltipRef = useRef(null);
  //form for update delete
  const crateQuestionForm = useForm({
    defaultValues: {
      text: '',
      dificulty: '',
      categoryId: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      answer: ''
    }
  });


  //question form
  const { register, control, reset, handleSubmit } = crateQuestionForm;
  //for model open and Question updateid
  const [createNewQuestionModel, setCreateNewQuestionModel] = useState(false);
  const [updateQuestionModel, setUpdateQuestionModel] = useState(false);
  const [updateQuestionId, setUpdateQuestionId] = useState(null);
  const [addCategoryModel, setAddCategoryModel] = useState(false);
  const [createMultipleQuestionModel, setCreateMultipleQuestionModel] = useState(false);

  //for filtering
  const [filterCategoryId,setFilterCategoryId]=useState(0);

  //Question tabel data
  const [data, setData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [category, setCategory] = useState('');
  const [questionFile, setQuestionFile] = useState();
  const [multipleQuestionCategoryId, setMultipleQuestionCategoryId] = useState("");
  const [multipleQuestionError, setMultipleQuestionError] = useState("");
  const [copied, setCopied] = useState(false);


  // MCQ Question Tabel Columns
  const questionColumn = useMemo(() => [
    {
      Header: 'ID',
      accessor: 'quesionId',
      Footer: 'ID',
    },
    {
      Header: 'Text',
      accessor: 'text',
      Footer: 'Text',
    },
    {
      Header: 'Difficulty',
      accessor: 'difficulty',
      Footer: 'difficulty',
    },
    {
      Header: 'Catagory',
      accessor: 'catagory.name',
      Footer: 'Catagory',
    },
    {
      Header: 'Option 1',
      Cell: ({ row }) => {
        const isCorrect = row.original.options[0].correct;
        return (
          <span
            style={{
              backgroundColor: isCorrect ? 'lightgreen' : 'transparent',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            {row.original.options[0].text}
          </span>
        );
      },
      Footer: 'Option 1',
    },
    {
      Header: 'Option 2',
      Cell: ({ row }) => {
        const isCorrect = row.original.options[1].correct;
        return (
          <span
            style={{
              backgroundColor: isCorrect ? 'lightgreen' : 'transparent',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            {row.original.options[1].text}
          </span>
        );
      },
      Footer: 'Option 2',
    }, {
      Header: 'Option 3',
      Cell: ({ row }) => {
        const isCorrect = row.original.options[2]?.correct;
        return (
          <span
            style={{
              backgroundColor: isCorrect ? 'lightgreen' : 'transparent',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            {row.original.options[2]?.text}
          </span>
        );
      },
      Footer: 'Option 3',
    },
    {
      Header: 'Option 4',
      Cell: ({ row }) => {
        const isCorrect = row.original.options[3]?.correct;
        return (
          <span
            style={{
              backgroundColor: isCorrect ? 'lightgreen' : 'transparent',
              cursor: 'pointer',
              fontSize: '18px',
            }}
          >
            {row.original.options[3]?.text}
          </span>
        );
      },
      Footer: 'Option 4',
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
            onClick={() => handleUpdate(row.original.quesionId)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </span>

          {/* Delete Icon */}
          <span
            className="text-danger"
            style={{ cursor: 'pointer', fontSize: '18px', marginLeft: '10px' }}
            onClick={() => handleDelete(row.original.quesionId)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </span>
        </div>
      ),
    }
  ], []);

//Create , update , delete Functions
//new Mcq Question Creation
  const HandleNewQuestionCreation = async (data) => {
    await axios.post(
      `${endpoint}/api/question`, data,
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

  //new mcq Category creation
  const HandleNewCategorySubmit = async () => {
    await axios.post(`${endpoint}/api/MCQCategory`, { name: category }, {
      headers: {
        "Authorization": `Bearer ${JwtToken}`
      }
    })
      .then(res => {
        if (res.status === 200) {
          setTimeout(() => {
            LoadCategory()
          }, 2000);
          showError("New Category Added Successfulyy", 1000, "success");
          setAddCategoryModel(false);
        }
      })
      .catch(error => {
        if (error.status === 409) {
          showError("Category name Alredy Exists");
        } else showError("Somthing went Wrong Durring Adding Category");
      })
  }

  //Update Question
  const handleUpdate = (id) => {
    axios.get(`${endpoint}/api/question/${id}`, {
      headers: {
        "Authorization": `Bearer ${JwtToken}`
      }
    }).then(res => {
      const question = res.data;
      let ans = "";
      //finding correct answer in in options
      if (question.options[0].correct) ans = question.options[0].text;
      else if (question.options[1].correct) ans = question.options[1].text;
      else if (question.options[2]?.correct) ans = question.options[2].text;
      else if (question.options[3].correct) ans = question.options[3].text;
      reset({
        text: question.text,
        dificulty: question.difficulty,
        categoryId: question.catagory.id,
        option1: question.options[0].text,
        option2: question.options[1].text,
        option3: question.options[2]?.text,
        option4: question.options[3]?.text,
        answer: ans
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
    axios.put(`${endpoint}/api/question/${updateQuestionId}`, data, {
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
        showError("Somthing went wrong while Updating Quetions");
      }
      if (error.status === 401) {
        generateJwt();
      }
    })
  }

  //Delete Question

  const handleDelete = (Id) => {
    axios.delete(`${endpoint}/api/question/${Id}`, {
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
    axios.post(`${endpoint}/api/question/multiple`, questionList, {
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

  //create multiple Question Creation
  const HandleMultipleQuestionSubmit = async () => {
    if (questionFile !== undefined && multipleQuestionCategoryId !== "") {

      const formData = new FormData();
      formData.append("file", questionFile);
      formData.append("categoryId", multipleQuestionCategoryId);
      await axios.post(`${endpoint}/api/question/upload-csv`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${JwtToken}`,
        },
      })
        .then((res) => {
          if (res.status === 200) {
            setMultipleQuestionCategoryId("");
            setCreateMultipleQuestionModel(false);
            showError("Multiple Mcq Question Uploded SuccessFulyy", 1000, "success");
            questionFile();
            LoadData();
            return;
          }
        })
        .catch((error) => {
          console.log(error);
          setMultipleQuestionCategoryId("");
          setCreateMultipleQuestionModel(false);
          setMultipleQuestionError(error.response?.data?.error);
          const insertedRecord = error.response?.data?.recordInserted;
          if (insertedRecord !== 0) {
            showError(" " + insertedRecord + " Student Record Inserted Succefulyy", 1000, "success");
          }
          LoadData();
        });
    } else {
      showError("Plese Provide File And Select Group")
    }
  }
  // Loading MCqQuestion Tabel Data
  const LoadData = async () => {
    await axios.get(`${endpoint}/api/question`, {
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
  //Loading mcq Question data
  const LoadCategory = async () => {
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
          setData([]);
          showError("No Category Found");
        } else showError("Somthing wrong while loading Category")
      })
  }

  //use Effect
  useEffect(() => {
    LoadData();
    LoadCategory();
    //its a clean up function when component unmount
    if (tooltipRef.current) {
      const tooltip = new window.bootstrap.Tooltip(tooltipRef.current);
      return () => tooltip.dispose();
    }
  }, []);

  //Extra funcction

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


  ///filter by difficulty
  const filterByDificulty = (dificulty) => {
    let filteredCategorList =null;
    if (dificulty === "0") {
      if(filterCategoryId===0) filteredCategorList=data;
      else filteredCategorList = data.filter(question => question.catagory.id.toString() === filterCategoryId);
      setFilterData(filteredCategorList);
    } else {
      if(filterCategoryId===0) filteredQuestionList=data;
      else filteredCategorList = data.filter(question => question.catagory.id.toString() === filterCategoryId);
      const filteredQuestionList = filteredCategorList.filter(question => question.difficulty.toString() === dificulty);
      setFilterData(filteredQuestionList);
    }
  }

  //function for copay message of multiple question upload error
  const copyToClipboard = () => {
    navigator.clipboard.writeText(multipleQuestionError.split(";").join("\n")) 
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); 
      })
      .catch(err => {
        showError('Error copying to clipboard');
      });
  }

  //closing all model its data
  const closeModels = () => {
    setCreateNewQuestionModel(false);
    setUpdateQuestionModel(false);
    reset({
      text: '',
      dificulty: '',
      categoryId: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      answer: ''
    });
    setAddCategoryModel(false);
    setUpdateQuestionId(null);
    setCategory(null);
    setCreateMultipleQuestionModel(false);
  }
  return (
    <>
      <div className="container-fluid" id="container-wrapper">
        <div className="d-sm-flex align-items-center justify-content-between mb-4 ml-200">
          <div className='row'>
            <h3 className="mb-3 text-center">MCQ Managment</h3>
            <div className='d-flex justify-content-end '>
              <button type='button' className='btn btn-outline-success' onClick={() => setCreateMultipleQuestionModel(true)}>Add Multiple Question</button>
              <button type='button' className='btn btn-outline-primary' onClick={() => setCreateNewQuestionModel(true)}>Add Question</button>
            </div>
            <div>
              <BasicTable data={filterData} columns={questionColumn} category={categoryData} filterByCategory={filterByCategory} filterByDificulty={filterByDificulty} deleteMultiUser={deleteMultiQuestion} />
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
                  <form onSubmit={handleSubmit(HandleNewQuestionCreation)} method="post">
                    <div className="row g-2">
                      <div className="col-md-6">
                        <label htmlFor="text" className="form-label">Quesion</label>
                        <input
                          type="text"
                          id="text"
                          required
                          placeholder='Enter Question'
                          className="form-control"
                          {...register("text", { required: true })}
                        />
                      </div>

                      {/* Password Field */}
                      <div className="col-md-6">
                        <label htmlFor="option1" className="form-label">Option 1</label>
                        <input
                          type="text"
                          id="option1"
                          required
                          placeholder='Enter Option 1'
                          className="form-control"
                          {...register("option1", { required: true })}
                        />
                      </div>
                    </div>

                    <div className="row g-2 mt-2">
                      {/* Name Field */}
                      <div className="col-md-6">
                        <label htmlFor="option2" className="form-label">option 2</label>
                        <input
                          type="text"
                          id="option2"
                          required
                          placeholder='Enter option 2'
                          className="form-control"
                          {...register("option2", { required: true })}
                        />
                      </div>

                      {/* Unique ID Field */}
                      <div className="col-md-6">
                        <label htmlFor="option3" className="form-label">option 3</label>
                        <input
                          type="text"
                          id="option3"
                          placeholder='Enter option 3'
                          className="form-control"
                          {...register("option3", { required: false })}
                        />
                      </div>
                    </div>

                    <div className="row g-2 mt-2">
                      {/* Program Field */}
                      <div className="col-md-6">
                        <label htmlFor="option4" className="form-label">option 4</label>
                        <input
                          type="text"
                          id="option4"
                          placeholder='Enter option 4'
                          className="form-control"
                          {...register("option4", { required: false })}
                        />
                      </div>

                      {/* Semester Field */}
                      <div className="col-md-6">
                        <label htmlFor="answer" className="form-label">Answer</label>
                        <input
                          type="text"
                          id="answer"
                          placeholder='Enter Answer'
                          className="form-control"
                          {...register("answer", { required: true })}
                        />
                      </div>
                    </div>

                    <div className="row g-2 mt-2">
                      {/* Group Dropdown  */}
                      <div className="col-md-6">
                        <label htmlFor="categoryId" className="form-label">Catagory</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                          </span>
                          <select
                            className="form-select"
                            id="categoryId"
                            {...register("categoryId", { required: true })}
                          >
                            <option value="">Select a Category</option>
                            {categoryData.map((group) => (
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
                          <button type="button" className='btn btn-outline-success mt-10' onClick={() => setAddCategoryModel(true)}>Add New Group</button>
                        </div>
                      </div>
                    </div>
                    <div className="row g-2 mt-2">
                      {/* Group Dropdown  */}
                      <div className="col-md-6">
                        <label htmlFor="dificulty" className="form-label">difficulty</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                          </span>
                          <select
                            className="form-select"
                            id="dificulty"
                            {...register("dificulty", { required: true })}
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
                  <form onSubmit={handleSubmit(HandleUpdateSubmit)} method="post">
                    <div className="row g-2">
                      <div className="col-md-6">
                        <label htmlFor="text" className="form-label">Quesion</label>
                        <input
                          type="text"
                          id="text"
                          required
                          placeholder='Enter Question'
                          className="form-control"
                          {...register("text", { required: true })}
                        />
                      </div>

                      {/* Password Field */}
                      <div className="col-md-6">
                        <label htmlFor="option1" className="form-label">Option 1</label>
                        <input
                          type="text"
                          id="option1"
                          required
                          placeholder='Enter Option 1'
                          className="form-control"
                          {...register("option1", { required: true })}
                        />
                      </div>
                    </div>

                    <div className="row g-2 mt-2">
                      {/* Name Field */}
                      <div className="col-md-6">
                        <label htmlFor="option2" className="form-label">option 2</label>
                        <input
                          type="text"
                          id="option2"
                          required
                          placeholder='Enter option 2'
                          className="form-control"
                          {...register("option2", { required: true })}
                        />
                      </div>

                      {/* Unique ID Field */}
                      <div className="col-md-6">
                        <label htmlFor="option3" className="form-label">option 3</label>
                        <input
                          type="text"
                          id="option3"
                          placeholder='Enter option 3'
                          className="form-control"
                          {...register("option3", { required: false })}
                        />
                      </div>
                    </div>

                    <div className="row g-2 mt-2">
                      {/* Program Field */}
                      <div className="col-md-6">
                        <label htmlFor="option4" className="form-label">option 4</label>
                        <input
                          type="text"
                          id="option4"
                          placeholder='Enter option 4'
                          className="form-control"
                          {...register("option4", { required: false })}
                        />
                      </div>

                      {/* Semester Field */}
                      <div className="col-md-6">
                        <label htmlFor="answer" className="form-label">Answer</label>
                        <input
                          type="text"
                          id="answer"
                          placeholder='Enter Answer'
                          className="form-control"
                          {...register("answer", { required: true })}
                        />
                      </div>
                    </div>

                    <div className="row g-2 mt-2">
                      {/* Group Dropdown  */}
                      <div className="col-md-6">
                        <label htmlFor="categoryId" className="form-label">Catagory</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                          </span>
                          <select
                            className="form-select"
                            id="categoryId"
                            {...register("categoryId", { required: true })}
                          >
                            <option value="">Select a Category</option>
                            {categoryData.map((group) => (
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
                          <button type="button" className='btn btn-outline-success mt-10' onClick={() => setAddCategoryModel(true)}>Add New Group</button>
                        </div>
                      </div>
                    </div>
                    <div className="row g-2 mt-2">
                      {/* Group Dropdown  */}
                      <div className="col-md-6">
                        <label htmlFor="dificulty" className="form-label">difficulty</label>
                        <div className="input-group">
                          <span className="input-group-text">
                            <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                          </span>
                          <select
                            className="form-select"
                            id="dificulty"
                            {...register("dificulty", { required: true })}
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


      {createMultipleQuestionModel && (
        <div className="modal-overlay">
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add Multiple Questio</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setCreateMultipleQuestionModel(false)}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form method="post">
                  <div className="row g-2">
                    <div className="col-md-6 position-relative">
                      <label htmlFor="File" className="form-label">
                        Select File read this-
                        <span
                          ref={tooltipRef}
                          className="ms-2 text-primary"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title={`File must be CSV. It should contain columns:
                                                        -Column Order Must be This
                                                        -Question
                                                        -difficulty(HARD,MEDIUM,EASY)
                                                        -option1
                                                        -option2
                                                        -option3(nullable)
                                                        -option4(nullable)
                                                        -answer
                                                        --Questions Text must be unique
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
                        onChange={(e) => setQuestionFile(e.target.files[0])}
                      />
                    </div>
                  </div>
                  <div className="row g-2 mt-2">
                    {/* Group Dropdown  */}
                    <div className="col-md-6">
                      <label htmlFor="groupid" className="form-label">Category</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-people"></i> {/* Bootstrap group icon */}
                        </span>
                        <select
                          className="form-select"
                          id="groupid"
                          value={multipleQuestionCategoryId}
                          onChange={e => setMultipleQuestionCategoryId(e.target.value)}
                        >
                          <option value="">Select a Category</option>
                          {categoryData.map((group) => (
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
                        <button type="button" className='btn btn-outline-success mt-10' onClick={() => setAddCategoryModel(true)}>Add New Category</button>
                      </div>
                    </div>
                  </div>
                  <div className="d-grid mt-2">
                    <button type='button' onClick={() => HandleMultipleQuestionSubmit()} className="btn btn-primary m-20">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {addCategoryModel && (
        <div className="modal-overlay">
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New Group</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setAddCategoryModel(false)}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form>
                  <div className="row g-2">
                    {/* Group name Field */}
                    <div className="col-md-6">
                      <label htmlFor="category" className="form-label">Category Name</label>
                      <input
                        type="text"
                        id="category"
                        required
                        placeholder='Enter Category '
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

      {multipleQuestionError !== "" && (
        <div className="modal-overlay">
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Problem in Some Record While Uplaoding csv</h5>
                  <button
                    type="button"
                    className="close"
                    onClick={() => setMultipleQuestionError("")}
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body" style={{ paddingTop: '10px' }}>
                  {multipleQuestionError?.split(';').length > 0 ? (
                    <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                      {multipleQuestionError?.split(';').map((error, index) => (
                        <li key={index} style={{ marginBottom: '5px' }}>
                          {error.trim()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No Error Found.</p>
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
  )
}

export default Questions