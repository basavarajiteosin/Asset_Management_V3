import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PleaseWaitButton from "../../shared/PleaseWaitButton";

const config = require("../../services/config.json");

function OSMaster() {
    const inputOSNameRef = useRef(null);
    const [osList, setOSList] = useState([]);
    const [newOSName, setNewOSName] = useState("");
    const [selectedOS, setSelectedOS] = useState(null);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [osToDelete, setOSToDelete] = useState(null);

    useEffect(() => {
        getOSList();
    }, []);

    const getOSList = async () => {
        try {
            setIsLoaderActive(true);
            const response = await axios.get(config.API_URL + "AssetManagement/GetAllOSDetails");
            setOSList(response.data.data || []);
        } catch (error) {
            toast.error("Failed to fetch OS list.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newOSName.trim() === "") {
            toast.error("Please enter OS name.", config.tostar_config);
            inputOSNameRef.current.focus();
            inputOSNameRef.current.classList.add("is-invalid");
            return;
        }

        const isDuplicate = osList.some(
            (os) => os.osName.toLowerCase().trim() === newOSName.toLowerCase().trim()
        );

        if (isDuplicate) {
            toast.error("OS already exists.", config.tostar_config);
            return;
        }

        try {
            setIsLoaderActive(true);
            let response;
            const dataToSend = { osName: newOSName.trim() };

            if (selectedOS) {
                response = await axios.post(
                    `${config.API_URL}AssetManagement/UpdateOS?hddID=${selectedOS.id}`,
                    dataToSend
                );
                toast.success("OS updated successfully.", config.tostar_config);
            } else {
                response = await axios.post(config.API_URL + "AssetManagement/CreateOS", dataToSend);
                toast.success("Successfully created OS.", config.tostar_config);
            }

            if (response.status === 200 || response.status === 201) {
                getOSList();
                setNewOSName("");
                setSelectedOS(null);
            }
        } catch (error) {
            toast.error("Failed to add/update OS.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleCancelClick = () => {
        setNewOSName("");
        inputOSNameRef.current.classList.remove("is-invalid");
    };

    const handleEdit = (os) => {
        setSelectedOS(os);
        setNewOSName(os.osName);
    };

    const handleRemove = (os) => {
        setOSToDelete(os);
        window.confirmModalShow();
    };

    const confirmDelete = async () => {
        try {
            setIsLoaderActive(true);
            await axios.post(config.API_URL + `AssetManagement/RemoveOS?id=${osToDelete.id}`);
            toast.success("OS deleted successfully.", config.tostar_config);
            setOSList((prevList) => prevList.filter((item) => item.id !== osToDelete.id));
            window.confirmModalHide();
        } catch (error) {
            toast.error("Failed to delete OS.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    return (
        <div>
            <section className="content">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title text-sm">Create New OS</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row align-items-center">
                                <div className="col-md-6 d-flex align-items-center">
                                    <label className="mr-2">OS Name<sup style={{ color: "red" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newOSName}
                                        ref={inputOSNameRef}
                                        onChange={(e) => setNewOSName(e.target.value)}
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

                {osList.length > 0 && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title text-sm">OS List ({osList.length})</h3>
                        </div>
                        <div className="card-body">
                            <table className="improved-common-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>OS Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {osList.map((os, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{os.osName}</td>
                                            <td>
                                                <button className="custom-success-button mr-2" onClick={() => handleEdit(os)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="custom-primary-button" onClick={() => handleRemove(os)}>
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
                                By clicking on Yes, the OS will be permanently deleted.
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

export default OSMaster;
