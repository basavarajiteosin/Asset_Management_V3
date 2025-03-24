import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import $ from "jquery";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const config = require("../../services/config.json");

const TicketList = () => {
    const [ticketList, setTicketList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const navigate = useNavigate();
    const personalInfo = useSelector((state) => state.personalInformationReducer);

    useEffect(() => {
        getTicketList();
        getUserList();
    }, []);

    const getTicketList = async () => {
        try {
            window.initDestroyDataTableFuncation();
            setIsLoaderActive(true);
            const response = await axios.get(
                `${config.API_URL}Tickets/GetAllTicketsByCreatedBy?createdBy=${personalInfo.userID}`
            );
            setTimeout(() => {
                window.initDataTableFuncation();
            }, 30);
            setTicketList(response.data.data);
        } catch (error) {
            toast.error("Failed to fetch tickets.", config.tostar_config);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const getUserList = async () => {
        try {
            const response = await axios.get(
                config.API_URL + "AuthMasterController/GetAllUsers?ClientId=" + config.clientId,
                { headers: config.headers2 }
            );
            if (response.data.success === "success") {
                setUserList(response.data.data);
            }
        } catch (error) {
            toast.error("Failed to fetch users.", config.tostar_config);
        }
    };

    const getUserName = (userId) => {
        const user = userList.find((u) => u.userID === userId);
        return user ? user.firstName + " " + user.lastName : userId; // Fallback to ID if user not found
    };

    const getStatusLabel = (status) => {
        switch (parseInt(status)) {
            case 0:
                return "Open";
            case 1:
                return "In Progress";
            case 2:
                return "Hold";
            case 3:
                return "Closed";
            default:
                return "Unknown";
        }
    };

    const handleEditTicket = (ticketId) => {
        navigate(`/tickets/create-new-ticket?ticketId=${ticketId}`);
    };

    const renderAttachments = (attachments) => {
        if (!attachments || attachments.length === 0) {
            return <span>No Attachments</span>;
        }
        return (
            <span>
                {attachments.map((attachment, index) => (
                    <a
                        key={attachment.attachId}
                        href={attachment.attachmentServerPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mr-2"
                        title={attachment.documentName}
                    >
                        <i className="fas fa-paperclip" style={{ cursor: "pointer" }}></i>
                        {index < attachments.length - 1 && " "}
                    </a>
                ))}
            </span>
        );
    };

    return (
        <section className="content">
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title text-sm">
                        Created Tickets ({ticketList.length})
                    </h3>
                    <div className="card-tools">
                        <button
                            className="custom-primary-button"
                            onClick={() => navigate("/tickets/create-new-ticket")}
                        >
                            Create Ticket
                        </button>
                    </div>
                </div>
                <div className="card-body table-container">
                    {isLoaderActive ? (
                        <PleaseWaitButton className="font-weight-medium auth-form-btn" />
                    ) : ticketList.length > 0 ? (
                        <table className="improved-table" id="example1">
                            <thead>
                                <tr>
                                    <th>Sr. No.</th>
                                    <th>Ticket Type</th>
                                    <th>Issue Type</th>
                                    <th>Issue Subject</th>
                                    <th>Issue Description</th>
                                    <th>Ticket Reporter</th>
                                    <th>Reporter Remarks</th>
                                    <th>CreatedIn</th>
                                    <th>ActionIn</th>
                                    <th>Attachments</th>
                                    <th className="sticky-action">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ticketList.map((ticket, index) => (
                                    <tr key={ticket.ticketId}>
                                        <td>{index + 1}</td>
                                        <td>{ticket.ticketType}</td>
                                        <td>{ticket.issueType}</td>
                                        <td>{ticket.issueSubject}</td>
                                        <td
                                            style={{
                                                textTransform: "lowercase",
                                                padding: "10px",
                                                letterSpacing: "0.5px",
                                                lineHeight: "1.5",
                                            }}
                                        >
                                            {ticket.issueDescription}
                                        </td>
                                        <td>{getUserName(ticket.assignedUser)}</td>
                                        <td>{ticket.assignerRemarks}</td>
                                        <td>{ticket.createdOn && ticket.createdOn !== null ? new Date(ticket.createdOn).toLocaleString() : ""}</td>
                                        <td>{ticket.modifiedOn && ticket.modifiedOn !== null ? new Date(ticket.modifiedOn).toLocaleString() : ""}</td>
                                        <td>{renderAttachments(ticket.ticketAttachments)}</td>
                                        <td className="sticky-action">{getStatusLabel(ticket.ticketStatus)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div
                            style={{
                                textAlign: "center",
                                padding: "20px",
                                fontSize: "18px",
                                color: "#6c757d",
                                fontWeight: "bold",
                            }}
                        >
                            No Tickets Found
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default TicketList;