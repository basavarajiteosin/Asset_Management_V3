import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PleaseWaitButton from "../../shared/PleaseWaitButton";

const config = require("../../services/config.json");

function GenrationMasters() {
    const inputGenrationNameRef = useRef(null);
    const [genrationList, setGenrationList] = useState([]);
    const [newGenrationName, setNewGenrationName] = useState("");
    const [selectedGenration, setSelectedGenration] = useState(null);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [genrationToDelete, setGenrationToDelete] = useState(null);

    useEffect(() => {
        getGenrationList();
    }, []);

    const getGenrationList = async () => {
        try {
            setIsLoaderActive(true);
            const response = await axios.get(config.API_URL + "AssetManagement/GetAllGenrationDetails");
            setGenrationList(response.data.data || []);
        } catch (error) {
            toast.error("Failed to fetch generations.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newGenrationName.trim() === "") {
            toast.error("Please enter generation name.", config.tostar_config);
            inputGenrationNameRef.current.focus();
            inputGenrationNameRef.current.classList.add("is-invalid");
            return;
        }

        const isDuplicate = genrationList.some(
            (gen) => gen.genrationName.toLowerCase().trim() === newGenrationName.toLowerCase().trim()
        );

        if (isDuplicate) {
            toast.error("Generation already exists.", config.tostar_config);
            return;
        }

        try {
            setIsLoaderActive(true);
            let response;
            const dataToSend = { genrationName: newGenrationName.trim() };

            if (selectedGenration) {
                response = await axios.post(
                    `${config.API_URL}AssetManagement/UpdateGenration?genrationId=${selectedGenration.id}`,
                    dataToSend
                );
                toast.success("Generation updated successfully.", config.tostar_config);
            } else {
                response = await axios.post(config.API_URL + "AssetManagement/CreateGenration", dataToSend);
                toast.success("Successfully created generation.", config.tostar_config);
            }

            if (response.status === 200 || response.status === 201) {
                getGenrationList();
                setNewGenrationName("");
                setSelectedGenration(null);
            }
        } catch (error) {
            toast.error("Failed to add/update generation.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleCancelClick = () => {
        setNewGenrationName("");
        inputGenrationNameRef.current.classList.remove("is-invalid");
    };

    const handleEdit = (gen) => {
        setSelectedGenration(gen);
        setNewGenrationName(gen.genrationName);
    };

    const handleRemove = (gen) => {
        setGenrationToDelete(gen);
        window.confirmModalShow();
    };

    const confirmDelete = async () => {
        try {
            setIsLoaderActive(true);
            await axios.post(config.API_URL + `AssetManagement/RemoveGenration?id=${genrationToDelete.id}`);
            toast.success("Generation deleted successfully.", config.tostar_config);
            setGenrationList((prevList) => prevList.filter((item) => item.id !== genrationToDelete.id));
            window.confirmModalHide();
        } catch (error) {
            toast.error("Failed to delete generation.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    return (
        <div>
            <section className="content">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title text-sm">Create New Generation</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row align-items-center">
                                <div className="col-md-6 d-flex align-items-center">
                                    <label className="mr-2">Generation Name<sup style={{ color: "red" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newGenrationName}
                                        ref={inputGenrationNameRef}
                                        onChange={(e) => setNewGenrationName(e.target.value)}
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

                {genrationList.length > 0 && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title text-sm">Generation List ({genrationList.length})</h3>
                        </div>
                        <div className="card-body">
                            <table className="improved-common-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Generation Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {genrationList.map((gen, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{gen.genrationName}</td>
                                            <td>
                                                <button className="custom-success-button mr-2" onClick={() => handleEdit(gen)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="custom-primary-button" onClick={() => handleRemove(gen)}>
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
                                By clicking on Yes, the generation will be permanently deleted.
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

export default GenrationMasters;
