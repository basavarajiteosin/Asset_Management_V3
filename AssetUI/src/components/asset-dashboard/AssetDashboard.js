import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Carousel } from "react-bootstrap";
import config from "../../services/config.json";
import { toast } from "react-toastify";

const AssetDashboard = () => {
    const [users, setUsers] = useState([]);
    const [assets, setAssets] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(0); // Track expanded asset index

    const personalInfo = useSelector((state) => state.personalInformationReducer);

    useEffect(() => {
        getAllUsers();
        axios
            .get(`${config.API_URL}AssetAssignment/GetAssetsDetailsByUser?userId=${personalInfo.userID}`, {
                headers: config.headers2,
            })
            .then((response) => {
                if (response.status === 200 && response.data.success) {
                    setAssets(response.data.data || []);
                } else {
                    toast.error(response.data.message || "Invalid data received", config.tostar_config);
                }
            })
            .catch((error) => {
                console.error("Error fetching asset details:", error);
                toast.error("Please try again later.", config.tostar_config);
            });
    }, []);

    const getUserFirstNameById = (userId) => {
        const user = users.find((user) => user.userID === userId);
        return user ? `${user.firstName} ${user.lastName}` : "";
    };

    const getAllUsers = () => {
        axios
            .get(`${config.API_URL}AuthMasterController/GetAllAccessUsers?ClientId=pmoAuthApp`)
            .then((response) => {
                if (response.status === 200 && response.data.success === "success") {
                    if (response.data.data.length > 0) {
                        setUsers(response.data.data);
                    }
                } else {
                    toast.error(response.data.message);
                }
            })
            .catch((error) => {
                console.error("API Error:", error);
                toast.error("Oops, something went wrong. Please try again later.");
            });
    };

    const getUserFullName = (userId) => {
        const user = users.find((user) => user.userID === userId);
        return user ? `${user.firstName} ${user.lastName}` : "Unknown User";
    };

    // Toggle Expand/Collapse
    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    return (
        <section className="content">
            <div className="container-fluid">

                {assets.length === 0 ? (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: "50vh", textAlign: "center" }}
                    >
                        <h5>No asset assigned to you yet.</h5>
                    </div>

                ) : (
                    <div className="row">
                        {assets.map((data, index) => (
                            <div key={index} className="col-md-12">
                                <div className="card card-danger card-outline">
                                    <div className="card-header" onClick={() => toggleExpand(index)} style={{ cursor: "pointer" }}>
                                        <h3 className="card-title text-sm">{data.assetName}</h3>
                                        <div className="card-tools">
                                            <button className="btn btn-tool">
                                                {expandedIndex === index ? "▼" : "►"}
                                            </button>
                                        </div>
                                    </div>

                                    {expandedIndex === index && (
                                        <div className="card-body">
                                            <div className="row">
                                                {/* Image Section (60%) */}
                                                <div className="col-md-7">
                                                    <div className="card card-danger card-outline">
                                                        <div className="card-header">
                                                            <h3 className="card-title text-sm">{data.assetName} - Image</h3>
                                                        </div>
                                                        <div className="card-body text-center">
                                                            {data.mandateDocByAssetsAssignment && data.mandateDocByAssetsAssignment.length > 0 ? (
                                                                <Carousel
                                                                    style={{ color: "black" }}
                                                                    prevIcon={
                                                                        <span
                                                                            aria-hidden="true"
                                                                            style={{
                                                                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                                                padding: "10px",
                                                                                borderRadius: "50%",
                                                                                color: "white",
                                                                                cursor: "pointer",
                                                                                position: "absolute",
                                                                                left: "10px",
                                                                                top: "50%",
                                                                                transform: "translateY(-50%)",
                                                                            }}
                                                                        >
                                                                            &#10094; {/* Left arrow */}
                                                                        </span>
                                                                    }
                                                                    nextIcon={
                                                                        <span
                                                                            aria-hidden="true"
                                                                            style={{
                                                                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                                                                padding: "10px",
                                                                                borderRadius: "50%",
                                                                                color: "white",
                                                                                cursor: "pointer",
                                                                                position: "absolute",
                                                                                right: "10px",
                                                                                top: "50%",
                                                                                transform: "translateY(-50%)",
                                                                            }}
                                                                        >
                                                                            &#10095; {/* Right arrow */}
                                                                        </span>
                                                                    }
                                                                >
                                                                    {data.mandateDocByAssetsAssignment.map((doc, idx) => (
                                                                        <Carousel.Item key={idx}>
                                                                            <img
                                                                                className="d-block w-100"
                                                                                src={doc.attachmentServerPath}
                                                                                alt={`Asset Image ${idx + 1}`}
                                                                                // style={{ maxHeight: "374px", objectFit: "cover" }}
                                                                                style={{ maxWidth: "100%", maxHeight: "350px", objectFit: "contain" }}

                                                                            />
                                                                        </Carousel.Item>
                                                                    ))}
                                                                </Carousel>
                                                            ) : (
                                                                <p style={{ fontSize: "16px", color: "red" }}>No image found</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Details Section (40%) */}
                                                <div className="col-md-5">
                                                    <div className="card card-danger card-outline">
                                                        <div className="card-header">
                                                            <h3 className="card-title text-sm">{data.assetName} - Details</h3>
                                                        </div>
                                                        <div className="card-body">
                                                            <table className="table table-bordered table-md"
                                                                style={{ fontSize: "12px", tableLayout: "fixed", wordBreak: "break-word" }}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td style={{ width: "40%" }}><strong>Assigned To:</strong></td>
                                                                        <td>{getUserFullName(data.assignedUser)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>Assigned By:</strong></td>
                                                                        <td>{getUserFullName(data.assignedBy)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>Assigned Date:</strong></td>
                                                                        <td>{new Date(data.assignedDate).toLocaleDateString()}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>Serial Number:</strong></td>
                                                                        <td>{data.serialNumber || "N/A"}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>Specifications:</strong></td>
                                                                        <td style={{ whiteSpace: "pre-wrap" }}>{data.specifications || "N/A"}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>Remarks:</strong></td>
                                                                        <td style={{ whiteSpace: "pre-wrap" }}>{data.remarks || "N/A"}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>Approved By:</strong></td>
                                                                        <td>{getUserFullName(data.approvedBy)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>Reviewed By:</strong></td>
                                                                        <td>{getUserFullName(data.reviewedBy)}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td><strong>Assigned Till Date:</strong></td>
                                                                        <td>{new Date(data.assignedTillDate).toLocaleDateString()}</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>


                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default AssetDashboard;
