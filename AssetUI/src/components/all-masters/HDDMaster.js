import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import axios from "axios";

const config = require("../../services/config.json");

function HDDMaster() {
    const inputHDDNameRef = useRef(null);
    const [hddList, setHddList] = useState([]);
    const [newHDDName, setNewHDDName] = useState("");
    const [selectedHDD, setSelectedHDD] = useState(null);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [hddToDelete, setHddToDelete] = useState(null);

    useEffect(() => {
        getHddList();
    }, []);

    const getHddList = async () => {
        try {
            setIsLoaderActive(true);
            const response = await axios.get(config.API_URL + "AssetManagement/GetAllHDDDetails");
            setHddList(response.data.data || []);
        } catch (error) {
            toast.error("Failed to fetch HDD details.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newHDDName.trim() === "") {
            toast.error("Please enter HDD name.", config.tostar_config);
            inputHDDNameRef.current.focus();
            inputHDDNameRef.current.classList.add("is-invalid");
            return;
        }

        const isDuplicate = hddList.some(
            (hdd) => hdd.hddName.toLowerCase().trim() === newHDDName.toLowerCase().trim()
        );

        if (isDuplicate) {
            toast.error("HDD already exists.", config.tostar_config);
            return;
        }

        try {
            setIsLoaderActive(true);
            let response;
            const dataToSend = { HDDName: newHDDName.trim() };

            if (selectedHDD) {
                response = await axios.post(
                    `${config.API_URL}AssetManagement/UpdateHDD?hddID=${selectedHDD.id}`,
                    dataToSend
                );
                toast.success("HDD updated successfully.", config.tostar_config);
            } else {
                response = await axios.post(config.API_URL + "AssetManagement/CreateHDD", {
                    hddName: newHDDName.trim(),
                });
                toast.success("Successfully created HDD.", config.tostar_config);
            }

            if (response.status === 200 || response.status === 201) {
                getHddList();
                setNewHDDName("");
                setSelectedHDD(null);
            }
        } catch (error) {
            toast.error("Failed to add/update HDD.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleCancelClick = () => {
        setNewHDDName("");
        inputHDDNameRef.current.classList.remove("is-invalid");
    };

    const handleEdit = (hdd) => {
        setSelectedHDD(hdd);
        setNewHDDName(hdd.hddName);
    };

    const handleRemove = (hdd) => {
        setHddToDelete(hdd);
        window.confirmModalShow();
    };

    const confirmDelete = async () => {
        try {
            setIsLoaderActive(true);
            await axios.post(config.API_URL + `AssetManagement/RemoveHDD?id=${hddToDelete.id}`);
            toast.success("HDD deleted successfully.", config.tostar_config);
            setHddList((prevList) => prevList.filter((item) => item.id !== hddToDelete.id));
            window.confirmModalHide();
        } catch (error) {
            toast.error("Failed to delete HDD.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    return (
        <div>
            <section className="content">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title text-sm">Create New HDD</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row align-items-center">
                                <div className="col-md-6 d-flex align-items-center">
                                    <label className="mr-2">HDD Name<sup style={{ color: "red" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newHDDName}
                                        ref={inputHDDNameRef}
                                        onChange={(e) => setNewHDDName(e.target.value)}
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

                {hddList.length > 0 && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title text-sm">HDD List ({hddList.length})</h3>
                        </div>
                        <div className="card-body">
                            <table className="improved-common-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>HDD Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {hddList.map((hdd, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{hdd.hddName}</td>
                                            <td>
                                                <button className="custom-success-button mr-2" onClick={() => handleEdit(hdd)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="custom-primary-button" onClick={() => handleRemove(hdd)}>
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
                                By clicking on Yes, the HDD will be permanently deleted.
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

export default HDDMaster;
