import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PleaseWaitButton from "../../shared/PleaseWaitButton";

const config = require("../../services/config.json");

function ChargerMaster() {
    const inputChargerNameRef = useRef(null);
    const [chargerList, setChargerList] = useState([]);
    const [newChargerName, setNewChargerName] = useState("");
    const [selectedCharger, setSelectedCharger] = useState(null);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [chargerToDelete, setChargerToDelete] = useState(null);

    useEffect(() => {
        getChargerList();
    }, []);

    const getChargerList = async () => {
        try {
            setIsLoaderActive(true);
            const response = await axios.get(config.API_URL + "AssetManagement/GetAllChargerDetails");
            setChargerList(response.data.data || []);
        } catch (error) {
            toast.error("Failed to fetch chargers.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newChargerName.trim() === "") {
            toast.error("Please enter charger name.", config.tostar_config);
            inputChargerNameRef.current.focus();
            inputChargerNameRef.current.classList.add("is-invalid");
            return;
        }

        const isDuplicate = chargerList.some(
            (charger) => charger.chargerName.toLowerCase().trim() === newChargerName.toLowerCase().trim()
        );

        if (isDuplicate) {
            toast.error("Charger already exists.", config.tostar_config);
            return;
        }

        try {
            setIsLoaderActive(true);
            let response;
            const dataToSend = { chargerName: newChargerName.trim() };

            if (selectedCharger) {
                response = await axios.post(
                    `${config.API_URL}AssetManagement/UpdateCharger?hddID=${selectedCharger.id}`,
                    dataToSend
                );
                toast.success("Charger updated successfully.", config.tostar_config);
            } else {
                response = await axios.post(config.API_URL + "AssetManagement/CreateCharger", dataToSend);
                toast.success("Successfully created charger.", config.tostar_config);
            }

            if (response.status === 200 || response.status === 201) {
                getChargerList();
                setNewChargerName("");
                setSelectedCharger(null);
            }
        } catch (error) {
            toast.error("Failed to add/update charger.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleCancelClick = () => {
        setNewChargerName("");
        inputChargerNameRef.current.classList.remove("is-invalid");
    };

    const handleEdit = (charger) => {
        setSelectedCharger(charger);
        setNewChargerName(charger.chargerName);
    };

    const handleRemove = (charger) => {
        setChargerToDelete(charger);
        window.confirmModalShow();
    };

    const confirmDelete = async () => {
        try {
            setIsLoaderActive(true);
            await axios.post(config.API_URL + `AssetManagement/RemoveCharger?id=${chargerToDelete.id}`);
            toast.success("Charger deleted successfully.", config.tostar_config);
            setChargerList((prevList) => prevList.filter((item) => item.id !== chargerToDelete.id));
            window.confirmModalHide();
        } catch (error) {
            toast.error("Failed to delete charger.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    return (
        <div>
            <section className="content">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title text-sm">Create New Charger</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row align-items-center">
                                <div className="col-md-6 d-flex align-items-center">
                                    <label className="mr-2">Charger Name<sup style={{ color: "red" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newChargerName}
                                        ref={inputChargerNameRef}
                                        onChange={(e) => setNewChargerName(e.target.value)}
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

                {chargerList.length > 0 && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title text-sm">Charger List ({chargerList.length})</h3>
                        </div>
                        <div className="card-body">
                            <table className="improved-common-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Charger Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chargerList.map((charger, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{charger.chargerName}</td>
                                            <td>
                                                <button className="custom-success-button mr-2" onClick={() => handleEdit(charger)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="custom-primary-button" onClick={() => handleRemove(charger)}>
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
                                By clicking on Yes, the Charger Master will be permanently deleted.
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

export default ChargerMaster;
