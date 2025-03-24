import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import $ from "jquery";
import PleaseWaitButton from "../../shared/PleaseWaitButton";

const config = require("../../services/config.json");

function TicketTypesMaster() {
  const inputTicketTypeReference = useRef(null);
  const [ticketTypeList, setTicketTypeList] = useState([]);
  const [newTicketType, setNewTicketType] = useState("");
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [ticketTypeToDelete, setTicketTypeToDelete] = useState(null);

  useEffect(() => {
    getTicketTypeList();
  }, []);

  const getTicketTypeList = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.get(config.API_URL + "TicketMaster/GetAllTicketTypes");
      setTicketTypeList(response.data);
    } catch (error) {
      toast.error("Failed to fetch ticket types.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newTicketType.trim() === "") {
      toast.error("Please enter ticket type name.", config.tostar_config);
      inputTicketTypeReference.current.focus();
      inputTicketTypeReference.current.classList.add("is-invalid");
      return;
    }

    const isDuplicate = ticketTypeList.some(
      (type) => type.ticketTypeName.toLowerCase().trim() === newTicketType.toLowerCase().trim()
    );

    if (isDuplicate) {
      toast.error("Ticket type already exists.", config.tostar_config);
      return;
    }

    try {
      setIsLoaderActive(true);
      const dataToSend = { ticketTypeName: newTicketType.trim() };
      let response;

      if (selectedTicketType) {
        response = await axios.post(
          config.API_URL + `TicketMaster/UpdateTicketType?ttId=${selectedTicketType.id}`,
          dataToSend
        );
        toast.success("Ticket type updated successfully.", config.tostar_config);
      } else {
        response = await axios.post(
          config.API_URL + "TicketMaster/CreateTicketType",
          dataToSend
        );
        toast.success("Successfully created ticket type.", config.tostar_config);
      }

      if (response.status === 200 || response.status === 201) {
        getTicketTypeList();
        setNewTicketType("");
        setSelectedTicketType(null);
      }
    } catch (error) {
      toast.error("Failed to add/update ticket type.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleCancelClick = () => {
    setNewTicketType("");
    inputTicketTypeReference.current.classList.remove("is-invalid");
  };

  const handleEdit = async (ticketType) => {
    try {
      const response = await axios.get(
        config.API_URL + `TicketMaster/GetTicketTypeById?id=${ticketType.id}`
      );
      setSelectedTicketType(response.data);
      setNewTicketType(response.data.ticketTypeName);
    } catch (error) {
      toast.error("Failed to fetch ticket type details.", config.tostar_config);
    }
  };

  const handleRemove = (ticketType) => {
    setTicketTypeToDelete(ticketType);
    window.confirmModalShow();
  };

  const confirmDelete = async () => {
    try {
      setIsLoaderActive(true);
      await axios.post(
        config.API_URL + `TicketMaster/RemoveTicketType?id=${ticketTypeToDelete.id}`
      );
      toast.success("Ticket type deleted successfully.", config.tostar_config);
      setTicketTypeList((prevList) =>
        prevList.filter((item) => item.id !== ticketTypeToDelete.id)
      );
      window.confirmModalHide();
    } catch (error) {
      toast.error("Failed to delete ticket type.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
  };

  return (
    <div>
      <section className="content">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title text-sm">Create New Ticket Type</h3>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row align-items-center">
                <div className="col-md-6 d-flex align-items-center">
                  <label className="mr-2">
                    Ticket Type Name<sup style={{ color: "red" }}>*</sup>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={newTicketType}
                    ref={inputTicketTypeReference}
                    onChange={(e) => setNewTicketType(e.target.value)}
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

        {ticketTypeList.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title text-sm">
                Ticket Types List ({ticketTypeList.length})
              </h3>
            </div>
            <div className="card-body">
              <table className="improved-common-table">
                <thead>
                  <tr>
                    <th>Sr. No.</th>
                    <th>Ticket Type Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {ticketTypeList.map((ticketType, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{ticketType.ticketTypeName}</td>
                      <td>
                        <button
                          className="custom-success-button mr-2"
                          onClick={() => handleEdit(ticketType)}
                        >
                          <i className="fas fa-pen"></i>
                        </button>
                        <button
                          className="custom-primary-button"
                          onClick={() => handleRemove(ticketType)}
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
                By clicking on Yes, the Ticket Type will be permanently deleted.
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

export default TicketTypesMaster;