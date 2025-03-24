import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import axios from "axios";
import $ from "jquery";

const config = require("../../services/config.json");

function RAMMaster() {
    const inputRAMReference = useRef(null);
    const [ramList, setRamList] = useState([]);
    const [newRAM, setNewRAM] = useState("");
    const [selectedRAM, setSelectedRAM] = useState(null);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [ramToDelete, setRamToDelete] = useState(null);

    useEffect(() => {
        getRamList();
    }, []);

    const getRamList = async () => {
        try {
            setIsLoaderActive(true);
            const response = await axios.get(config.API_URL + "AssetManagement/GetAllRAMDetails");
            if (response.data.data.length > 0) {
                setRamList(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch RAM details.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newRAM.trim() === "") {
            toast.error("Please enter RAM name.", config.tostar_config);
            inputRAMReference.current.focus();
            inputRAMReference.current.classList.add("is-invalid");
            return;
        }

        const isDuplicate = ramList.some(
            (ram) => ram.ramName.toLowerCase().trim() === newRAM.toLowerCase().trim()
        );

        if (isDuplicate) {
            toast.error("RAM already exists.", config.tostar_config);
            return;
        }

        try {
            setIsLoaderActive(true);
            let response;
            const dataToSend = { ramName: newRAM.trim() };

            if (selectedRAM) {
                response = await axios.post(
                    `${config.API_URL}AssetManagement/UpdateRAM?ramId=${selectedRAM.id}`,
                    dataToSend
                );
                toast.success("RAM updated successfully.", config.tostar_config);
            } else {
                response = await axios.post(
                    config.API_URL + "AssetManagement/CreateRAM",
                    dataToSend
                );
                toast.success("Successfully created RAM.", config.tostar_config);
            }

            if (response.status === 200 || response.status === 201) {
                getRamList();
                setNewRAM("");
                setSelectedRAM(null);
            } else {
                toast.error("Failed to add/update RAM.", config.tostar_config);
            }
        } catch (error) {
            toast.error("Failed to add/update RAM.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleCancelClick = () => {
        setNewRAM("");
        inputRAMReference.current.classList.remove("is-invalid");
    };

    const handleEdit = (ram) => {
        setSelectedRAM(ram);
        setNewRAM(ram.ramName);
    };

    const handleRemove = (ram) => {
        setRamToDelete(ram);
        window.confirmModalShow();
    };

    const confirmDelete = async () => {
        try {
            setIsLoaderActive(true);
            await axios.post(config.API_URL + `AssetManagement/RemoveRAM?id=${ramToDelete.id}`);
            toast.success("RAM deleted successfully.", config.tostar_config);
            setRamList((prevList) => prevList.filter((item) => item.id !== ramToDelete.id));
            window.confirmModalHide(); // Close modal with jQuery
        } catch (error) {
            toast.error("Failed to delete RAM.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    return (
        <div>
            <section className="content">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title text-sm">Create New RAM</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row align-items-center">
                                <div className="col-md-6 d-flex align-items-center">
                                    <label className="mr-2">RAM Name<sup style={{ color: "red" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newRAM}
                                        ref={inputRAMReference}
                                        onChange={(e) => setNewRAM(e.target.value)}
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

                {ramList.length > 0 && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title text-sm">RAM List ({ramList.length})</h3>
                        </div>
                        <div className="card-body">
                            <table className="improved-common-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>RAM Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ramList.map((ram, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{ram.ramName}</td>
                                            <td>
                                                <button className="custom-success-button mr-2" onClick={() => handleEdit(ram)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="custom-primary-button" onClick={() => handleRemove(ram)}>
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

            {/* Delete Confirmation Modal */}
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
                                By clicking on Yes, the RAM will be permanently deleted.
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

export default RAMMaster;
