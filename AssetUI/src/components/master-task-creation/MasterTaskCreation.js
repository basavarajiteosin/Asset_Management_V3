import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { removeExtraSpaces } from '../../common/textOperations';
import { toast } from 'react-toastify';
import { getFirstTwoLetters } from '../../common/textOperations';
import PleaseWaitButton from '../../shared/PleaseWaitButton';
import { Link } from 'react-router-dom'
import axios from 'axios';
import $ from "jquery";

const config = require('../../services/config.json');

const MasterTaskCreation = () => {


  const inputTaskNameReference = useRef(null);
  const inputDescriptionReference = useRef(null);
  const inputProposedDurationReference = useRef(null);
  const inputEndDateReference = useRef(null);
  const inputStartDateReference = useRef(null);
  const inputTechnologieReference = useRef(null);
  const inputIsParallelProcessReference = useRef(null);

  const personalInfo = useSelector((state) => state.personalInformationReducer);

  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [proposedDuration, setProposedDuration] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [technologieId, setTechnologieId] = useState("");
  const [isParallelProcess, setIsParallelProcess] = useState(false);

  const [isLoaderActive, setIsLoaderActive] = useState(false);

  const [allTechnologiesList, setAllTechnologiesList] = useState([]);
  const [allTasksList, setAllTaskList] = useState([]);

  const [taskUpdateId, setTaskUpdateId] = useState("");
  const [taskDeleteId, setTaskDeleteId] = useState("");



  useEffect(() => {
    getAllTechnologiesList();
    getAllTaskList();
    window.initDateTimePickerFuncation();

  }, []);

  const getAllTaskList = () => {
    window.initDestroyDataTableFuncation();
    axios.get(config.APP_API_URL + 'ProjectTaskManager/GetAllProjectTasks', {
      headers: config.headers2,
    }).then((response) => {
      if (response.status == 200) {
        if (response.data.success == true) {
          if (response.data.data.length > 0) {
            // console.log("response.data.data ======>", response.data.data)
            setAllTaskList(response.data.data);
            setTimeout(() => {
              window.initDataTableFuncation();
            }, 3000)
          } else {
            setAllTaskList([]);
            setTimeout(() => {
              window.initDataTableFuncation();
            }, 3000)
          }
        } else {
          toast.error(response.data.message, config.tostar_config);
        }
      } else if (response.data.status.status == 500) {
        toast.error("Invalid username or password", config.tostar_config);
      }
    }).catch((error) => {
      toast.error("Please try again later.", config.tostar_config);
    })
  }

  const getAllTechnologiesList = () => {
    axios.get(config.APP_API_URL + 'ProjectTaskManager/GetAllTechnologies', {
      headers: config.headers2,
    }).then((response) => {
      if (response.status == 200) {
        if (response.data.success == true) {
          if (response.data.data.length > 0) {
            setAllTechnologiesList(response.data.data);
          }
        } else {
          toast.error(response.data.message, config.tostar_config);
        }
      } else if (response.data.status.status == 500) {
        toast.error("Invalid username or password", config.tostar_config);
      }
    }).catch((error) => {
      toast.error("Please try again later.", config.tostar_config);
    })
  }

  const addProjectCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  }

  const listOfProjectsHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButton").click();
  }

  const handleEditTaskDetails = (getTaskObject) => {

    const startDateISO = new Date(getTaskObject.actualStartDate);
    const formattedStartDate = `${(startDateISO.getMonth() + 1).toString().padStart(2, '0')}/${startDateISO.getDate().toString().padStart(2, '0')}/${startDateISO.getFullYear()} ${startDateISO.getHours().toString().padStart(2, '0')}:${startDateISO.getMinutes().toString().padStart(2, '0')} ${startDateISO.getHours() >= 12 ? 'PM' : 'AM'}`;

    const endDateISO = new Date(getTaskObject.actualFinishDate);
    const formattedEndDate = `${(endDateISO.getMonth() + 1).toString().padStart(2, '0')}/${endDateISO.getDate().toString().padStart(2, '0')}/${endDateISO.getFullYear()} ${endDateISO.getHours().toString().padStart(2, '0')}:${endDateISO.getMinutes().toString().padStart(2, '0')} ${endDateISO.getHours() >= 12 ? 'PM' : 'AM'}`;

    $("#projectStartDateV").val(formattedStartDate);
    $("#projectEndDateV").val(formattedEndDate);

    setStartDate(formattedStartDate);
    setEndDate(formattedEndDate);
    setTechnologieId(getTaskObject.technologies);
    setTaskName(getTaskObject.taskName);
    setTaskDescription(getTaskObject.description);
    setProposedDuration(getTaskObject.proposedDuration);
    setTaskUpdateId(getTaskObject.pTaskId);
    setIsParallelProcess(getTaskObject.isParallelProcess);
    
    listOfProjectsHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleRemoveProject = (getTaskObject) => {
    setTaskDeleteId(getTaskObject.pTaskId);
    window.confirmModalShow();
  }

  const yesConfirmSubmitRequest = () => {
    setIsLoaderActive(true);
    let APIMethodName = 'ProjectTaskManager/DeleteProjectTask?id=' + taskDeleteId
    axios.post(config.APP_API_URL + APIMethodName, {
      headers: config.headers3,
    }).then((response) => {
      // console.log(response);
      if (response.data.success == true) {
        toast.success(response.data.message, config.tostar_config);
        window.confirmModalHide();
        setIsLoaderActive(false);
        setTaskDeleteId("");
        getAllTaskList();
      } else {
        setIsLoaderActive(false);
        toast.error(response.data.message, config.tostar_config);
      }
    }).catch((error) => {
      if (!error.response.data.success) {
        toast.error(error.response.data.message, config.tostar_config);
      } else {
        toast.error("Please try again later.", config.tostar_config);
      }
      setIsLoaderActive(false);
    })
  }

  const clearAllFields = () => {
    $("#projectStartDateV").val('');
    $("#projectEndDateV").val('');

    setStartDate('');
    setEndDate('');
    setTaskName('');
    setTaskDescription('');
    setProposedDuration('');
    setTaskUpdateId('');
    setTaskDeleteId('');
    setIsParallelProcess(false)
  }

  const handleTaskSubmit = (e) => {

    let getStartDate = $("#projectStartDateV").val();
    //setStartDate(getStartDate);
    let getEndDate = $("#projectEndDateV").val();
    //setEndDate(getEndDate);
    if (technologieId) {
      if (removeExtraSpaces(taskName)) {
        if (taskDescription) {
          if (proposedDuration) {
            if (getStartDate) {
              inputStartDateReference.current.classList.remove('is-invalid');
              if (getEndDate) {
                inputEndDateReference.current.classList.remove('is-invalid');

                let APIMethodName = ''
                if (taskUpdateId != "") {
                  APIMethodName = 'ProjectTaskManager/UpdateProjectTask?PTaskId=' + taskUpdateId
                } else {
                  APIMethodName = 'ProjectTaskManager/CreateProjectTask'
                }

                axios.post(config.APP_API_URL + APIMethodName, {
                  "createdBy": personalInfo.userID,
                  "modifiedBy": personalInfo.userID,
                  "taskName": taskName,
                  "description": taskDescription,
                  "technologies": technologieId,
                  "proposedDuration": proposedDuration,
                  "actualStartDate": getStartDate.toString(),
                  "actualFinishDate": getEndDate.toString(),
                  "isParallelProcess": isParallelProcess
                }, {
                  headers: config.headers2,
                }).then((response) => {
                  // console.log(response);
                  if (response.data.success == true) {
                    toast.success(response.data.message, config.tostar_config);
                    clearAllFields();
                    addProjectCardHeaderButtonClick();
                    getAllTaskList();
                    setIsLoaderActive(false);
                  } else {
                    setIsLoaderActive(false);
                    toast.error(response.data.message, config.tostar_config);
                  }
                }).catch((error) => {
                  if (!error.response.data.success) {
                    toast.error(error.response.data.message, config.tostar_config);
                  } else {
                    toast.error("Please try again later.", config.tostar_config);
                  }
                  setIsLoaderActive(false);
                })

              } else {
                toast.error("Please select end date.", config.tostar_config);
                inputEndDateReference.current.focus();
                inputEndDateReference.current.classList.add('is-invalid');
              }
            } else {
              toast.error("Please select start date.", config.tostar_config);
              inputStartDateReference.current.focus();
              inputStartDateReference.current.classList.add('is-invalid');
            }

          } else {
            toast.error("Please enter proposed duration.", config.tostar_config);
            inputProposedDurationReference.current.focus();
            inputProposedDurationReference.current.classList.add('is-invalid');
          }

        } else {
          toast.error("Please enter task description.", config.tostar_config);
          inputDescriptionReference.current.focus();
          inputDescriptionReference.current.classList.add('is-invalid');
        }
      } else {
        toast.error("Please enter task name.", config.tostar_config);
        inputTaskNameReference.current.focus();
        inputTaskNameReference.current.classList.add('is-invalid');
      }
    } else {
      toast.error("Please select technologie.", config.tostar_config);
      inputTechnologieReference.current.focus();
      inputTechnologieReference.current.classList.add('is-invalid');
    }

  }
  const handleCheckboxChange = () => {
    setIsParallelProcess(inputIsParallelProcessReference.current.checked);
  };

  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Task Master</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item"><Link to="#">Home</Link></li>
                <li className="breadcrumb-item active">Manage Task Master</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className='row'>
            <div className="col-md-12">
              <div className="card card-danger card-outline collapsed-card">
                <div className="card-header">
                  <h3 className="card-title text-sm">Create New Task</h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-danger btn-xs" id='AddNewHeaderButton' onClick={(e) => { addProjectCardHeaderButtonClick(e) }} data-card-widget="collapse">
                      <i className="fas fa-plus"></i> Add New
                    </button>
                    <button type="button" className="btn btn-tool" data-card-widget="maximize">
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body text-sm" >
                  <div className='row'>
                    <div className="form-group col-md-6">
                      <label>Select Technologie<sup style={{ color: "red" }}>*</sup></label>
                      <select className="form-control form-control-sm" ref={inputTechnologieReference} value={technologieId} onChange={(e) => setTechnologieId(e.target.value)}>
                        <option value="">--Select--</option>
                        {allTechnologiesList.map((tech) => {
                          return (
                            <option key={"Mana_" + tech.techId} value={tech.techId}>{tech.description}</option>
                          )
                        })}
                      </select>
                    </div>
                    <div className="form-group col-md-6">
                      <label for="taskNameInput">Task Name<sup style={{ color: "red" }}>*</sup></label>
                      <input type="text" className="form-control form-control-sm" id="taskNameInput" ref={inputTaskNameReference} value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="Task Name" />
                    </div>

                    <div className="form-group  col-md-12">
                      <label>Description<sup style={{ color: "red" }}>*</sup></label>
                      <textarea className="form-control form-control-sm" style={{ resize: 'none', minHeight: "45px" }} rows="3" ref={inputDescriptionReference} value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="Enter description ..."></textarea>
                    </div>
                    <div className="form-group col-md-4">
                      <label for="proposedDurationInput">Proposed Duration<sup style={{ color: "red" }}>*</sup></label>
                      <input type="text" className="form-control form-control-sm" id="proposedDurationInput" ref={inputProposedDurationReference} value={proposedDuration} onChange={(e) => setProposedDuration(e.target.value)} placeholder="Proposed Duration" />
                    </div>
                    <div className="form-group col-md-4">
                      <label>Task Start Date<sup style={{ color: "red" }}>*</sup></label>
                      <div className="input-group" id="projectStartDate" data-target-input="nearest">
                        <input type="text" className="form-control form-control-sm" id="projectStartDateV" ref={inputStartDateReference} value={startDate} onSelect={(e) => { setStartDate(e.target.value); }} placeholder='Task Start Date' data-target="#projectStartDate" />
                        <div className="input-group-append" custDatePicker data-target="#projectStartDate" data-toggle="datetimepicker">
                          <div className="input-group-text"><i className="fa fa-calendar"></i></div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <label>Task End Date<sup style={{ color: "red" }}>*</sup></label>
                      <div className="input-group" id="projectEndDate" data-target-input="nearest">
                        <input type="text" className="form-control custDatePicker form-control-sm" id="projectEndDateV" ref={inputEndDateReference} value={endDate} onSelect={(e) => setEndDate(e.target.value)} placeholder='Task End Date' data-target="#projectEndDate" />
                        <div className="input-group-append" data-target="#projectEndDate" data-toggle="datetimepicker">
                          <div className="input-group-text"><i className="fa fa-calendar"></i></div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group   col-md-6">
                      <div className="input-group" id="projectEndDate" data-target-input="nearest">
                        <input
                          type="checkbox"
                          className="form-check-input "
                          id="isThisParallelProcessInput"
                          ref={inputIsParallelProcessReference}
                          checked={isParallelProcess}
                          onChange={handleCheckboxChange}
                          style={{    position: 'absolute',
                            marginTop: '.2rem',
                            marginLeft: '0rem'}}
                        />
                        <label
                          class="form-check-label"
                          for="isThisParallelProcessInput"
                          style={{marginLeft: '17px'}}
                        >
                          Is this parallel process?
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-footer text-sm">
                  {isLoaderActive ? <PleaseWaitButton className='float-right btn-xs ml-2 font-weight-medium auth-form-btn' /> :
                    <button type="submit" className="btn btn-success float-right btn-xs ml-2" onClick={(e) => { handleTaskSubmit(e) }}>Save & Submit</button>
                  }
                  <button type="submit" className="btn btn-default float-right btn-xs">Cancel</button>
                </div>
              </div>

            </div>
          </div>

          <div className='row'>
            <div className="col-md-12">
              <div className="card card-danger card-outline">
                <div className="card-header">
                  <h3 className="card-title text-sm">Master Tasks List</h3>
                  <div className="card-tools">
                    <button type="button" className="btn btn-tool" id='listOfProjectsHeaderExpandButtion' onClick={(e) => { listOfProjectsHeaderExpandButtionClick(e) }} data-card-widget="collapse">
                      <i className="fas fa-minus"></i>
                    </button>
                    <button type="button" className="btn btn-tool" data-card-widget="maximize">
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body text-sm" >
                  <table id="example1" class="table table-bordered table-sm table-striped">
                    <thead>
                      <tr>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }} className='text-center'>Sr. No.</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Technologie</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Task Name</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Description</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Proposed Duration</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Start Date</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>End Date</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller' }}>Is Parallel Process</th>
                        <th style={{ fontWeight: '500', fontSize: 'smaller', width: "7%" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allTasksList.length > 0 ?
                        allTasksList.map((taskObj, index) => {
                          let getTechnologieName = allTechnologiesList.find(x => x.techId == parseInt(taskObj.technologies));
                          if (getTechnologieName) {
                            if ('description' in getTechnologieName) {
                              getTechnologieName = getTechnologieName.description;
                            } else {
                              getTechnologieName = "Not Found";
                            }
                          } else {
                            getTechnologieName = "Not Found";
                          }
                          return (
                            <tr>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>{index + 1}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{getTechnologieName}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{taskObj.taskName}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{taskObj.description}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{taskObj.proposedDuration}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{taskObj.actualStartDate}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{taskObj.actualFinishDate}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }}>{taskObj.isParallelProcess == true ? "Yes" : "No"}</td>
                              <td style={{ fontWeight: '400', fontSize: 'smaller' }} className='text-center text-sm'>
                                <button type="button" class="btn bg-gradient-warning btn-xs" onClick={(e) => { handleEditTaskDetails(taskObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                                  <i class="fas fa-pen" style={{ fontSize: 'smaller' }}></i>
                                </button>
                                <button type="button" class="btn bg-gradient-danger btn-xs ml-2" onClick={(e) => { handleRemoveProject(taskObj) }} style={{ padding: '5px', fontSize: '.75rem', lineHeight: '0', borderRadius: '.15rem' }}>
                                  <i class="fas fa-trash" style={{ fontSize: 'smaller' }}></i>
                                </button>
                              </td>
                            </tr>
                          )
                        })
                        : ""
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div id="confirmCommonModal" class="modal fade confirmCommonModal" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div class="modal-dialog modal-confirm">
          <div class="modal-content">
            <div class="modal-header">
              <div class="icon-box">
                <i class="fas fa-info"></i>
              </div>
              <h5 class="modal-title w-100">Are you sure ?</h5>
            </div>
            <div class="modal-body">
              <p class="text-center">By clicking on Yes delete all the project details. Once you deleted it can not be recovered.</p>
            </div>
            <div class="modal-footer col-md-12">
              <button class="btn btn-default btn-sm"  data-bs-dismiss="modal">Cancel</button>
              {isLoaderActive ? <PleaseWaitButton className='btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn' /> :
                <button class="btn btn-warning btn-sm pl-3 pr-3 ml-2" onClick={(e) => { yesConfirmSubmitRequest(e) }}>Yes</button>
              }

            </div>
          </div>
        </div>
      </div>
    </>

  );
}

export default MasterTaskCreation;
