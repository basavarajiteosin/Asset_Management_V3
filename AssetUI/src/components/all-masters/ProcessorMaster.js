import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import axios from "axios";

const config = require("../../services/config.json");

function ProcessorMaster() {
    const inputProcessorRef = useRef(null);
    const [processorList, setProcessorList] = useState([]);
    const [newProcessor, setNewProcessor] = useState("");
    const [selectedProcessor, setSelectedProcessor] = useState(null);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [processorToDelete, setProcessorToDelete] = useState(null);

    useEffect(() => {
        getProcessorList();
    }, []);

    const getProcessorList = async () => {
        try {
            setIsLoaderActive(true);
            const response = await axios.get(config.API_URL + "AssetManagement/GetAllProcessorDetails");
            setProcessorList(response.data.data || []);

        } catch (error) {
            toast.error("Failed to fetch processor details.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newProcessor.trim() === "") {
            toast.error("Please enter processor name.", config.tostar_config);
            inputProcessorRef.current.focus();
            inputProcessorRef.current.classList.add("is-invalid");
            return;
        }

        const isDuplicate = processorList.some(
            (processor) => processor.processorName.toLowerCase().trim() === newProcessor.toLowerCase().trim()
        );

        if (isDuplicate) {
            toast.error("Processor already exists.", config.tostar_config);
            return;
        }

        try {
            setIsLoaderActive(true);
            let response;
            if (selectedProcessor) {
                response = await axios.post(config.API_URL + "AssetManagement/UpdateProcessor", {
                    processorId: selectedProcessor.id,
                    processorName: newProcessor.trim(),
                });
                toast.success("Processor updated successfully.", config.tostar_config);
            } else {
                response = await axios.post(config.API_URL + "AssetManagement/CreateProcessor", {
                    processorName: newProcessor.trim(),
                });
                toast.success("Successfully created processor.", config.tostar_config);
            }

            if (response.status === 200 || response.status == 201) {
                getProcessorList();
                setNewProcessor("");
                setSelectedProcessor(null);
            }
        } catch (error) {
            toast.error("Failed to add/update processor.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleCancelClick = () => {
        setNewProcessor("");
        inputProcessorRef.current.classList.remove("is-invalid");
    };

    const handleEdit = (processor) => {
        setSelectedProcessor(processor);
        setNewProcessor(processor.processorName);
    };

    const handleRemove = (processor) => {
        setProcessorToDelete(processor);
        window.confirmModalShow();
    };

    const confirmDelete = async () => {
        try {
            setIsLoaderActive(true);
            await axios.post(config.API_URL + `AssetManagement/RemoveProcessor?id=${processorToDelete.id}`);
            toast.success("Processor deleted successfully.", config.tostar_config);
            setProcessorList((prevList) => prevList.filter((item) => item.id !== processorToDelete.id));
            window.confirmModalHide();
        } catch (error) {
            toast.error("Failed to delete processor.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    return (
        <div>
            <section className="content">
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title text-sm">Create New Processor</h3>
                    </div>
                    <div className="card-body">
                        <form onSubmit={handleSubmit}>
                            <div className="row align-items-center">
                                <div className="col-md-6 d-flex align-items-center">
                                    <label className="mr-2">Processor Name<sup style={{ color: "red" }}>*</sup></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newProcessor}
                                        ref={inputProcessorRef}
                                        onChange={(e) => setNewProcessor(e.target.value)}
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

                {processorList.length > 0 && (
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title text-sm">Processor List ({processorList.length})</h3>
                        </div>
                        <div className="card-body">
                            <table className="improved-common-table">
                                <thead>
                                    <tr>
                                        <th>Sr. No.</th>
                                        <th>Processor Name</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {processorList.map((processor, index) => (
                                        <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{processor.processorName}</td>
                                            <td>
                                                <button className="custom-success-button mr-2" onClick={() => handleEdit(processor)}>
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className="custom-primary-button" onClick={() => handleRemove(processor)}>
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
                                By clicking on Yes delete all the task details. Once you deleted
                                it can not be recovered.
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

export default ProcessorMaster;
