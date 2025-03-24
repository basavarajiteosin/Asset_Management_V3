import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import axios from "axios";

const config = require("../../services/config.json");

function ModelsMasters() {
    const inputModelNameRef = useRef(null);
    const inputAssetTypeRef = useRef(null);
    const [modelsList, setModelsList] = useState([]);
    const [newModel, setNewModel] = useState("");
    const [selectedModel, setSelectedModel] = useState(null);
    const [newAssetType, setNewAssetType] = useState("");
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [modelToDelete, setModelToDelete] = useState(null);

    useEffect(() => {
        getModelsList();
    }, []);

    const getModelsList = async () => {
        try {
            setIsLoaderActive(true);
            const response = await axios.get(config.API_URL + "AssetManagement/GetAllModelsDetails");
            setModelsList(response.data.data || []);
        } catch (error) {
            toast.error("Failed to fetch models details.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newModel.trim() === "") {
            toast.error("Please enter model name and asset type.", config.tostar_config);
            inputModelNameRef.current.focus();
            inputModelNameRef.current.classList.add("is-invalid");
            return;
        }
        if (newAssetType.trim() === "") {
            toast.error("Please enter asset type.", config.tostar_config);
            inputAssetTypeRef.current.focus();
            inputAssetTypeRef.current.classList.add("is-invalid");
            return;
        }

        const isDuplicate = modelsList.some(
            (model) => model.modelName.toLowerCase().trim() === newModel.toLowerCase().trim()
        );

        if (isDuplicate) {
            toast.error("Model already exists.", config.tostar_config);
            return;
        }

        try {
            setIsLoaderActive(true);
            let response;
            const dataToSend = {
                modelName: newModel.trim(),
                accetType: newAssetType.trim(),
            };
            if (selectedModel) {
                response = await axios.post(
                    `${config.API_URL}AssetManagement/UpdateModel?assetTypeId=${selectedModel.id}`,
                    dataToSend
                );
                toast.success("Model updated successfully.", config.tostar_config);
            } else {
                response = await axios.post(config.API_URL + "AssetManagement/CreateModel", {
                    modelName: newModel.trim(),
                    accetType: newAssetType.trim(),
                });
                toast.success("Successfully created model.", config.tostar_config);
            }

            if (response.status === 200 || response.status === 201) {
                getModelsList();
                setNewModel("");
                setNewAssetType("");
                setSelectedModel(null);
            }
        } catch (error) {
            toast.error("Failed to add/update model.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleCancelClick = () => {
        setNewModel("");
        setNewAssetType("");
        inputModelNameRef.current.classList.remove("is-invalid");
    };

    const handleEdit = (model) => {
        setSelectedModel(model);
        setNewModel(model.modelName);
        setNewAssetType(model.accetType);
    };

    const handleRemove = (model) => {
        setModelToDelete(model);
        window.confirmModalShow();
    };

    const confirmDelete = async () => {
        try {
            setIsLoaderActive(true);
            await axios.post(config.API_URL + `AssetManagement/RemoveModel?id=${modelToDelete.id}`);
            toast.success("Model deleted successfully.", config.tostar_config);
            setModelsList((prevList) => prevList.filter((item) => item.id !== modelToDelete.id));
            window.confirmModalHide();
        } catch (error) {
            toast.error("Failed to delete model.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    return (
        <div>
            <section className="content">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title text-sm">Create New Model</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row align-items-center">
                                <div className="form-group col-md-4">
                                    <label>Model Name<sup style={{ color: "red" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newModel}
                                        ref={inputModelNameRef}
                                        onChange={(e) => setNewModel(e.target.value)}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <label>Asset Type<sup style={{ color: "red" }}>*</sup></label>
                                    {/* <input
                                        type="text"
                                        className="form-control"
                                        value={newAssetType}
                                        onChange={(e) => setNewAssetType(e.target.value)}
                                    /> */}
                                    <select
                                        className="form-control form-control-sm"
                                        value={newAssetType}
                                        ref={inputAssetTypeRef}
                                        onChange={(e) => setNewAssetType(e.target.value)}
                                    >
                                        <option value="">--Select Asset Type--</option>
                                        <option value="Laptop">Laptop</option>
                                        <option value="Accessories">Accessories</option>
                                        <option value="Other IT Assets">Other IT Assets</option>

                                    </select>
                                </div>
                                <div className="form-group col-md-4 d-flex align-items-end justify-content-end">
                                    <button type="submit" className="custom-success-button mr-2 mt-4">Save & Submit</button>
                                    <button type="button" className="custom-secondary-button mt-4" onClick={handleCancelClick}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {modelsList.length > 0 && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title text-sm">Model List ({modelsList.length})</h3>
                        </div>
                        <div className="card-body">
                            <table className="improved-common-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Model Name</th>
                                        <th>Asset Type</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {modelsList.map((model, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{model.modelName}</td>
                                            <td>{model.accetType}</td>
                                            <td>
                                                <button className="custom-success-button mr-2" onClick={() => handleEdit(model)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="custom-primary-button" onClick={() => handleRemove(model)}>
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
                                By clicking on Yes, the model will be permanently deleted.
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

export default ModelsMasters;
