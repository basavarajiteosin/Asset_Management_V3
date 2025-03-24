import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../../shared/PleaseWaitButton";
import axios from "axios";
import $ from "jquery";
const config = require("../../../services/config.json");

function AssetHistory() {
  const inputAssetReference = useRef(null);
  const inputAssetSelectedReference = useRef(null);
  const inputAssignedByReference = useRef(null);
  const inputWarrantyStatusReference = useRef(null);
  const inputAssignedUserReference = useRef(null);
  const inputApprovedByReference = useRef(null);
  const inputAssignedDateReference = useRef(null);
  const inputAssignedTillDateReference = useRef(null);
  const inputProcessorReference = useRef(null);
  const inputGenerationReference = useRef(null);
  const inputRamReference = useRef(null);
  const inputHddReference = useRef(null);
  const inputPurchaseDateReference = useRef(null);
  const inputVendorNameReference = useRef(null);

  const [asset, setAsset] = useState("");
  const [assetType, setAssetType] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [assignedUser, setAssignedUser] = useState("");
  const [assignedBy, setAssignedBy] = useState("");
  const [approvedBy, setApprovedBy] = useState("");
  const [assignedDate, setAssignedDate] = useState("");
  const [assignedTillDate, setAssignedTillDate] = useState("");
  const [processor, setProcessor] = useState("");
  const [generation, setGeneration] = useState("");
  const [ram, setRam] = useState("");
  const [hdd, setHdd] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [warrantyStatus, setWarrantyStatus] = useState("");
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [viewFields, setViewFields] = useState(false);
  const [allAssetType, setAssetTypeDetailsFromAssetTypeMaster] = useState([]);
  const [allAssetTypeFromAssetmaster, setAssetTypeDetailsFromAssetMaster] =
    useState([]);
  const [assetDetailsArray, setAssetDetailsArray] = useState([]);

  useEffect(() => {
    getAllAssetType();
    window.initDatePickerFuncation();
  }, []);

  useEffect(() => {
    if (asset) {
      getAssetTypeDetailsFromAssetMaster(asset);
    }
  }, [asset]);

  useEffect(() => {
    if (assetType) {
      fetchAssetDetails(assetType);
    }
  }, [assetType]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (asset.trim() === "") {
      toast.error("Please select Asset Type.");
      inputAssetReference.current.focus();
      inputAssetReference.current.classList.add("is-invalid");
      return;
    }
    if (assetType.trim() === "") {
      toast.error("Please select Model and Serial No.");
      inputAssetSelectedReference.current.focus();
      inputAssetSelectedReference.current.classList.add("is-invalid");
      return;
    }

    listOfHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelClick = (e) => {
    e.preventDefault();

    setAsset("");
    setAssetType("");
    setAssignedUser("");
    setAssignedBy("");
    setViewFields(false);

    inputAssetReference.current.classList.remove("is-invalid");

    listOfHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleView = (e) => {
    setViewFields(!viewFields);
  };

  const addCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  };

  const listOfHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButton").click();
  };

  const getAllAssetType = () => {
    window.initDestroyDataTableFuncation();
    axios
      .get(config.API_URL + "AssetManagement/GetAllAssetTypeDetails")
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success) {
            if (response.data.data.length > 0) {
              setAssetTypeDetailsFromAssetTypeMaster(response.data.data);
              setTimeout(() => {
                window.initDataTableFuncation();
              }, 1000);
            } else {
              console.warn("No Asset Type found");
            }
          } else {
            toast.error(response.data.message);
            setTimeout(() => {
              window.initDataTableFuncation();
            }, 1000);
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

  const getAssetTypeDetailsFromAssetMaster = (assetType) => {
    window.initDestroyDataTableFuncation();
    axios
      .get(
        `${config.API_URL}AssetManagement/GetAssetDetailByAssetType?inputAssetType=${assetType}`
      )
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success) {
            if (response.data.data.length > 0) {
              setAssetTypeDetailsFromAssetMaster(response.data.data);
              setTimeout(() => {
                window.initDataTableFuncation();
              }, 1000);
            } else {
              console.warn("No Asset found");
            }
          } else {
            toast.error(response.data.message);
            setTimeout(() => {
              window.initDataTableFuncation();
            }, 1000);
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

  const fetchAssetDetails = (selectedAssetType) => {
    const selectedModel = allAssetTypeFromAssetmaster.find(
      (asset) => asset.serialNumber === selectedAssetType
    );

    if (selectedModel) {
      const { model, serialNumber } = selectedModel;

      // console.log("Selected Model:", selectedModel);

      axios
        .get(
          `${config.API_URL}AssetManagement/GetAssetAssignmentDetailByAssetType?inputAssetType=${asset}`
        )
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            const assetDetailsByType = response.data.data;

            if (assetDetailsByType) {
              // console.log("Asset Details By Type:", assetDetailsByType);
              setAssignedUser(assetDetailsByType.assignedUser);
              setAssignedBy(assetDetailsByType.assignedBy);
              setApprovedBy(assetDetailsByType.approvedBy);
            } else {
              // console.log("No matching asset details found by type");
            }
          }
        })
        .catch((error) => {
          console.error("API Error:", error);
          toast.error("Oops, something went wrong. Please try again later.");
        });

      axios
        .get(
          `${config.API_URL}AssetManagement/GetAssetAssignmentDetailByModelAndSNo?inputModel=${model}&inputSno=${serialNumber}`
        )
        .then((response) => {
          if (response.status === 200 && response.data.success) {
            const assetDetailsArray = response.data.data;

            setAssetDetailsArray(assetDetailsArray);
          } else {
            // console.log(
            //   "No matching asset details found by model and serial number"
            // );
          }
        })
        .catch((error) => {
          console.error("Error fetching asset details:", error);
        });
    }
  };

  return (
    <div>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Asset History</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="#">Home</Link>
                </li>
                <li className="breadcrumb-item active">Asset History</li>
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
                  <h3 className="card-title text-sm">Track Asset History</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      id="AddNewHeaderButtion"
                      onClick={(e) => {
                        addCardHeaderButtonClick(e);
                      }}
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-plus"></i> Asset History
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
                          Asset
                          <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <select
                          className="custom-select form-control-sm"
                          ref={inputAssetReference}
                          value={asset}
                          onChange={(e) => setAsset(e.target.value)}
                        >
                          <option value="">--Select Asset--</option>
                          {allAssetType.map((assetObj) => (
                            <option
                              key={assetObj.assetTypeName}
                              value={assetObj.assetTypeName}
                            >
                              {assetObj.assetTypeName}
                            </option>
                          ))}
                        </select>
                      </div>
                      {asset && (
                        <>
                          <div className="form-group col-md-4">
                            <label>
                              Model
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <select
                              className="custom-select form-control-sm"
                              ref={inputAssetSelectedReference}
                              value={assetType}
                              onChange={(e) => setAssetType(e.target.value)}
                            >
                              <option value="">--Select Model--</option>
                              {allAssetTypeFromAssetmaster.map((assetO) => (
                                <option
                                  key={assetO.serialNumber}
                                  value={assetO.serialNumber}
                                >
                                  {"Model : " +
                                    assetO.model +
                                    " " +
                                    " Serial Number: " +
                                    assetO.serialNumber}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="assignedUserInput">
                              Assigned User{" "}
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="assignedUserInput"
                              value={assignedUser}
                              ref={inputAssignedUserReference}
                              placeholder="Assigned User..."
                              readOnly
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="assignedByInput">
                              Assigned By <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="assignedByInput"
                              value={assignedBy}
                              ref={inputAssignedByReference}
                              placeholder="Assigned By..."
                              readOnly
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="approvedByInput">
                              Approved By <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="approvedByInput"
                              value={approvedBy}
                              ref={inputApprovedByReference}
                              placeholder="Approved By..."
                              readOnly
                            />
                          </div>
                        </>
                      )}
                    </div>
                    <div className="card-footer text-sm">
                      {isLoaderActive ? (
                        <PleaseWaitButton className="float-right btn-xs ml-2 font-weight-medium auth-form-btn" />
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-success float-right btn-xs ml-2"
                        >
                          Save & Submit
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-default float-right btn-xs"
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
                    Asset History List ( {assetDetailsArray.length} )
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
                    className="table table-bordered table-sm table-striped"
                  >
                    <thead>
                      <tr>
                        <th
                          className="text-center"
                          style={{ fontWeight: "500", fontSize: "smaller" }}
                        >
                          Sr. No.
                        </th>
                        <th
                          className="text-center"
                          style={{ fontWeight: "500", fontSize: "smaller" }}
                        >
                          assignedDate
                        </th>
                        <th
                          className="text-center"
                          style={{ fontWeight: "500", fontSize: "smaller" }}
                        >
                          assignedTillDate
                        </th>
                        <th
                          className="text-center"
                          style={{ fontWeight: "500", fontSize: "smaller" }}
                        >
                          processor
                        </th>
                        <th
                          className="text-center"
                          style={{ fontWeight: "500", fontSize: "smaller" }}
                        >
                          generation
                        </th>
                        <th
                          className="text-center"
                          style={{ fontWeight: "500", fontSize: "smaller" }}
                        >
                          ram
                        </th>
                        <th
                          className="text-center"
                          style={{ fontWeight: "500", fontSize: "smaller" }}
                        >
                          hdd
                        </th>
                        <th
                          className="text-center"
                          style={{ fontWeight: "500", fontSize: "smaller" }}
                        >
                          purchaseDate
                        </th>
                        <th
                          className="text-center"
                          style={{ fontWeight: "500", fontSize: "smaller" }}
                        >
                          vendorName
                        </th>
                        <th
                          className="text-center"
                          style={{ fontWeight: "500", fontSize: "smaller" }}
                        >
                          warrantyStatus
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {assetDetailsArray.map((assetDetails, index) => (
                        <tr key={index}>
                          <td>{assetDetails.assignedDate}</td>
                          <td>{assetDetails.assignedTillDate}</td>
                          <td>{assetDetails.processor}</td>
                          <td>{assetDetails.generation}</td>
                          <td>{assetDetails.ram}</td>
                          <td>{assetDetails.hdd}</td>
                          <td>{assetDetails.purchaseDate}</td>
                          <td>{assetDetails.vendorName}</td>
                          <td>{assetDetails.warrantyStatus}</td>
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
    </div>
  );
}

export default AssetHistory;
