import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../../shared/PleaseWaitButton";
import axios from "axios";
import $ from "jquery";

const config = require("../../../services/config.json");

function CompanyType() {
  const inputCompanyTypesReference = useRef(null);

  const [companyTypes, setCompanyTypes] = useState([]);
  const [newCompanyType, setNewCompanyType] = useState("");
  const [selectedCompanyType, setSelectedCompanyType] = useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [error, setError] = useState("");
  const [companyTypeToDelete, setCompanyTypeToDelete] = useState(null);

  useEffect(() => {
    getCompanyTypes();
  }, []);

  const getCompanyTypes = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.get(
        config.API_URL + "Masters/GetAllCompanyMasters"
      );
      if (response.data.data.length > 0) {
        // console.log("data", response.data.data);
        setCompanyTypes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching Company Names:", error);
      toast.error("Failed to fetch Company Names.");
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newCompanyType.trim() === "") {
      // setError("Please enter Company Name.");
      setTimeout(() => {
        setError("");
      }, 2000);
      toast.error("Please Enter Company Name.");
      inputCompanyTypesReference.current.focus();
      inputCompanyTypesReference.current.classList.add("is-invalid");
      return;
    }

    const isDuplicate = companyTypes.some(
      (company) =>
        company.type &&
        company.type.toLowerCase().trim() ===
          newCompanyType.toLowerCase().trim()
    );

    if (isDuplicate) {
      // setError("Company Name already exists.");
      setTimeout(() => {
        setError("");
      }, 3000);
      toast.error("Company Name already exists.");
      return;
    }

    try {
      setIsLoaderActive(true);
      let response;
      if (selectedCompanyType) {
        response = await axios.post(
          config.API_URL + "Masters/UpdateCompanyMaster",
          {
            compnyId: selectedCompanyType.compnyId,
            cName: newCompanyType.trim(),
          }
        );
        toast.success("Company Name Updated Successfully.");
      } else {
        response = await axios.post(
          config.API_URL + "Masters/CreateCompanyMaster",
          { cName: newCompanyType.trim() }
        );
        toast.success("Successfully Created Company Name.");
      }

      if (response.status === 200) {
        const responseData = response.data;
        if (responseData.success) {
          const newCompanyTypeData = {
            compnyId: responseData.compnyId,
            cName: responseData.cName,
          };
          if (selectedCompanyType) {
            const updatedCompanyTypes = companyTypes.map((company) =>
              company.compnyId === selectedCompanyType.compnyId
                ? { ...selectedCompanyType, cName: responseData.cName }
                : company
            );
            setCompanyTypes(updatedCompanyTypes);
            // console.log("Updated Company Name:", updatedCompanyTypes);
          } else {
            // setCompanyTypes([...companyTypes, newCompanyTypeData]);
            // console.log("Updated Company Names:", [
            //   ...companyTypes,
            //   newCompanyTypeData,
            // ]);
          }
          setNewCompanyType("");
          setError("");
          setSelectedCompanyType(null);
        } else {
          toast.error(responseData.message || "Failed to Update Company Name.");
        }
      } else {
        toast.error("Failed to add/update company name.");
      }
    } catch (error) {
      console.error("Error adding/updating company name:", error);
      toast.error("Failed to add/update company name.");
    } finally {
      setIsLoaderActive(false);
    }
    listOfHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
    getCompanyTypes();
  };

  const handleCancelClick = (e) => {
    setNewCompanyType("");
    
    listOfHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (companyType) => {
    setSelectedCompanyType(companyType);
    setNewCompanyType(companyType.cName);
    const companyTypeInput = document.getElementById("companyTypeInput");
    if (companyTypeInput) {
      companyTypeInput.focus();
    }

    const isDuplicate = companyTypes.some(
      (company) =>
        company.type &&
        company.type.toLowerCase().trim() ===
          newCompanyType.toLowerCase().trim()
    );

    if (isDuplicate) {
      setError("Company Name already exists.");
      setTimeout(() => {
        setError("");
      }, 3000);
      toast.error("Company Name already exists.");
      return;
    }

    listOfHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemove = (companyType) => {
    setCompanyTypeToDelete(companyType);
    window.confirmModalShow();
  };

  const confirmDelete = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.post(
        config.API_URL +
          `Masters/DeleteCompanyMaster/${companyTypeToDelete.compnyId}`
      );
      if (response.status === 200) {
        toast.success("Company Name deleted successfully.");
        setCompanyTypes((prevCompanyTypes) =>
          prevCompanyTypes.filter(
            (item) => item.compnyId !== companyTypeToDelete.compnyId
          )
        );
      }
      setIsLoaderActive(false);
      window.confirmModalHide();
    } catch (error) {
      console.error("Error deleting company name:", error);
      toast.error("Failed to delete company name.");
      setIsLoaderActive(false);
    }
  };

  const addCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  };

  const listOfHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButton").click();
  };

  return (
    <div>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Company Type Master</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="#">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to={"/all-masters"}>Masters</Link>
                </li>
                <li className="breadcrumb-item active">Company Master</li>
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
                  <h3 className="card-title text-sm">
                    Create New Company Master
                  </h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      id="AddNewHeaderButton"
                      onClick={(e) => {
                        addCardHeaderButtonClick(e);
                      }}
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-plus"></i> Add New Company
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
                        <label htmlFor="companyTypeInput">
                          Company Name<sup style={{ color: "red" }}>*</sup>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="companyTypeInput"
                          value={newCompanyType}
                          ref={inputCompanyTypesReference}
                          onChange={(e) => setNewCompanyType(e.target.value)}
                        />
                        {error && <div className="text-danger">{error}</div>}
                      </div>
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
          {companyTypes.length > 0 && (
            <div className="row">
              <div className="col-md-12">
                <div className="card card-danger card-outline">
                  <div className="card-header">
                    <h3 className="card-title text-sm">
                      Company Master List ( {companyTypes.length} )
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
                    <table className="table table-bordered table-sm table-striped">
                      <thead>
                        <tr>
                          <th className="text-center">Sr. No.</th>
                          <th>Company Name</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyTypes.map((companyType, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>{companyType.cName}</td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="btn bg-gradient-warning btn-xs"
                                onClick={() => handleEdit(companyType)}
                              >
                                <i className="fas fa-pen"></i>
                              </button>
                              <button
                                type="button"
                                className="btn bg-gradient-danger btn-xs ml-2"
                                onClick={() => handleRemove(companyType)}
                              >
                                <i className="fas fa-trash"></i>
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
          )}
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
                By clicking on Yes delete all the task details. Once you deleted
                it can not be recovered.
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
    </div>
  );
}

export default CompanyType;
