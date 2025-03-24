import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../../shared/PleaseWaitButton";
import axios from "axios";
import $ from "jquery";

const config = require("../../../services/config.json");
function ProcessorMaster() {
  const inputProcessorNameReference = useRef(null);

  const [processor, setProcessor] = useState([]);
  const [id, setProcessorId] = useState("");
  const [newProcessorName, setNewProcessorName] = useState("");
  const [selectedProcessorName, setSelectedProcessorName] = useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [error, setError] = useState("");
  const [processorNameToDelete, setProcessorNameToDelete] = useState(null);

  useEffect(() => {
    getProcessorData();
  }, []);

  const getProcessorData = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllProcessorDetails"
      );
      if (response.data.data.length > 0) {
        // console.log("data", response.data.data);
        setProcessor(response.data.data);
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

    if (newProcessorName.trim() === "") {
      toast.error("Please enter processorName.");
      inputProcessorNameReference.current.focus();
      inputProcessorNameReference.current.classList.add("is-invalid");
      return;
    }

    try {
      setIsLoaderActive(true);
      let response;

      if (id) {
        const dataToSend = {
          assetTypeId: id,
          processorName: newProcessorName.trim(),
        };

        response = await axios.post(
          `${config.API_URL}AssetManagement/UpdateProcessor?processorId=${id}`,
          dataToSend
        );
        toast.success("Data Updated Successfully.");
      } else {
        response = await axios.post(
          `${config.API_URL}AssetManagement/CreateProcessor`,
          { processorName: newProcessorName.trim() }
        );
        toast.success(`${newProcessorName} Successfully Created`);
      }

      if (response.status === 200) {
        const responseData = response.data;
        if (responseData.success) {
          if (selectedProcessorName) {
            const updatedProcessor = processor.map((processor) =>
              processor.id === selectedProcessorName.id
                ? { ...processor, processorName: responseData.processorName }
                : processor
            );
            setProcessor(updatedProcessor);
            // console.log("Updated Data:", updatedProcessor);
          } else {
            setProcessor([...processor, responseData]);
            // console.log("Updated Data:", [...processor, responseData]);
          }
          setNewProcessorName("");
          setError("");
          setSelectedProcessorName(null);
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
    getProcessorData();
  };

  const handleCancelClick = (e) => {
    setNewProcessorName("");
    setProcessorId("");
    setSelectedProcessorName("");

    inputProcessorNameReference.current.classList.remove("is-invalid");
  };

  const handleEdit = (processor) => {
    setSelectedProcessorName(processor);
    // console.log("M", processor);
    setNewProcessorName(processor.processorName);
    setProcessorId(processor.id);
  };

  const handleRemove = (processorName) => {
    setProcessorNameToDelete(processorName);
    window.confirmModalShow();
  };

  const confirmDelete = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.post(
        config.API_URL +
          `AssetManagement/RemoveProcessor?id=${processorNameToDelete.id}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setProcessor((prevProcessor) =>
          prevProcessor.filter((item) => item.id !== processorNameToDelete.id)
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
              <h4 style={{ marginBottom: "-10px" }}>Processor Type</h4>
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
                  <h3 className="card-title text-sm">Create New Processor</h3>
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
                      <i className="fas fa-plus"> Add New processor</i>
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
                        <label htmlFor="processorNameInput">
                          Processor Type<sup style={{ color: "red" }}>*</sup>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="processorNameInput"
                          value={newProcessorName}
                          ref={inputProcessorNameReference}
                          onChange={(e) => setNewProcessorName(e.target.value)}
                          placeholder="Processor Type..."
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

            {processor.length > 0 && (
              <div className="col-md-6">
                <div className="card card-danger card-outline">
                  <div className="card-header">
                    <h3 className="card-title text-sm">
                      Processor List ( {processor.length} )
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
                            <th>Processor Type</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {processor.map((processors, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{processors.processorName}</td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn bg-gradient-warning btn-xs"
                                  onClick={() => handleEdit(processors)}
                                >
                                  <i className="fas fa-pen"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn bg-gradient-danger btn-xs ml-2"
                                  onClick={() => handleRemove(processors)}
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
                By clicking on Yes ProcessorName will be Deleted. Once you
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

export default ProcessorMaster;
