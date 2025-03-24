import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//   faSpinner,
//   faEnvelopeOpen,
//   faCheckCircle,
//   faArrowsAltH
// } from '@fortawesome/free-solid-svg-icons';

const UserDashboard = () => {
  const [isTasksExpanded, setIsTasksExpanded] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [updatedRemarks, setUpdatedRemarks] = useState('');
  const [updatedTaskStatus, setUpdatedTaskStatus] = useState('');
  const [taskAttachmentsName, setTaskAttachmentsName] = useState('');
  const [taskAttachmentFile, setTaskAttachmentFile] = useState([]);
  const [selectedTaskAttachmentsFileName, setSelectedTaskAttachmentsFileName] = useState('');

  const openPopup = taskId => {
    setSelectedTask(taskId);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setSelectedTask(null);
    setIsPopupOpen(false);
  };

  const handleSave = () => {
    // console.log('Updated documents:', taskAttachmentFile);
    // console.log('Updated taskStatus:', updatedTaskStatus);
    // console.log('Updated remarks:', updatedRemarks);
    closePopup();
  };

  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedAttachmentsFileName(file.name);
      setTaskAttachmentFile([file]); // Update state to store the selected file
    }
  };


  const listOfTaskHeaderExpandButtonClick = () => {
    setIsTasksExpanded(!isTasksExpanded);
  };

  const [selectedAttachmentsFileName, setSelectedAttachmentsFileName] = useState('');

  const personalInfo = useSelector(state => state.personalInformationReducer);

  const tasks = [
    {
      id: 1,
      projectName: 'Project 1',
      taskName: 'Task 1',
      clientName: 'Client 1',
      clientSPOC: 'Client SPOC 1',
      iteosSPOC: 'Iteos SPOC 1',
      startDate: '2024-04-16',
      endDate: '2024-05-16',
      taskStatus: 'In-Progress',
      description: 'Task Description 1',
      documents: 'Document 1',
      remarks: 'Remarks 1'
    }
  ];

  return (
    <>
      {/* <div className='content-header'>
        <div className='container-fluid'>
          <div className='row mb-2'>
            <div className='col-sm-6'>
              <h1 className='m-0'>Dashboard</h1>
            </div>
            <div className='col-sm-6'>
              <ol className='breadcrumb float-sm-right'>
                <li className='breadcrumb-item'>
                  <a href='#'>Home</a>
                </li>
                <li className='breadcrumb-item active'>Dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className='content'>
        <div className='container-fluid'>
          <div className='row'>
           
            <div className='col-lg-3 col-6'>
             
              <div className='small-box bg-info'>
                <div className='inner'>
                  <h4>In-Progress</h4>
                </div>

                <FontAwesomeIcon
                  icon={faSpinner}
                  style={{
                    marginLeft: '20px',
                    fontSize: '30px',
                    marginBottom: '10px'
                  }}
                />

                <div className='icon'>
                  <i className='ion ion-bag' />
                </div>
                <Link to='#' className='small-box-footer'>
                  More info <i className='fas fa-arrow-circle-right' />
                </Link>
              </div>
            </div>
           
            <div className='col-lg-3 col-6'>
             
              <div className='small-box bg-success'>
                <div className='inner'>
                  <h4>In-AMS Support</h4>
                </div>

                <FontAwesomeIcon
                  icon={faEnvelopeOpen}
                  style={{
                    marginLeft: '20px',
                    fontSize: '30px',
                    marginBottom: '10px'
                  }}
                />

                <div className='icon'>
                  <i className='ion ion-stats-bars' />
                </div>
                <Link to='#' className='small-box-footer'>
                  More info <i className='fas fa-arrow-circle-right' />
                </Link>
              </div>
            </div>
           
            <div className='col-lg-3 col-6'>
            
              <div className='small-box bg-warning'>
                <div className='inner'>
                  <h4>Completed</h4>
                </div>

                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{
                    marginLeft: '20px',
                    fontSize: '30px',
                    marginBottom: '10px'
                  }}
                />

                <div className='icon'>
                  <i className='ion ion-person-add' />
                </div>
                <Link to='#' className='small-box-footer'>
                  More info <i className='fas fa-arrow-circle-right' />
                </Link>
              </div>
            </div>
           
            <div className='col-lg-3 col-6'>
           
              <div className='small-box bg-danger'>
                <div className='inner'>
                  <h4>Consulting</h4>
                </div>

                <FontAwesomeIcon
                  icon={faArrowsAltH}
                  style={{
                    marginLeft: '20px',
                    fontSize: '30px',
                    marginBottom: '10px'
                  }}
                />
                <div className='icon'>
                  <i className='ion ion-pie-graph' />
                </div>
                <Link to='#' className='small-box-footer'>
                  More info <i className='fas fa-arrow-circle-right' />
                </Link>
              </div>
            </div>
           
          </div>
        
          <div className='row'>
        
            <div className='col-md-12'>
             
              <div className='card card-danger card-outline'>
                <div className='card-header'>
                  <h3 className='card-title text-sm'>Tasks List</h3>
                  <div className='card-tools'>
                    <button
                      type='button'
                      className='btn btn-tool'
                      id='listOfTaskHeaderExpandButton'
                      onClick={listOfTaskHeaderExpandButtonClick}
                      data-card-widget='collapse'
                    >
                      <i className='fas fa-minus'></i>
                    </button>
                    <button
                      type='button'
                      className='btn btn-tool'
                      data-card-widget='maximize'
                    >
                      <i className='fas fa-expand'></i>
                    </button>
                  </div>
                </div>
               
                <div className='card-body p-0'>
                  <table className='table table-striped'>
                    <thead>
                      <tr>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>
                          Sr. No.
                        </th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>
                          Project Name
                        </th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>
                          Task Name
                        </th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>
                          Client Name
                        </th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>
                          Client SPOC
                        </th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>
                          Iteos SPOC
                        </th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>
                          Start Date
                        </th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>
                          End Date
                        </th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>
                          Task Status
                        </th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task, index) => (
                        <tr key={task.id}>
                          <td>{index + 1}</td>
                          <td>{task.projectName}</td>
                          <td>{task.taskName}</td>
                          <td>{task.clientName}</td>
                          <td>{task.clientSPOC}</td>
                          <td>{task.iteosSPOC}</td>
                          <td>{task.startDate}</td>
                          <td>{task.endDate}</td>
                          <td>{task.taskStatus}</td>
                          <td>
                            <button
                              type='button'
                              className='btn btn-xs btn-primary'
                              onClick={() => openPopup(task.id)}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
              
            </div>
          
          </div>
      
        </div>
      
      </section>
   

      {isPopupOpen && selectedTask !== null && (
        <div className='modal fade show' style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className='modal-dialog modal-lg'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h4 className='modal-title'>Task Details</h4>
                <button type='button' className='close' onClick={closePopup}>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
              
                <div className="form-group">
                  <label
                    htmlFor="taskStatus"
                    style={{
                      color: "green",
                      fontWeight: "normal",
                      fontSize: "0.8em",
                    }}
                  >Task Status<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <select
                    className="form-control"
                    id="taskStatus"
                    value={updatedTaskStatus}
                    onChange={(e) => setUpdatedTaskStatus(e.target.value)}
                  >
                    <option value="">--Select--</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                   
                  </select>
                </div>


               
                <div className="form-group">
                  <label
                    htmlFor="documentUpload"
                    style={{
                      color: "green",
                      fontWeight: "normal",
                      fontSize: "0.8em",
                    }}
                  >Document Upload<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <div className="custom-file">
                    <input
                      type="file"
                      className="custom-file-input"
                      id="documentUpload"
                      onChange={handleDocumentUpload}
                    />
                    <label className="custom-file-label" htmlFor="documentUpload">
                      {selectedAttachmentsFileName || "Choose file"}
                    </label>
                  </div>
                  <small className="form-text text-muted">Upload relevant documents.</small>
                </div>
               
                <div className="form-group">
                  <label htmlFor="remarks"
                    style={{
                      color: "green",
                      fontWeight: "normal",
                      fontSize: "0.8em",
                    }}
                  >Remarks<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <textarea
                    className="form-control"
                    id="remarks"
                    rows="3"
                    value={updatedRemarks}
                    onChange={(e) => setUpdatedRemarks(e.target.value)}
                    placeholder="Enter remarks..."
                  ></textarea>
                </div>

              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-primary' onClick={handleSave}>Save & Submit</button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default UserDashboard;
