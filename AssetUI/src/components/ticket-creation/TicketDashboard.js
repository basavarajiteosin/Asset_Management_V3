import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import * as XLSX from "xlsx"; // For Excel export
import "./TicketDashboard.css";

const config = require("../../services/config.json");

function TicketDashboard() {
    const [ticketList, setTicketList] = useState([]); // Holds all tickets for status counts
    const [filteredTickets, setFilteredTickets] = useState([]); // Holds tickets fetched by status
    const [displayTickets, setDisplayTickets] = useState([]); // Holds tickets after filters
    const [isLoaderActive, setIsLoaderActive] = useState(false);
    const [userList, setUserList] = useState([]); // Holds user list for CreatedBy filter
    const [activeStatus, setActiveStatus] = useState(0); // Default to Open (status=0)
    const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
    const [ticketsPerPage] = useState(5); // Number of tickets per page
    const [searchQuery, setSearchQuery] = useState(""); // Search query state
    const [createdByFilter, setCreatedByFilter] = useState(""); // CreatedBy filter state
    const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" }); // Sorting state
    const personalInfo = useSelector((state) => state.personalInformationReducer);
    const navigate = useNavigate();

    // Calculate status counts from ticketList
    const statusCounts = {
        Open: ticketList.filter((t) => t.ticketStatus === 0).length,
        InProgress: ticketList.filter((t) => t.ticketStatus === 1).length,
        Hold: ticketList.filter((t) => t.ticketStatus === 2).length,
        Closed: ticketList.filter((t) => t.ticketStatus === 3).length,
    };

    useEffect(() => {
        fetchAllTickets();
        getUserList();
        fetchTicketsByStatus(0); // Default to Open
    }, []);

    useEffect(() => {
        fetchTicketsByStatus(activeStatus);
    }, [activeStatus]);

    useEffect(() => {
        // Apply search and CreatedBy filters, then sort
        let filtered = [...filteredTickets];

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter((ticket) =>
                Object.values(ticket).some(
                    (value) =>
                        value &&
                        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
                )
            );
        }

        // Apply CreatedBy filter
        if (createdByFilter) {
            filtered = filtered.filter((ticket) => ticket.createdBy === createdByFilter);
        }

        // Apply sorting
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key] || "";
                const bValue = b[sortConfig.key] || "";
                if (sortConfig.direction === "asc") {
                    return aValue.toString().localeCompare(bValue.toString());
                }
                return bValue.toString().localeCompare(aValue.toString());
            });
        }

        setDisplayTickets(filtered);
        setCurrentPage(1); // Reset to first page when filters or sort change
    }, [filteredTickets, searchQuery, createdByFilter, sortConfig]);

    const fetchAllTickets = async () => {
        try {
            const response = await axios.get(`${config.API_URL}Tickets/GetAllTickets`);
            setTicketList(response.data.data || []);
        } catch (error) {
            toast.error("Failed to fetch ticket counts.", config.tostar_config);
            setTicketList([]);
        }
    };

    const fetchTicketsByStatus = async (status) => {
        try {
            setIsLoaderActive(true);
            const response = await axios.get(
                `${config.API_URL}Tickets/GetTicketsBasedOnStatus?status=${status}`
            );
            setFilteredTickets(response.data.data || []);
            setDisplayTickets(response.data.data || []);
            setCurrentPage(1);
        } catch (error) {
            toast.error(`Failed to fetch ${getStatusLabel(status)} tickets.`, config.tostar_config);
            setFilteredTickets([]);
            setDisplayTickets([]);
        } finally {
            setIsLoaderActive(false);
        }
    };

    const getUserList = async () => {
        try {
            const response = await axios.get(
                `${config.API_URL}AuthMasterController/GetAllAccessUsers?ClientId=${config.clientId}`,
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
        return user ? `${user.firstName} ${user.lastName}` : userId || "N/A"; // Fallback to ID or "N/A"
    };

    const getStatusLabel = (status) => {
        switch (Number(status)) {
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

    const renderAttachments = (attachments) => {
        if (!attachments || !Array.isArray(attachments) || attachments.length === 0) {
            return "No Attachments";
        }
        return attachments.map((attachment) => attachment.documentName || "Attachment").join(", ");
    };

    const truncateText = (text, maxLength = 20) => {
        if (!text) return "N/A";
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const handleReviewTicket = (ticketId) => {
        navigate(`/tickets/create-new-ticket?ticketId=${ticketId}`);
    };

    const handleTileClick = (status) => {
        setActiveStatus(status);
        setSearchQuery("");
        setCreatedByFilter(""); // Reset CreatedBy filter when status changes
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleCreatedByFilterChange = (e) => {
        setCreatedByFilter(e.target.value);
    };

    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction:
                prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
        }));
    };

    const exportToExcel = () => {
        const exportData = displayTickets.map((ticket, index) => ({
            "Sr. No.": index + 1,
            "Ticket Type": ticket.ticketType || "N/A",
            "Issue Type": ticket.issueType || "N/A",
            "Issue Subject": ticket.issueSubject || "N/A",
            "Issue Description": ticket.issueDescription || "N/A",
            "Reporter Remarks": ticket.assignerRemarks || "N/A",
            Status: getStatusLabel(ticket.ticketStatus),
            CreatedIn:
                ticket.createdOn && ticket.createdOn !== null
                    ? new Date(ticket.createdOn).toLocaleDateString()
                    : "N/A",
            ActionIn:
                ticket.modifiedOn && ticket.modifiedOn !== null
                    ? new Date(ticket.modifiedOn).toLocaleDateString()
                    : "N/A",
            CreatedBy: getUserName(ticket.createdBy),
            Attachments: renderAttachments(ticket.ticketAttachments),
        }));

        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");
        XLSX.writeFile(workbook, `${getStatusLabel(activeStatus)}_Tickets.xlsx`);
    };

    const isTicketResolver = personalInfo.userRole !== "Asset User";

    const getHeaderTitle = () => {
        return `${getStatusLabel(activeStatus)} Ticket List (${filteredTickets.length})`;
    };

    // Pagination logic
    const indexOfLastTicket = currentPage * ticketsPerPage;
    const indexOfFirstTicket = indexOfLastTicket - ticketsPerPage;
    const currentTickets = displayTickets.slice(indexOfFirstTicket, indexOfLastTicket);
    const totalPages = Math.ceil(displayTickets.length / ticketsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <section className="content">
            <div className="container-fluid">
                {/* Status Tiles */}
                <div className="row mb-3">
                    {[
                        { label: "Open", count: statusCounts.Open, color: "bg-soft-blue", icon: "fas fa-folder-open", status: 0 },
                        { label: "In Progress", count: statusCounts.InProgress, color: "bg-soft-yellow", icon: "fas fa-hourglass-half", status: 1 },
                        { label: "Hold", count: statusCounts.Hold, color: "bg-soft-teal", icon: "fas fa-pause-circle", status: 2 },
                        { label: "Closed", count: statusCounts.Closed, color: "bg-soft-green", icon: "fas fa-check-circle", status: 3 },
                    ].map((tile) => (
                        <div key={tile.label} className="col-lg-3 col-6">
                            <div
                                className={`small-box ${tile.color} ${activeStatus === tile.status ? "active-tile" : ""}`}
                                onClick={() => handleTileClick(tile.status)}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="inner d-flex align-items-center justify-content-between">
                                    <h3>{tile.count}</h3>
                                    <p>{tile.label}</p>
                                    <div className="icon">
                                        <i className={tile.icon}></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Ticket Table */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title text-sm">{getHeaderTitle()}</h3>
                        <div className="card-tools">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                placeholder="Search tickets..."
                                style={{ padding: "5px", marginRight: "10px", width: "200px" }}
                            />
                            <select
                                value={createdByFilter}
                                onChange={handleCreatedByFilterChange}
                                style={{ padding: "5px", marginRight: "10px", width: "200px" }}
                            >
                                <option value="">All Users</option>
                                {userList.map((user) => (
                                    <option key={user.userID} value={user.userID}>
                                        {`${user.firstName} ${user.lastName}`}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={exportToExcel}
                                style={{ padding: "5px 10px", marginRight: "10px" }}
                            >
                                Export to Excel
                            </button>
                        </div>
                    </div>
                    <div className="card-body table-container">
                        {isLoaderActive ? (
                            <PleaseWaitButton className="font-weight-medium auth-form-btn" />
                        ) : (
                            <div>
                                <table className="improved-table">
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleSort("ticketId")} style={{ cursor: "pointer" }}>
                                                Sr. No. {sortConfig.key === "ticketId" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                            </th>
                                            <th onClick={() => handleSort("ticketType")} style={{ cursor: "pointer" }}>
                                                Ticket Type {sortConfig.key === "ticketType" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                            </th>
                                            <th onClick={() => handleSort("issueType")} style={{ cursor: "pointer" }}>
                                                Issue Type {sortConfig.key === "issueType" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                            </th>
                                            <th onClick={() => handleSort("issueSubject")} style={{ cursor: "pointer" }}>
                                                Issue Subject {sortConfig.key === "issueSubject" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                            </th>
                                            <th onClick={() => handleSort("issueDescription")} style={{ cursor: "pointer" }}>
                                                Issue Description {sortConfig.key === "issueDescription" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                            </th>
                                            <th onClick={() => handleSort("assignerRemarks")} style={{ cursor: "pointer" }}>
                                                Reporter Remarks{sortConfig.key === "assignerRemarks" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                            </th>
                                            <th onClick={() => handleSort("ticketStatus")} style={{ cursor: "pointer" }}>
                                                Status {sortConfig.key === "ticketStatus" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                            </th>
                                            <th onClick={() => handleSort("createdOn")} style={{ cursor: "pointer" }}>
                                                CreatedIn {sortConfig.key === "createdOn" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                            </th>
                                            <th onClick={() => handleSort("modifiedOn")} style={{ cursor: "pointer" }}>
                                                ActionIn {sortConfig.key === "modifiedOn" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                            </th>
                                            <th onClick={() => handleSort("createdBy")} style={{ cursor: "pointer" }}>
                                                CreatedBy {sortConfig.key === "createdBy" && (sortConfig.direction === "asc" ? "↑" : "↓")}
                                            </th>
                                            {/* <th>Attachments</th> */}
                                            {isTicketResolver && <th className="sticky-action">Action</th>}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTickets.length > 0 ? (
                                            currentTickets.map((ticket, index) => (
                                                <tr key={ticket.ticketId || index}>
                                                    <td>{indexOfFirstTicket + index + 1}</td>
                                                    <td>{ticket.ticketType || "N/A"}</td>
                                                    <td>{ticket.issueType || "N/A"}</td>
                                                    <td>{ticket.issueSubject || "N/A"}</td>
                                                    <td title={ticket.issueDescription || "N/A"}>
                                                        {truncateText(ticket.issueDescription)}
                                                    </td>
                                                    <td title={ticket.assignerRemarks || "N/A"}>
                                                        {truncateText(ticket.assignerRemarks)}
                                                    </td>
                                                    <td>{getStatusLabel(ticket.ticketStatus)}</td>
                                                    <td>
                                                        {ticket.createdOn && ticket.createdOn !== null
                                                            ? new Date(ticket.createdOn).toLocaleString()
                                                            : "N/A"}
                                                    </td>
                                                    <td>
                                                        {ticket.modifiedOn && ticket.modifiedOn !== null
                                                            ? new Date(ticket.modifiedOn).toLocaleString()
                                                            : "N/A"}
                                                    </td>
                                                    <td>{getUserName(ticket.createdBy)}</td>
                                                    {/* <td>{renderAttachments(ticket.ticketAttachments)}</td> */}
                                                    {isTicketResolver && (
                                                        <td className="sticky-action">
                                                            <button
                                                                type="button"
                                                                className="custom-success-button mr-2"
                                                                onClick={() => handleReviewTicket(ticket.ticketId)}
                                                            >
                                                                <i className="fas fa-eye"></i> Review
                                                            </button>
                                                        </td>
                                                    )}
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={isTicketResolver ? 12 : 11} style={{ textAlign: "center", padding: "20px" }}>
                                                    No Tickets Found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {/* Pagination Controls */}
                                {displayTickets.length > ticketsPerPage && (
                                    <div className="pagination" style={{ marginTop: "20px", textAlign: "center" }}>
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            style={{ margin: "0 5px" }}
                                        >
                                            Previous
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                            <button
                                                key={page}
                                                onClick={() => paginate(page)}
                                                style={{
                                                    margin: "0 5px",
                                                    backgroundColor: currentPage === page ? "#007bff" : "#fff",
                                                    color: currentPage === page ? "#fff" : "#000",
                                                    border: "1px solid #ccc",
                                                    padding: "5px 10px",
                                                }}
                                            >
                                                {page}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            style={{ margin: "0 5px" }}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default TicketDashboard;