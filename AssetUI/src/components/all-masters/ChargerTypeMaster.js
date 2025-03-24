import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PleaseWaitButton from "../../shared/PleaseWaitButton";

const config = require("../../services/config.json");

function ChargerTypeMaster() {
    const inputChargerTypeRef = useRef(null);
    const [chargerTypeList, setChargerTypeList] = useState([]);
    const [newChargerType, setNewChargerType] = useState("");
    const [selectedChargerType, setSelectedChargerType] = useState(null);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [chargerTypeToDelete, setChargerTypeToDelete] = useState(null);

    useEffect(() => {
        getChargerTypeList();
    }, []);

    const getChargerTypeList = async () => {
        try {
            setIsLoaderActive(true);
            const response = await axios.get(config.API_URL + "AssetManagement/GetAllChargerTypeDetails");
            setChargerTypeList(response.data.data || []);
        } catch (error) {
            toast.error("Failed to fetch Charger Types.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newChargerType.trim() === "") {
            toast.error("Please enter Charger Type name.", config.tostar_config);
            inputChargerTypeRef.current.focus();
            inputChargerTypeRef.current.classList.add("is-invalid");
            return;
        }

        const isDuplicate = chargerTypeList.some(
            (type) => type.chargerTypeName.toLowerCase().trim() === newChargerType.toLowerCase().trim()
        );

        if (isDuplicate) {
            toast.error("Charger Type already exists.", config.tostar_config);
            return;
        }

        try {
            setIsLoaderActive(true);
            let response;
            const dataToSend = { chargerTypeName: newChargerType.trim() };

            if (selectedChargerType) {
                response = await axios.post(
                    `${config.API_URL}AssetManagement/UpdateChargerType?hddID=${selectedChargerType.id}`,
                    dataToSend
                );
                toast.success("Charger Type updated successfully.", config.tostar_config);
            } else {
                response = await axios.post(config.API_URL + "AssetManagement/CreateChargerType", dataToSend);
                toast.success("Successfully created Charger Type.", config.tostar_config);
            }

            if (response.status === 200 || response.status === 201) {
                getChargerTypeList();
                setNewChargerType("");
                setSelectedChargerType(null);
            }
        } catch (error) {
            toast.error("Failed to add/update Charger Type.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleCancelClick = () => {
        setNewChargerType("");
        inputChargerTypeRef.current.classList.remove("is-invalid");
    };

    const handleEdit = (type) => {
        setSelectedChargerType(type);
        setNewChargerType(type.chargerTypeName);
    };

    const handleRemove = (type) => {
        setChargerTypeToDelete(type);
        window.confirmModalShow();
    };

    const confirmDelete = async () => {
        try {
            setIsLoaderActive(true);
            await axios.post(config.API_URL + `AssetManagement/RemoveChargerType?id=${chargerTypeToDelete.id}`);
            toast.success("Charger Type deleted successfully.", config.tostar_config);
            setChargerTypeList((prevList) => prevList.filter((item) => item.id !== chargerTypeToDelete.id));
            window.confirmModalHide();
        } catch (error) {
            toast.error("Failed to delete Charger Type.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    return (
        <div>
            <section className="content">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title text-sm">Create New Charger Type</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row align-items-center">
                                <div className="col-md-6 d-flex align-items-center">
                                    <label className="mr-2">Charger Type Name<sup style={{ color: "red" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newChargerType}
                                        ref={inputChargerTypeRef}
                                        onChange={(e) => setNewChargerType(e.target.value)}
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

                {chargerTypeList.length > 0 && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title text-sm">Charger Type List ({chargerTypeList.length})</h3>
                        </div>
                        <div className="card-body">
                            <table className="improved-common-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Charger Type Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chargerTypeList.map((type, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{type.chargerTypeName}</td>
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
                                By clicking on Yes, the Charger Type will be permanently deleted.
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

export default ChargerTypeMaster;
