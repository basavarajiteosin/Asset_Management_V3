import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import $ from "jquery";
import PleaseWaitButton from "../../shared/PleaseWaitButton";

const config = require("../../services/config.json");

function HardwareTypesMaster() {
  const inputHardwareTypeReference = useRef(null);
  const [hardwareTypeList, setHardwareTypeList] = useState([]);
  const [newHardwareType, setNewHardwareType] = useState("");
  const [selectedHardwareType, setSelectedHardwareType] = useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [hardwareTypeToDelete, setHardwareTypeToDelete] = useState(null);

  useEffect(() => {
    getHardwareTypeList();
  }, []);

  const getHardwareTypeList = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.get(config.API_URL + "TicketMaster/GetAllHardwareTypes");
      setHardwareTypeList(response.data.data); // Accessing the 'data' property directly
    } catch (error) {
      toast.error("Failed to fetch hardware types.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newHardwareType.trim() === "") {
      toast.error("Please enter hardware type name.", config.tostar_config);
      inputHardwareTypeReference.current.focus();
      inputHardwareTypeReference.current.classList.add("is-invalid");
      return;
    }

    const isDuplicate = hardwareTypeList.some(
      (type) => type.hardwareTypeName.toLowerCase().trim() === newHardwareType.toLowerCase().trim()
    );

    if (isDuplicate) {
      toast.error("Hardware type already exists.", config.tostar_config);
      return;
    }

    try {
      setIsLoaderActive(true);
      const dataToSend = { hardwareTypeName: newHardwareType.trim() };
      let response;

      if (selectedHardwareType) {
        response = await axios.post(
          config.API_URL + `TicketMaster/UpdateHardwareType?htId=${selectedHardwareType.htId}`,
          dataToSend
        );
        toast.success("Hardware type updated successfully.", config.tostar_config);
      } else {
        response = await axios.post(
          config.API_URL + "TicketMaster/CreateHardwareType",
          dataToSend
        );
        toast.success("Successfully created hardware type.", config.tostar_config);
      }

      if (response.status === 200 || response.status === 201) {
        getHardwareTypeList();
        setNewHardwareType("");
        setSelectedHardwareType(null);
      }
    } catch (error) {
      toast.error("Failed to add/update hardware type.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleCancelClick = () => {
    setNewHardwareType("");
    inputHardwareTypeReference.current.classList.remove("is-invalid");
  };

  const handleEdit = async (hardwareType) => {
    try {
      const response = await axios.get(
        config.API_URL + `TicketMaster/GetHardwareTypeById?id=${hardwareType.htId}`
      );
      setSelectedHardwareType(response.data.data); // Assuming single object in 'data'
      setNewHardwareType(response.data.data.hardwareTypeName);
    } catch (error) {
      toast.error("Failed to fetch hardware type details.", config.tostar_config);
    }
  };

  const handleRemove = (hardwareType) => {
    setHardwareTypeToDelete(hardwareType);
    window.confirmModalShow();
  };

  const confirmDelete = async () => {
    try {
      setIsLoaderActive(true);
      await axios.post(
        config.API_URL + `TicketMaster/RemoveHardwareType?id=${hardwareTypeToDelete.htId}`
      );
      toast.success("Hardware type deleted successfully.", config.tostar_config);
      setHardwareTypeList((prevList) =>
        prevList.filter((item) => item.htId !== hardwareTypeToDelete.htId)
      );
      window.confirmModalHide();
    } catch (error) {
      toast.error("Failed to delete hardware type.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
  };

  return (
    <div>
      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title text-sm">Create New Hardware Type</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row align-items-center">
                <div className="col-md-6 d-flex align-items-center">
                  <label className="mr-2">
                    Hardware Type Name<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={newHardwareType}
                    ref={inputHardwareTypeReference}
                    onChange={(e) => setNewHardwareType(e.target.value)}
                    style={{ width: "60%" }}
                  />
                </div>
                <div className="col-md-6 d-flex justify-content-end">
                  <button type="submit" className="custom-success-button mr-2">
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

        {hardwareTypeList.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title text-sm">
                Hardware Types List ({hardwareTypeList.length})
              </h3>
            </div>
            <div className="card-body">
              <table className="improved-common-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Hardware Type Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {hardwareTypeList.map((hardwareType, index) => (
                    <tr key={hardwareType.htId}>
                      <td>{index + 1}</td>
                      <td>{hardwareType.hardwareTypeName}</td>
                      <td>
                        <button
                          className="custom-success-button mr-2"
                          onClick={() => handleEdit(hardwareType)}
                        >
                          <i className="fas fa-pen"></i>
                        </button>
                        <button
                          className="custom-primary-button"
                          onClick={() => handleRemove(hardwareType)}
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
                By clicking on Yes, the Hardware Type will be permanently deleted.
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
                  onClick={confirmDelete}
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

export default HardwareTypesMaster;