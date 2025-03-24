import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../../shared/PleaseWaitButton";
import axios from "axios";
import $ from "jquery";
const config = require("../../../services/config.json");

function OsMaster() {
  const inputOsReference = useRef(null);

  const [os, setOs] = useState([]);
  const [id, setId] = useState("");
  const [newOs, setNewOs] = useState("");
  const [selectedOs, setSelectedOs] = useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [error, setError] = useState("");
  const [osToDelete, setOsToDelete] = useState(null);

  useEffect(() => {
    getOsData();
  }, []);

  const getOsData = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllOSDetails"
      );
      if (response.data.data.length > 0) {
        setOs(response.data.data);
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

    if (newOs.trim() === "") {
      toast.error("Please enter os.");
      inputOsReference.current.focus();
      inputOsReference.current.classList.add("is-invalid");
      return;
    }

    try {
      setIsLoaderActive(true);
      let response;

      if (id) {
        const dataToSend = {
          assetTypeId: id,
          osName: newOs.trim(),
        };

        response = await axios.post(
          `${config.API_URL}AssetManagement/UpdateOS?hddID=${id}`,
          dataToSend
        );
        toast.success("Data Updated Successfully.");
      } else {
        response = await axios.post(
          `${config.API_URL}AssetManagement/CreateOS`,
          { osName: newOs.trim() }
        );
        toast.success(`${newOs} Successfully Created`);
      }

      if (response.status === 200) {
        const responseData = response.data;
        if (responseData.success) {
          if (selectedOs) {
            const updateOs = os.map((os) =>
              os.id === selectedOs.id
                ? { ...os, osName: responseData.osName }
                : os
            );
            setOs(updateOs);
          } else {
            setOs([...os, responseData]);
          }
          setNewOs("");
          setError("");
          setSelectedOs(null);
        }
      }
    } catch (error) {
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
    getOsData();
  };

  const handleCancelClick = (e) => {
    setNewOs("");
    setSelectedOs("");
    setId("");

    inputOsReference.current.classList.remove("is-invalid");
  };

  const handleEdit = (os) => {
    setSelectedOs(os);
    setNewOs(os.osName);
    setId(os.id);
  };

  const handleRemove = (os) => {
    setOsToDelete(os);
    window.confirmModalShow();
  };

  const confirmDelete = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.post(
        config.API_URL + `AssetManagement/RemoveOS?id=${osToDelete.id}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setOs((prevOs) => prevOs.filter((item) => item.id !== osToDelete.id));
      }
      setIsLoaderActive(false);
      window.confirmModalHide();
    } catch (error) {
      console.error("Error deleting Data:", error);
      toast.error("Failed to delete Data.");
      setIsLoaderActive(false);
    }
  };

  return (
    <div>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            {os.length > 0 && (
              <div className="col-md-6">
                <div className="card card-danger card-outline">
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
                            <th>OS Type</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {os.map((oss, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{oss.osName}</td>
                              <td>
                                <button
                                  type="button"
                                  className="custom-success-button mr-2"
                                  onClick={() => handleEdit(oss)}
                                >
                                  <i className="fas fa-pen"></i>
                                </button>
                                <button
                                  type="button"
                                  className="custom-primary-button"
                                  onClick={() => handleRemove(oss)}
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
    </div>
  );
}

export default OsMaster;
