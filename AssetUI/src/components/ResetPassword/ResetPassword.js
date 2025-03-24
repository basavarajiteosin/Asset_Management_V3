import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";
import { removeExtraSpaces } from "../../common/textOperations";
import loadConfig from "../../services/config";
import { useLocation, useNavigate } from "react-router-dom";
import "./ResetPassword.css"
const config = require("../../services/config.json");

const ResetPassword = () => {
  const location = useLocation();
  const inputNewPasswordReference = useRef(null);
  const inputConfirmPasswordReference = useRef(null);
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");
  const userID = new URLSearchParams(location.search).get("Id");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const [errorField, setErrorField] = useState(null);

  const resetChangePassword = () => {
    setConfirmPassword("");
    setNewPassword("");
    setErrorField(null);
  };


  const toggleNewPasswordVisibility = () => {
    setIsNewPasswordVisible(!isNewPasswordVisible);
  };
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };
  const hanldeClear = () => {
    setConfirmPassword("");
    setNewPassword("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "newPassword") {
      setNewPassword(value);
      if (errorField === "newPassword") {
        setErrorField(null);
      }
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
      if (errorField === "confirmPassword") {
        setErrorField(null);
      }
    }
  };

  const handleChangePassSubmit = (e) => {
    e.preventDefault();

    let errorMessage = "";
    let fieldWithError = null;
    if (!removeExtraSpaces(newPassword)) {
      fieldWithError = "newPassword";
      errorMessage = "Please enter new password.";
    }
    else if (!passwordRegex.test(newPassword)) {
      fieldWithError = "newPassword";
      errorMessage =
        "New password must be at least 8 characters long, contain uppercase letters, lowercase letters, numbers, and special characters.";
    }
    // Check if the confirm password is empty
    else if (!removeExtraSpaces(confirmPassword)) {
      fieldWithError = "confirmPassword";
      errorMessage = "Please enter confirm password.";
    }
    // Check if new password and confirm password match
    else if (
      removeExtraSpaces(newPassword) !== removeExtraSpaces(confirmPassword)
    ) {
      fieldWithError = "confirmPassword";
      errorMessage = "New password and confirm password should be the same.";
    }

    // If there's an error, handle it
    if (errorMessage) {
      setErrorField(fieldWithError);
      toast.error(errorMessage);
      switch (fieldWithError) {
        case "newPassword":
          inputNewPasswordReference.current.focus();
          break;
        case "confirmPassword":
          inputConfirmPasswordReference.current.focus();
          break;
        default:
          break;
      }
      return;
    }

    // Clear the error field if validation passes
    setErrorField(null);

    // Submit the form data
    axios
      .post(
        config.API_URL + "AuthMasterController/ForgotPassword",
        {
          userID: userID,
          emailAddress: "",
          newPassword: newPassword,
          token: token,
        },
        {
          headers: config.headers2,
        }
      )
      .then((response) => {
        if (response.data.success === "success") {
          toast.success(response.data.message);
          resetChangePassword();
          // localStorage.removeItem('isChangePasswordRequired');
          localStorage.clear();
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        } else {
          resetChangePassword();
          toast.error(response.data.message);
        }
        hanldeClear()
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Oops! Something went wrong. Please try again later.");
        }
      });
  };

  const getInputClassName = (fieldName) => {
    return errorField === fieldName
      ? "form-control is-invalid"
      : "form-control";
  };

  return (
    <>
      <div className="container changepassword-container">
        <div className="row">
          <div className="col-md-6 changepassword-left">
            <img
              alt="logo"
              height="300"
              src={require("../../assets/images/loginlogo.png")}
              width="400"
            />

            <h2>Log In to Your Account</h2>
            <p>
              Manage company assets efficiently and stay organized with our powerful asset management system. Track laptops, accessories, and more—all in one place.
            </p>
          </div>
          <div className="col-md-6 changepassword-right">
            <img
              alt="Company logo"
              height="50"
              src={require("../../assets/images/iteosLogo.png")}
              width="120"
              className="mb-2"
            />
            <>
              <h2>Change your password</h2>
              <p>Enter a new password below to change your password</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleChangePassSubmit(e);
                }}

              >
                <div className="mb-3 mt-2">
                  <div
                    className="input-container"
                    style={{ position: "relative", width: "100%" }}
                  >
                    <input
                      type={isNewPasswordVisible ? "text" : "password"}
                      className={getInputClassName("newPassword")}
                      placeholder="New Password"
                      name="newPassword"
                      value={newPassword}
                      onChange={handleChange}
                      ref={inputNewPasswordReference}
                      style={{ width: "100%", paddingRight: 2.5 }}
                    />
                    <i
                      className={`fa ${isNewPasswordVisible ? "fa-eye" : "fa-eye-slash"
                        }`}
                      onClick={toggleNewPasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#929292"
                      }}
                    ></i>
                  </div>
                </div>
                <div className="mb-3">
                  <div
                    className="input-container"
                    style={{ position: "relative", width: "100%" }}
                  >
                    <input
                      type={isConfirmPasswordVisible ? "text" : "password"}
                      className={getInputClassName("confirmPassword")}
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                      ref={inputConfirmPasswordReference}
                    />
                    <i
                      className={`fa ${isConfirmPasswordVisible ? "fa-eye" : "fa-eye-slash"
                        }`}
                      onClick={toggleConfirmPasswordVisibility}
                      style={{
                        position: "absolute",
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        cursor: "pointer",
                        color: "#929292"
                      }}
                    ></i>
                  </div>
                </div>
                <button className="btn btn-primary w-100 mt-3" type="submit">
                  Change Password
                </button>
              </form>
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;