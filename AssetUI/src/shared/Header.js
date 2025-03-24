import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { isValidEmail, isValidContact } from '../common/validations';
import PleaseWaitButton from '../shared/PleaseWaitButton';
import $ from "jquery";
import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

const config = require('../services/config.json');

function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [highlightField, setHighlightField] = useState(null);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const personalInfo = useSelector((state) => state.personalInformationReducer);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (personalInfo?.menuItemNames?.length > 0) {
      const currentRoute = location.pathname; // Extract current route
      const matchedItem = personalInfo.menuItemNames.find(
        (item) => item.appRoute === currentRoute
      );
      if (matchedItem) {
        setTitle(matchedItem.appName); // Set appName if match found
      }
    }
  }, [location.pathname, personalInfo.menuItemNames]);

  let navigate = useNavigate();


  const handleChangePassword = () => {
    if (newPassword !== confirmNewPassword) {
      setPasswordError("Passwords do not match");
      setHighlightField("confirmNewPassword");
      toast.error("Passwords do not match", config.tostar_config);
      return;
    }
    // Show success toast message
    toast.success("Password changed successfully!", config.tostar_config);
  };

  const handleLogout = () => {
    // axios.post(config.API_URL + "AuthMasterController/SignOut?userID=" + personalInfo.userID,
    //   { headers: config.headers2 }).then(response => {
    localStorage.removeItem("persist:am_user");
    localStorage.removeItem("isUserDataAuthenticated");
    localStorage.removeItem("user_id");
    localStorage.clear();
    navigate("/");
    // }).catch(error => {
    //   toast.error(error, config.tostar_config);
    // });
  };

  return (
    <>
      {/* <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        style={{
          width: "300px",
        }}
        toastStyle={{ backgroundColor: "#fff", color: "black" }}
      /> */}

      <nav className="main-header navbar navbar-expand navbar-black navbar-dark">
        <ul className="navbar-nav">
          <li className="nav-item">
            <a
              className="nav-link"
              data-widget="pushmenu"
              href="#"
              role="button"
            >
              <i className="fas fa-bars"></i>
            </a>
          </li>
          <li className="nav-item">
            <span className="nav-title nav-link">{title || ""}</span>
          </li>
        </ul>

        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            {/* <a
              className="nav-link"
              data-widget="fullscreen"
              href="#"
              role="button"
            >
              <i className="fas fa-expand-arrows-alt"></i>
            </a> */}
          </li>
          <li className="nav-item dropdown show">
            <a className="nav-link nav-profile-header " data-toggle="dropdown" href="#" aria-expanded="true">
              <div className="d-flex ">
                <span className="profile-name mr-2 pt-1">{personalInfo.firstName} {personalInfo.lastName} ({personalInfo.userRole})</span>
                <i className="fas fa-user"></i> {/* Profile Icon */}
              </div>

            </a>
            <div className="dropdown-menu dropdown-menu-sm dropdown-menu-right" style={{ left: 'inherit', right: '0px' }}>
              {/* Profile Menu Item */}
              {/* <a href="#" className="dropdown-item" style={{ cursor: "pointer" }}>
      <i className="fas fa-user-circle mr-2"></i> Profile
    </a> */}

              {/* <div className="dropdown-divider"></div> Divider Line */}

              {/* Logout Menu Item */}
              <div className="dropdown-item">
                <a href="#" className="logout-link" style={{ cursor: "pointer" }} onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </a>
              </div>
            </div>
          </li>

        </ul>
      </nav>

      {/* Modal */}
      <div
        className={`modal ${showModal ? "modal-open" : ""}`}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Change Password</h4>
              <button type="button" className="close">
                <span>&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group col-md-4">
                <label
                  htmlFor="currentPassword"
                  style={{
                    color: "green",
                    fontWeight: "normal",
                    fontSize: "0.8em",
                  }}
                >
                  Current Password<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  type="password"
                  className={`form-control form-control-sm ${highlightField === "currentPassword" &&
                    (passwordError || currentPassword === "")
                    ? "is-invalid"
                    : ""
                    }`}
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                />
              </div>
              <div className="form-group col-md-4">
                <label
                  htmlFor="newPassword"
                  style={{
                    color: "green",
                    fontWeight: "normal",
                    fontSize: "0.8em",
                  }}
                >
                  New Password<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  type="password"
                  className={`form-control form-control-sm ${highlightField === "newPassword" &&
                    ((passwordError && newPassword === "") ||
                      (passwordError &&
                        passwordError.includes("Passwords do not match")))
                    ? "is-invalid"
                    : ""
                    }`}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New Password"
                />
              </div>
              <div className="form-group col-md-4">
                <label
                  htmlFor="confirmNewPassword"
                  style={{
                    color: "green",
                    fontWeight: "normal",
                    fontSize: "0.8em",
                  }}
                >
                  Confirm New Password<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  type="password"
                  className={`form-control form-control-sm ${highlightField === "confirmNewPassword" &&
                    (passwordError || confirmNewPassword === "")
                    ? "is-invalid"
                    : ""
                    }`}
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Confirm New Password"
                />
              </div>
              {passwordError && (
                <div className="invalid-feedback">{passwordError}</div>
              )}
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success float-right btn-xs ml-2"
                onClick={handleChangePassword}
              >
                Save & Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
