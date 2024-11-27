import React, { useContext, useEffect, useState, useMemo } from 'react'
import BasicTable from './BasicTable'
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../UserContext';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faCheck, faTimes, faL } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const Users = () => {
  //all defines and varibals
  const { JwtToken, endpoint, showError, generateJwt } = useContext(UserContext);
  //form for update delete
  const createUserForm = useForm({
    defaultValues: {
      username: '',
      password: '',
      role: 'Admin', // Default role or other relevant fields
    }
  });
  const { register, control, reset, handleSubmit } = createUserForm;
  //for model open and user updateid
  const [createUserModel, setCreateUserModel] = useState(false);
  const [updateUserModel, setUpdateUserModel] = useState(false);
  const [updateUserId, setUpdateUserId] = useState(null);

  //user tabel data
  const [data, setData] = useState([]);

  
  //user Tabel Columns

  
  const userColumn = useMemo(() => [
    {
      Header: 'ID',
      accessor: 'userId',
      Footer: 'ID',
    },
    {
      Header: 'Username',
      accessor: 'username',
      Footer: 'Username',
    },
    {
      Header: 'Password',
      accessor: 'password',
      Footer: 'Password',
      Cell: () => "Encrypted",
    },
    {
      Header: 'Role',
      accessor: 'role', // Fix here
      Footer: 'Role',
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
            onClick={() => handleUpdate(row.original.userId)}
          >
            <FontAwesomeIcon icon={faEdit} />
          </span>

          {/* Delete Icon */}
          <span
            className="text-danger"
            style={{ cursor: 'pointer', fontSize: '18px', marginLeft: '10px' }}
            onClick={() => handleDelete(row.original.userId)}
          >
            <FontAwesomeIcon icon={faTrash} />
          </span>

          {/* Activation/Deactivation Icon */}
          <span
            className={`text-${row.original.active ? 'success' : 'secondary'}`}
            style={{ cursor: 'pointer', fontSize: '18px', marginLeft: '10px' }}
            onClick={() => toggleActivation(row.original.userId)}
          >
            <FontAwesomeIcon icon={row.original.active ? faCheck : faTimes} />
          </span>
        </div>
      ),
    }
  ], []);


  // Loading User Tabel Data
  const LoadData = async () => {
    await axios.get(`${endpoint}/api/user`, {
      headers: {
        "Authorization": `Bearer ${JwtToken}`
      }
    })
      .then(res => {
        setData(res.data);
        setTimeout(() => {

        }, 3000);
      })
      .catch(error => {
        console.log(error);
        if(error.status===401){
          generateJwt();
        }
      })
  }

  //Create , Update , Delete , Active/Deactive User Function

  //Create User

  
  const HandleNewUserSubmit = async (data) => {
    console.log(data);
    axios.post(`${endpoint}/api/user`, data, {
      headers: {
        "Authorization": `Bearer ${JwtToken}`
      }
    })
      .then(res => {
        showError("New User Create Succesfully", 1000, "success");
        setCreateUserModel(false);
        LoadData();
        reset();
      })
      .catch(error => {
        if (error.status === 409) {
          showError("Username Alredy Taken!");
        }
      })
  }

  //Update User
  const handleUpdate = (userId) => {
    axios.get(`${endpoint}/api/user/${userId}`, {
      headers: {
        "Authorization": `Bearer ${JwtToken}`
      }
    }).then(res => {
      reset({ username: res.data.username, password: '', role: res.data.role })
      setUpdateUserId(userId);
      setUpdateUserModel(true);
    })
      .catch(error => {
        showError("Somthing went wrong while Updating User");
        if (error.status === 401) {
          generateJwt();
        }
      })
  };

  
  const HandleUpdateSubmit = (data) => {
    axios.put(`${endpoint}/api/user/${updateUserId}`, data, {
      headers: {
        "Authorization": `Bearer ${JwtToken}`,
      }
    }).then(res => {
      if (res.status === 200) {
        setUpdateUserModel(false);
        LoadData();
        showError("User Updated Sucessfully", 1000, 'success');
        reset();
      }
    }).catch(error => {
      if (error.status === 409) {
        showError("Username Alredy Taken");
      } else {
        showError("Somthing went wrong while Updating User");
      }
      if (error.status === 401) {
        generateJwt();
      }
    })
  }

  //Delete User

  const handleDelete = (userId) => {
    axios.delete(`${endpoint}/api/user/${userId}`, {
      headers: {
        "Authorization": `Bearer ${JwtToken}`,
      }
    }).then(res => {
      showError("User Deleted Succefully", 1000, "success");
      LoadData();
    })
      .catch(res => {
        showError("Somthing went wrong Plese Try Again Letter");
      })
  };

  
  const deleteMultiUser = (selectedFlatRows) => {
    try {
      selectedFlatRows.map(user => {
        axios.delete(`${endpoint}/api/user/${user.original.userId}`, {
          headers: {
            "Authorization": `Bearer ${JwtToken}`,
          }
        });
      })
      toast("Multiple User Deleted Sucessfully", 1000, "success");
      setTimeout(() => {
        LoadData();
      }, 3000);
    } catch (error) {
      toast("Somthing went wrong While Deleting Multiple User");
    }
  }

  //Active Deactive User
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
    const userList = selectedFlatRows.map(row => row.original);
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
    const userList = selectedFlatRows.map(row => row.original);
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

  //Extra Functions

  const closeModels = () => {
    setCreateUserModel(false);
    setUpdateUserModel(false);
    reset({ username: '', password: '', role: 'Admin' });
  }

//use Effect
  useEffect(() => {
    LoadData();
  }, []);

  return (
    <>
      <div className="container-fluid" id="container-wrapper">
        <div className="d-sm-flex align-items-center justify-content-between mb-4 ml-200">
          <div className='row'>
            <h3 className="mb-3 text-center">User Managment</h3>
            <div className='d-flex justify-content-end '>
              <button type='button' className='btn btn-outline-primary' onClick={() => setCreateUserModel(true)}>Add User</button>
            </div>
            <div>
              <BasicTable data={data} columns={userColumn} deActiveMultipleUser={deActiveMultipleUser} activeMultipleUser={activeMultipleUser} deleteMultiUser={deleteMultiUser} />
            </div>
          </div>
        </div>
      </div>
      {createUserModel && (
        <div className="modal-overlay">
          <div className="modal show d-block" tabIndex="-1" role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Add New User</h5>
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
                  <form onSubmit={handleSubmit(HandleNewUserSubmit)} method='post'>
                    <div className="form-group mb-1">
                      <label htmlFor="username" className="form-label">Username</label>
                      <input
                        type="text"
                        id="username"
                        className="form-control"
                        {...register("username", { required: true })}
                      />
                    </div>

                    <div className="form-group mb-1">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        {...register("password", { required: true })}
                      />
                    </div>
                    <div className="form-group mb-1 d-flex">
                      <label htmlFor="role" className="form-label">Role:</label>
                      <select
                        className="form-select w-auto"
                        id="role"
                        {...register("role")} // Connects the dropdown to react-hook-form
                      >
                        <option value="Admin">Admin</option>
                        <option value="Student">Student</option>
                      </select>

                    </div>
                    <div className="d-grid mt-2">
                      <button type='submit' className="btn btn-primary">
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

      {updateUserModel && (
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
                  <form onSubmit={handleSubmit(HandleUpdateSubmit)} method='post'>
                    <div className="form-group mb-1">
                      <label htmlFor="username" className="form-label">Username</label>
                      <input
                        type="text"
                        id="username"
                        className="form-control"
                        placeholder='Enter Username'
                        {...register("username", { required: true })}
                      />
                    </div>

                    <div className="form-group mb-1">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        id="password"
                        placeholder='Leave blank to keep unchanged'
                        className="form-control"
                        {...register("password")}
                      />
                    </div>
                    <div className="form-group mb-1 d-flex">
                      <label htmlFor="role" className="form-label">Role:</label>
                      <select
                        className="form-select w-auto"
                        id="role"
                        {...register("role")}
                      >
                        <option value="Admin">Admin</option>
                        <option value="Student">Student</option>
                      </select>
                    </div>
                    <div className="d-grid mt-2">
                      <button type='submit' className="btn btn-primary">
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

export default Users