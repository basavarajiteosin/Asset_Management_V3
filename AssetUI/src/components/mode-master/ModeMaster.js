import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import axios from "axios";
import $ from "jquery";

const config = require("../../services/config.json");

function ModeMaster() {
  const inputModeMasterReference = useRef(null);

  const [modeTypes, setModeTypes] = useState([]);
  const [newModeType, setNewModeType] = useState("");
  const [selectedModeType, setSelectedModeType] = useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [error, setError] = useState("");
  const [modeTypeToDelete, setModeTypeToDelete] = useState(null);

  useEffect(() => {
    getModeTypes();
  }, []);

  const getModeTypes = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.get(
        config.API_URL + "Masters/GetAllModes"
      );
      if (response.data.data.length > 0) {
        // console.log("data", response.data.data);
        setModeTypes(response.data.data);
      }
    } catch (error) {
      // console.error("Error fetching mode types:", error);
      toast.error("Failed to fetch mode types.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newModeType.trim() === "") {
      // setError("Please enter mode type.");
      setTimeout(() => {
        setError("");
      }, 2000);
      toast.error("Please Enter Mode type.", config.tostar_config);
      inputModeMasterReference.current.focus();
      inputModeMasterReference.current.classList.add("is-invalid");
      return;
    }

    const isDuplicate = modeTypes.some(
      (mode) =>
        mode.type &&
        mode.type.toLowerCase().trim() === newModeType.toLowerCase().trim()
    );

    if (isDuplicate) {
      // setError("Mode type already exists.");
      setTimeout(() => {
        setError("");
      }, 3000);
      toast.error("Mode type already exists.", config.tostar_config);
      return;
    }

    try {
      setIsLoaderActive(true);
      let response;
      if (selectedModeType) {
        response = await axios.post(
          config.API_URL + "Masters/UpdateMode",
          {
            mId: selectedModeType.mId,
            mTypes: newModeType.trim(),
          }
        );
        toast.success("Mode Type Updated Successfully.", config.tostar_config);
      } else {
        response = await axios.post(
          config.API_URL + "Masters/CreateMode",
          { mTypes: newModeType.trim() }
        );
        toast.success("Successfully Created ModeType.", config.tostar_config);
      }

      if (response.status === 200) {
        const responseData = response.data;
        if (responseData.success) {
          const newModeTypeData = {
            mId: responseData.mId,
            mTypes: responseData.mTypes,
          };
          if (selectedModeType) {
            const updatedModeTypes = modeTypes.map((mode) =>
              mode.mId === selectedModeType.mId
                ? { ...selectedModeType, mTypes: responseData.mTypes }
                : mode
            );
            setModeTypes(updatedModeTypes);
            // console.log("Updated mode Types:", updatedModeTypes);
          } else {
            setModeTypes([...modeTypes, newModeTypeData]);
            // console.log("Updated mode Types:", [...modeTypes, newModeTypeData]);
          }
          setNewModeType("");
          setError("");
          setSelectedModeType(null);
        } else {
          toast.error(responseData.message || "Failed to update Mode type.", config.tostar_config);
        }
      } else {
        toast.error("Failed to add/update Mode type.", config.tostar_config);
      }
    } catch (error) {
      console.error("Error adding/updating Mode type:", error);
      toast.error("Failed to add/update Mode type.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
    listOfHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
    getModeTypes();
  };

  const handleCancelClick = (e) => {
    setNewModeType("");
    listOfHeaderExpandButtionClick();
    inputModeMasterReference.current.classList.remove("is-invalid");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (modeType) => {
    setSelectedModeType(modeType);
    setNewModeType(modeType.mTypes);
    const modeTypeInput = document.getElementById("modeTypeInput");
    if (modeTypeInput) {
      modeTypeInput.focus();
    }
    listOfHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemove = (modeType) => {
    setModeTypeToDelete(modeType);
    window.confirmModalShow();
  };

  const confirmDelete = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.post(
        config.API_URL + `Masters/DeleteMode/${modeTypeToDelete.mId}`
      );
      if (response.status === 200) {
        toast.success("Mode Type deleted successfully.", config.tostar_config);
        setModeTypes((prevModeTypes) =>
          prevModeTypes.filter((item) => item.mId !== modeTypeToDelete.mId)
        );
      }
      setIsLoaderActive(false);
      window.confirmModalHide();
    } catch (error) {
      console.error("Error deleting mode type:", error);
      toast.error("Failed to delete mode type.", config.tostar_config);
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
     

      <section className="content">
      
              <div className="card ">
                <div className="card-header">
                  <h3 className="card-title text-sm">Create New ModeType</h3>
                  {/* <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      id="AddNewHeaderButton"
                      onClick={(e) => {
                        addCardHeaderButtonClick(e);
                      }}
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-plus"></i> Add New ModeType
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="maximize"
                    >
                      <i className="fas fa-expand"></i>
                    </button>
                  </div> */}
                </div>
                <div className="card-body text-sm">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="form-group col-md-4">
                        <label htmlFor="modeTypeInput">
                          Mode Type<sup style={{ color: "red" }}>*</sup>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="modeTypeInput"
                          value={newModeType}
                          ref={inputModeMasterReference}
                          onChange={(e) => setNewModeType(e.target.value)}
                        />
                        {error && <div className="text-danger">{error}</div>}
                      </div>
                      <div className="card-footer col-md-12 d-flex justify-content-end mt-2">
                     
                      
                     <button
                       type="submit"
                       className="custom-success-button mr-2"
                     >
                       Save & Submit
                     </button>
                 
                   <button
                     type="button"
                     className="custom-secondary-button"
                     onClick={handleCancelClick}
                   >
                     Cancel
                   </button>
                 </div>
                    </div>
                    
                  </form>
                </div>
              </div>
           
          {modeTypes.length > 0 && (
           
                <div className="card ">
                  <div className="card-header">
                    <h3 className="card-title text-sm">
                      Mode Master List ( {modeTypes.length} )
                    </h3>
                    {/* <div className="card-tools">
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
                    </div> */}
                  </div>
                  <div className="card-body">
                  <table className="improved-common-table">
                      <thead>
                        <tr>
                          <th >Sr. No.</th>
                          <th>Mode Type</th>
                          <th >Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modeTypes.map((modeType, index) => (
                          <tr key={index}>
                            <td >{index + 1}</td>
                            <td>{modeType.mTypes}</td>
                            <td >
                              <button
                                type="button"
                                className="custom-success-button mr-2"
                                onClick={() => handleEdit(modeType)}
                              >
                                <i className="fas fa-pen"></i>
                              </button>
                              <button
                                type="button"
                                className="custom-primary-button"
                                onClick={() => handleRemove(modeType)}
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
            
          )}
   
      </section>

      <div
        id="confirmCommonModal"
        className="modal fade confirmCommonModal"
        data-backdrop="static"
        tabindex="-1"
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

export default ModeMaster;
