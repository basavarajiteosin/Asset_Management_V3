import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../../shared/PleaseWaitButton";
import axios from "axios";
import $ from "jquery";

const config = require("../../../services/config.json");
function ModelMaster() {
  const inputModelNameReference = useRef(null);
  const inputAssetReference = useRef(null);

  const [model, setModel] = useState([]);
  const [id, setModelId] = useState("");
  const [asset, setAsset] = useState("");
  const [assetTypes, setAssetTypes] = useState([]);
  const [newModelName, setNewModelName] = useState("");
  const [selectedModelName, setSelectedModelName] = useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [error, setError] = useState("");
  const [modelNameToDelete, setModelNameToDelete] = useState(null);

  useEffect(() => {
    getModelData();
    fetchAssetTypes();
  }, []);

  const getModelData = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllModelsDetails"
      );
      if (response.data.data.length > 0) {
        // console.log("data", response.data.data);
        setModel(response.data.data);
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

  const fetchAssetTypes = async () => {
    try {
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllAssetTypeDetails"
      );
      setAssetTypes(response.data.data);
      // console.log("assetTypes", response);
    } catch (error) {
      console.error("Error fetching asset types:", error);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (asset.trim() === "") {
      toast.error("Please Select Asset Type.");
      inputAssetReference.current.focus();
      inputAssetReference.current.classList.add("is-invalid");
      return;
    }
    if (newModelName.trim() === "") {
      toast.error("Please enter ModelName.");
      inputModelNameReference.current.focus();
      inputModelNameReference.current.classList.add("is-invalid");
      return;
    }

    try {
      setIsLoaderActive(true);
      let response;

      if (id) {
        const dataToSend = {
          assetTypeId: id,
          accetType: asset,
          modelName: newModelName.trim(),
        };

        response = await axios.post(
          `${config.API_URL}AssetManagement/UpdateModel?assetTypeId=${id}`,
          dataToSend
        );
        toast.success("Data Updated Successfully.");
      } else {
        response = await axios.post(
          `${config.API_URL}AssetManagement/CreateModel`,
          { modelName: newModelName.trim(), accetType: asset }
        );
        toast.success(`${newModelName} Successfully Created`);
      }

      if (response.status === 200) {
        const responseData = response.data;
        if (responseData.success) {
          if (selectedModelName) {
            const updatedModel = model.map((model) =>
              model.id === selectedModelName.id
                ? {
                    ...model,
                    modelName: responseData.modelName,
                    accetType: responseData.assetType,
                  }
                : model
            );
            setModel(updatedModel);
            // console.log("Updated Data:", updatedModel);
          } else {
            setModel([...model, responseData]);
            // console.log("Updated Data:", [...model, responseData]);
          }
          setNewModelName("");
          setAsset("");
          setError("");
          setSelectedModelName(null);
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
    getModelData();
  };

  const handleCancelClick = () => {
    setNewModelName("");
    setAsset("");
    setSelectedModelName("");
    setModelId("");

    inputAssetReference.current.classList.remove("is-invalid");
    inputModelNameReference.current.classList.remove("is-invalid");
  };

  const handleEdit = (model) => {
    setSelectedModelName(model);
    // console.log("M", model);
    setAsset(model.accetType);
    setNewModelName(model.modelName);
    setModelId(model.id);
  };

  const handleRemove = (ModelName) => {
    setModelNameToDelete(ModelName);
    window.confirmModalShow();
  };

  const confirmDelete = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.post(
        config.API_URL +
          `AssetManagement/RemoveModel?id=${modelNameToDelete.id}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setModel((prevModel) =>
          prevModel.filter((item) => item.id !== modelNameToDelete.id)
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
              <h4 style={{ marginBottom: "-10px" }}>Model Type</h4>
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
                  <h3 className="card-title text-sm">Create New ModelName</h3>
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
                      <i className="fas fa-plus"> Add New model</i>
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
                        <label>
                          Asset Type
                          <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <select
                          className="custom-select form-control-sm"
                          ref={inputAssetReference}
                          value={asset}
                          onChange={(e) => setAsset(e.target.value)}
                          // disabled={isDisabled}
                        >
                          <option value="">--Select Asset Type--</option>
                          {assetTypes.map((type) => (
                            <option key={type.id} value={type.value}>
                              {type.assetTypeName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group col-md-4">
                        <label htmlFor="ModelNameInput">
                          Model Type<sup style={{ color: "red" }}>*</sup>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="ModelNameInput"
                          value={newModelName}
                          ref={inputModelNameReference}
                          onChange={(e) => setNewModelName(e.target.value)}
                          placeholder="Model Type..."
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

            {model.length > 0 && (
              <div className="col-md-6">
                <div className="card card-danger card-outline">
                  <div className="card-header">
                    <h3 className="card-title text-sm">
                      Model List ( {model.length} )
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
                            <th>Model Type</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {model.map((models, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{models.modelName}</td>
                              <td className="text-center">
                                <button
                                  type="button"
                                  className="btn bg-gradient-warning btn-xs"
                                  onClick={() => handleEdit(models)}
                                >
                                  <i className="fas fa-pen"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn bg-gradient-danger btn-xs ml-2"
                                  onClick={() => handleRemove(models)}
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
                By clicking on Yes ModelName will be Deleted. Once you deleted
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

export default ModelMaster;
