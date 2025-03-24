import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import PleaseWaitButton from '../../shared/PleaseWaitButton';
import axios from 'axios';
import $ from "jquery";
import Select from 'react-select'; // Import react-select

const config = require('../../services/config.json');


const customStyles = {
  multiValue: (styles) => {
    return {
      ...styles,
      background: '#ff7a59', // Darker gradient background
      color: '#fff', // Ensures text remains visible
      fontSize: '10px', // Smaller font size
      borderRadius: '15px', // Softer rounded corners
      // display: 'inline-block',
      // fontWeight: 'bold', // Makes the text stand out more
      textAlign: 'center',
      padding: '4px 8px', // Adjusted padding for balance with smaller font
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)', // Slightly stronger shadow for more depth
      marginBottom: '4px', // Adjusted margin for spacing
    };
  },
  multiValueLabel: (styles) => ({
    ...styles,
    color: '#fff', // Text color
    fontWeight: 'bold', // Optional: bold text
    fontSize: '10px', // Smaller font size to match multiValue
  }),
  multiValueRemove: (styles) => ({
    ...styles,
    color: '#ffffff', // Color for the remove (X) icon
    ':hover': {
      // backgroundColor: '#ffa500', // Background color when hovering over remove icon
      color: '#fff', // Ensure text remains visible on hover
    },
  }),
};

const ManageRoles = () => {
  const inputRoleNameReference = useRef(null);
  const selectAppsReference = useRef(null);
  const personalInfo = useSelector((state) => state.personalInformationReducer);
  const [roleName, setRoleName] = useState("");
  const [appId, setAppId] = useState([]);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [allRolesList, setAllRolesList] = useState([]);
  const [allAppsList, setAllAppsList] = useState([]);
  const [updateOrDeleteId, setUpdateOrDeleteId] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  // const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    getAllAppsList();
    window.initMultiSelectFuncation();
  }, []);

  const getAllAppsList = () => {
    axios.get(config.API_URL + 'AuthMasterController/GetAllApps', {
      headers: config.headers2,
    }).then((response) => {
      if (response.status === 200) {
        if (response.data.success === "success") {
          if (response.data.data.length > 0) {
            setAllAppsList(response.data.data);
            getAllRolesList();
          }
        } else {
          toast.error(response.data.message);
        }
      } else if (response.data.status.status === 500) {
        toast.error("Invalid username or password");
      }
    }).catch((error) => {
      toast.error("Oops, something went wrong. Please try again later.");
    });
  }

  const getAllRolesList = () => {
    window.initDestroyDataTableFuncation();
    // showLoader();
    axios.get(config.API_URL + 'AuthMasterController/GetAllRoles?ClientId=' + config.clientId, {
      headers: config.headers2,
    }).then((response) => {
      if (response.status == 200) {

        if (response.data.success == "success") {
          if (response.data.data.length > 0) {
            setTimeout(() => {
              window.initDataTableFuncation();
              // hideLoader();
            }, 30)
            setAllRolesList(response.data.data);
          }
        } else {
          setTimeout(() => {
            window.initDataTableFuncation();
          }, 30)
          setAllRolesList([]);

          toast.error(response.data.message);
        }
      } else if (response.data.status.status == 500) {
        toast.error("Invalid username or password");
      }
    }).catch((error) => {
      toast.error("oops something went wrong. please try again later.");
    })
  }
  const addProjectCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  }

  const listOfProjectsHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButton").click();
  }

  const handleEditRoleDetails = (roleObj) => {
    setUpdateOrDeleteId(roleObj.roleID);
    setRoleName(roleObj.roleName);
    const appOptions = roleObj.appIDList.map(appID => ({ value: appID, label: allAppsList.find(app => app.appID === appID)?.appName }));
    setAppId(appOptions);
    listOfProjectsHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleRemoveRole = (roleObj) => {
    setUpdateOrDeleteId(roleObj.roleID);
    window.confirmModalShow();
  }

  const yesConfirmSubmitRequest = () => {

    // showLoader();
    let APIMethodName = 'AuthMasterController/DeleteRole?roleId=' + updateOrDeleteId
    axios.post(config.API_URL + APIMethodName, {
      headers: config.headers2,
    }).then((response) => {

      if (response.data.success == "success") {
        toast.success("Role deleted successfully...");
        window.confirmModalHide();
        clearAllFields();
        getAllAppsList();
        // setIsLoaderActive(false);
        // hideLoader();
      } else {
        // setIsLoaderActive(false);
        // hideLoader();
        toast.error(response.data.message);
      }
    }).catch((error) => {
      if (!error.response.data.success) {
        toast.error(error.response.data.message);
      } else {
        toast.error("oops something went wrong. please try again later.");
      }
      // setIsLoaderActive(false);
      // hideLoader();
    })
  }

  const handleCancelClick = () => {
    clearAllFields();
    addProjectCardHeaderButtonClick();
  }

  const clearAllFields = () => {
    setRoleName("");
    setAppId([]);
    setUpdateOrDeleteId('');
  }

  const handleRoleSubmit = (e) => {
    e.preventDefault();
    if (roleName) {
      if (appId.length > 0) {
        // showLoader();
        let APIMethodName = '';
        let successMessage = '';
        if (updateOrDeleteId !== "") {
          APIMethodName = 'AuthMasterController/UpdateRole';
          successMessage = "Role updated successfully.";
        } else {
          APIMethodName = 'AuthMasterController/CreateRole';
          successMessage = "Role created successfully.";
        }

        axios.post(config.API_URL + APIMethodName, {
          "roleID": updateOrDeleteId,
          "createdBy": personalInfo.userID,
          "clientId": config.clientId,
          "modifiedBy": personalInfo.userID,
          "roleName": roleName,
          "appIDList": appId.map(app => app.value),
          "isActive": true
        }, {
          headers: config.headers2,
        }).then((response) => {
          if (response.data.success === "success") {
            toast.success(successMessage);
            clearAllFields();
            addProjectCardHeaderButtonClick();
            getAllRolesList();
            // hideLoader();
          } else {
            // hideLoader();
            toast.error(response.data.message);
          }
        }).catch((error) => {
          if (!error.response.data.success) {
            toast.error(error.response.data.message);
          } else {
            toast.error("Oops, something went wrong. Please try again later.");
          }
          // hideLoader();
        });
      } else {
        toast.error("Select apps.");
        selectAppsReference.current.focus();
        selectAppsReference.current.classList.add('is-invalid');
      }
    } else {
      toast.error("Please enter role name.");
      inputRoleNameReference.current.focus();
      inputRoleNameReference.current.classList.add('is-invalid');
    }
  }

  const createAttachmentHTML = (appArray) => {
    if (appArray.length > 0) {
      return appArray.map((appID, index) => {
        const appName = allAppsList.find(x => x.appID === appID);
        return (<small key={index} className="badge-custom mr-1"> {appName?.appName}</small>);
      });
    }
  }



  const appOptions = allAppsList.map(app => ({ value: app.appID, label: app.appName }));

  return (
    <>
      <section className="content scroll-content">

        <div className='row'>
          <div className="col-md-12">
            <div className="card ">
              <div className="card-header">
                <h3 className="card-title text-sm">Create New Role</h3>
              </div>
              <div className="card-body text-sm">
                <div className='row'>
                  <div className="form-group col-md-6">
                    <label htmlFor="userRoleNameInput">Role Name<sup style={{ color: "red" }}>*</sup></label>
                    <input
                      type="text"
                      className="form-control form-control-md"
                      id="userRoleNameInput"
                      ref={inputRoleNameReference}
                      value={roleName}
                      disabled
                      onChange={(e) => setRoleName(e.target.value)}
                      placeholder="Role Name"
                    />
                  </div>
                  <div className="form-group col-md-6">
                    <label>Select Apps<sup style={{ color: "red" }}>*</sup></label>
                    <Select
                      isMulti
                      options={appOptions}
                      className="roles-custom-select" // Add custom class here
                      value={appId}
                      onChange={(selectedOptions) => setAppId(selectedOptions || [])}
                      ref={selectAppsReference}
                      placeholder="Select Apps.."
                      styles={customStyles}
                    />
                  </div>

                </div>
                <div className="card-footer mt-3">

                  <button
                    type="submit"
                    className="custom-success-button mr-2 "
                    onClick={(e) => {
                      handleRoleSubmit(e);
                    }}
                  >
                    {updateOrDeleteId ? 'Update & Submit' : 'Save & Submit'}
                  </button>

                  {/* } */}
                  <button type="submit" className="custom-secondary-button" onClick={(e) => { handleCancelClick(e) }}>Cancel</button>
                </div>
              </div>

            </div>
          </div>
        </div>
        <div className='row'>
          <div className="col-md-12">
            <div className="card ">
              <div className="card-header">
                <h3 className="card-title ">Roles List ( {allRolesList.length} )</h3>

              </div>
              <div className="card-body table-container" >
                <table
                  id="example1"
                  className="improved-table"
                >
                  <thead>
                    <tr>
                      <th >Sr. No.</th>
                      <th >Role Name</th>
                      <th >App Names</th>
                      <th className="sticky-action">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allRolesList.length > 0 ?
                      allRolesList.map((roleObj, index) => {
                        return (
                          <tr>
                            <td  >{index + 1}</td>
                            <td >{roleObj.roleName}</td>
                            <td >{createAttachmentHTML(roleObj.appIDList)}</td>
                            <td className="sticky-action">
                              <button type="button" className="custom-success-button mr-2" onClick={(e) => { handleEditRoleDetails(roleObj) }} >
                                <i className="fas fa-pen" ></i>
                              </button>
                              <button type="button" disabled className="custom-primary-button" style={{ backgroundColor: 'gray' }} onClick={(e) => { handleRemoveRole(roleObj) }} >
                                <i className="fas fa-trash"></i>
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
              <p class="text-center">By clicking on Yes delete all the role details. Once you deleted it can not be recovered.</p>
            </div>
            <div class="modal-footer col-md-12">
              <button class="btn btn-default btn-sm" data-dismiss="modal">Cancel</button>
              {isLoaderActive ? <PleaseWaitButton className='btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn' /> :
                <button class="btn btn-warning btn-sm pl-3 pr-3 ml-2" onClick={(e) => { yesConfirmSubmitRequest(e) }}>Yes</button>
              }

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageRoles;
