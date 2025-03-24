import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { removeExtraSpaces } from "../../common/textOperations";
import { toast } from "react-toastify";
import { getFirstTwoLetters } from "../../common/textOperations";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import { Link } from "react-router-dom";
import axios from "axios";
import $ from "jquery";

const config = require("../../services/config.json");

const ManageProjects = () => {
  const inputProjectAttachmentsNameReference = useRef(null);
  const inputProjectAttachmentsFileReference = useRef(null);
  const inputProjectDescriptionReference = useRef(null);
  const inputProjectStatusReference = useRef(null);
  // const inputBRDStatusReference = useRef(null);
  const inputKickOffDateReference = useRef(null);
  const inputEndDateReference = useRef(null);
  const inputStartDateReference = useRef(null);
  const inputIteosSPOCReference = useRef(null);
  const inputClientSPOCReference = useRef(null);
  const inputManagerIdReference = useRef(null);
  const inputClientNameReference = useRef(null);
  const inputProjectNameReference = useRef(null);
  const inputTechnologieReference = useRef(null);
  const inputProjectTypeReference = useRef(null);
  const personalInfo = useSelector((state) => state.personalInformationReducer);

  const [projectAttachmentsName, setProjectAttachmentsName] = useState([]);
  const [projectAttachmentFile, setProjectAttachmentsFile] = useState([]);
  const [selectedAttachmentsFile, setSelectedAttachmentsFile] = useState("");
  const [selectedAttachmentsFileName, setSelectedAttachmentsFileName] =
    useState("Choose file");
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [clientName, setClientName] = useState("");
  const [managerId, setManagerId] = useState("");
  const [clientSPOC, setClientSPOC] = useState("");
  const [iteosSPOC, setIteosSPOC] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [kickOffDate, setKickOffDate] = useState("");
  // const [bRDStatus, setBRDStatus] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [allManagesList, setAllManagesList] = useState([]);
  const [allProjectsList, setAllProjectsList] = useState([]);
  const [removeOldFilesArrayList, setRemoveOldFilesArrayList] = useState([]);
  const [projectUpdateId, setProjectUpdateId] = useState("");
  const [projectDeleteId, setProjectDeleteId] = useState("");
  const [activeId, setActiveId] = useState("");
  const [technologieId, setTechnologieId] = useState("");
  const [projectType, setProjectType] = useState("");
  const [allTechnologiesList, setAllTechnologiesList] = useState([]);

  // console.log(personalInfo);
  useEffect(() => {
    getAllManagerList();
    getAllProjectsList();
    getAllTechnologiesList();
    window.initDatePickerFuncation();
  }, []);

  const getAllProjectsList = () => {
    window.initDestroyDataTableFuncation();
    axios
      .get(
        config.APP_API_URL +
          "ProjectDetailes/GetAllProjectsWithAttachments?userRole=" +
          personalInfo.userRole +
          "&userId=" +
          personalInfo.userID,
        {
          headers: config.headers2,
        }
      )
      .then((response) => {
        if (response.status == 200) {
          if (response.data.success == true) {
            if (response.data.data.length > 0) {
              // console.log("response.data.data ======>", response.data.data);
              setAllProjectsList(response.data.data);
              setTimeout(() => {
                window.initDataTableFuncation();
              }, 1000);
            } else {
              setAllProjectsList([]);
              setTimeout(() => {
                window.initDataTableFuncation();
              }, 1000);
            }
          } else {
            toast.error(response.data.message, config.tostar_config);
          }
        } else if (response.data.status.status == 500) {
          toast.error("Invalid username or password", config.tostar_config);
        }
      })
      .catch((error) => {
        toast.error("Please try again later.", config.tostar_config);
      });
  };
  const getAllManagerList = () => {
    axios
      .get(
        config.API_URL +
          "AuthMasterController/GetAllManagerUsers?ClientId=" +
          config.clientId,
        {
          headers: config.headers2,
        }
      )
      .then((response) => {
        if (response.status == 200) {
          if (response.data.success == "success") {
            if (response.data.data.length > 0) {
              let tempArray = [];
              // console.log(
              //   "response.data.data Manager---->",
              //   response.data.data
              // );

              response.data.data.map((manager) => {
                if (manager.accountGroup != "Sales and Marketing Team") {
                  let tempObj = {
                    managerId: manager.userID,
                    managerName: manager.userName,
                    managerFirstName: manager.firstName,
                    managerLastName: manager.lastName,
                    managerStatus: manager.isActive,
                  };
                  tempArray.push(tempObj);
                }
              });
              setAllManagesList(tempArray);
            }
          } else {
            toast.error(response.data.message, config.tostar_config);
          }
        } else if (response.data.status.status == 500) {
          toast.error("Invalid username or password", config.tostar_config);
        }
      })
      .catch((error) => {
        toast.error("Please try again later.", config.tostar_config);
      });
  };

  const getAllTechnologiesList = () => {
    axios
      .get(config.APP_API_URL + "ProjectTaskManager/GetAllTechnologies", {
        headers: config.headers2,
      })
      .then((response) => {
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
      })
      .catch((error) => {
        toast.error("Please try again later.", config.tostar_config);
      });
  };

  function ValidateSingleInput(event) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size > 8 * 1000 * 1024) {
        toast.error(
          "File with maximum size of 8MB is allowed",
          config.tostar_config
        );
        return false;
      }
      var fileName = event.target.files[0].name;
      var fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1);
      if (!config._validFileExtensions.includes(fileNameExt)) {
        toast.error(
          "Please upload files having extensions: " +
            config._validFileExtensions.join(", ") +
            " only.",
          config.tostar_config
        );
        $(event).val("");
        return false;
      }
      setSelectedAttachmentsFileName(fileName);
      setSelectedAttachmentsFile(event.target.files[0]);
    }
  }

  const handleAddNewAttachment = () => {
    if (removeExtraSpaces(projectAttachmentsName)) {
      if (selectedAttachmentsFile) {
        // console.log("selectedAttachmentsFile --->", selectedAttachmentsFile);
        var tempArray = [...projectAttachmentFile];
        let tempObj = {
          fileAdded: "New",
          fileName: projectAttachmentsName,
          selectedFile: selectedAttachmentsFile,
          attachId: "",
        };
        tempArray.push(tempObj);
        setProjectAttachmentsFile(tempArray);
        setSelectedAttachmentsFile("");
        setSelectedAttachmentsFileName("Choose file");
        setProjectAttachmentsName("");
        $("#customFile").val("");
      } else {
        toast.error("Please select attachment file.", config.tostar_config);
        inputProjectAttachmentsFileReference.current.focus();
        inputProjectAttachmentsFileReference.current.classList.add(
          "is-invalid"
        );
        // is-invalid
      }
    } else {
      toast.error("Please enter attachment name.", config.tostar_config);
      inputProjectAttachmentsNameReference.current.focus();
      inputProjectAttachmentsNameReference.current.classList.add("is-invalid");
    }
  };

  const handleRemoveAttachment = (getIndex) => {
    let tempArray = [...projectAttachmentFile];
    let tempOldFileArray = [...removeOldFilesArrayList];
    if (tempArray[getIndex].fileAdded == "Old") {
      tempArray.splice(getIndex, 1);
      tempOldFileArray.push(tempArray[getIndex].attachId);
    } else {
      tempArray.splice(getIndex, 1);
    }
    setRemoveOldFilesArrayList(tempOldFileArray);
    setProjectAttachmentsFile(tempArray);
  };

  const handleCancelClick = () => {
    clearAllFields();
    addProjectCardHeaderButtonClick();
  };

  const addProjectCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  };

  const listOfProjectsHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButton").click();
  };

  const handleInActive = () => {
    $("#isActiveFalse").show();
    $("#isActiveTrue").hide();
    $("#isActive").show();
    $("#inActive").hide();
  };

  const handleIsActive = () => {
    $("#isActiveFalse").hide();
    $("#isActiveTrue").show();
    $("#isActive").hide();
    $("#inActive").show();
  };

  const handleEdutProjectDetails = (getProjectObject) => {
    $("#projectStartDateV").val(getProjectObject.startDate);
    $("#projectEndDateV").val(getProjectObject.endDate);
    $("#projectKickOffDateV").val(getProjectObject.projectKickoff);
    // setStartDate(getProjectObject.startDate);
    // setEndDate(getProjectObject.endDate);
    // setKickOffDate(getProjectObject.projectKickoff);
    setProjectName(getProjectObject.projectName);
    setClientName(getProjectObject.clientName);
    setManagerId(getProjectObject.assignedManagerId);
    setClientSPOC(getProjectObject.clientSpoc);
    setIteosSPOC(getProjectObject.iteosSpoc);
    setProjectStatus(getProjectObject.projectStatus);
    setProjectDescription(getProjectObject.discription);
    setTechnologieId(getProjectObject.projectTechnologies);
    setProjectType(getProjectObject.projectType);
    setProjectUpdateId(getProjectObject.projectId);

    var tempArray = [];
    getProjectObject.attachments.map((attachObj, index) => {
      let tempObj = {
        fileAdded: "Old",
        fileName: attachObj.actualDocName,
        selectedFile: attachObj.attachmentName,
        attachId: attachObj.attachmentID,
      };
      tempArray.push(tempObj);
    });
    setProjectAttachmentsFile(tempArray);

    listOfProjectsHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveProject = (getProjectObject) => {
    setProjectDeleteId(getProjectObject.projectId);
    window.confirmModalShow();
  };

  const handleActiveProject = (getProjectObject) => {
    // console.log(getProjectObject);
    setActiveId(getProjectObject.projectId);
    ActiveProject();
  };

  const ActiveProject = () => {
    let APIMethodName =
      "ProjectDetailes/ActiveProjectAndAttachments?projectId=" + activeId;
    axios
      .post(config.APP_API_URL + APIMethodName, {
        headers: config.headers3,
      })
      .then((response) => {
        // console.log(response);
        if (response.data.success == true) {
          toast.success(response.data.message, config.tostar_config);
          setActiveId("");
          getAllProjectsList();
        } else {
          toast.error(response.data.message, config.tostar_config);
        }
      })
      .catch((error) => {
        if (!error.response.data.success) {
          toast.error(error.response.data.message, config.tostar_config);
        } else {
          toast.error(
            "oops something went wrong. please try again later.",
            config.tostar_config
          );
        }
      });
  };

  const yesConfirmSubmitRequest = () => {
    setIsLoaderActive(true);
    let APIMethodName =
      "ProjectDetailes/DeleteProjectAndAttachments?projectId=" +
      projectDeleteId;
    axios
      .post(config.APP_API_URL + APIMethodName, {
        headers: config.headers3,
      })
      .then((response) => {
        // console.log(response);
        if (response.data.success == true) {
          toast.success(response.data.message, config.tostar_config);
          window.confirmModalHide();
          setIsLoaderActive(false);
          setProjectDeleteId("");
          getAllProjectsList();
        } else {
          setIsLoaderActive(false);
          toast.error(response.data.message, config.tostar_config);
        }
      })
      .catch((error) => {
        if (!error.response.data.success) {
          toast.error(error.response.data.message, config.tostar_config);
        } else {
          toast.error(
            "oops something went wrong. please try again later.",
            config.tostar_config
          );
        }
        setIsLoaderActive(false);
      });
  };

  const clearAllFields = () => {
    $("#projectStartDateV").val("");
    $("#projectEndDateV").val("");
    $("#projectKickOffDateV").val("");
    // setStartDate('');
    // setEndDate('');
    // setKickOffDate('');
    setProjectAttachmentsName([]);
    setProjectAttachmentsFile([]);
    setSelectedAttachmentsFile("");
    setSelectedAttachmentsFileName("Choose file");
    setProjectName("");
    setClientName("");
    setManagerId("");
    setClientSPOC("");
    setIteosSPOC("");
    // setBRDStatus("");
    setProjectStatus("");
    setProjectDescription("");
    setProjectUpdateId("");
    setProjectType("");
    setTechnologieId("");
    setRemoveOldFilesArrayList([]);
    inputProjectAttachmentsFileReference.current.classList.remove("is-invalid");
    inputProjectAttachmentsNameReference.current.classList.remove("is-invalid");
    inputProjectNameReference.current.classList.remove("is-invalid");
    inputManagerIdReference.current.classList.remove("is-invalid");
    inputClientNameReference.current.classList.remove("is-invalid");
    inputProjectStatusReference.current.classList.remove("is-invalid");
    inputProjectTypeReference.current.classList.remove("is-invalid");
    inputTechnologieReference.current.classList.remove("is-invalid");
    inputKickOffDateReference.current.classList.remove("is-invalid");
    inputEndDateReference.current.classList.remove("is-invalid");
    inputStartDateReference.current.classList.remove("is-invalid");
    inputIteosSPOCReference.current.classList.remove("is-invalid");
    inputClientSPOCReference.current.classList.remove("is-invalid");
  };

  const handleProjectSubmit = (e) => {
    let getStartDate = $("#projectStartDateV").val();
    //setStartDate(getStartDate);
    let getEndDate = $("#projectEndDateV").val();
    //setEndDate(getEndDate);
    let getProjectKickOffDateV = $("#projectKickOffDateV").val();
    //setKickOffDate(getProjectKickOffDateV);
    if (removeExtraSpaces(projectName)) {
      if (clientName) {
        if (managerId) {
          if (clientSPOC) {
            if (iteosSPOC) {
              if (getStartDate) {
                inputStartDateReference.current.classList.remove("is-invalid");
                if (getEndDate) {
                  inputEndDateReference.current.classList.remove("is-invalid");
                  if (getProjectKickOffDateV) {
                    inputKickOffDateReference.current.classList.remove(
                      "is-invalid"
                    );
                    if (technologieId) {
                      if (projectType) {
                        if (projectStatus) {
                          var formData = new FormData();
                          formData.append("ProjectName", projectName);
                          formData.append("ClientName", clientName);
                          formData.append("AssignedManagerId", managerId);
                          formData.append("ClientSpoc", clientSPOC);
                          formData.append("IteosSpoc", iteosSPOC);
                          formData.append("StartDate", getStartDate);
                          formData.append("EndDate", getEndDate);
                          formData.append(
                            "ProjectKickoff",
                            getProjectKickOffDateV
                          );
                          formData.append("ProjectStatus", projectStatus);
                          formData.append("Discription", projectDescription);
                          formData.append("ProjectType", projectType);
                          formData.append("ProjectTechnologies", technologieId);
                          formData.append("CreatedBy", personalInfo.userID);
                          // console.log(
                          //   "projectAttachmentFile===<>",
                          //   projectAttachmentFile
                          // );
                          if (projectAttachmentFile.length > 0) {
                            // console.log(projectAttachmentFile);
                            let tempIndex = 0;
                            projectAttachmentFile.map((filesObj, index) => {
                              if (filesObj.fileAdded == "New") {
                                formData.append(
                                  "Attachments",
                                  filesObj.selectedFile
                                );
                                formData.append(
                                  "DocumentsName[" + tempIndex + "]",
                                  filesObj.fileName
                                );
                                tempIndex++;
                              }
                            });
                          } else {
                            formData.append("Attachments", []);
                            formData.append("DocumentsName", []);
                          }
                          setIsLoaderActive(true);

                          let APIMethodName = "";
                          if (projectUpdateId != "") {
                            if (removeOldFilesArrayList.length > 0) {
                              formData.append(
                                "DeleteDocIds",
                                removeOldFilesArrayList.toString()
                              );
                            } else {
                              formData.append("DeleteDocIds", "");
                            }
                            APIMethodName =
                              "ProjectDetailes/UpdateProjectAndAttachments?projectId=" +
                              projectUpdateId;
                          } else {
                            APIMethodName =
                              "ProjectDetailes/CreateProjectWithAttachments";
                          }

                          axios
                            .post(
                              config.APP_API_URL + APIMethodName,
                              formData,
                              {
                                headers: config.headers3,
                              }
                            )
                            .then((response) => {
                              // console.log(response);
                              if (response.data.success == true) {
                                toast.success(
                                  response.data.message,
                                  config.tostar_config
                                );
                                clearAllFields();
                                addProjectCardHeaderButtonClick();
                                getAllProjectsList();
                                setIsLoaderActive(false);
                              } else {
                                setIsLoaderActive(false);
                                toast.error(
                                  response.data.message,
                                  config.tostar_config
                                );
                              }
                            })
                            .catch((error) => {
                              if (!error.response.data.success) {
                                toast.error(
                                  error.response.data.message,
                                  config.tostar_config
                                );
                              } else {
                                toast.error(
                                  "Please try again later.",
                                  config.tostar_config
                                );
                              }
                              setIsLoaderActive(false);
                            });
                        } else {
                          toast.error(
                            "Please select project status.",
                            config.tostar_config
                          );
                          inputProjectStatusReference.current.focus();
                          inputProjectStatusReference.current.classList.add(
                            "is-invalid"
                          );
                        }
                      } else {
                        toast.error(
                          "Please select project type.",
                          config.tostar_config
                        );
                        inputProjectTypeReference.current.focus();
                        inputProjectTypeReference.current.classList.add(
                          "is-invalid"
                        );
                      }
                    } else {
                      toast.error(
                        "Please select technologie.",
                        config.tostar_config
                      );
                      inputTechnologieReference.current.focus();
                      inputTechnologieReference.current.classList.add(
                        "is-invalid"
                      );
                    }
                  } else {
                    toast.error(
                      "Please select Kick Off date.",
                      config.tostar_config
                    );
                    inputKickOffDateReference.current.focus();
                    inputKickOffDateReference.current.classList.add(
                      "is-invalid"
                    );
                  }
                } else {
                  toast.error("Please select end date.", config.tostar_config);
                  inputEndDateReference.current.focus();
                  inputEndDateReference.current.classList.add("is-invalid");
                }
              } else {
                toast.error("Please select start date.", config.tostar_config);
                inputStartDateReference.current.focus();
                inputStartDateReference.current.classList.add("is-invalid");
              }
            } else {
              toast.error("Please enter Iteos SPOC.", config.tostar_config);
              inputIteosSPOCReference.current.focus();
              inputIteosSPOCReference.current.classList.add("is-invalid");
            }
          } else {
            toast.error("Please enter client SPOC.", config.tostar_config);
            inputClientSPOCReference.current.focus();
            inputClientSPOCReference.current.classList.add("is-invalid");
          }
        } else {
          toast.error("Please select manager.", config.tostar_config);
          inputManagerIdReference.current.focus();
          inputManagerIdReference.current.classList.add("is-invalid");
        }
      } else {
        toast.error("Please enter client name.", config.tostar_config);
        inputClientNameReference.current.focus();
        inputClientNameReference.current.classList.add("is-invalid");
      }
    } else {
      toast.error("Please enter project name.", config.tostar_config);
      inputProjectNameReference.current.focus();
      inputProjectNameReference.current.classList.add("is-invalid");
    }
  };

  const cteateAttachmentHTML = (attachmentsObj) => {
    if (attachmentsObj.length > 0) {
      return attachmentsObj.map((attachObj, index) => {
        return (
          <a href={attachObj.attachmentFile} target="_blank">
            <small className="badge badge-secondary p-1 mt-1 ml-1">
              <i className="fas fa-paperclip"></i> {attachObj.actualDocName}
            </small>
          </a>
        );
      });
    }
  };
  return (
    <>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Manage Projects</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="/dashboard">Home</Link>
                </li>
                <li className="breadcrumb-item active">Manage Projects</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-danger card-outline collapsed-card">
                <div className="card-header">
                  <h3 className="card-title text-sm">Create New Project</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      id="AddNewHeaderButton"
                      onClick={(e) => {
                        addProjectCardHeaderButtonClick(e);
                      }}
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-plus"></i> Add New
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="maximize"
                    >
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body text-sm">
                  <div className="row">
                    <div className="form-group col-md-4">
                      <label htmlFor="projectNameInput">
                        Project Name<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="projectNameInput"
                        ref={inputProjectNameReference}
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Project Name"
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label htmlFor="clientNameInput">
                        Client Name<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        id="clientNameInput"
                        ref={inputClientNameReference}
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="Client Name"
                      />
                    </div>
                    <div className="form-group col-md-4">
                      <label>
                        Select Manager<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        className="form-control form-control-sm"
                        ref={inputManagerIdReference}
                        value={managerId}
                        onChange={(e) => setManagerId(e.target.value)}
                      >
                        <option value="">--Select--</option>
                        {allManagesList
                          .filter((manager) => manager.managerStatus === true)
                          .map((manager) => {
                            return (
                              <option
                                key={"Mana_" + manager.managerId}
                                value={manager.managerId}
                              >
                                {manager.managerFirstName}{" "}
                                {manager.managerLastName}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                    <div className="form-group  col-md-6">
                      <label>
                        Client SPOC<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        style={{ resize: "none", minHeight: "45px" }}
                        rows="3"
                        ref={inputClientSPOCReference}
                        value={clientSPOC}
                        onChange={(e) => setClientSPOC(e.target.value)}
                        placeholder="Enter Client SPOC ..."
                      ></textarea>
                    </div>
                    <div className="form-group  col-md-6">
                      <label>
                        Iteos SPOC<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <textarea
                        className="form-control form-control-sm"
                        style={{ resize: "none", minHeight: "45px" }}
                        rows="3"
                        ref={inputIteosSPOCReference}
                        value={iteosSPOC}
                        onChange={(e) => setIteosSPOC(e.target.value)}
                        placeholder="Enter Iteos SPOC ..."
                      ></textarea>
                    </div>
                    <div className="form-group col-md-4">
                      <label>
                        Project KickOff Date
                        <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <div
                        className="input-group"
                        id="projectKickOffDate"
                        data-target-input="nearest"
                      >
                        <input
                          type="text"
                          className="form-control custDatePicker form-control-sm"
                          id="projectKickOffDateV"
                          ref={inputKickOffDateReference}
                          placeholder="Project KickOff Date"
                          data-target="#projectKickOffDate"
                        />
                        <div
                          className="input-group-append"
                          data-target="#projectKickOffDate"
                          data-toggle="datetimepicker"
                        >
                          <div className="input-group-text">
                            <i className="fa fa-calendar"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <label>
                        Project Start Date<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <div
                        className="input-group"
                        id="projectStartDate"
                        data-target-input="nearest"
                      >
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="projectStartDateV"
                          ref={inputStartDateReference}
                          placeholder="Project Start Date"
                          data-target="#projectStartDate"
                        />
                        <div
                          className="input-group-append"
                          custDatePicker
                          data-target="#projectStartDate"
                          data-toggle="datetimepicker"
                        >
                          <div className="input-group-text">
                            <i className="fa fa-calendar"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group col-md-4">
                      <label>
                        Project End Date<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <div
                        className="input-group"
                        id="projectEndDate"
                        data-target-input="nearest"
                      >
                        <input
                          type="text"
                          className="form-control custDatePicker form-control-sm"
                          id="projectEndDateV"
                          ref={inputEndDateReference}
                          placeholder="Project End Date"
                          data-target="#projectEndDate"
                        />
                        <div
                          className="input-group-append"
                          data-target="#projectEndDate"
                          data-toggle="datetimepicker"
                        >
                          <div className="input-group-text">
                            <i className="fa fa-calendar"></i>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="form-group col-md-6">
                      <label>
                        Select Technologies<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        className="form-control form-control-sm"
                        ref={inputTechnologieReference}
                        value={technologieId}
                        onChange={(e) => setTechnologieId(e.target.value)}
                      >
                        <option value="">--Select--</option>
                        {allTechnologiesList.map((tech) => {
                          return (
                            <option
                              key={"Mana_" + tech.techId}
                              value={tech.techId}
                            >
                              {tech.description}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="form-group col-md-6">
                      <label>
                        Select Project Type<sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        className="custom-select form-control-sm"
                        ref={inputProjectTypeReference}
                        value={projectType}
                        onChange={(e) => setProjectType(e.target.value)}
                      >
                        <option value="">--Select--</option>
                        <option value="Consulting">Consulting</option>
                        <option value="In-House">In-House</option>
                        <option value="Shared-Service">Shared Service</option>
                      </select>
                    </div>
                    <div className="form-group col-md-6">
                      <label>
                        Select Project Status
                        <sup style={{ color: "red" }}>*</sup>
                      </label>
                      <select
                        className="custom-select form-control-sm"
                        ref={inputProjectStatusReference}
                        value={projectStatus}
                        onChange={(e) => setProjectStatus(e.target.value)}
                      >
                        <option value="">--Select--</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="In-BRD Stage">In-BRD Stage</option>
                        <option value="Customer Action">Customer Action</option>
                        <option value="Completed">Completed</option>
                        <option value="Go Live Support">Go Live Support</option>
                        <option value="AMS Support">AMS Support</option>
                        <option value="CR">CR</option>
                        <option value="Hold">Hold</option>
                      </select>
                    </div>
                    <div className="form-group  col-md-12">
                      <label>Project Description</label>
                      <textarea
                        className="form-control form-control-sm"
                        ref={inputProjectDescriptionReference}
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        style={{ resize: "none", minHeight: "45px" }}
                        rows="3"
                        placeholder="Enter Project Description ..."
                      ></textarea>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12 text-sm">
                      <label>Documents Upload</label>
                      <table className="table table-bordered table-sm">
                        <thead>
                          <tr>
                            <th
                              style={{
                                width: "45%",
                                fontWeight: "500",
                                fontSize: "smaller",
                              }}
                            >
                              Document Name
                            </th>
                            <th
                              style={{
                                width: "45%",
                                fontWeight: "500",
                                fontSize: "smaller",
                              }}
                            >
                              Select File
                            </th>
                            <th
                              style={{
                                width: "80px",
                                fontWeight: "500",
                                fontSize: "smaller",
                              }}
                            >
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <div>
                                <input
                                  type="text"
                                  ref={inputProjectAttachmentsNameReference}
                                  value={projectAttachmentsName}
                                  className="form-control form-control-sm"
                                  onChange={(e) =>
                                    setProjectAttachmentsName(e.target.value)
                                  }
                                  id="documnetName"
                                  placeholder="Document Name"
                                />
                              </div>
                            </td>
                            <td>
                              <div>
                                <div className="custom-file">
                                  <input
                                    type="file"
                                    ref={inputProjectAttachmentsFileReference}
                                    className="custom-file-input form-control-sm"
                                    id="customFile"
                                    onChange={(e) => {
                                      ValidateSingleInput(e);
                                    }}
                                  />
                                  <label
                                    className="custom-file-label"
                                    htmlFor="customFile"
                                  >
                                    {selectedAttachmentsFileName}
                                  </label>
                                </div>
                              </div>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-block btn-warning btn-xs"
                                onClick={(e) => {
                                  handleAddNewAttachment(e);
                                }}
                              >
                                Add File
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {projectAttachmentFile.length > 0 ? (
                    <div className="row">
                      <div className="col-md-12 text-sm">
                        <label>Selected Documents</label>
                        <table className="table table-bordered table-sm table-striped">
                          <thead>
                            <tr>
                              <th
                                style={{
                                  width: "10%",
                                  fontWeight: "500",
                                  fontSize: "smaller",
                                }}
                                className="text-center"
                              >
                                Sr. No.
                              </th>
                              <th
                                style={{
                                  fontWeight: "500",
                                  fontSize: "smaller",
                                }}
                              >
                                Attachment Name
                              </th>
                              <th
                                style={{
                                  fontWeight: "500",
                                  fontSize: "smaller",
                                }}
                              >
                                File Name
                              </th>
                              <th
                                style={{
                                  width: "10%",
                                  fontWeight: "500",
                                  fontSize: "smaller",
                                }}
                                className="text-center text-sm"
                              >
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {projectAttachmentFile.map((children, index) => {
                              return (
                                <tr key={index}>
                                  <td
                                    style={{
                                      fontWeight: "400",
                                      fontSize: "smaller",
                                    }}
                                    className="text-center text-sm"
                                  >
                                    {index + 1}
                                  </td>
                                  <td
                                    style={{
                                      fontWeight: "400",
                                      fontSize: "smaller",
                                    }}
                                  >
                                    {children.fileName}
                                  </td>
                                  <td
                                    style={{
                                      fontWeight: "400",
                                      fontSize: "smaller",
                                    }}
                                  >
                                    {children.fileAdded == "New"
                                      ? children.selectedFile.name
                                      : children.selectedFile}
                                  </td>
                                  <td
                                    style={{
                                      fontWeight: "400",
                                      fontSize: "smaller",
                                    }}
                                    className="text-center text-sm"
                                  >
                                    <button
                                      type="button"
                                      className="btn bg-gradient-danger btn-xs"
                                      onClick={(e) => {
                                        handleRemoveAttachment(index);
                                      }}
                                      style={{
                                        padding: "5px",
                                        fontSize: ".75rem",
                                        lineHeight: "0",
                                        borderRadius: ".15rem",
                                      }}
                                    >
                                      <i
                                        className="fas fa-trash"
                                        style={{ fontSize: "smaller" }}
                                      ></i>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div className="card-footer text-sm">
                  {isLoaderActive ? (
                    <PleaseWaitButton className="float-right btn-xs ml-2 font-weight-medium auth-form-btn" />
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-success float-right btn-xs ml-2"
                      onClick={(e) => {
                        handleProjectSubmit(e);
                      }}
                    >
                      Save & Submit
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn btn-default float-right btn-xs"
                    onClick={(e) => {
                      handleCancelClick(e);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <div className="card card-danger card-outline">
                <div className="card-header">
                  <h3 className="card-title text-sm">Projects List</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      id="inActive"
                      onClick={(e) => {
                        handleInActive(e);
                      }}
                    >
                      InActive
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-xs"
                      id="isActive"
                      onClick={(e) => {
                        handleIsActive(e);
                      }}
                      style={{ display: "none" }}
                    >
                      Active
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      id="listOfProjectsHeaderExpandButtion"
                      onClick={(e) => {
                        listOfProjectsHeaderExpandButtionClick(e);
                      }}
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-minus"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="maximize"
                    >
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body text-sm">
                  <div class="table-responsive">
                    <table
                      id="example1"
                      className="table table-bordered table-sm table-striped"
                    >
                      <thead>
                        <tr>
                          <th
                            style={{ fontWeight: "500", fontSize: "smaller" }}
                            className="text-center"
                          >
                            Sr. No.
                          </th>
                          <th
                            style={{ fontWeight: "500", fontSize: "smaller" }}
                          >
                            Project Name
                          </th>
                          <th
                            style={{ fontWeight: "500", fontSize: "smaller" }}
                          >
                            Client Name
                          </th>
                          <th
                            style={{ fontWeight: "500", fontSize: "smaller" }}
                          >
                            Manager Name
                          </th>
                          <th
                            style={{ fontWeight: "500", fontSize: "smaller" }}
                          >
                            Client SPOC
                          </th>
                          <th
                            style={{ fontWeight: "500", fontSize: "smaller" }}
                          >
                            Iteos SPOC
                          </th>
                          <th
                            style={{ fontWeight: "500", fontSize: "smaller" }}
                          >
                            Start Date
                          </th>
                          <th
                            style={{ fontWeight: "500", fontSize: "smaller" }}
                          >
                            End Date
                          </th>
                          <th
                            style={{ fontWeight: "500", fontSize: "smaller" }}
                          >
                            Project Type
                          </th>
                          <th
                            style={{ fontWeight: "500", fontSize: "smaller" }}
                          >
                            Project Status
                          </th>
                          <th
                            style={{ fontWeight: "500", fontSize: "smaller" }}
                          >
                            Description
                          </th>
                          <th
                            style={{ fontWeight: "500", fontSize: "smaller" }}
                          >
                            Documents
                          </th>
                          <th
                            style={{
                              fontWeight: "500",
                              fontSize: "smaller",
                              width: "7%",
                            }}
                          >
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody id="isActiveTrue">
                        {allProjectsList.length > 0
                          ? allProjectsList
                              .filter((proObj) => proObj.isActive === true)
                              .map((proObj, index) => {
                                let projectStatus =
                                  proObj.projectStatus == "In-Progress" ? (
                                    <small className="badge badge-warning">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus ==
                                    "Customer Action" ? (
                                    <small className="badge badge-secondary">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus == "Completed" ? (
                                    <small className="badge badge-success">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus ==
                                    "Go Live Support" ? (
                                    <small className="badge badge-primary">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus == "AMS Support" ? (
                                    <small className="badge badge-primary">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus == "Consulting" ? (
                                    <small className="badge badge-info">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus == "In-BRD Stage" ? (
                                    <small className="badge badge-warning">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus == "CR" ? (
                                    <small className="badge badge-info">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus == "Hold" ? (
                                    <small className="badge badge-danger">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : (
                                    ""
                                  );
                                let getManagerName = allManagesList.find(
                                  (x) => x.managerId == proObj.assignedManagerId
                                );
                                if (getManagerName) {
                                  if ("managerName" in getManagerName) {
                                    getManagerName =
                                      getManagerName.managerFirstName +
                                      " " +
                                      getManagerName.managerLastName;
                                  } else {
                                    getManagerName = "Inactive User";
                                  }
                                } else {
                                  getManagerName = "Inactive User";
                                }

                                let projectTechnologiesName =
                                  allTechnologiesList.find(
                                    (x) =>
                                      x.techId == proObj.projectTechnologies
                                  );
                                if (projectTechnologiesName) {
                                  if (
                                    "description" in projectTechnologiesName
                                  ) {
                                    projectTechnologiesName =
                                      projectTechnologiesName.description;
                                  } else {
                                    projectTechnologiesName = "Not Found";
                                  }
                                } else {
                                  projectTechnologiesName = "Not Found";
                                }

                                return (
                                  <tr key={index}>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                      className="text-center text-sm"
                                    >
                                      {index + 1}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.projectName}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.clientName}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {getManagerName}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.clientSpoc}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.iteosSpoc}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.startDate}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.endDate}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.projectType}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {projectStatus}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.discription}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {cteateAttachmentHTML(proObj.attachments)}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                      className="text-center text-sm"
                                    >
                                      {proObj.isActive == true ? (
                                        <>
                                          <button
                                            type="button"
                                            className="btn bg-gradient-warning btn-xs"
                                            onClick={(e) => {
                                              handleEdutProjectDetails(proObj);
                                            }}
                                            style={{
                                              padding: "5px",
                                              fontSize: ".75rem",
                                              lineHeight: "0",
                                              borderRadius: ".15rem",
                                            }}
                                          >
                                            <i
                                              className="fas fa-pen"
                                              style={{ fontSize: "smaller" }}
                                            ></i>
                                          </button>
                                          <button
                                            type="button"
                                            className="btn bg-gradient-danger btn-xs ml-2"
                                            onClick={(e) => {
                                              handleRemoveProject(proObj);
                                            }}
                                            style={{
                                              padding: "5px",
                                              fontSize: ".75rem",
                                              lineHeight: "0",
                                              borderRadius: ".15rem",
                                            }}
                                          >
                                            <i
                                              className="fas fa-trash"
                                              style={{ fontSize: "smaller" }}
                                            ></i>
                                          </button>
                                        </>
                                      ) : null}
                                    </td>
                                  </tr>
                                );
                              })
                          : ""}
                      </tbody>
                      <tbody id="isActiveFalse" style={{ display: "none" }}>
                        {allProjectsList.length > 0
                          ? allProjectsList
                              .filter((proObj) => proObj.isActive === false)
                              .map((proObj, index) => {
                                let projectStatus =
                                  proObj.projectStatus == "In-Progress" ? (
                                    <small className="badge badge-warning">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus ==
                                    "Customer Action" ? (
                                    <small className="badge badge-secondary">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus == "Completed" ? (
                                    <small className="badge badge-success">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus ==
                                    "Go Live Support" ? (
                                    <small className="badge badge-primary">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus == "AMS Support" ? (
                                    <small className="badge badge-primary">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus == "Consulting" ? (
                                    <small className="badge badge-info">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus == "In-BRD Stage" ? (
                                    <small className="badge badge-warning">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus == "CR" ? (
                                    <small className="badge badge-info">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : proObj.projectStatus == "Hold" ? (
                                    <small className="badge badge-danger">
                                      {proObj.projectStatus}
                                    </small>
                                  ) : (
                                    ""
                                  );
                                let getManagerName = allManagesList.find(
                                  (x) => x.managerId == proObj.assignedManagerId
                                );
                                if (getManagerName) {
                                  if ("managerName" in getManagerName) {
                                    getManagerName =
                                      getManagerName.managerFirstName +
                                      " " +
                                      getManagerName.managerLastName;
                                  } else {
                                    getManagerName = "Inactive User";
                                  }
                                } else {
                                  getManagerName = "Inactive User";
                                }

                                let projectTechnologiesName =
                                  allTechnologiesList.find(
                                    (x) =>
                                      x.techId == proObj.projectTechnologies
                                  );
                                if (projectTechnologiesName) {
                                  if (
                                    "description" in projectTechnologiesName
                                  ) {
                                    projectTechnologiesName =
                                      projectTechnologiesName.description;
                                  } else {
                                    projectTechnologiesName = "Not Found";
                                  }
                                } else {
                                  projectTechnologiesName = "Not Found";
                                }

                                return (
                                  <tr key={index}>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                      className="text-center text-sm"
                                    >
                                      {index + 1}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.projectName}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.clientName}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {getManagerName}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.clientSpoc}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.iteosSpoc}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.startDate}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.endDate}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.projectType}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {projectStatus}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {proObj.discription}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                    >
                                      {cteateAttachmentHTML(proObj.attachments)}
                                    </td>
                                    <td
                                      style={{
                                        fontWeight: "400",
                                        fontSize: "smaller",
                                      }}
                                      className="text-center text-sm"
                                    >
                                      <>
                                        <button
                                          type="button"
                                          className="btn bg-gradient-danger btn-xs ml-2"
                                          onClick={(e) => {
                                            handleActiveProject(proObj);
                                          }}
                                          style={{
                                            padding: "5px",
                                            fontSize: ".75rem",
                                            lineHeight: "0",
                                            borderRadius: ".15rem",
                                          }}
                                        >
                                          <i
                                            className="fas fa-plus"
                                            style={{ fontSize: "smaller" }}
                                          ></i>
                                        </button>
                                      </>
                                    </td>
                                  </tr>
                                );
                              })
                          : ""}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div
        id="confirmCommonModal"
        className="modal fade confirmCommonModal"
        data-backdrop="static"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-confirm">
          <div className="modal-content">
            <div className="modal-header">
              <div className="icon-box">
                <i className="fas fa-info"></i>
              </div>
              <h5 className="modal-title w-100">Are you sure ?</h5>
            </div>
            <div className="modal-body">
              <p className="text-center">
                By clicking on Yes delete all the project details. Once you
                deleted it can not be recovered.
              </p>
            </div>
            <div className="modal-footer col-md-12">
              <button className="btn btn-default btn-sm"  data-bs-dismiss="modal">
                Cancel
              </button>
              {isLoaderActive ? (
                <PleaseWaitButton className="btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn" />
              ) : (
                <button
                  className="btn btn-warning btn-sm pl-3 pr-3 ml-2"
                  onClick={(e) => {
                    yesConfirmSubmitRequest(e);
                  }}
                >
                  Yes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageProjects;
