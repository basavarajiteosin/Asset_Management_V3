// import React, { useRef, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { removeExtraSpaces } from "../../common/textOperations";
// import { isValidEmail, isValidContact } from "../../common/validations";
// import { toast } from "react-toastify";
// import { getFirstTwoLetters } from "../../common/textOperations";
// import PleaseWaitButton from "../../shared/PleaseWaitButton";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import $ from "jquery";

// const config = require("../../services/config.json");

// const ManagerAndUserMapping = () => {
//   const inputRoleNameReference = useRef(null);
//   const inputSelectSalesUsersReference = useRef(null);
//   const inputManagerIdReference = useRef(null);

//   const personalInfo = useSelector((state) => state.personalInformationReducer);

//   const [salesUserId, setSalesUserId] = useState("");
//   const [isLoaderActive, setIsLoaderActive] = useState(false);
//   const [allManagerUserMapsList, setAllManagerUserMapsList] = useState([]);
//   const [allManagesList, setAllManagesList] = useState([]);
//   const [managerId, setManagerId] = useState("");
//   const [updateOrDeleteId, setUpdateOrDeleteId] = useState(false);
//   const [allUsersList, setAllUsersList] = useState([]);

//   useEffect(() => {
//     getAllManagerList();
//     getUsersList();
//     window.initMultiSelectFuncation();
//   }, []);

//   const getUsersList = () => {
//     axios
//       .get(
//         config.API_URL +
//           "AuthMasterController/GetAllUsers?ClientId=" +
//           config.clientId,
//         {
//           headers: config.headers2,
//         }
//       )
//       .then((response) => {
//         if (response.status == 200) {
//           if (response.data.success == "success") {
//             if (response.data.data.length > 0) {
//               // console.log("Users List", response.data.data);
//               setAllUsersList(response.data.data);
//               GetAllManagerUserMaps();
//             }
//           } else {
//             toast.error(response.data.message, config.tostar_config);
//           }
//         } else if (response.data.status.status == 500) {
//           toast.error("oops something went wrong.", config.tostar_config);
//         }
//       })
//       .catch((error) => {
//         toast.error("Please try again later.", config.tostar_config);
//       });
//   };

//   const getAllManagerList = () => {
//     axios
//       .get(
//         config.API_URL +
//           "AuthMasterController/GetAllManagerUsers?ClientId=" +
//           config.clientId,
//         {
//           headers: config.headers2,
//         }
//       )
//       .then((response) => {
//         if (response.status == 200) {
//           if (response.data.success == "success") {
//             // console.log("manager--->", response.data.data);
//             if (response.data.data.length > 0) {
//               let tempArray = [];
//               response.data.data.map((manager) => {
//                 if (manager.accountGroup == "Sales and Marketing Team") {
//                   let tempObj = {
//                     managerId: manager.userID,
//                     managerName: manager.userName,
//                     managerFirstName: manager.firstName,
//                     managerLastName: manager.lastName,
//                     managerStatus: manager.isActive,
//                   };
//                   tempArray.push(tempObj);
//                 }
//               });
//               setAllManagesList(tempArray);
//             }
//           } else {
//             toast.error(response.data.message, config.tostar_config);
//           }
//         } else if (response.data.status.status == 500) {
//           toast.error("Invalid username or password", config.tostar_config);
//         }
//       })
//       .catch((error) => {
//         toast.error("Please try again later.", config.tostar_config);
//       });
//   };

//   const GetAllManagerUserMaps = () => {
//     window.initDestroyDataTableFuncation();
//     axios
//       .get(config.API_URL + "EmailCofigureController/GetAllManagerUserMaps", {
//         headers: config.headers2,
//       })
//       .then((response) => {
//         if (response.status == 200) {
//           // console.log("response.data.data============>", response.data);
//           if (response.data.success == true) {
//             if (response.data.data.length > 0) {
//               setAllManagerUserMapsList(response.data.data);
//               setTimeout(() => {
//                 window.initDataTableFuncation();
//               }, 1000);
//             } else {
//               setAllManagerUserMapsList([]);
//               setTimeout(() => {
//                 window.initDataTableFuncation();
//               }, 1000);
//             }
//           } else {
//             toast.error(response.data.message, config.tostar_config);
//             setTimeout(() => {
//               window.initDataTableFuncation();
//             }, 1000);
//           }
//         } else if (response.data.status.status == 500) {
//           toast.error("Invalid username or password", config.tostar_config);
//         }
//       })
//       .catch((error) => {
//         toast.error("Please try again later.", config.tostar_config);
//       });
//   };

//   const addProjectCardHeaderButtonClick = () => {
//     $("#listOfProjectsHeaderExpandButtion").click();
//   };

//   const listOfProjectsHeaderExpandButtionClick = () => {
//     $("#AddNewHeaderButton").click();
//   };

//   const handleEditMappingDetails = (roleObj) => {
//     // console.log("roleObj-->", roleObj);
//     setUpdateOrDeleteId(true);
//     let getAppListArray = roleObj.userID.toLowerCase().split(",");
//     setManagerId(roleObj.managerID);
//     window.assignValueToSelect2(getAppListArray);
//     listOfProjectsHeaderExpandButtionClick();
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleRemoveRole = (roleObj) => {
//     setUpdateOrDeleteId(roleObj.managerID);
//     window.confirmModalShow();
//   };

//   const yesConfirmSubmitRequest = () => {
//     setIsLoaderActive(true);
//     let APIMethodName =
//       "EmailCofigureController/DeleteManagerUserMap?managerId=" +
//       updateOrDeleteId;
//     axios
//       .post(config.API_URL + APIMethodName, {
//         headers: config.headers2,
//       })
//       .then((response) => {
//         // console.log(response);
//         if (response.data.success == true) {
//           GetAllManagerUserMaps();
//           toast.success("Deleted successfully...", config.tostar_config);
//           window.confirmModalHide();
//           clearAllFields();
//           setIsLoaderActive(false);
//         } else {
//           setIsLoaderActive(false);
//           toast.error(response.data.message, config.tostar_config);
//         }
//       })
//       .catch((error) => {
//         if (!error.response.data.success) {
//           toast.error(error.response.data.message, config.tostar_config);
//         } else {
//           toast.error("Please try again later.", config.tostar_config);
//         }
//         setIsLoaderActive(false);
//       });
//   };

//   const handleCancelClick = () => {
//     clearAllFields();
//     addProjectCardHeaderButtonClick();
//   };

//   const clearAllFields = () => {
//     setManagerId("");
//     $(".select2").val("");
//     window.assignValueToSelect2([]);
//     setUpdateOrDeleteId(false);
//   };

//   const handleRoleSubmit = (e) => {
//     let getAllSelectedApps = $(".select2").val();
//     if (managerId) {
//       if (getAllSelectedApps) {
//         setIsLoaderActive(false);
//         let APIMethodName = "";
//         if (updateOrDeleteId == true) {
//           APIMethodName = "EmailCofigureController/UpdateManagerUserMap";
//         } else {
//           APIMethodName = "EmailCofigureController/CreateManagerUserMap";
//         }

//         axios
//           .post(
//             config.API_URL + APIMethodName,
//             {
//               managerID: managerId,
//               userID: getAllSelectedApps.toString(),
//               createdBy: personalInfo.userID,
//             },
//             {
//               headers: config.headers2,
//             }
//           )
//           .then((response) => {
//             // console.log(response);
//             if (response.data.success == true) {
//               toast.success(
//                 "Asset User Mapped Successfully...",
//                 config.tostar_config
//               );
//               clearAllFields();
//               addProjectCardHeaderButtonClick();
//               GetAllManagerUserMaps();
//               setIsLoaderActive(false);
//             } else {
//               setIsLoaderActive(false);
//               toast.error(response.data.message, config.tostar_config);
//             }
//           })
//           .catch((error) => {
//             if (!error.response.data.success) {
//               toast.error(error.response.data.message);
//             } else {
//               toast.error("Please try again later.", config.tostar_config);
//             }
//             setIsLoaderActive(false);
//           });
//       } else {
//         toast.error("Select atleast one user.", config.tostar_config);
//         inputSelectSalesUsersReference.current.focus();
//         inputSelectSalesUsersReference.current.classList.add("is-invalid");
//       }
//     } else {
//       toast.error("Please select manager.", config.tostar_config);
//       inputManagerIdReference.current.focus();
//       inputManagerIdReference.current.classList.add("is-invalid");
//     }
//   };

//   const cteateAttachmentHTML = (appArray) => {
//     if (appArray.length > 0) {
//       return appArray.map((appID, index) => {
//         let getEmaployeeName = allUsersList.find(
//           (x) => x.userID === appID.toLowerCase()
//         );
//         return (
//           <small className="badge badge-warning p-1 mt-1 ml-1">
//             {" "}
//             {getEmaployeeName.firstName} {getEmaployeeName.lastName}
//           </small>
//         );
//       });
//     }
//   };

//   return (
//     <>
//       {/* <div className="content-header">
       
//       </div> */}

//       <section className="content pt-3">
        
//               <div className="card">
//                 <div className="card-header">
//                   <h3 className="card-title text-sm">Create New Mapping</h3>
                
//                 </div>
//                 <div className="card-body text-sm">
//                   <div className="row">
//                     <div className="form-group col-md-6">
//                       <label>
//                         Select Manager<sup style={{ color: "red" }}>*</sup>
//                       </label>
//                       <select
//                         className="form-control form-control-sm"
//                         ref={inputManagerIdReference}
//                         value={managerId}
//                         onChange={(e) => setManagerId(e.target.value)}
//                       >
//                         <option value="">--Select--</option>
//                         {allManagesList
//                           .filter((manager) => manager.managerStatus === true)
//                           .map((manager) => {
//                             return (
//                               <option
//                                 key={"Mana_" + manager.managerId}
//                                 value={manager.managerId}
//                               >
//                                 {manager.managerFirstName}{" "}
//                                 {manager.managerLastName}
//                               </option>
//                             );
//                           })}
//                       </select>
//                     </div>
//                     <div className="form-group col-md-6">
//                       <label>
//                         Select Users<sup style={{ color: "red" }}>*</sup>
//                       </label>
//                       <select
//                         className="select2 "
//                         multiple="multiple"
//                         data-placeholder="Select Users.."
//                         style={{ width: "100%" }}
//                         ref={inputSelectSalesUsersReference}
//                         value={salesUserId}
//                         onChange={(e) => setSalesUserId(e.target.value)}
//                       >
//                         <option value="">--Select--</option>
//                         {allUsersList
//                           .filter((techObj) => techObj.isActive === true)
//                           .map((techObj, index) => {
//                             if (
//                               techObj.accountGroup === "Sales and Marketing Team"
//                             ) {
//                               return (
//                                 <option
//                                   key={
//                                     "Mana_" + techObj.userID + "~index" + index
//                                   }
//                                   value={techObj.userID}
//                                 >
//                                   {techObj.firstName} {techObj.lastName}
//                                 </option>
//                               );
//                             }
//                           })}
//                       </select>
//                     </div>
//                   </div>
//                   <div className="card-footer mt-2">
                  
//                     <button
//                       type="submit"
//                       className="custom-success-button mr-2"
//                       onClick={(e) => {
//                         handleRoleSubmit(e);
//                       }}
//                     >
//                       Save & Submit
//                     </button>
                
//                   <button
//                     type="submit"
//                     className="custom-secondary-button"
//                     onClick={(e) => {
//                       handleCancelClick(e);
//                     }}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//                 </div>
          
//               </div>
            

//             <div className="content">
//               <div className="card">
//                 <div className="card-header">
//                   <h3 className="card-title text-sm">
//                     Manager Mapping List ( {allManagerUserMapsList.length} )
//                   </h3>
             
//                 </div>
//                 <div className="card-body table-container">
//                   <table
//                     id="example1"
//                     className="improved-normal-table"
//                   >
//                     <thead>
//                       <tr>
//                         <th
                          
//                         >
//                           Sr. No.
//                         </th>
//                         <th >
//                           Manager Name
//                         </th>
//                         <th >
//                           Sales Person Names
//                         </th>
//                         <th
                          
//                         >
//                           Action
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {allManagerUserMapsList.length > 0
//                         ? allManagerUserMapsList
//                             // .filter((roleObj) => roleObj.isActive === true)
//                             .map((roleObj, index) => {
//                               let getManagerName = allUsersList.find(
//                                 (x) =>
//                                   x.userID == roleObj.managerID.toLowerCase()
//                               );

//                               return (
//                                 <tr key={index}>
//                                   <td
                                    
//                                   >
//                                     {index + 1}
//                                   </td>
//                                   <td
                                    
//                                   >
//                                     {getManagerName.firstName}{" "}
//                                     {getManagerName.lastName}
//                                   </td>
//                                   <td
                                    
//                                   >
//                                     {cteateAttachmentHTML(
//                                       roleObj.userID.split(",")
//                                     )}
//                                   </td>
//                                   <td
                                   
//                                   >
//                                     <button
//                                       type="button"
//                                       className="custom-success-button mr-2"
//                                       onClick={(e) => {
//                                         handleEditMappingDetails(roleObj);
//                                       }}
                                     
//                                     >
//                                       <i
//                                         className="fas fa-pen"
                                       
//                                       ></i>
//                                     </button>
//                                     <button
//                                       type="button"
//                                       className="custom-primary-button"
//                                       onClick={(e) => {
//                                         handleRemoveRole(roleObj);
//                                       }}
                                     
//                                     >
//                                       <i
//                                         className="fas fa-trash"
                                        
//                                       ></i>
//                                     </button>
//                                   </td>
//                                 </tr>
//                               );
//                             })
//                         : ""}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>
//             </div>
   
  
//       </section>

//       <div
//         id="confirmCommonModal"
//         class="modal fade confirmCommonModal"
//         data-backdrop="static"
//         tabIndex="-1"
//         role="dialog"
//         aria-labelledby="staticBackdropLabel"
//         aria-hidden="true"
//       >
//         <div class="modal-dialog modal-confirm">
//           <div class="modal-content">
//             <div class="modal-header">
//               <div class="icon-box">
//                 <i class="fas fa-info"></i>
//               </div>
//               <h5 class="modal-title w-100">Are you sure ?</h5>
//             </div>
//             <div class="modal-body">
//               <p class="text-center">
//                 By clicking on Yes delete all the mapping details. Once you
//                 deleted it can not be recovered.
//               </p>
//             </div>
//             <div class="modal-footer col-md-12">
//               <button class="btn btn-default btn-sm"  data-bs-dismiss="modal">
//                 Cancel
//               </button>
//               {isLoaderActive ? (
//                 <PleaseWaitButton className="btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn" />
//               ) : (
//                 <button
//                   class="btn btn-warning btn-sm pl-3 pr-3 ml-2"
//                   onClick={(e) => {
//                     yesConfirmSubmitRequest(e);
//                   }}
//                 >
//                   Yes
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default ManagerAndUserMapping;


// import { useRef, useEffect, useState } from "react"
// import { useSelector } from "react-redux"
// import { toast } from "react-toastify"
// import PleaseWaitButton from "../../shared/PleaseWaitButton"
// import axios from "axios"
// import $ from "jquery"

// const config = require("../../services/config.json")

// const ManagerAndUserMapping = () => {
//   const inputRoleNameReference = useRef(null)
//   const inputSelectSalesUsersReference = useRef(null)
//   const inputManagerIdReference = useRef(null)

//   const personalInfo = useSelector((state) => state.personalInformationReducer)

//   const [salesUserId, setSalesUserId] = useState("")
//   const [isLoaderActive, setIsLoaderActive] = useState(false)
//   const [allManagerUserMapsList, setAllManagerUserMapsList] = useState([])
//   const [allManagesList, setAllManagesList] = useState([])
//   const [managerId, setManagerId] = useState("")
//   const [updateOrDeleteId, setUpdateOrDeleteId] = useState(false)
//   const [allUsersList, setAllUsersList] = useState([])

//   useEffect(() => {
//     getAllManagerList()
//     getUsersList()
//     window.initMultiSelectFuncation()
//   }, [])

//   const getUsersList = () => {
//     axios
//       .get(config.API_URL + "AuthMasterController/GetAllUsers?ClientId=" + config.clientId, {
//         headers: config.headers2,
//       })
//       .then((response) => {
//         if (response.status == 200) {
//           if (response.data.success == "success") {
//             if (response.data.data.length > 0) {
//               // console.log("Users List", response.data.data);
//               setAllUsersList(response.data.data)
//               GetAllManagerUserMaps()
//             }
//           } else {
//             toast.error(response.data.message, config.tostar_config)
//           }
//         } else if (response.data.status.status == 500) {
//           toast.error("oops something went wrong.", config.tostar_config)
//         }
//       })
//       .catch((error) => {
//         toast.error("Please try again later.", config.tostar_config)
//       })
//   }

//   const getAllManagerList = () => {
//     axios
//       .get(config.API_URL + "AuthMasterController/GetAllManagerUsers?ClientId=" + config.clientId, {
//         headers: config.headers2,
//       })
//       .then((response) => {
//         if (response.status == 200) {
//           if (response.data.success == "success") {
//             // console.log("manager--->", response.data.data);
//             if (response.data.data.length > 0) {
//               const tempArray = []
//               response.data.data.map((manager) => {
//                 if (manager.accountGroup == "Sales and Marketing Team") {
//                   const tempObj = {
//                     managerId: manager.userID,
//                     managerName: manager.userName,
//                     managerFirstName: manager.firstName,
//                     managerLastName: manager.lastName,
//                     managerStatus: manager.isActive,
//                   }
//                   tempArray.push(tempObj)
//                 }
//               })
//               setAllManagesList(tempArray)
//             }
//           } else {
//             toast.error(response.data.message, config.tostar_config)
//           }
//         } else if (response.data.status.status == 500) {
//           toast.error("Invalid username or password", config.tostar_config)
//         }
//       })
//       .catch((error) => {
//         toast.error("Please try again later.", config.tostar_config)
//       })
//   }

//   const GetAllManagerUserMaps = () => {
//     window.initDestroyDataTableFuncation()
//     axios
//       .get(config.API_URL + "EmailCofigureController/GetAllManagerUserMaps", {
//         headers: config.headers2,
//       })
//       .then((response) => {
//         if (response.status == 200) {
//           // console.log("response.data.data============>", response.data);
//           if (response.data.success == true) {
//             if (response.data.data.length > 0) {
//               setAllManagerUserMapsList(response.data.data)
//               setTimeout(() => {
//                 window.initDataTableFuncation()
//               }, 1000)
//             } else {
//               setAllManagerUserMapsList([])
//               setTimeout(() => {
//                 window.initDataTableFuncation()
//               }, 1000)
//             }
//           } else {
//             toast.error(response.data.message, config.tostar_config)
//             setTimeout(() => {
//               window.initDataTableFuncation()
//             }, 1000)
//           }
//         } else if (response.data.status.status == 500) {
//           toast.error("Invalid username or password", config.tostar_config)
//         }
//       })
//       .catch((error) => {
//         toast.error("Please try again later.", config.tostar_config)
//       })
//   }

//   const addProjectCardHeaderButtonClick = () => {
//     $("#listOfProjectsHeaderExpandButtion").click()
//   }

//   const listOfProjectsHeaderExpandButtionClick = () => {
//     $("#AddNewHeaderButton").click()
//   }

//   const handleEditMappingDetails = (roleObj) => {
//     // console.log("roleObj-->", roleObj);
//     setUpdateOrDeleteId(true)
//     const getAppListArray = roleObj.userID.toLowerCase().split(",")
//     setManagerId(roleObj.managerID)
//     window.assignValueToSelect2(getAppListArray)
//     listOfProjectsHeaderExpandButtionClick()
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   }

//   const handleRemoveRole = (roleObj) => {
//     setUpdateOrDeleteId(roleObj.managerID)
//     window.confirmModalShow()
//   }

//   const yesConfirmSubmitRequest = () => {
//     setIsLoaderActive(true)
//     const APIMethodName = "EmailCofigureController/DeleteManagerUserMap?managerId=" + updateOrDeleteId
//     axios
//       .post(config.API_URL + APIMethodName, {
//         headers: config.headers2,
//       })
//       .then((response) => {
//         // console.log(response);
//         if (response.data.success == true) {
//           GetAllManagerUserMaps()
//           toast.success("Deleted successfully...", config.tostar_config)
//           window.confirmModalHide()
//           clearAllFields()
//           setIsLoaderActive(false)
//         } else {
//           setIsLoaderActive(false)
//           toast.error(response.data.message, config.tostar_config)
//         }
//       })
//       .catch((error) => {
//         if (!error.response.data.success) {
//           toast.error(error.response.data.message, config.tostar_config)
//         } else {
//           toast.error("Please try again later.", config.tostar_config)
//         }
//         setIsLoaderActive(false)
//       })
//   }

//   const handleCancelClick = () => {
//     clearAllFields()
//     addProjectCardHeaderButtonClick()
//   }

//   const clearAllFields = () => {
//     setManagerId("")
//     $(".select2").val("")
//     window.assignValueToSelect2([])
//     setUpdateOrDeleteId(false)
//   }

//   const handleRoleSubmit = (e) => {
//     const getAllSelectedApps = $(".select2").val()
//     if (managerId) {
//       if (getAllSelectedApps) {
//         setIsLoaderActive(false)
//         let APIMethodName = ""
//         if (updateOrDeleteId == true) {
//           APIMethodName = "EmailCofigureController/UpdateManagerUserMap"
//         } else {
//           APIMethodName = "EmailCofigureController/CreateManagerUserMap"
//         }

//         axios
//           .post(
//             config.API_URL + APIMethodName,
//             {
//               managerID: managerId,
//               userID: getAllSelectedApps.toString(),
//               createdBy: personalInfo.userID,
//             },
//             {
//               headers: config.headers2,
//             },
//           )
//           .then((response) => {
//             // console.log(response);
//             if (response.data.success == true) {
//               toast.success("Asset User Mapped Successfully...", config.tostar_config)
//               clearAllFields()
//               addProjectCardHeaderButtonClick()
//               GetAllManagerUserMaps()
//               setIsLoaderActive(false)
//             } else {
//               setIsLoaderActive(false)
//               toast.error(response.data.message, config.tostar_config)
//             }
//           })
//           .catch((error) => {
//             if (!error.response.data.success) {
//               toast.error(error.response.data.message)
//             } else {
//               toast.error("Please try again later.", config.tostar_config)
//             }
//             setIsLoaderActive(false)
//           })
//       } else {
//         toast.error("Select atleast one user.", config.tostar_config)
//         inputSelectSalesUsersReference.current.focus()
//         inputSelectSalesUsersReference.current.classList.add("is-invalid")
//       }
//     } else {
//       toast.error("Please select manager.", config.tostar_config)
//       inputManagerIdReference.current.focus()
//       inputManagerIdReference.current.classList.add("is-invalid")
//     }
//   }

//   const cteateAttachmentHTML = (appArray) => {
//     if (appArray.length > 0) {
//       return appArray.map((appID, index) => {
//         const getEmaployeeName = allUsersList.find((x) => x.userID === appID.toLowerCase())
//         return (
//           <small className="badge badge-warning p-1 mt-1 ml-1">
//             {" "}
//             {getEmaployeeName?.firstName || ""} {getEmaployeeName?.lastName || ""}
//           </small>
//         )
//       })
//     }
//   }

//   return (
//     <>
//       {/* <div className="content-header">
       
//       </div> */}

//       <section className="content pt-3">
//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title text-sm">Create New Mapping</h3>
//           </div>
//           <div className="card-body text-sm">
//             <div className="row">
//               <div className="form-group col-md-6">
//                 <label>
//                   Select Manager<sup style={{ color: "red" }}>*</sup>
//                 </label>
//                 <select
//                   className="form-control form-control-sm"
//                   ref={inputManagerIdReference}
//                   value={managerId}
//                   onChange={(e) => setManagerId(e.target.value)}
//                 >
//                   <option value="">--Select--</option>
//                   {allManagesList
//                     .filter((manager) => manager.managerStatus === true)
//                     .map((manager) => {
//                       return (
//                         <option key={"Mana_" + manager.managerId} value={manager.managerId}>
//                           {manager.managerFirstName || ""} {manager.managerLastName || ""}
//                         </option>
//                       )
//                     })}
//                 </select>
//               </div>
//               <div className="form-group col-md-6">
//                 <label>
//                   Select Users<sup style={{ color: "red" }}>*</sup>
//                 </label>
//                 <select
//                   className="select2 "
//                   multiple="multiple"
//                   data-placeholder="Select Users.."
//                   style={{ width: "100%" }}
//                   ref={inputSelectSalesUsersReference}
//                   value={salesUserId}
//                   onChange={(e) => setSalesUserId(e.target.value)}
//                 >
//                   <option value="">--Select--</option>
//                   {allUsersList
//                     .filter((techObj) => techObj.isActive === true)
//                     .map((techObj, index) => {
//                       if (techObj.accountGroup === "Sales and Marketing Team") {
//                         return (
//                           <option key={"Mana_" + techObj.userID + "~index" + index} value={techObj.userID}>
//                             {techObj.firstName || ""} {techObj.lastName || ""}
//                           </option>
//                         )
//                       }
//                     })}
//                 </select>
//               </div>
//             </div>
//             <div className="card-footer mt-2">
//               <button
//                 type="submit"
//                 className="custom-success-button mr-2"
//                 onClick={(e) => {
//                   handleRoleSubmit(e)
//                 }}
//               >
//                 Save & Submit
//               </button>

//               <button
//                 type="submit"
//                 className="custom-secondary-button"
//                 onClick={(e) => {
//                   handleCancelClick(e)
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="content">
//           <div className="card">
//             <div className="card-header">
//               <h3 className="card-title text-sm">Manager Mapping List ( {allManagerUserMapsList.length} )</h3>
//             </div>
//             <div className="card-body table-container">
//               <table id="example1" className="improved-normal-table">
//                 <thead>
//                   <tr>
//                     <th>Sr. No.</th>
//                     <th>Manager Name</th>
//                     <th>Sales Person Names</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {allManagerUserMapsList.length > 0
//                     ? allManagerUserMapsList
//                         // .filter((roleObj) => roleObj.isActive === true)
//                         .map((roleObj, index) => {
//                           const getManagerName = allUsersList.find((x) => x.userID == roleObj.managerID.toLowerCase())

//                           return (
//                             <tr key={index}>
//                               <td>{index + 1}</td>
//                               <td>
//                                 {getManagerName?.firstName || ""} {getManagerName?.lastName || ""}
//                               </td>
//                               <td>{cteateAttachmentHTML(roleObj.userID.split(","))}</td>
//                               <td>
//                                 <button
//                                   type="button"
//                                   className="custom-success-button mr-2"
//                                   onClick={(e) => {
//                                     handleEditMappingDetails(roleObj)
//                                   }}
//                                 >
//                                   <i className="fas fa-pen"></i>
//                                 </button>
//                                 <button
//                                   type="button"
//                                   className="custom-primary-button"
//                                   onClick={(e) => {
//                                     handleRemoveRole(roleObj)
//                                   }}
//                                 >
//                                   <i className="fas fa-trash"></i>
//                                 </button>
//                               </td>
//                             </tr>
//                           )
//                         })
//                     : ""}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </section>

//       <div
//         id="confirmCommonModal"
//         class="modal fade confirmCommonModal"
//         data-backdrop="static"
//         tabIndex="-1"
//         role="dialog"
//         aria-labelledby="staticBackdropLabel"
//         aria-hidden="true"
//       >
//         <div class="modal-dialog modal-confirm">
//           <div class="modal-content">
//             <div class="modal-header">
//               <div class="icon-box">
//                 <i class="fas fa-info"></i>
//               </div>
//               <h5 class="modal-title w-100">Are you sure ?</h5>
//             </div>
//             <div class="modal-body">
//               <p class="text-center">
//                 By clicking on Yes delete all the mapping details. Once you deleted it can not be recovered.
//               </p>
//             </div>
//             <div class="modal-footer col-md-12">
//               <button class="btn btn-default btn-sm" data-bs-dismiss="modal">
//                 Cancel
//               </button>
//               {isLoaderActive ? (
//                 <PleaseWaitButton className="btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn" />
//               ) : (
//                 <button
//                   class="btn btn-warning btn-sm pl-3 pr-3 ml-2"
//                   onClick={(e) => {
//                     yesConfirmSubmitRequest(e)
//                   }}
//                 >
//                   Yes
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default ManagerAndUserMapping


// import { useRef, useEffect, useState } from "react"
// import { useSelector } from "react-redux"
// import { toast } from "react-toastify"
// import PleaseWaitButton from "../../shared/PleaseWaitButton"
// import axios from "axios"
// import $ from "jquery"

// const config = require("../../services/config.json")

// const ManagerAndUserMapping = () => {
//   const inputRoleNameReference = useRef(null)
//   const inputSelectSalesUsersReference = useRef(null)
//   const inputManagerIdReference = useRef(null)

//   const personalInfo = useSelector((state) => state.personalInformationReducer)

//   const [salesUserId, setSalesUserId] = useState("")
//   const [isLoaderActive, setIsLoaderActive] = useState(false)
//   const [allManagerUserMapsList, setAllManagerUserMapsList] = useState([])
//   const [allManagesList, setAllManagesList] = useState([])
//   const [managerId, setManagerId] = useState("")
//   const [updateOrDeleteId, setUpdateOrDeleteId] = useState(false)
//   const [allUsersList, setAllUsersList] = useState([])

//   useEffect(() => {
//     getAllManagerList()
//     getUsersList()
//     window.initMultiSelectFuncation()
//   }, [])

//   const getUsersList = () => {
//     axios
//       .get(config.API_URL + "AuthMasterController/GetAllUsers?ClientId=" + config.clientId, {
//         headers: config.headers2,
//       })
//       .then((response) => {
//         if (response.status == 200) {
//           if (response.data.success == "success") {
//             if (response.data.data.length > 0) {
//               // console.log("Users List", response.data.data);
//               setAllUsersList(response.data.data)
//               GetAllManagerUserMaps()
//             }
//           } else {
//             toast.error(response.data.message, config.tostar_config)
//           }
//         } else if (response.data.status.status == 500) {
//           toast.error("oops something went wrong.", config.tostar_config)
//         }
//       })
//       .catch((error) => {
//         toast.error("Please try again later.", config.tostar_config)
//       })
//   }

//   const getAllManagerList = () => {
//     axios
//       .get(config.API_URL + "AuthMasterController/GetAllManagerUsers?ClientId=" + config.clientId, {
//         headers: config.headers2,
//       })
//       .then((response) => {
//         if (response.status == 200) {
//           if (response.data.success == "success") {
//             // console.log("manager--->", response.data.data);
//             if (response.data.data.length > 0) {
//               const tempArray = []
//               response.data.data.map((manager) => {
//                 if (manager.accountGroup == "Sales and Marketing Team") {
//                   const tempObj = {
//                     managerId: manager.userID,
//                     managerName: manager.userName,
//                     managerFirstName: manager.firstName,
//                     managerLastName: manager.lastName,
//                     managerStatus: manager.isActive,
//                   }
//                   tempArray.push(tempObj)
//                 }
//               })
//               setAllManagesList(tempArray)
//             }
//           } else {
//             toast.error(response.data.message, config.tostar_config)
//           }
//         } else if (response.data.status.status == 500) {
//           toast.error("Invalid username or password", config.tostar_config)
//         }
//       })
//       .catch((error) => {
//         toast.error("Please try again later.", config.tostar_config)
//       })
//   }

//   const GetAllManagerUserMaps = () => {
//     window.initDestroyDataTableFuncation()
//     axios
//       .get(config.API_URL + "EmailCofigureController/GetAllManagerUserMaps", {
//         headers: config.headers2,
//       })
//       .then((response) => {
//         if (response.status === 200 && response.data.success) {
//           setAllManagerUserMapsList(response.data.data)
//           setTimeout(() => {
//             window.initDataTableFuncation()
//           }, 1000)
//         } else {
//           toast.error(response.data.message || "Failed to fetch manager user maps", config.tostar_config)
//           setAllManagerUserMapsList([])
//         }
//       })
//       .catch((error) => {
//         console.error("Error fetching manager user maps:", error)
//         toast.error("Please try again later.", config.tostar_config)
//         setAllManagerUserMapsList([])
//       })
//       .finally(() => {
//         setTimeout(() => {
//           window.initDataTableFuncation()
//         }, 1000)
//       })
//   }

//   const addProjectCardHeaderButtonClick = () => {
//     $("#listOfProjectsHeaderExpandButtion").click()
//   }

//   const listOfProjectsHeaderExpandButtionClick = () => {
//     $("#AddNewHeaderButton").click()
//   }

//   const handleEditMappingDetails = (roleObj) => {
//     // console.log("roleObj-->", roleObj);
//     setUpdateOrDeleteId(true)
//     const getAppListArray = roleObj.userID.toLowerCase().split(",")
//     setManagerId(roleObj.managerID)
//     window.assignValueToSelect2(getAppListArray)
//     listOfProjectsHeaderExpandButtionClick()
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   }

//   const handleRemoveRole = (roleObj) => {
//     setUpdateOrDeleteId(roleObj.managerID)
//     window.confirmModalShow()
//   }

//   const yesConfirmSubmitRequest = () => {
//     setIsLoaderActive(true)
//     const APIMethodName = "EmailCofigureController/DeleteManagerUserMap?managerId=" + updateOrDeleteId
//     axios
//       .post(config.API_URL + APIMethodName, {
//         headers: config.headers2,
//       })
//       .then((response) => {
//         // console.log(response);
//         if (response.data.success == true) {
//           GetAllManagerUserMaps()
//           toast.success("Deleted successfully...", config.tostar_config)
//           window.confirmModalHide()
//           clearAllFields()
//           setIsLoaderActive(false)
//         } else {
//           setIsLoaderActive(false)
//           toast.error(response.data.message, config.tostar_config)
//         }
//       })
//       .catch((error) => {
//         if (!error.response.data.success) {
//           toast.error(error.response.data.message, config.tostar_config)
//         } else {
//           toast.error("Please try again later.", config.tostar_config)
//         }
//         setIsLoaderActive(false)
//       })
//   }

//   const handleCancelClick = () => {
//     clearAllFields()
//     addProjectCardHeaderButtonClick()
//   }

//   const clearAllFields = () => {
//     setManagerId("")
//     $(".select2").val("")
//     window.assignValueToSelect2([])
//     setUpdateOrDeleteId(false)
//   }

//   const handleRoleSubmit = (e) => {
//     const getAllSelectedApps = $(".select2").val()
//     if (managerId) {
//       if (getAllSelectedApps) {
//         setIsLoaderActive(false)
//         let APIMethodName = ""
//         if (updateOrDeleteId == true) {
//           APIMethodName = "EmailCofigureController/UpdateManagerUserMap"
//         } else {
//           APIMethodName = "EmailCofigureController/CreateManagerUserMap"
//         }

//         axios
//           .post(
//             config.API_URL + APIMethodName,
//             {
//               managerID: managerId,
//               userID: getAllSelectedApps.toString(),
//               createdBy: personalInfo.userID,
//             },
//             {
//               headers: config.headers2,
//             },
//           )
//           .then((response) => {
//             // console.log(response);
//             if (response.data.success == true) {
//               toast.success("Asset User Mapped Successfully...", config.tostar_config)
//               clearAllFields()
//               addProjectCardHeaderButtonClick()
//               GetAllManagerUserMaps()
//               setIsLoaderActive(false)
//             } else {
//               setIsLoaderActive(false)
//               toast.error(response.data.message, config.tostar_config)
//             }
//           })
//           .catch((error) => {
//             if (!error.response.data.success) {
//               toast.error(error.response.data.message)
//             } else {
//               toast.error("Please try again later.", config.tostar_config)
//             }
//             setIsLoaderActive(false)
//           })
//       } else {
//         toast.error("Select atleast one user.", config.tostar_config)
//         inputSelectSalesUsersReference.current.focus()
//         inputSelectSalesUsersReference.current.classList.add("is-invalid")
//       }
//     } else {
//       toast.error("Please select manager.", config.tostar_config)
//       inputManagerIdReference.current.focus()
//       inputManagerIdReference.current.classList.add("is-invalid")
//     }
//   }

//   const cteateAttachmentHTML = (appArray) => {
//     if (appArray.length > 0) {
//       return appArray.map((appID, index) => {
//         const getEmployeeName = allUsersList.find((x) => x.userID.toLowerCase() === appID.toLowerCase())
//         return (
//           <small key={index} className="badge badge-warning p-1 mt-1 ml-1">
//             {getEmployeeName ? `${getEmployeeName.firstName || ""} ${getEmployeeName.lastName || ""}` : "Unknown User"}
//           </small>
//         )
//       })
//     }
//     return null
//   }

//   return (
//     <>
//       {/* <div className="content-header">
       
//       </div> */}

//       <section className="content pt-3">
//         <div className="card">
//           <div className="card-header">
//             <h3 className="card-title text-sm">Create New Mapping</h3>
//           </div>
//           <div className="card-body text-sm">
//             <div className="row">
//               <div className="form-group col-md-6">
//                 <label>
//                   Select Manager<sup style={{ color: "red" }}>*</sup>
//                 </label>
//                 <select
//                   className="form-control form-control-sm"
//                   ref={inputManagerIdReference}
//                   value={managerId}
//                   onChange={(e) => setManagerId(e.target.value)}
//                 >
//                   <option value="">--Select--</option>
//                   {allManagesList
//                     .filter((manager) => manager.managerStatus === true)
//                     .map((manager) => {
//                       return (
//                         <option key={"Mana_" + manager.managerId} value={manager.managerId}>
//                           {manager.managerFirstName || ""} {manager.managerLastName || ""}
//                         </option>
//                       )
//                     })}
//                 </select>
//               </div>
//               <div className="form-group col-md-6">
//                 <label>
//                   Select Users<sup style={{ color: "red" }}>*</sup>
//                 </label>
//                 <select
//                   className="select2 "
//                   multiple="multiple"
//                   data-placeholder="Select Users.."
//                   style={{ width: "100%" }}
//                   ref={inputSelectSalesUsersReference}
//                   value={salesUserId}
//                   onChange={(e) => setSalesUserId(e.target.value)}
//                 >
//                   <option value="">--Select--</option>
//                   {allUsersList
//                     .filter((techObj) => techObj.isActive === true)
//                     .map((techObj, index) => {
//                       if (techObj.accountGroup === "Sales and Marketing Team") {
//                         return (
//                           <option key={"Mana_" + techObj.userID + "~index" + index} value={techObj.userID}>
//                             {techObj.firstName || ""} {techObj.lastName || ""}
//                           </option>
//                         )
//                       }
//                     })}
//                 </select>
//               </div>
//             </div>
//             <div className="card-footer mt-2">
//               <button
//                 type="submit"
//                 className="custom-success-button mr-2"
//                 onClick={(e) => {
//                   handleRoleSubmit(e)
//                 }}
//               >
//                 Save & Submit
//               </button>

//               <button
//                 type="submit"
//                 className="custom-secondary-button"
//                 onClick={(e) => {
//                   handleCancelClick(e)
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="content">
//           <div className="card">
//             <div className="card-header">
//               <h3 className="card-title text-sm">Manager Mapping List ( {allManagerUserMapsList.length} )</h3>
//             </div>
//             <div className="card-body table-container">
//               <table id="example1" className="improved-normal-table">
//                 <thead>
//                   <tr>
//                     <th>Sr. No.</th>
//                     <th>Manager Name</th>
//                     <th>Sales Person Names</th>
//                     <th>Action</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {allManagerUserMapsList.length > 0
//                     ? allManagerUserMapsList.map((roleObj, index) => {
//                         const getManagerName = allUsersList.find(
//                           (x) => x.userID.toLowerCase() === roleObj.managerID.toLowerCase(),
//                         )

//                         return (
//                           <tr key={index}>
//                             <td>{index + 1}</td>
//                             <td>
//                               {getManagerName
//                                 ? `${getManagerName.firstName || ""} ${getManagerName.lastName || ""}`
//                                 : "Unknown Manager"}
//                             </td>
//                             <td>{cteateAttachmentHTML(roleObj.userID.split(","))}</td>
//                             <td>
//                               <button
//                                 type="button"
//                                 className="custom-success-button mr-2"
//                                 onClick={() => handleEditMappingDetails(roleObj)}
//                               >
//                                 <i className="fas fa-pen"></i>
//                               </button>
//                               <button
//                                 type="button"
//                                 className="custom-primary-button"
//                                 onClick={() => handleRemoveRole(roleObj)}
//                               >
//                                 <i className="fas fa-trash"></i>
//                               </button>
//                             </td>
//                           </tr>
//                         )
//                       })
//                     : null}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </section>

//       <div
//         id="confirmCommonModal"
//         class="modal fade confirmCommonModal"
//         data-backdrop="static"
//         tabIndex="-1"
//         role="dialog"
//         aria-labelledby="staticBackdropLabel"
//         aria-hidden="true"
//       >
//         <div class="modal-dialog modal-confirm">
//           <div class="modal-content">
//             <div class="modal-header">
//               <div class="icon-box">
//                 <i class="fas fa-info"></i>
//               </div>
//               <h5 class="modal-title w-100">Are you sure ?</h5>
//             </div>
//             <div class="modal-body">
//               <p class="text-center">
//                 By clicking on Yes delete all the mapping details. Once you deleted it can not be recovered.
//               </p>
//             </div>
//             <div class="modal-footer col-md-12">
//               <button class="btn btn-default btn-sm" data-bs-dismiss="modal">
//                 Cancel
//               </button>
//               {isLoaderActive ? (
//                 <PleaseWaitButton className="btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn" />
//               ) : (
//                 <button
//                   class="btn btn-warning btn-sm pl-3 pr-3 ml-2"
//                   onClick={(e) => {
//                     yesConfirmSubmitRequest(e)
//                   }}
//                 >
//                   Yes
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default ManagerAndUserMapping


import { useRef, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { toast } from "react-toastify"
import PleaseWaitButton from "../../shared/PleaseWaitButton"
import axios from "axios"
import Select from "react-select"

const config = require("../../services/config.json")

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

const ManagerAndUserMapping = () => {
  const inputManagerIdReference = useRef(null)

  const personalInfo = useSelector((state) => state.personalInformationReducer)

  const [selectedUsers, setSelectedUsers] = useState([])
  const [isLoaderActive, setIsLoaderActive] = useState(false)
  const [allManagerUserMapsList, setAllManagerUserMapsList] = useState([])
  const [allManagesList, setAllManagesList] = useState([])
  const [managerId, setManagerId] = useState("")
  const [updateOrDeleteId, setUpdateOrDeleteId] = useState(false)
  const [allUsersList, setAllUsersList] = useState([])

  useEffect(() => {
    getAllManagerList()
    getUsersList()
  }, [])

  const getUsersList = () => {
    axios
      .get(config.API_URL + "AuthMasterController/GetAllUsers?ClientId=" + config.clientId, {
        headers: config.headers2,
      })
      .then((response) => {
        if (response.status == 200) {
          if (response.data.success == "success") {
            if (response.data.data.length > 0) {
              setAllUsersList(response.data.data)
              GetAllManagerUserMaps()
            }
          } else {
            toast.error(response.data.message, config.tostar_config)
          }
        } else if (response.data.status.status == 500) {
          toast.error("oops something went wrong.", config.tostar_config)
        }
      })
      .catch((error) => {
        toast.error("Please try again later.", config.tostar_config)
      })
  }

  const getAllManagerList = () => {
    axios
      .get(config.API_URL + "AuthMasterController/GetAllManagerUsers?ClientId=" + config.clientId, {
        headers: config.headers2,
      })
      .then((response) => {
        if (response.status == 200) {
          if (response.data.success == "success") {
            if (response.data.data.length > 0) {
              const tempArray = []
              response.data.data.map((manager) => {
                if (manager.accountGroup == "Sales and Marketing Team") {
                  const tempObj = {
                    managerId: manager.userID,
                    managerName: manager.userName,
                    managerFirstName: manager.firstName,
                    managerLastName: manager.lastName,
                    managerStatus: manager.isActive,
                  }
                  tempArray.push(tempObj)
                }
              })
              setAllManagesList(tempArray)
            }
          } else {
            toast.error(response.data.message, config.tostar_config)
          }
        } else if (response.data.status.status == 500) {
          toast.error("Invalid username or password", config.tostar_config)
        }
      })
      .catch((error) => {
        toast.error("Please try again later.", config.tostar_config)
      })
  }

  const GetAllManagerUserMaps = () => {
    axios
      .get(config.API_URL + "EmailCofigureController/GetAllManagerUserMaps", {
        headers: config.headers2,
      })
      .then((response) => {
        if (response.status == 200) {
          if (response.data.success == true) {
            if (response.data.data.length > 0) {
              setAllManagerUserMapsList(response.data.data)
            } else {
              setAllManagerUserMapsList([])
            }
          } else {
            toast.error(response.data.message, config.tostar_config)
          }
        } else if (response.data.status.status == 500) {
          toast.error("Invalid username or password", config.tostar_config)
        }
      })
      .catch((error) => {
        toast.error("Please try again later.", config.tostar_config)
      })
  }

  const handleEditMappingDetails = (roleObj) => {
    setUpdateOrDeleteId(true)
    const getAppListArray = roleObj.userID.toLowerCase().split(",")
    setManagerId(roleObj.managerID)
    setSelectedUsers(getAppListArray.map((id) => ({ value: id, label: getUserName(id) })))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleRemoveRole = (roleObj) => {
    setUpdateOrDeleteId(roleObj.managerID)
    window.confirmModalShow()
  }

  const yesConfirmSubmitRequest = () => {
    setIsLoaderActive(true)
    const APIMethodName = "EmailCofigureController/DeleteManagerUserMap?managerId=" + updateOrDeleteId
    axios
      .post(config.API_URL + APIMethodName, {
        headers: config.headers2,
      })
      .then((response) => {
        if (response.data.success == true) {
          GetAllManagerUserMaps()
          toast.success("Deleted successfully...", config.tostar_config)
          window.confirmModalHide()
          clearAllFields()
          setIsLoaderActive(false)
        } else {
          setIsLoaderActive(false)
          toast.error(response.data.message, config.tostar_config)
        }
      })
      .catch((error) => {
        if (!error.response.data.success) {
          toast.error(error.response.data.message, config.tostar_config)
        } else {
          toast.error("Please try again later.", config.tostar_config)
        }
        setIsLoaderActive(false)
      })
  }

  const handleCancelClick = () => {
    clearAllFields()
  }

  const clearAllFields = () => {
    setManagerId("")
    setSelectedUsers([])
    setUpdateOrDeleteId(false)
  }

  const handleRoleSubmit = (e) => {
    if (managerId) {
      if (selectedUsers.length > 0) {
        setIsLoaderActive(true)
        const APIMethodName = updateOrDeleteId
          ? "EmailCofigureController/UpdateManagerUserMap"
          : "EmailCofigureController/CreateManagerUserMap"

        axios
          .post(
            config.API_URL + APIMethodName,
            {
              managerID: managerId,
              userID: selectedUsers.map((user) => user.value).join(","),
              createdBy: personalInfo.userID,
            },
            {
              headers: config.headers2,
            },
          )
          .then((response) => {
            if (response.data.success == true) {
              toast.success("Asset User Mapped Successfully...", config.tostar_config)
              clearAllFields()
              GetAllManagerUserMaps()
              setIsLoaderActive(false)
            } else {
              setIsLoaderActive(false)
              toast.error(response.data.message, config.tostar_config)
            }
          })
          .catch((error) => {
            if (!error.response.data.success) {
              toast.error(error.response.data.message)
            } else {
              toast.error("Please try again later.", config.tostar_config)
            }
            setIsLoaderActive(false)
          })
      } else {
        toast.error("Select at least one user.", config.tostar_config)
      }
    } else {
      toast.error("Please select manager.", config.tostar_config)
      inputManagerIdReference.current.focus()
    }
  }

  const getUserName = (userId) => {
    const user = allUsersList.find((u) => u.userID.toLowerCase() === userId.toLowerCase())
    return user ? `${user.firstName} ${user.lastName}` : ""
  }

  return (
    <>
      <section className="content pt-3">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title text-sm">Create New Mapping</h3>
          </div>
          <div className="card-body text-sm">
            <div className="row">
              <div className="form-group col-md-6">
                <label>
                  Select Manager<sup style={{ color: "red" }}>*</sup>
                </label>
                <select
                  className="form-control"
                  ref={inputManagerIdReference}
                  value={managerId}
                  onChange={(e) => setManagerId(e.target.value)}
                >
                  <option value="">--Select--</option>
                  {allManagesList
                    .filter((manager) => manager.managerStatus === true)
                    .map((manager) => (
                      <option key={`Mana_${manager.managerId}`} value={manager.managerId}>
                        {manager.managerFirstName || ""} {manager.managerLastName || ""}
                      </option>
                    ))}
                </select>
              </div>
              <div className="form-group col-md-6">
                <label>
                  Select Users<sup style={{ color: "red" }}>*</sup>
                </label>
                <Select
                  isMulti
                  name="users"
                  options={allUsersList
                    .filter((user) => user.isActive === true && user.accountGroup === "Sales and Marketing Team")
                    .map((user) => ({
                      value: user.userID,
                      label: `${user.firstName} ${user.lastName}`,
                    }))}
                    className="roles-custom-select" 
                  classNamePrefix="select"
                  value={selectedUsers}
                  onChange={setSelectedUsers}
                  styles={customStyles} 
                />
              </div>
            </div>
            <div className="card-footer mt-2">
              <button type="submit" className="custom-success-button mr-2" onClick={handleRoleSubmit}>
                Save & Submit
              </button>

              <button type="submit" className="custom-secondary-button" onClick={handleCancelClick}>
                Cancel
              </button>
            </div>
          </div>
        </div>

        <div className="content">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title text-sm">Manager Mapping List ( {allManagerUserMapsList.length} )</h3>
            </div>
            <div className="card-body table-container">
              <table id="example1" className="improved-normal-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Manager Name</th>
                    <th>Sales Person Names</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {allManagerUserMapsList.map((roleObj, index) => {
                    const getManagerName = allUsersList.find(
                      (x) => x.userID.toLowerCase() === roleObj.managerID.toLowerCase(),
                    )

                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          {getManagerName?.firstName || ""} {getManagerName?.lastName || ""}
                        </td>
                        <td>
                          {roleObj.userID.split(",").map((userId, idx) => (
                            <small key={idx} className="badge-custom mr-1">
                              {getUserName(userId)}
                            </small>
                          ))}
                        </td>
                        <td>
                          <button
                            type="button"
                            className="custom-success-button mr-2"
                            onClick={() => handleEditMappingDetails(roleObj)}
                          >
                            <i className="fas fa-pen"></i>
                          </button>
                          <button
                            type="button"
                            className="custom-primary-button"
                            onClick={() => handleRemoveRole(roleObj)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
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
                By clicking on Yes delete all the mapping details. Once you deleted it can not be recovered.
              </p>
            </div>
            <div className="modal-footer col-md-12">
              <button className="btn btn-default btn-sm" data-bs-dismiss="modal">
                Cancel
              </button>
              {isLoaderActive ? (
                <PleaseWaitButton className="btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn" />
              ) : (
                <button className="btn btn-warning btn-sm pl-3 pr-3 ml-2" onClick={yesConfirmSubmitRequest}>
                  Yes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ManagerAndUserMapping


