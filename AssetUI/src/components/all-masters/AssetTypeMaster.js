import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PleaseWaitButton from "../../shared/PleaseWaitButton";

const config = require("../../services/config.json");

function AssetTypeMaster() {
    const inputAssetTypeNameRef = useRef(null);
    const [assetTypeList, setAssetTypeList] = useState([]);
    const [newAssetTypeName, setNewAssetTypeName] = useState("");
    const [selectedAssetType, setSelectedAssetType] = useState(null);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [assetTypeToDelete, setAssetTypeToDelete] = useState(null);

    useEffect(() => {
        getAssetTypeList();
    }, []);

    const getAssetTypeList = async () => {
        try {
            setIsLoaderActive(true);
            const response = await axios.get(config.API_URL + "AssetManagement/GetAllAssetTypeDetails");
            setAssetTypeList(response.data.data || []);
        } catch (error) {
            toast.error("Failed to fetch asset types.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newAssetTypeName.trim() === "") {
            toast.error("Please enter asset type name.", config.tostar_config);
            inputAssetTypeNameRef.current.focus();
            inputAssetTypeNameRef.current.classList.add("is-invalid");
            return;
        }

        const isDuplicate = assetTypeList.some(
            (type) => type.assetTypeName.toLowerCase().trim() === newAssetTypeName.toLowerCase().trim()
        );

        if (isDuplicate) {
            toast.error("Asset type already exists.", config.tostar_config);
            return;
        }

        try {
            setIsLoaderActive(true);
            let response;
            const dataToSend = { assetTypeName: newAssetTypeName.trim() };

            if (selectedAssetType) {
                response = await axios.post(
                    `${config.API_URL}AssetManagement/UpdateAssetType?assetTypeId=${selectedAssetType.id}`,
                    dataToSend
                );
                toast.success("Asset type updated successfully.", config.tostar_config);
            } else {
                response = await axios.post(config.API_URL + "AssetManagement/CreateAssetType", dataToSend);
                toast.success("Successfully created asset type.", config.tostar_config);
            }

            if (response.status === 200 || response.status === 201) {
                getAssetTypeList();
                setNewAssetTypeName("");
                setSelectedAssetType(null);
            }
        } catch (error) {
            toast.error("Failed to add/update asset type.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleCancelClick = () => {
        setNewAssetTypeName("");
        inputAssetTypeNameRef.current.classList.remove("is-invalid");
    };

    const handleEdit = (type) => {
        setSelectedAssetType(type);
        setNewAssetTypeName(type.assetTypeName);
    };

    const handleRemove = (type) => {
        setAssetTypeToDelete(type);
        window.confirmModalShow();
    };

    const confirmDelete = async () => {
        try {
            setIsLoaderActive(true);
            await axios.post(config.API_URL + `AssetManagement/RemoveAssetType?id=${assetTypeToDelete.id}`);
            toast.success("Asset type deleted successfully.", config.tostar_config);
            setAssetTypeList((prevList) => prevList.filter((item) => item.id !== assetTypeToDelete.id));
            window.confirmModalHide();
        } catch (error) {
            toast.error("Failed to delete asset type.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    return (
        <div>
            <section className="content">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title text-sm">Create New Asset Type</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row align-items-center">
                                <div className="form-group col-md-6 d-flex align-items-center">
                                    <label className="mr-2">Asset Type Name<sup style={{ color: "red" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newAssetTypeName}
                                        ref={inputAssetTypeNameRef}
                                        onChange={(e) => setNewAssetTypeName(e.target.value)}
                                        style={{ width: "60%" }}
                                    />
                                </div>
                                <div className="col-md-6 d-flex justify-content-end">
                                    <button type="submit" className="custom-success-button mr-2">Save & Submit</button>
                                    <button type="button" className="custom-secondary-button" onClick={handleCancelClick}>Cancel</button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>

                {assetTypeList.length > 0 && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title text-sm">Asset Type List ({assetTypeList.length})</h3>
                        </div>
                        <div className="card-body">
                            <table className="improved-common-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Asset Type Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assetTypeList.map((type, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{type.assetTypeName}</td>
                                            <td>
                                                <button className="custom-success-button mr-2" onClick={() => handleEdit(type)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="custom-primary-button" onClick={() => handleRemove(type)}>
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
                                By clicking on Yes, the AssetType will be permanently deleted.
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

export default AssetTypeMaster;
