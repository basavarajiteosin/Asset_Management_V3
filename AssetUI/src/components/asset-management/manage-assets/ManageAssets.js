import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../../shared/PleaseWaitButton";
import axios from "axios";
import $ from "jquery";

const config = require("../../../services/config.json");

function ManageAssets() {
  const inputUserReference = useRef(null);
  const inputSpecificationReference = useRef(null);
  const inputAssetReference = useRef(null);
  const inputAssignedByReference = useRef(null);
  const inputApprovedByReference = useRef(null);
  const inputReviewedByReference = useRef(null);
  const inputRemarksReference = useRef(null);
  const inputAssignedDateReference = useRef(null);
  const inputAssignedTillDateReference = useRef(null);
  const inputSerialNoReference = useRef(null);
  const inputIsActiveReference = useRef(null);
  const [isActive, setIsActive] = useState("");

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [assignedBy, setAssignedBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [reviewedBy, setReviewedBy] = useState("");
  const [remarks, setRemarks] = useState("");
  const [asset, setAsset] = useState("");
  const [assetType, setAssetType] = useState([]);
  const [assignedDate, setAssignedDate] = useState("");
  const [assignedTillDate, setAssignedTillDate] = useState("");
  const [specification, setSpecification] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [assetTypeDetails, setAssetTypeDetails] = useState([]);
  const [assetAssignmentListData, setAllAssetAssignmentListData] = useState([]);
  const [updateOrDeleteId, setUpdateOrDeleteId] = useState("");
  const [assetAssignmentDetails, setAssetAssignmentDetails] = useState("");
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isNonEdit, setIsNonEdit] = useState(false);
  const [assetHistory, setAssetHistory] = useState([]);
  const [showLogViewModal, setShowLogsViewModal] = useState(false);
  const [mandateAttachmentsFile, setMandateAttachmentsFile] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [viewDocymenchekIndex, setViewDocymenchekIndex] = useState(null);
  const [viewDocymenchekAttachments, setViewDocymenchekAttachments] = useState([]);

  useEffect(() => {
    getAllUsers();
    fetchAssetTypeDetails();
    getAllAssetAssignmentList();
  }, []);

  const getAllUsers = () => {
    axios
      .get(
        config.API_URL + "AuthMasterController/GetAllAccessUsers?ClientId=pmoAuthApp"
      )
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success === "success") {
            if (response.data.data.length > 0) {
              setUsers(response.data.data);
            } else {
              console.warn("No users found");
            }
          } else {
            toast.error(response.data.message);
          }
        } else if (response.data.status.status === 500) {
          toast.error("Invalid ");
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        toast.error("Oops, something went wrong. Please try again later.");
      });
  };

  const assetOnChangeHandler = (getAssetId) => {
    fetchAssetDetails(getAssetId);
  };

  const fetchUserDetails = (userName) => {
    axios
      .get(
        `${config.API_URL}AuthMasterController/GetAllAccessUsers?ClientId=pmoAuthApp`
      )
      .then((response) => {
        if (response.data.success == "success") {
          let getResp = response.data.data;
          const filterData = getResp.find((o) => o.userID === userName);
          setUserDetails(filterData);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        toast.error("Failed to fetch user details.");
      });
  };

  function formatDate(dateString) {
    if (dateString instanceof Date) {
      return dateString.toISOString().split("T")[0];
    } else if (typeof dateString === "string") {
      return dateString.split("T")[0];
    } else {
      console.error("Invalid date input", dateString);
      return "";
    }
  }

  const fetchAssetTypeDetails = () => {
    window.initDestroyDataTableFuncation();
    axios
      .get(`${config.API_URL}AssetManagement/GetAllAssetTypeDetails`)
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success === true) {
            setAssetType(response.data.data);
          } else {
            setAssetType([]);
            toast.error(response.data.message);
          }
        } else {
          toast.error(`Unexpected response status: ${response.status}`);
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        toast.error("Failed to fetch user details.");
      });
  };

  const fetchAssetDetails = (asset) => {
    setAssetTypeDetails([]);
    axios
      .get(
        `${config.API_URL}AssetManagement/GetAssetDetailByAssetType?inputAssetType=${asset}`
      )
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success) {
            if (response.data.data.length > 0) {
              setAssetTypeDetails(response.data.data);
            } else {
              console.warn("No Asset found");
              setAssetTypeDetails([]);
            }
          } else {
            toast.error(response.data.message);
          }
        } else if (response.data.status.status === 500) {
          toast.error("Invalid ");
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        toast.error("Oops, something went wrong. Please try again later.");
      });
  };

  const handleUserChange = (e) => {
    const selectedUser = e.target.value;
    if (updateOrDeleteId !== 0 && updateOrDeleteId !== null) {
      setPreviewIndex(null);
      setMandateAttachmentsFile([]);
    }
    setUser(selectedUser);
    if (selectedUser) {
      fetchUserDetails(selectedUser);
    } else {
      setUserDetails(null);
    }
  };

  const handlePropertyChangeChange = (e) => {
    const selecteSerialNo = e.target.value;
    if (updateOrDeleteId !== 0 && updateOrDeleteId !== null) {
      setPreviewIndex(null);
      setMandateAttachmentsFile([]);
    }
    setSerialNumber(selecteSerialNo);
  };

  const getUserFirstNameById = (userId) => {
    const user = users.find((user) => user.userID === userId);
    return user ? `${user.firstName} ${user.lastName}` : "";
  };

  let userId = localStorage.getItem("user_id");

  const addCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  };

  const collapseForm = () => {
    $("#AddNewHeaderButtion").click(); // Collapse the form
    $("#listOfProjectsHeaderExpandButtion").click(); // Expand the table if collapsed
  };

  const listOfHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButtion").click();
  };

  const editButton = () => {
    $("#viewButton").show();
    $("#editButton").hide();
    setIsDisabled(false);
    setIsReadOnly(false);
    setIsNonEdit(true);
  };

  const viewButton = () => {
    $("#viewButton").hide();
    $("#editButton").show();
    setIsDisabled(true);
    setIsReadOnly(true);
    setIsNonEdit(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var startDate = $("#projectStartDate").val();
    if (startDate) {
      var assignedDateTimeFormated = new Date(startDate);
      if (!isNaN(assignedDateTimeFormated.getTime())) {
        setAssignedDate(assignedDateTimeFormated);
      } else {
        console.error("Invalid Start Date:", startDate);
      }
    }

    var endDate = $("#projectEndDate").val();
    if (endDate) {
      var assignedDateTillTimeFormated = new Date(endDate);
      if (!isNaN(assignedDateTillTimeFormated.getTime())) {
        setAssignedTillDate(assignedDateTillTimeFormated);
      } else {
        console.error("Invalid End Date:", endDate);
      }
    }

    if (user.trim() === "") {
      toast.error("Please select User.");
      inputUserReference.current.focus();
      inputUserReference.current.classList.add("is-invalid");
      return;
    }
    if (asset.trim() === "") {
      toast.error("Please select Asset.");
      inputAssetReference.current.focus();
      inputAssetReference.current.classList.add("is-invalid");
      return;
    }
    if (assignedBy.trim() === "") {
      toast.error("Please select AssignedBy.");
      inputAssignedByReference.current.focus();
      inputAssignedByReference.current.classList.add("is-invalid");
      return;
    }
    if (approvedBy.trim() === "") {
      toast.error("Please select ApprovedBy.");
      inputApprovedByReference.current.focus();
      inputApprovedByReference.current.classList.add("is-invalid");
      return;
    }
    if (reviewedBy.trim() === "") {
      toast.error("Please select ReviewedBy.");
      inputReviewedByReference.current.focus();
      inputReviewedByReference.current.classList.add("is-invalid");
      return;
    }
    if (specification.trim() === "") {
      toast.error("Please enter Specifications.");
      inputSpecificationReference.current.focus();
      inputSpecificationReference.current.classList.add("is-invalid");
      return;
    }
    if (remarks.trim() === "") {
      toast.error("Please enter Remarks.");
      inputRemarksReference.current.focus();
      inputRemarksReference.current.classList.add("is-invalid");
      return;
    }
    if (assignedDate === "") {
      toast.error("Please select Assigned Date.");
      inputAssignedDateReference.current.focus();
      inputAssignedDateReference.current.classList.add("is-invalid");
      return;
    }
    if (assignedTillDate === "") {
      toast.error("Please select Assigned TillDate.");
      inputAssignedTillDateReference.current.focus();
      inputAssignedTillDateReference.current.classList.add("is-invalid");
      return;
    }

    const newMandateAttachments = mandateAttachmentsFile.filter(
      (fileObj) => fileObj.fileAdded === "New"
    );

    if (mandateAttachmentsFile.length < 8) {
      toast.error("Please upload at least 8 mandatory asset images.");
      setIsLoaderActive(false);
      return;
    }

    const manageData = {
      assetName: asset,
      assignedUser: user,
      assignedBy: assignedBy,
      assignedDate: assignedDate,
      assignedTillDate: assignedTillDate,
      specifications: specification,
      serialNumber: serialNumber,
      approvedBy: approvedBy,
      reviewedBy: reviewedBy,
      remarks: remarks,
      createdBy: userId,
      isActive: updateOrDeleteId && updateOrDeleteId != 0 ? isActive : true,
    };

    const formData = new FormData();
    for (const key in manageData) {
      if (Array.isArray(manageData[key])) {
        manageData[key].forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, manageData[key]);
      }
    }

    newMandateAttachments.forEach((fileObj) => {
      formData.append("mandateAttchment", fileObj.selectedFile);
    });

    try {
      setIsLoaderActive(true);

      const config1 = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };

      let response;
      if (updateOrDeleteId && updateOrDeleteId != 0) {
        response = await axios.post(
          `${config.API_URL}AssetAssignment/UpdateAssetDetail?assetId=${updateOrDeleteId}`,
          formData,
          config1
        );
        toast.success("Asset Assignment updated successfully.");
      } else {
        response = await axios.post(
          `${config.API_URL}AssetAssignment/AssignAssetDetail`,
          formData,
          config1
        );
        toast.success("Asset Assignment created successfully.");
      }

      if (response.status === 200 || response.status === 201) {
        const responseData = response.data;
        if (responseData.success) {
          getAllUsers();
          fetchAssetTypeDetails();
          fetchAssetDetails();
          getAllAssetAssignmentList();
          handleReset();
          setPreviewIndex(null);
          setMandateAttachmentsFile([]);
          collapseForm(); // Collapse form and show table
        } else {
          toast.error(responseData.message);
        }
      }
    } catch (error) {
      console.error(error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || "An error occurred.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setUpdateOrDeleteId("");
      setIsLoaderActive(false);
    }

    $("#editButton").hide();
    $("#viewButton").hide();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getAllAssetAssignmentList = () => {
    window.initDestroyDataTableFuncation();
    axios
      .get(`${config.API_URL}AssetAssignment/GetDetailsOfAllAssets`, {
        headers: config.headers2,
      })
      .then((response) => {
        if (response.status == 200) {
          if (response.data.success == true) {
            if (response.data.data.length > 0) {
              setTimeout(() => {
                window.initDataTableFuncation();
              }, 30);
              setAllAssetAssignmentListData(response.data.data);
            } else {
              setTimeout(() => {
                window.initDataTableFuncation();
              }, 30);
              setAllAssetAssignmentListData([]);
            }
          } else {
            toast.error(response.data.message);
          }
        } else if (response.data.status.status == 500) {
          toast.error("Invalid username or password");
        }
      })
      .catch((error) => {
        toast.error("oops something went wrong. please try again later.");
      });
  };

  const handleCancelClick = (e) => {
    setUser("");
    setApprovedBy("");
    setAsset("");
    setAssignedBy("");
    setAssignedDate("");
    setAssignedTillDate("");
    $("#projectStartDateV").val("");
    $("#projectEndDateV").val("");
    setRemarks("");
    setReviewedBy("");
    setSpecification("");
    setUserDetails(null);
    setIsReadOnly(false);
    setIsDisabled(false);
    setIsNonEdit(false);
    $("#editButton").hide();
    $("#viewButton").hide();
    setPreviewIndex(null);
    setMandateAttachmentsFile([]);
    setUpdateOrDeleteId("");

    inputUserReference.current.classList.remove("is-invalid");
    inputAssetReference.current.classList.remove("is-invalid");
    inputAssignedByReference.current.classList.remove("is-invalid");
    inputApprovedByReference.current.classList.remove("is-invalid");
    inputAssignedDateReference.current.classList.remove("is-invalid");
    inputAssignedTillDateReference.current.classList.remove("is-invalid");
    inputReviewedByReference.current.classList.remove("is-invalid");
    inputSpecificationReference.current.classList.remove("is-invalid");
    inputRemarksReference.current.classList.remove("is-invalid");

    listOfHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemove = (roleObj) => {
    setUpdateOrDeleteId(roleObj);
    window.confirmModalShow();
  };

  const confirmDelete = async () => {
    setIsLoaderActive(true);
    let APIMethodName =
      "AssetAssignment/RemoveAssetDetail?id=" + updateOrDeleteId;
    axios
      .post(config.API_URL + APIMethodName, {
        headers: config.headers2,
      })
      .then((response) => {
        if (response.data.success == true) {
          toast.success("Asset Assignment deleted successfully...");
          window.confirmModalHide();
          getAllAssetAssignmentList();
          setIsLoaderActive(false);
        } else {
          setIsLoaderActive(false);
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        if (!error.response.data.success) {
          toast.error(error.response.data.message);
        } else {
          toast.error("oops something went wrong. please try again later.");
        }
        setIsLoaderActive(false);
      });
    window.location.reload();
  };

  const handleReset = () => {
    $("#projectStartDate").val("");
    $("#projectEndDate").val("");
    setAsset("");
    setAssignedBy("");
    setApprovedBy("");
    setReviewedBy("");
    setSerialNumber("");
    setRemarks("");
    setAssetType([]);
    setIsActive("");
    setAssignedDate("");
    setAssignedTillDate("");
    setUsers([]);
    setUser("");
    setSpecification("");
    setUserDetails("");
    setUpdateOrDeleteId("");
  };

  const handleEditAssetAssignmentDetails = (
    assetAssignmentDetailsToBeUpdated
  ) => {
    setUpdateOrDeleteId(assetAssignmentDetailsToBeUpdated.id);
    setAssetAssignmentDetails(assetAssignmentDetailsToBeUpdated);
    fetchAssetDetails(assetAssignmentDetailsToBeUpdated.assetName);
    setAsset(assetAssignmentDetailsToBeUpdated.assetName);
    setUser(assetAssignmentDetailsToBeUpdated.assignedUser);
    setApprovedBy(assetAssignmentDetailsToBeUpdated.approvedBy);
    setAssignedBy(assetAssignmentDetailsToBeUpdated.assignedBy);

    setIsActive(assetAssignmentDetailsToBeUpdated.isActive);

    let startDate = new Date(assetAssignmentDetailsToBeUpdated.assignedDate);
    let formattedStartDate = formatDate(startDate);
    setAssignedDate(formattedStartDate);

    let endDate = new Date(assetAssignmentDetailsToBeUpdated.assignedTillDate);
    let formattedEndDate = formatDate(endDate);
    setAssignedTillDate(formattedEndDate);

    setCreatedBy(assetAssignmentDetailsToBeUpdated.createdBy);
    setRemarks(assetAssignmentDetailsToBeUpdated.remarks);
    setReviewedBy(assetAssignmentDetailsToBeUpdated.reviewedBy);
    setTimeout(() => {
      setSerialNumber(assetAssignmentDetailsToBeUpdated.productId);
    }, 2000);

    setSpecification(assetAssignmentDetailsToBeUpdated.specifications);

    if (assetAssignmentDetailsToBeUpdated.mandateDocByAssetsAssignment && assetAssignmentDetailsToBeUpdated.mandateDocByAssetsAssignment.length > 0) {
      const existingImages = assetAssignmentDetailsToBeUpdated.mandateDocByAssetsAssignment.map((file) => ({
        selectedFile: file.attachmentServerPath,
        fileName: file.documentName || file.attachmentFilePath.split("/").pop(),
        fileAdded: "Old",
        attachId: file.mandateDocId
      }));
      setMandateAttachmentsFile(existingImages);
    } else {
      setMandateAttachmentsFile([]);
    }

    setIsReadOnly(true);
    setIsDisabled(true);
    setIsNonEdit(true);
    $("#editButton").show();
    addCardHeaderButtonClick();
    listOfHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fetchAssetHistory = (assetId) => {
    axios
      .get(
        config.API_URL +
        `AssetAssignment/GetAssetHistoryById?assetId=${assetId}`
      )
      .then((response) => {
        if (response.status === 200 && response.data.success) {
          setAssetHistory(response.data.data);
        } else {
          toast.error("Failed to fetch asset history.");
        }
      })
      .catch((error) => {
        console.error("API Error:", error);
        toast.error("Oops, something went wrong. Please try again later.");
      });
  };

  const handleHistoryClick = (assetId) => {
    fetchAssetHistory(assetId);
    setShowLogsViewModal(true);
  };

  const handleMandateFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (mandateAttachmentsFile.length + files.length > 20) {
      toast.error("You can upload a maximum of 20 images.");
      return;
    }

    const newFiles = files.map((file) => ({
      selectedFile: file,
      fileName: file.name,
      fileAdded: "New",
    }));

    setMandateAttachmentsFile((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveMandateAttachment = (index) => {
    setMandateAttachmentsFile((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteMandateAttachment = async (mandateDocId) => {
    try {
      setIsLoaderActive(true);
      const response = await axios.post(
        `${config.API_URL}AssetAssignment/delete`,
        { mandateDocId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success("Attachment deleted successfully");
        // Immediately update the UI by filtering out the deleted attachment
        setMandateAttachmentsFile((prev) =>
          prev.filter((file) => file.attachId !== mandateDocId)
        );
      } else {
        toast.error(response.data.message || "Failed to delete attachment");
      }
    } catch (error) {
      console.error("Delete Attachment Error:", error);
      toast.error(
        error.response?.data?.message || "Failed to delete attachment. Please try again."
      );
    } finally {
      setIsLoaderActive(false);
    }
  };

  const openViewDocymenchek = (attachments, index) => {
    setViewDocymenchekAttachments(attachments);
    setViewDocymenchekIndex(index);
    setShowLogsViewModal(false);
  };

  const closeViewDocymenchek = () => {
    setViewDocymenchekIndex(null);
    setViewDocymenchekAttachments([]);
  };

  return (
    <>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-danger card-outline collapsed-card">
                <div className="card-header">
                  <h3 className="card-title text-sm">Assign New Asset</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-warning btn-xs"
                      id="editButton"
                      onClick={(e) => {
                        editButton(e);
                      }}
                      style={{ marginRight: "10px", display: "none" }}
                    >
                      <i className="fas fa-pen"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-info btn-xs"
                      id="viewButton"
                      onClick={(e) => {
                        viewButton(e);
                      }}
                      style={{ marginRight: "10px", display: "none" }}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="custom-primary-gradient-button mr-2"
                      id="AddNewHeaderButtion"
                      onClick={(e) => {
                        addCardHeaderButtonClick(e);
                      }}
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-user-plus"></i> Assign Asset
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
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="form-group col-md-4">
                        <label>
                          Select User
                          <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <select
                          className="custom-select form-control-sm"
                          ref={inputUserReference}
                          value={user}
                          onChange={handleUserChange}
                          disabled={isDisabled}
                          required
                        >
                          <option value="">--Select User--</option>
                          {users
                            .filter((userObj) => userObj.isActive === true)
                            .map((userObj) => (
                              <option
                                key={userObj.userID}
                                value={userObj.userID}
                              >
                                {userObj.firstName + " " + userObj.lastName}
                              </option>
                            ))}
                        </select>
                      </div>
                      {userDetails && (
                        <>
                          <div className="form-group col-md-4">
                            <label htmlFor="teamNameInput">Department</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="teamNameInput"
                              value={userDetails.accountGroup || ""}
                              readOnly
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="phoneNoInput">Phone Number</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="phoneNoInput"
                              value={userDetails.contactNumber || ""}
                              readOnly
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="emailIdInput">Email Id</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="emailIdInput"
                              value={userDetails.email || ""}
                              readOnly
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="empIdInput">Emp Id</label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="empIdInput"
                              value={userDetails.userName || ""}
                              readOnly
                            />
                          </div>
                        </>
                      )}
                      <div className="form-group col-md-4">
                        <label>
                          Select Asset
                          <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <select
                          className="custom-select form-control-sm"
                          ref={inputAssetReference}
                          value={asset}
                          onChange={(e) => {
                            setAsset(e.target.value);
                            assetOnChangeHandler(e.target.value);
                          }}
                          disabled={isDisabled || isNonEdit}
                          required
                        >
                          <option value="">--Select Asset--</option>
                          {Array.isArray(assetType) &&
                            assetType.map((assetObj) => (
                              <option
                                key={assetObj.assetTypeName + "_assetType"}
                                value={assetObj.assetTypeName}
                              >
                                {assetObj.assetTypeName}
                              </option>
                            ))}
                        </select>
                      </div>
                      {asset && (
                        <div className="form-group col-md-4">
                          <label>
                            Select {asset} Properties
                            <sup style={{ color: "red" }}>*</sup>
                          </label>
                          <select
                            className="custom-select form-control-sm"
                            ref={inputSerialNoReference}
                            value={serialNumber}
                            onChange={handlePropertyChangeChange}
                            disabled={isDisabled}
                            required
                          >
                            <option value="">
                              --Select {asset} Properties--
                            </option>
                            {assetTypeDetails.map((assetp) => (
                              <option
                                key={assetp.id + "_assetProperties"}
                                value={assetp.id}
                              >
                                {`${assetp.model} ${assetp.serialNumber} ${assetp.processor} ${assetp.genration} ${assetp.ram} ${assetp.hdd}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div className="form-group col-md-4">
                        <label>
                          Select AssignedBy
                          <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <select
                          className="custom-select form-control-sm"
                          ref={inputAssignedByReference}
                          value={assignedBy}
                          onChange={(e) => setAssignedBy(e.target.value)}
                          disabled={isDisabled}
                          required
                        >
                          <option value="">--Select AssignedBy--</option>
                          {users
                            .filter((userObj) => userObj.isActive === true)
                            .map((userObj) => (
                              <option
                                key={userObj.userID}
                                value={userObj.userID}
                              >
                                {userObj.firstName}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="form-group col-md-4">
                        <label>
                          Select ApprovedBy
                          <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <select
                          className="custom-select form-control-sm"
                          ref={inputApprovedByReference}
                          value={approvedBy}
                          onChange={(e) => setApprovedBy(e.target.value)}
                          disabled={isDisabled}
                          required
                        >
                          <option value="">--Select ApprovedBy--</option>
                          {users
                            .filter((userObj) => userObj.isActive === true)
                            .map((userObj) => (
                              <option
                                key={userObj.userID}
                                value={userObj.userID}
                              >
                                {userObj.firstName}
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="form-group col-md-4">
                        <label>
                          Select ReviewedBy
                          <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <select
                          className="custom-select form-control-sm"
                          ref={inputReviewedByReference}
                          value={reviewedBy}
                          onChange={(e) => setReviewedBy(e.target.value)}
                          disabled={isDisabled}
                          required
                        >
                          <option value="">--Select ReviewedBy--</option>
                          {users
                            .filter((userObj) => userObj.isActive === true)
                            .map((userObj) => (
                              <option
                                key={userObj.userID}
                                value={userObj.userID}
                              >
                                {userObj.firstName}
                              </option>
                            ))}
                        </select>
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="specificationInput">
                          Specifications <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="specificationInput"
                          value={specification}
                          ref={inputSpecificationReference}
                          onChange={(e) => setSpecification(e.target.value)}
                          readOnly={isReadOnly}
                          placeholder="Enter Specifications.."
                          required
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="remarksInput">
                          Remarks <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="remarksInput"
                          value={remarks}
                          ref={inputRemarksReference}
                          onChange={(e) => setRemarks(e.target.value)}
                          readOnly={isReadOnly}
                          placeholder="Enter Remarks..."
                          required
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="assignedDateInput">
                          Assigned Date
                          <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <div
                          className="input-group"
                          id="assignedDate"
                          data-target-input="nearest"
                        >
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            id="purchaseDate"
                            placeholder="Assigned Date"
                            data-target="#projectStartDate"
                            value={assignedDate}
                            ref={inputAssignedDateReference}
                            onChange={(e) => setAssignedDate(e.target.value)}
                            readOnly={isReadOnly}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="assignedTillDateInput">
                          Assigned Till Date
                          <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <div
                          className="input-group"
                          id="assignedTillDate"
                          data-target-input="nearest"
                        >
                          <input
                            type="date"
                            className="form-control form-control-sm"
                            id="assignedTillDate"
                            placeholder="Assigned Till Date"
                            data-target="#projectEndDate"
                            value={assignedTillDate}
                            ref={inputAssignedTillDateReference}
                            onChange={(e) =>
                              setAssignedTillDate(e.target.value)
                            }
                            readOnly={isReadOnly}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="isActiveInput">
                          isActive
                        </label>
                        <select
                          className="form-control form-control-sm"
                          id="isActiveInput"
                          ref={inputIsActiveReference}
                          value={isActive}
                          onChange={(e) => setIsActive(e.target.value)}
                          placeholder="Select Status"
                          disabled={isDisabled}
                        >
                          <option value="true">Assign</option>
                          <option value="false">UnAssign</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-12 text-sm">
                      <label>
                        Upload Asset Images <sup style={{ color: "red" }}>*</sup> (Min 10)
                      </label>
                      <div className="row">
                        {mandateAttachmentsFile.map((file, index) => (
                          <div key={file.attachId || index} className="col-md-1 text-center mb-1">
                            <div className="position-relative">
                              <img
                                src={
                                  file.fileAdded === "New"
                                    ? URL.createObjectURL(file.selectedFile)
                                    : file.selectedFile
                                }
                                alt={`Asset ${index + 1}`}
                                className="img-thumbnail"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  cursor: "pointer",
                                  borderRadius: "5px",
                                  opacity: file.fileAdded === "Old" ? "0.6" : "1",
                                }}
                                onClick={() => setPreviewIndex(index)}
                              />

                              {/* Delete Button for New Images */}
                              {file.fileAdded === "New" && !isDisabled && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger position-absolute"
                                  style={{
                                    top: "0px",
                                    right: "0px",
                                    padding: "2px 5px",
                                    fontSize: "10px",
                                  }}
                                  onClick={() => handleRemoveMandateAttachment(index)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              )}

                              {/* Delete Button for Existing (Old) Images in Edit Mode */}
                              {file.fileAdded === "Old" && !isDisabled && updateOrDeleteId && (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-danger position-absolute"
                                  style={{
                                    top: "0px",
                                    right: "0px",
                                    padding: "2px 5px",
                                    fontSize: "10px",
                                  }}
                                  onClick={() => deleteMandateAttachment(file.attachId)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        ))}

                        {/* Upload Button for New Files */}
                        {mandateAttachmentsFile.length < 10 && (
                          <div className="col-md-1 text-center">
                            <input
                              type="file"
                              accept=".jpg,.jpeg,.png,.jfif"
                              multiple={true}
                              className="d-none"
                              id="mandateFileInput"
                              disabled={isDisabled}
                              onChange={handleMandateFileChange}
                            />
                            <label
                              htmlFor="mandateFileInput"
                              className="btn btn-outline-primary d-block"
                              readOnly={isReadOnly}
                              style={{
                                width: "50px",
                                height: "50px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                fontSize: "10px",
                                padding: "5px",
                                borderRadius: "5px",
                              }}
                            >
                              <i className="fas fa-upload"></i>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="card-footer mt-2">
                      {isLoaderActive ? (
                        <PleaseWaitButton className="float-right btn-xs mr-2 font-weight-medium auth-form-btn" />
                      ) : (
                        <button
                          type="submit"
                          className="custom-success-button mr-2"
                          disabled={isDisabled}
                        >
                          Save & Submit
                        </button>
                      )}
                      <button
                        type="button"
                        className="custom-secondary-button"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card card-danger card-outline">
                <div className="card-header">
                  <h3 className="card-title text-sm">
                    Assets List ( {assetAssignmentListData.length} )
                  </h3>

                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      id="listOfProjectsHeaderExpandButtion"
                      onClick={(e) => {
                        listOfHeaderExpandButtionClick(e);
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
                  <table
                    id="example1"
                    className="improved-table">
                    <thead>
                      <tr>
                        <th
                          className="text-center"
                          style={{ fontWeight: "500", fontSize: "smaller" }}
                        >
                          Sr. No.
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          User
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          Asset Type
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          AssignedBy
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          ApprovedBy
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          Assigned Date
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          Assigned TillDate
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          ReviewedBy
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          Specifications
                        </th>
                        <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                          Remarks
                        </th>
                        <th
                          className="sticky-action text-center"
                          style={{
                            fontWeight: "500",
                            fontSize: "smaller",
                            width: "9%",
                          }}
                        >
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {assetAssignmentListData.length > 0
                        ? assetAssignmentListData
                          .filter((roleObj) => roleObj.isActive === true)
                          .map((roleObj, index) => {
                            return (
                              <tr key={roleObj.id}>
                                <td className="text-center">{index + 1}</td>
                                <td>
                                  {getUserFirstNameById(roleObj.assignedUser)}
                                </td>
                                <td>{roleObj.assetName}</td>
                                <td>
                                  {getUserFirstNameById(roleObj.assignedBy)}
                                </td>
                                <td>
                                  {getUserFirstNameById(roleObj.approvedBy)}
                                </td>
                                <td>
                                  {new Date(
                                    roleObj.assignedDate
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  {new Date(
                                    roleObj.assignedTillDate
                                  ).toLocaleDateString()}
                                </td>
                                <td>
                                  {getUserFirstNameById(roleObj.reviewedBy)}
                                </td>
                                <td>{roleObj.specifications}</td>
                                <td>{roleObj.remarks}</td>
                                <td className="sticky-action">
                                  <button
                                    type="button"
                                    className="btn bg-info btn-xs"
                                    onClick={(e) =>
                                      handleEditAssetAssignmentDetails(
                                        roleObj
                                      )
                                    }
                                    style={{
                                      padding: "5px",
                                      fontSize: ".75rem",
                                      lineHeight: "0",
                                      borderRadius: ".15rem",
                                    }}
                                  >
                                    <i
                                      className="fas fa-eye"
                                      style={{ fontSize: "smaller" }}
                                    ></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn bg-gradient-warning btn-xs ml-1 mb-1"
                                    onClick={() =>
                                      handleHistoryClick(roleObj.id)
                                    }
                                    style={{
                                      padding: "5px",
                                      fontSize: ".75rem",
                                      lineHeight: "0",
                                      borderRadius: ".15rem",
                                    }}
                                  >
                                    <i
                                      className="fas fa-glasses"
                                      style={{ fontSize: "smaller" }}
                                    ></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn bg-gradient-danger btn-xs ml-1 mt-1"
                                    onClick={() => handleRemove(roleObj.id)}
                                  >
                                    <i
                                      className="fas fa-trash"
                                      style={{ fontSize: "smaller" }}
                                    ></i>
                                  </button>
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
                By clicking on Yes delete all the Asset Assignment details. Once
                you deleted it can not be recovered.
              </p>
            </div>
            <div className="modal-footer col-md-12">
              <button className="btn btn-default btn-sm" data-bs-dismiss="modal">
                Cancel
              </button>
              {isLoaderActive ? (
                <PleaseWaitButton className="btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn" />
              ) : (
                <button
                  className="btn btn-warning btn-sm pl-3 pr-3 ml-2"
                  onClick={(e) => {
                    confirmDelete(e);
                  }}
                >
                  Yes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {previewIndex !== null && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            style={{ maxWidth: "600px" }}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Preview Image</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setPreviewIndex(null)}
                >
                  <span>×</span>
                </button>
              </div>
              <div className="modal-body text-center position-relative">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setPreviewIndex((prev) => (prev > 0 ? prev - 1 : prev))}
                  hidden={previewIndex === 0}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    padding: "5px 10px",
                    fontSize: "20px",
                    borderRadius: "50%",
                  }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>

                <div
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={
                      mandateAttachmentsFile[previewIndex].fileAdded === "New"
                        ? URL.createObjectURL(mandateAttachmentsFile[previewIndex].selectedFile)
                        : mandateAttachmentsFile[previewIndex].selectedFile
                    }
                    alt="Preview"
                    style={{
                      maxWidth: "90%",
                      maxHeight: "350px",
                      objectFit: "contain",
                      borderRadius: "5px",
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() =>
                    setPreviewIndex((prev) =>
                      prev < mandateAttachmentsFile.length - 1 ? prev + 1 : prev
                    )
                  }
                  hidden={previewIndex === mandateAttachmentsFile.length - 1}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    padding: "5px 10px",
                    fontSize: "20px",
                    borderRadius: "50%",
                  }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {viewDocymenchekIndex !== null && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" data-backdrop="static" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: "600px", zIndex: "1055" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Preview Image</h5>
                <button type="button" className="close" onClick={closeViewDocymenchek} aria-label="Close">
                  <span>×</span>
                </button>
              </div>
              <div className="modal-body text-center position-relative">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setViewDocymenchekIndex((prev) => (prev > 0 ? prev - 1 : prev))}
                  hidden={viewDocymenchekIndex === 0}
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", zIndex: 10, padding: "5px 10px", fontSize: "20px", borderRadius: "50%" }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div style={{ maxWidth: "100%", maxHeight: "400px", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
                  <img
                    src={viewDocymenchekAttachments[viewDocymenchekIndex].attachmentServerPath}
                    alt="Preview"
                    style={{ maxWidth: "90%", maxHeight: "350px", objectFit: "contain", borderRadius: "5px", boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setViewDocymenchekIndex((prev) => (prev < viewDocymenchekAttachments.length - 1 ? prev + 1 : prev))}
                  hidden={viewDocymenchekIndex === viewDocymenchekAttachments.length - 1}
                  style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", zIndex: 10, padding: "5px 10px", fontSize: "20px", borderRadius: "50%" }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className={`modal fade ${showLogViewModal ? "show d-block" : ""}`} tabIndex="-1" role="dialog" aria-labelledby="myModal" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title card-title text-sm">Asset History</h4>
              <button type="button" className="custom-success-gradient-button" onClick={() => setShowLogsViewModal(false)} aria-label="Close"> <i className="fa fa-times"></i>
              </button>
            </div>
            <div className="modal-body" style={{ maxHeight: "400px", overflowY: "auto", padding: "5px" }}>
              <table id="example1" className="table table-bordered table-sm table-striped">
                <thead>
                  <tr>
                    <th>Sr. No</th>
                    <th>Date</th>
                    <th>Serial No</th>
                    <th>User</th>
                    <th>By</th>
                    <th>Approved</th>
                    <th>Reviewed</th>
                    <th>Till</th>
                    <th>Attachments</th>
                  </tr>
                </thead>
                <tbody>
                  {assetHistory.length > 0 ? (
                    assetHistory.map((data, index) => (
                      <tr key={index} style={{ textDecoration: data.isActive ? "none" : "line-through" }}>
                        <td>{index + 1}</td>
                        <td>{new Date(data.assignedDate).toLocaleDateString()}</td>
                        <td>
                          <span className="badge bg-info text-white p-1 rounded">{data.serialNumber}</span>
                        </td>
                        <td>{getUserFirstNameById(data.assignedUser)}</td>
                        <td>{getUserFirstNameById(data.assignedBy)}</td>
                        <td>{getUserFirstNameById(data.approvedBy)}</td>
                        <td>{getUserFirstNameById(data.reviewedBy)}</td>
                        <td>{new Date(data.assignedTillDate).toLocaleDateString()}</td>
                        <td>
                          {data.docForAssetsHistoryAssignment && data.docForAssetsHistoryAssignment.length > 0 ? (
                            data.docForAssetsHistoryAssignment.map((doc, docIndex) => (
                              <span
                                key={docIndex}
                                onClick={() => openViewDocymenchek(data.docForAssetsHistoryAssignment, docIndex)}
                                className="d-inline-block text-center mx-1 cursor-pointer"
                                style={{ width: "20px" }}
                              >
                                <i className="fas fa-paperclip"></i>
                              </span>
                            ))
                          ) : (
                            <span>No Attachments</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center">
                        No history available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManageAssets;