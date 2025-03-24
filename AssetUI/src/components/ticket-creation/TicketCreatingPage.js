import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import { useSelector } from "react-redux";

const config = require("../../services/config.json");

function TicketCreatingPage() {
    // Form field refs
    const inputIssueSubjectReference = useRef(null);
    const inputIssueDescriptionReference = useRef(null);
    const inputTicketTypeReference = useRef(null);
    const inputIssueTypeReference = useRef(null);
    const inputAssignerRemarksReference = useRef(null);
    const inputAttachmentReference = useRef(null);

    // Form field states
    const [issueSubject, setIssueSubject] = useState("");
    const [issueDescription, setIssueDescription] = useState("");
    const [ticketType, setTicketType] = useState("");
    const [issueType, setIssueType] = useState("");
    const [assignerRemarks, setAssignerRemarks] = useState("");
    const [ticketStatus, setTicketStatus] = useState("0"); // Default to Open
    const [ticketAttachments, setTicketAttachments] = useState([]); // New uploads
    const [existingAttachments, setExistingAttachments] = useState([]); // Pre-loaded from server
    const [ticketId, setTicketId] = useState(null);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [isDisabled, setIsDisabled] = useState("0"); // Default to Open

    // Dropdown data states
    const [ticketTypeList, setTicketTypeList] = useState([]);
    const [softwareTypeList, setSoftwareTypeList] = useState([]);
    const [hardwareTypeList, setHardwareTypeList] = useState([]);
    const [issueTypeOptions, setIssueTypeOptions] = useState([]);

    // Redux and location
    const personalInfo = useSelector((state) => state.personalInformationReducer);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const urlTicketId = queryParams.get("ticketId");
    const isAssetUser = personalInfo.userRole === "Asset User";
    const navigate = useNavigate();

    useEffect(() => {
        getTicketTypeList();
        getSoftwareTypeList();
        getHardwareTypeList();

        if (urlTicketId) {
            setTicketId(urlTicketId);
            fetchTicketData(urlTicketId);
        }
    }, [urlTicketId]);

    const getTicketTypeList = async () => {
        try {
            const response = await axios.get(config.API_URL + "TicketMaster/GetAllTicketTypes");
            if (response.data.success) setTicketTypeList(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch ticket types.", config.tostar_config);
        }
    };

    const getSoftwareTypeList = async () => {
        try {
            const response = await axios.get(config.API_URL + "TicketMaster/GetAllSoftwareTypes");
            setSoftwareTypeList(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch software types.", config.tostar_config);
        }
    };

    const getHardwareTypeList = async () => {
        try {
            const response = await axios.get(config.API_URL + "TicketMaster/GetAllHardwareTypes");
            setHardwareTypeList(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch hardware types.", config.tostar_config);
        }
    };

    const fetchTicketData = async (id) => {
        try {
            setIsLoaderActive(true);
            const response = await axios.get(
                config.API_URL + `Tickets/GetTicketById?ticketId=${id}`
            );
            const ticketData = response.data.data;
            setIssueSubject(ticketData.issueSubject || "");
            setIssueDescription(ticketData.issueDescription || "");
            setTicketType(ticketData.ticketType || "");
            setIssueType(ticketData.issueType || "");
            setAssignerRemarks(ticketData.assignerRemarks || "");
            setTicketStatus(ticketData.ticketStatus.toString() || "0");
            setExistingAttachments(ticketData.ticketAttachments || []);
            setIsDisabled(ticketData.ticketStatus.toString() || "0")
        } catch (error) {
            toast.error("Failed to fetch ticket data.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    useEffect(() => {
        if (ticketType === "Software") {
            setIssueTypeOptions(softwareTypeList);
        } else if (ticketType === "Hardware") {
            setIssueTypeOptions(hardwareTypeList);
        } else {
            setIssueTypeOptions([]);
        }
        if (!ticketId) setIssueType("");
    }, [ticketType, softwareTypeList, hardwareTypeList, ticketId]);

    const clearAllFields = () => {
        setIssueSubject("");
        setIssueDescription("");
        setTicketType("");
        setIssueType("");
        setAssignerRemarks("");
        setTicketStatus("0");
        setTicketAttachments([]);
        setExistingAttachments([]);
        [inputIssueSubjectReference, inputIssueDescriptionReference, inputTicketTypeReference, inputIssueTypeReference, inputAssignerRemarksReference]
            .forEach((ref) => ref.current?.classList.remove("is-invalid"));
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain",
        ];
        const validFiles = newFiles.filter((file) => allowedTypes.includes(file.type));
        if (validFiles.length < newFiles.length) {
            toast.error("Only images and documents (.jpg, .png, .gif, .pdf, .doc, .docx, .txt) are allowed.", config.tostar_config);
        }
        setTicketAttachments((prev) => [...prev, ...newFiles]);
    };

    const removeAttachment = (indexToRemove) => {
        setTicketAttachments((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const renderAttachments = () => {
        if (!existingAttachments.length) return null;
        return (
            <div className="form-group col-md-12">
                <label style={{ fontWeight: "bold", marginBottom: "5px" }}>Reference Attachments</label>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {existingAttachments.map((attachment) => (
                        <li
                            key={attachment.attachId}
                            style={{
                                padding: "8px",
                                backgroundColor: "#f8f9fa",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                marginBottom: "5px",
                            }}
                        >
                            <a
                                href={attachment.attachmentServerPath}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#007bff", textDecoration: "none" }}
                            >
                                <i className="fas fa-paperclip" style={{ marginRight: "8px" }}></i>
                                {attachment.documentName}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const renderUploadedAttachments = () => {
        if (!ticketAttachments.length) return null;
        return (
            <div style={{ marginTop: "10px" }}>
                <h6 style={{ fontSize: "14px", color: "#333", marginBottom: "5px" }}>
                    Uploaded Attachments
                </h6>
                <ul style={{ listStyle: "none", padding: 0 }}>
                    {ticketAttachments.map((file, index) => (
                        <li
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "8px",
                                backgroundColor: "#f8f9fa",
                                border: "1px solid #ddd",
                                borderRadius: "4px",
                                marginBottom: "5px",
                            }}
                        >
                            <i className="fas fa-file-alt" style={{ marginRight: "8px", color: "#007bff" }}></i>
                            <span style={{ flexGrow: 1 }}>{file.name}</span>
                            <button
                                type="button"
                                onClick={() => removeAttachment(index)}
                                style={{
                                    padding: "4px 8px",
                                    backgroundColor: "#dc3545",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                }}
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const handleTicketSubmit = async (e) => {
        e.preventDefault();

        const inputs = [
            inputIssueSubjectReference,
            inputTicketTypeReference,
            inputIssueTypeReference,
        ];
        inputs.forEach((ref) => ref.current?.classList.remove("is-invalid"));

        if (!issueSubject.trim()) {
            toast.error("Please enter issue subject.", config.tostar_config);
            inputIssueSubjectReference.current.focus();
            inputIssueSubjectReference.current.classList.add("is-invalid");
            return;
        }

        if (!ticketType) {
            toast.error("Please select ticket type.", config.tostar_config);
            inputTicketTypeReference.current.focus();
            inputTicketTypeReference.current.classList.add("is-invalid");
            return;
        }

        if (!issueType) {
            toast.error("Please select issue type.", config.tostar_config);
            inputIssueTypeReference.current.focus();
            inputIssueTypeReference.current.classList.add("is-invalid");
            return;
        }

        setIsLoaderActive(true);

        const formData = new FormData();
        formData.append("IssueSubject", issueSubject);
        formData.append("IssueDescription", issueDescription || "");
        formData.append("TicketType", ticketType);
        formData.append("IssueType", issueType);
        if (!isAssetUser) {
            formData.append("AssignerRemarks", assignerRemarks || "");
            formData.append("AssignedUser", personalInfo.userID || "defaultUserId");
        }
        formData.append("TicketStatus", ticketStatus);
        formData.append("CreatedBy", personalInfo.userID || "defaultUserId");
        formData.append("TicketId", ticketId || "0");

        ticketAttachments.forEach((file) => formData.append("TicketAttchment", file));

        try {
            const url = ticketId
                ? config.API_URL + `Tickets/UpdateTicket?ticketId=${ticketId}`
                : config.API_URL + "Tickets/CreateTicket";

            const response = await axios.post(url, formData, {
                headers: { "Content-Type": "multipart/form-data", accept: "*/*" },
            });

            if (response.status === 200 || response.status === 201) {
                toast.success(
                    ticketId ? "Ticket updated successfully!" : "Ticket created successfully!",
                    config.tostar_config
                );
                if (!ticketId) clearAllFields();
                else fetchTicketData(ticketId);
                handleBackClick();
            } else {
                toast.error("Operation failed.", config.tostar_config);
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to process ticket.",
                config.tostar_config
            );
        } finally {
            setIsLoaderActive(false);
        }
    };

    const handleBackClick = () => {
        if (isAssetUser) {
            navigate("/tickets");
        } else {
            navigate("/tickets-dashboard");
        }
    };

    return (
        <section className="content">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title text-sm">
                        <i
                            onClick={handleBackClick}
                            className="fas fa-arrow-left cursor-pointer mr-2"
                            style={{ cursor: "pointer" }}
                        ></i>
                        {ticketId ? "Edit Ticket" : "Create New Ticket"}
                    </h3>
                </div>
                <div className="card-body text-sm">
                    <form onSubmit={handleTicketSubmit}>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <label htmlFor="issueSubjectInput">
                                    Issue Subject<sup style={{ color: "red" }}>*</sup>
                                </label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    id="issueSubjectInput"
                                    ref={inputIssueSubjectReference}
                                    value={issueSubject}
                                    onChange={(e) => setIssueSubject(e.target.value)}
                                    placeholder="Enter Issue Subject"
                                    maxLength={200}
                                    disabled={!isAssetUser}
                                />
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="ticketTypeInput">
                                    Ticket Type<sup style={{ color: "red" }}>*</sup>
                                </label>
                                <select
                                    className="form-control form-control-sm"
                                    id="ticketTypeInput"
                                    ref={inputTicketTypeReference}
                                    value={ticketType}
                                    disabled={!isAssetUser}
                                    onChange={(e) => setTicketType(e.target.value)}
                                >
                                    <option value="">--Select--</option>
                                    {ticketTypeList.map((type) => (
                                        <option key={type.ttId} value={type.ticketTypeName}>
                                            {type.ticketTypeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="issueTypeInput">
                                    Issue Type<sup style={{ color: "red" }}>*</sup>
                                </label>
                                <select
                                    className="form-control form-control-sm"
                                    id="issueTypeInput"
                                    ref={inputIssueTypeReference}
                                    value={issueType}
                                    onChange={(e) => setIssueType(e.target.value)}
                                    disabled={!ticketType || !isAssetUser}
                                >
                                    <option value="">--Select--</option>
                                    {issueTypeOptions.map((type) => (
                                        <option
                                            key={type.stId || type.htId}
                                            value={type.softwareTypeName || type.hardwareTypeName}
                                        >
                                            {type.softwareTypeName || type.hardwareTypeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group col-md-6">
                                <label htmlFor="ticketStatusInput">Ticket Status</label>
                                <select
                                    className="form-control form-control-sm"
                                    id="ticketStatusInput"
                                    value={ticketStatus}
                                    onChange={(e) => setTicketStatus(e.target.value)}
                                    disabled={isAssetUser || isDisabled === "3"}
                                >
                                    <option value="0">Open</option>
                                    <option value="1">In Progress</option>
                                    <option value="2">Hold</option>
                                    <option value="3">Closed</option>
                                </select>
                            </div>
                            <div className="form-group col-md-12">
                                <label htmlFor="issueDescriptionInput">Issue Description</label>
                                <textarea
                                    className="form-control form-control-sm"
                                    style={{ resize: "none", minHeight: "90px" }}
                                    id="issueDescriptionInput"
                                    ref={inputIssueDescriptionReference}
                                    value={issueDescription}
                                    onChange={(e) => setIssueDescription(e.target.value)}
                                    placeholder="Enter Issue Description"
                                    maxLength={1000}
                                    disabled={!isAssetUser}
                                />
                            </div>
                            {!isAssetUser && (
                                <div className="form-group col-md-12">
                                    <label htmlFor="assignerRemarksInput">Reporter Remarks</label>
                                    <textarea
                                        className="form-control form-control-sm"
                                        style={{ resize: "none", minHeight: "90px" }}
                                        id="assignerRemarksInput"
                                        ref={inputAssignerRemarksReference}
                                        value={assignerRemarks}
                                        onChange={(e) => setAssignerRemarks(e.target.value)}
                                        placeholder="Enter Reporter Remarks"
                                        maxLength={500}
                                        disabled={isDisabled === "3"}
                                    />
                                </div>
                            )}
                            {ticketId && !isAssetUser && renderAttachments()}
                            {(!ticketId || isAssetUser) && (
                                <div className="form-group col-md-12">
                                    <label htmlFor="ticketAttachmentInput">
                                        {ticketId ? "Add More Attachments" : "Ticket Attachments"}
                                    </label>
                                    <input
                                        type="file"
                                        ref={inputAttachmentReference}
                                        multiple
                                        accept="image/*,application/pdf,.doc,.docx,.txt" // Restrict to images and documents
                                        onChange={handleFileChange}
                                        style={{
                                            padding: "5px",
                                            border: "1px solid #ced4da",
                                            borderRadius: "4px",
                                            width: "100%",
                                            fontSize: "14px",
                                        }}
                                    />
                                    <small style={{ color: "#6c757d", fontSize: "12px" }}>
                                        Select multiple files to upload.
                                    </small>
                                    {renderUploadedAttachments()}
                                </div>
                            )}
                        </div>
                        <div className="card-footer mt-2">
                            {isLoaderActive ? (
                                <PleaseWaitButton className="font-weight-medium auth-form-btn" />
                            ) : (
                                <>
                                    <button type="submit" disabled={isDisabled === "3"} className="custom-success-button mr-2">
                                        {ticketId ? "Update & Submit" : "Save & Submit"}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isDisabled === "3"}
                                        className="custom-secondary-button mr-2"
                                        onClick={clearAllFields}
                                    >
                                        Clear
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default TicketCreatingPage;