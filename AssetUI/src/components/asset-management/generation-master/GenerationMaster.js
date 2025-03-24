import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../../shared/PleaseWaitButton";
import axios from "axios";
import $ from "jquery";

const config = require("../../../services/config.json");
function GenrationMaster() {
  const inputGenrationNameReference = useRef(null);

  const [genration, setGenration] = useState([]);
  const [id, setGenrationId] = useState("");
  const [newGenrationName, setNewGenrationName] = useState("");
  const [selectedGenrationName, setSelectedGenrationName] = useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [error, setError] = useState("");
  const [genrationNameToDelete, setGenrationNameToDelete] = useState(null);

  useEffect(() => {
    getGenrationData();
  }, []);

  const getGenrationData = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllGenrationDetails"
      );
      if (response.data.data.length > 0) {
        // console.log("data", response.data.data);
        setGenration(response.data.data);
      }
      setTimeout(() => {
        window.initDataTableFuncation();
      }, 1000);
    } catch (error) {
      console.error("Error fetching Data:", error);
      toast.error("Failed to fetch Data.");
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newGenrationName.trim() === "") {
      toast.error("Please enter genrationName.");
      inputGenrationNameReference.current.focus();
      inputGenrationNameReference.current.classList.add("is-invalid");
      return;
    }

    try {
      setIsLoaderActive(true);
      let response;

      if (id) {
        const dataToSend = {
          assetTypeId: id,
          genrationName: newGenrationName.trim(),
        };

        response = await axios.post(
          `${config.API_URL}AssetManagement/UpdateGenration?genrationId=${id}`,
          dataToSend
        );
        toast.success("Data Updated Successfully.");
      } else {
        response = await axios.post(
          `${config.API_URL}AssetManagement/CreateGenration`,
          { genrationName: newGenrationName.trim() }
        );
        toast.success(`${newGenrationName} Successfully Created`);
      }

      if (response.status === 200) {
        const responseData = response.data;
        if (responseData.success) {
          if (selectedGenrationName) {
            const updatedGenration = genration.map((genration) =>
              genration.id === selectedGenrationName.id
                ? { ...genration, genrationName: responseData.genrationName }
                : genration
            );
            setGenration(updatedGenration);
            // console.log("Updated Data:", updatedGenration);
          } else {
            setGenration([...genration, responseData]);
            // console.log("Updated Data:", [...genration, responseData]);
          }
          setNewGenrationName("");
          setError("");
          setSelectedGenrationName(null);
        }
      }
    } catch (error) {
      // console.log(error);
      if (error.response && error.response.data) {
        const errorMessage = error.response.data;
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoaderActive(false);
    }

    handleCancelClick();
    getGenrationData();
  };

  const handleCancelClick = (e) => {
    setNewGenrationName("");
    setSelectedGenrationName("");
    setGenrationId("");

    inputGenrationNameReference.current.classList.remove("is-invalid");
  };

  const handleEdit = (genration) => {
    setSelectedGenrationName(genration);
    // console.log("M", genration);
    setNewGenrationName(genration.genrationName);
    setGenrationId(genration.id);
  };

  const handleRemove = (genrationName) => {
    setGenrationNameToDelete(genrationName);
    window.confirmModalShow();
  };

  const confirmDelete = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.post(
        config.API_URL +
          `AssetManagement/RemoveGenration?id=${genrationNameToDelete.id}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setGenration((prevGenration) =>
          prevGenration.filter((item) => item.id !== genrationNameToDelete.id)
        );
      }
      setIsLoaderActive(false);
      window.confirmModalHide();
    } catch (error) {
      console.error("Error deleting Data:", error);
      toast.error("Failed to delete Data.");
      setIsLoaderActive(false);
    }
  };

  // const addCardHeaderButtonClick = () => {
  //   $("#listOfProjectsHeaderExpandButtion").click();
  // };

  const listOfHeaderExpandButtionClick = () => {
    // $("#AddNewHeaderButton").click();
  };

  return (
    <div>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row" style={{ marginTop: "-20px" }}>
            <div className="col-sm-6">
              <h4 style={{ marginBottom: "-10px" }}>Genration Type</h4>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <div className="card card-danger card-outline">
                <div className="card-header">
                  <h3 className="card-title text-sm">
                    Create New GenrationName
                  </h3>
                  <div className="card-tools">
                    {/* <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      id="AddNewHeaderButton"
                      onClick={(e) => {
                        addCardHeaderButtonClick(e);
                      }}
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-plus"> Add New genration</i>
                    </button> */}
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
                        <label htmlFor="genrationNameInput">
                          Genration Type<sup style={{ color: "red" }}>*</sup>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="genrationNameInput"
                          value={newGenrationName}
                          ref={inputGenrationNameReference}
                          onChange={(e) => setNewGenrationName(e.target.value)}
                          placeholder="Generation Type..."
                        />
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

            {genration.length > 0 && (
              <div className="col-md-6">
                <div className="card card-danger card-outline">
                  <div className="card-header">
                    <h3 className="card-title text-sm">
                      Genration List ( {genration.length} )
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
                    <div
                      className="table-responsive"
                      style={{ maxHeight: "325px", overflowY: "auto" }}
                    >
                      <table
                        id="example1"
                        className="table table-bordered table-sm table-striped"
                      >
                        <thead>
                          <tr>
                            <th className="text-center">Sr. No.</th>
                            <th>Genration Type</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {genration.map((genrations, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{genrations.genrationName}</td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn bg-gradient-warning btn-xs"
                                  onClick={() => handleEdit(genrations)}
                                >
                                  <i className="fas fa-pen"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn bg-gradient-danger btn-xs ml-2"
                                  onClick={() => handleRemove(genrations)}
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
                By clicking on Yes GenrationName will be Deleted. Once you
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

export default GenrationMaster;

 {/* <div className="modal-body" style={{ maxHeight: "500px", overflowY: "auto", padding: "10px" }}>
              <div className="container-fluid">
                <div className="row justify-content-center">
                  <div className="col-md-6" style={{ padding: "0" }}>
                    {assetHistory.length > 0 ? (
                      assetHistory.map((data, index) => (
                        <div className="timeline" key={index}>
                          <div className="time-label text-center my-1">
                            <span className="badge bg-primary" style={{ fontSize: "12px", padding: "5px 10px" }}>{index + 1}.</span> <span className="badge bg-success" style={{ fontSize: "12px", padding: "5px 10px" }}>{new Date(data.assignedDate).toLocaleDateString()}</span>
                          </div>

                          {[
                            { icon: "fa-laptop", bg: "bg-info", label: "Serial No", value: data.serialNumber },
                            { icon: "fa-user", bg: "bg-success", label: "Assigned User", value: getUserFirstNameById(data.assignedUser) },
                            { icon: "fa-user-tag", bg: "bg-warning", label: "Assigned By", value: getUserFirstNameById(data.assignedBy) },
                            { icon: "fa-user-check", bg: "bg-danger", label: "Approved By", value: getUserFirstNameById(data.approvedBy) },
                            { icon: "fa-search", bg: "bg-indigo", label: "Reviewed By", value: getUserFirstNameById(data.reviewedBy) }
                          ].map((item, idx) => (
                            <div key={idx} className="d-flex align-items-center my-1">
                              <i className={`fas ${item.icon} ${item.bg} text-white d-flex justify-content-center align-items-center`}
                                style={{ width: "24px", height: "24px", fontSize: "12px", borderRadius: "50%" }}></i>
                              <div className="timeline-item border rounded p-1 ms-2" style={{ width: "180px" }}>
                                <h6 className="mb-0" style={{ fontSize: "11px" }}>
                                  <strong>{item.label}:</strong> <a href="#" className="text-primary ms-1" style={{ fontSize: "11px" }}>{item.value}</a>
                                </h6>
                              </div>
                            </div>
                          ))}

                          <div className="time-label text-center mt-2">
                            <span className="badge bg-danger" style={{ fontSize: "12px", padding: "5px 10px" }}>{new Date(data.assignedTillDate).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center" style={{ fontSize: "12px" }}>No history available.</p>
                    )}
                  </div>
                </div>
              </div>
            </div> */}