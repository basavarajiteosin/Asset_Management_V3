import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PleaseWaitButton from "../../shared/PleaseWaitButton";

const config = require("../../services/config.json");

function AccessoriesTypeMaster() {
    const inputAccessoriesTypeRef = useRef(null);
    const [accessoriesTypeList, setAccessoriesTypeList] = useState([]);
    const [newAccessoriesType, setNewAccessoriesType] = useState("");
    const [selectedAccessoriesType, setSelectedAccessoriesType] = useState(null);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [accessoriesTypeToDelete, setAccessoriesTypeToDelete] = useState(null);

    useEffect(() => {
        getAccessoriesTypeList();
    }, []);

    const getAccessoriesTypeList = async () => {
        try {
            setIsLoaderActive(true);
            const response = await axios.get(config.API_URL + "AssetManagement/GetAllAccessoriesTypeDetails");
            setAccessoriesTypeList(response.data.data || []);
        } catch (error) {
            toast.error("Failed to fetch Accessories Types.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newAccessoriesType.trim() === "") {
            toast.error("Please enter Accessories Type name.", config.tostar_config);
            inputAccessoriesTypeRef.current.focus();
            inputAccessoriesTypeRef.current.classList.add("is-invalid");
            return;
        }

        const isDuplicate = accessoriesTypeList.some(
            (type) => type.AccessoriesTypeName.toLowerCase().trim() === newAccessoriesType.toLowerCase().trim()
        );

        if (isDuplicate) {
            toast.error("Accessories Type already exists.", config.tostar_config);
            return;
        }

        try {
            setIsLoaderActive(true);
            let response;
            const dataToSend = { AccessoriesTypeName: newAccessoriesType.trim() };

            if (selectedAccessoriesType) {
                response = await axios.post(
                    `${config.API_URL}AssetManagement/UpdateAccessoriesType?accessoriesId=${selectedAccessoriesType.id}`,
                    dataToSend
                );
                toast.success("Accessories Type updated successfully.", config.tostar_config);
            } else {
                response = await axios.post(config.API_URL + "AssetManagement/CreateAccessoriesType", dataToSend);
                toast.success("Successfully created Accessories Type.", config.tostar_config);
            }

            if (response.status === 200 || response.status === 201) {
                getAccessoriesTypeList();
                setNewAccessoriesType("");
                setSelectedAccessoriesType(null);
            }
        } catch (error) {
            toast.error("Failed to add/update Accessories Type.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleCancelClick = () => {
        setNewAccessoriesType("");
        inputAccessoriesTypeRef.current.classList.remove("is-invalid");
    };

    const handleEdit = (type) => {
        setSelectedAccessoriesType(type);
        setNewAccessoriesType(type.AccessoriesTypeName);
    };

    const handleRemove = (type) => {
        setAccessoriesTypeToDelete(type);
        window.confirmModalShow();
    };

    const confirmDelete = async () => {
        try {
            setIsLoaderActive(true);
            await axios.post(config.API_URL + `AssetManagement/RemoveAccessoriesType?id=${accessoriesTypeToDelete.id}`);
            toast.success("Accessories Type deleted successfully.", config.tostar_config);
            setAccessoriesTypeList((prevList) => prevList.filter((item) => item.id !== accessoriesTypeToDelete.id));
            window.confirmModalHide();
        } catch (error) {
            toast.error("Failed to delete Accessories Type.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    return (
        <div>
            <section className="content">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title text-sm">Create New Accessories Type</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="form-group col-md-4">
                                    <label>Accessories Type Name<sup style={{ color: "red" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newAccessoriesType}
                                        ref={inputAccessoriesTypeRef}
                                        onChange={(e) => setNewAccessoriesType(e.target.value)}
                                    />
                                </div>
                                <div className="col-md-12 d-flex justify-content-end mt-2">
                                    <button type="submit" className="custom-success-button mr-2">Save & Submit</button>
                                    <button type="button" className="custom-secondary-button" onClick={handleCancelClick}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {accessoriesTypeList.length > 0 && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title text-sm">Accessories Type List ({accessoriesTypeList.length})</h3>
                        </div>
                        <div className="card-body">
                            <table className="improved-common-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Accessories Type Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {accessoriesTypeList.map((type, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{type.AccessoriesTypeName}</td>
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
                                By clicking on Yes, the Accessories Type will be permanently deleted.
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

export default AccessoriesTypeMaster;
