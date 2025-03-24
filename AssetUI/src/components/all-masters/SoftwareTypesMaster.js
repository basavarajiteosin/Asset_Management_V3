import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import $ from "jquery";
import PleaseWaitButton from "../../shared/PleaseWaitButton";

const config = require("../../services/config.json");

function SoftwareTypesMaster() {
  const inputSoftwareTypeReference = useRef(null);
  const [softwareTypeList, setSoftwareTypeList] = useState([]);
  const [newSoftwareType, setNewSoftwareType] = useState("");
  const [selectedSoftwareType, setSelectedSoftwareType] = useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [softwareTypeToDelete, setSoftwareTypeToDelete] = useState(null);

  useEffect(() => {
    getSoftwareTypeList();
  }, []);

  const getSoftwareTypeList = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.get(config.API_URL + "TicketMaster/GetAllSoftwareTypes");
      setSoftwareTypeList(response.data.data); // Accessing the 'data' property directly
    } catch (error) {
      toast.error("Failed to fetch software types.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newSoftwareType.trim() === "") {
      toast.error("Please enter software type name.", config.tostar_config);
      inputSoftwareTypeReference.current.focus();
      inputSoftwareTypeReference.current.classList.add("is-invalid");
      return;
    }

    const isDuplicate = softwareTypeList.some(
      (type) => type.softwareTypeName.toLowerCase().trim() === newSoftwareType.toLowerCase().trim()
    );

    if (isDuplicate) {
      toast.error("Software type already exists.", config.tostar_config);
      return;
    }

    try {
      setIsLoaderActive(true);
      const dataToSend = { softwareTypeName: newSoftwareType.trim() };
      let response;

      if (selectedSoftwareType) {
        response = await axios.post(
          config.API_URL + `TicketMaster/UpdateSoftwareType?stId=${selectedSoftwareType.stId}`,
          dataToSend
        );
        toast.success("Software type updated successfully.", config.tostar_config);
      } else {
        response = await axios.post(
          config.API_URL + "TicketMaster/CreateSoftwareType",
          dataToSend
        );
        toast.success("Successfully created software type.", config.tostar_config);
      }

      if (response.status === 200 || response.status === 201) {
        getSoftwareTypeList();
        setNewSoftwareType("");
        setSelectedSoftwareType(null);
      }
    } catch (error) {
      toast.error("Failed to add/update software type.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleCancelClick = () => {
    setNewSoftwareType("");
    inputSoftwareTypeReference.current.classList.remove("is-invalid");
  };

  const handleEdit = async (softwareType) => {
    try {
      const response = await axios.get(
        config.API_URL + `TicketMaster/GetSoftwareTypeById?id=${softwareType.stId}`
      );
      setSelectedSoftwareType(response.data.data); // Assuming single object in 'data'
      setNewSoftwareType(response.data.data.softwareTypeName);
    } catch (error) {
      toast.error("Failed to fetch software type details.", config.tostar_config);
    }
  };

  const handleRemove = (softwareType) => {
    setSoftwareTypeToDelete(softwareType);
    window.confirmModalShow();
  };

  const confirmDelete = async () => {
    try {
      setIsLoaderActive(true);
      await axios.post(
        config.API_URL + `TicketMaster/RemoveSoftwareType?id=${softwareTypeToDelete.stId}`
      );
      toast.success("Software type deleted successfully.", config.tostar_config);
      setSoftwareTypeList((prevList) =>
        prevList.filter((item) => item.stId !== softwareTypeToDelete.stId)
      );
      window.confirmModalHide();
    } catch (error) {
      toast.error("Failed to delete software type.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
  };

  return (
    <div>
      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title text-sm">Create New Software Type</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row align-items-center">
                <div className="col-md-6 d-flex align-items-center">
                  <label className="mr-2">
                    Software Type Name<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={newSoftwareType}
                    ref={inputSoftwareTypeReference}
                    onChange={(e) => setNewSoftwareType(e.target.value)}
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

        {softwareTypeList.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title text-sm">
                Software Types List ({softwareTypeList.length})
              </h3>
            </div>
            <div className="card-body">
              <table className="improved-common-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Software Type Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {softwareTypeList.map((softwareType, index) => (
                    <tr key={softwareType.stId}>
                      <td>{index + 1}</td>
                      <td>{softwareType.softwareTypeName}</td>
                      <td>
                        <button
                          className="custom-success-button mr-2"
                          onClick={() => handleEdit(softwareType)}
                        >
                          <i className="fas fa-pen"></i>
                        </button>
                        <button
                          className="custom-primary-button"
                          onClick={() => handleRemove(softwareType)}
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
                By clicking on Yes, the Software Type will be permanently deleted.
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

export default SoftwareTypesMaster;