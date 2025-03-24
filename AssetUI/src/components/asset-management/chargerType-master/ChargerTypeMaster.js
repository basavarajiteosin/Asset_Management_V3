import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../../shared/PleaseWaitButton";
import axios from "axios";
import $ from "jquery";

const config = require("../../../services/config.json");
function ChargerTypeMaster() {
  const inputChargerTypeNameReference = useRef(null);

  const [chargerType, setChargerType] = useState([]);
  const [id, setChargerTypeId] = useState("");
  const [newChargerTypeName, setNewChargerTypeName] = useState("");
  const [selectedChargerTypeName, setSelectedChargerTypeName] = useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [error, setError] = useState("");
  const [chargerTypeNameToDelete, setChargerTypeNameToDelete] = useState(null);

  useEffect(() => {
    getChargerTypeData();
  }, []);

  const getChargerTypeData = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllChargerTypeDetails"
      );
      if (response.data.data.length > 0) {
        // console.log("data", response.data.data);
        setChargerType(response.data.data);
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

    if (newChargerTypeName.trim() === "") {
      toast.error("Please enter ChargerTypeName.");
      inputChargerTypeNameReference.current.focus();
      inputChargerTypeNameReference.current.classList.add("is-invalid");
      return;
    }

    try {
      setIsLoaderActive(true);
      let response;

      if (id) {
        const dataToSend = {
          assetTypeId: id,
          chargerTypeName: newChargerTypeName.trim(),
        };

        response = await axios.post(
          `${config.API_URL}AssetManagement/UpdateChargerType?hddID=${id}`,
          dataToSend
        );
        toast.success("Data Updated Successfully.");
      } else {
        response = await axios.post(
          `${config.API_URL}AssetManagement/CreateChargerType`,
          { chargerTypeName: newChargerTypeName.trim() }
        );
        toast.success(`${newChargerTypeName} Successfully Created`);
      }

      if (response.status === 200) {
        const responseData = response.data;
        if (responseData.success) {
          if (selectedChargerTypeName) {
            const updatedChargerType = chargerType.map((chargerType) =>
              chargerType.id === selectedChargerTypeName.id
                ? {
                    ...chargerType,
                    chargerTypeName: responseData.chargerTypeName,
                  }
                : chargerType
            );
            setChargerType(updatedChargerType);
            // console.log("Updated Data:", updatedChargerType);
          } else {
            setChargerType([...chargerType, responseData]);
            // console.log("Updated Data:", [...chargerType, responseData]);
          }
          setNewChargerTypeName("");
          setError("");
          setSelectedChargerTypeName(null);
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
    getChargerTypeData();
  };

  const handleCancelClick = (e) => {
    setNewChargerTypeName("");
    setSelectedChargerTypeName("");
    setChargerTypeId("");

    inputChargerTypeNameReference.current.classList.remove("is-invalid");
  };

  const handleEdit = (ChargerType) => {
    setSelectedChargerTypeName(ChargerType);
    // console.log("M", ChargerType);
    setNewChargerTypeName(ChargerType.chargerTypeName);
    setChargerTypeId(chargerType.id);
  };

  const handleRemove = (ChargerTypeName) => {
    setChargerTypeNameToDelete(ChargerTypeName);
    window.confirmModalShow();
  };

  const confirmDelete = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.post(
        config.API_URL +
          `AssetManagement/RemoveChargerType?id=${chargerTypeNameToDelete.id}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setChargerType((prevChargerType) =>
          prevChargerType.filter(
            (item) => item.id !== chargerTypeNameToDelete.id
          )
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
              <h4 style={{ marginBottom: "-10px" }}>ChargerType </h4>
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
                  <h3 className="card-title text-sm">Create New ChargerType</h3>
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
                      <i className="fas fa-plus"> Add New ChargerType</i>
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
                        <label htmlFor="ChargerTypeNameInput">
                          ChargerType <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="chargerTypeNameInput"
                          value={newChargerTypeName}
                          ref={inputChargerTypeNameReference}
                          onChange={(e) =>
                            setNewChargerTypeName(e.target.value)
                          }
                          placeholder="Charger Type ..."
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

            {chargerType.length > 0 && (
              <div className="col-md-6">
                <div className="card card-danger card-outline">
                  <div className="card-header">
                    <h3 className="card-title text-sm">
                      ChargerType List ( {chargerType.length} )
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
                            <th>ChargerType </th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {chargerType.map((ChargerTypes, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{ChargerTypes.chargerTypeName}</td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn bg-gradient-warning btn-xs"
                                  onClick={() => handleEdit(ChargerTypes)}
                                >
                                  <i className="fas fa-pen"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn bg-gradient-danger btn-xs ml-2"
                                  onClick={() => handleRemove(ChargerTypes)}
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
                By clicking on Yes ChargerTypeName will be Deleted. Once you
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

export default ChargerTypeMaster;
