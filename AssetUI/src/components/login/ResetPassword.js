import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import { removeExtraSpaces } from "../../common/textOperations";
import { useDispatch } from "react-redux";
import { setUserPersonalInformation } from "../../reduxStorage/personalInformation";
import "./login.css";
// const axios = require('axios');
const config = require("../../services/config.json");

const ResetPassword = () => {
  const inputUserEmailReference = useRef(null);
  const inputUserPasswordReference = useRef(null);
  const inputPasswordReference = useRef(null);
  const inputConfirmPasswordReference = useRef(null);

  const dispatch = useDispatch();
  const location = useLocation();
  const [resetPasswordClick, setResetPasswordClick] = useState(true);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get("token");
  const userID = new URLSearchParams(location.search).get("Id");
  const currentOrigin = window.location.origin;
  // console.log("--->>>", currentOrigin);

  let handleResetPassword = (e) => {
    setUserEmail("");
    setUserPassword("");
    setResetPasswordClick(true);
  };

  let handleSignIn = (e) => {
    setNewPassword("");
    setConfirmNewPassword("");
    setResetPasswordClick(false);
  };

  const handleSignInAccount = (e) => {
    if (removeExtraSpaces(userEmail)) {
      if (userPassword) {
        setIsLoaderActive(true);
        axios
          .post(
            config.API_URL + "AuthController/token",
            {
              userName: userEmail,
              password: userPassword,
            },
            {
              headers: config.headers2,
            }
          )
          .then((response) => {
            if (response.status == 200) {
              if (response.data.success == "success") {
                toast.success(response.data.message, config.tostar_config);
                let responseData = response.data.data;
                // console.log("responseData--->",responseData);
                let user_ID = responseData.userID;
                localStorage.setItem("user_id", user_ID);
                localStorage.setItem("isUserDataAuthenticated", true);
                dispatch(
                  setUserPersonalInformation({
                    userID: responseData.userID,
                    userName: responseData.userName,
                    userRole: responseData.userRole,
                    displayName: responseData.displayName,
                    emailAddress: responseData.emailAddress,
                    menuItemNames: [],
                    token: responseData.token,
                    profilePic: responseData.profilePic,
                    firstName: responseData.firstName,
                    lastName: responseData.lastName,
                    clientId: "",
                    department: responseData.accountGroup,
                  })
                );
                setTimeout(() => {
                  setIsLoaderActive(false);
                  // if (responseData.menuItemNames.length > 0) {
                  navigate("/main-dashboard");
                  // }
                }, 1000);
              } else {
                setIsLoaderActive(false);
                toast.error(response.data.message, config.tostar_config);
              }
            } else if (response.data.status.status == 500) {
              setIsLoaderActive(false);
              toast.error("Invalid username or password", config.tostar_config);
            }
          })
          .catch((error) => {
            toast.error("Please try again later.", config.tostar_config);
            setIsLoaderActive(false);
          });
      } else {
        inputUserPasswordReference.current.focus();
        toast.error("Please enter your password.", config.tostar_config);
      }
    } else {
      inputUserEmailReference.current.focus();
      toast.error("Please enter your email address.", config.tostar_config);
    }
  };

  const onEnterKeyPress = (event) => {
    if (event.keyCode === 13) {
      handleSignInAccount();
    }
  };

  const handleResetPasswordSubmit = () => {
    setErrorMessage(""); // Clear previous error message
    if (removeExtraSpaces(newPassword)) {
      if (removeExtraSpaces(confirmNewPassword)) {
        if (
          removeExtraSpaces(newPassword) ===
          removeExtraSpaces(confirmNewPassword)
        ) {
          setIsLoaderActive(true);
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
              if (response.status === 200) {
                if (response.data.success === "success") {
                  toast.success(response.data.message);
                  navigate("/login");
                  setTimeout(() => {
                    setIsLoaderActive(false);
                    setNewPassword("");
                    setConfirmNewPassword("");
                  }, 1500);
                } else {
                  setIsLoaderActive(false);
                  toast.error(response.data.message);
                }
              } else {
                setIsLoaderActive(false);
                toast.error("Invalid request");
              }
            })
            .catch((error) => {
              handleError(error);
            });
        } else {
          toast.error(
            "The new password and confirm new password are not same.",
            config.tostar_config
          );
        }
      } else {
        inputConfirmPasswordReference.current.focus();
        toast.error("Please confirm your new password.", config.tostar_config);
      }
    } else {
      inputPasswordReference.current.focus();
      toast.error("Please enter your new password.", config.tostar_config);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 400:
          toast.error("Bad request");
          break;
        case 401:
          toast.error("You are not authorized");
          break;
        case 403:
          toast.error("Forbidden");
          break;
        case 404:
          toast.error("Not found");
          break;
        case 500:
          toast.error("Internal server error");
          break;
        default:
          toast.error("An unknown error occurred");
      }
    } else {
      toast.error("Network error");
    }
    setIsLoaderActive(false);
  };

  return (
    <div className="loginPage">
      <div
        className={
          resetPasswordClick ? "container right-panel-active" : "container"
        }
        id="container"
        style={{ top: "15%" }}
      >
        <div className="form-container sign-up-container">
          <form action="#">
            <h3>Reset Password</h3>
            <h6>Enter your new password</h6>
            <input
              type="password"
              value={newPassword}
              ref={inputPasswordReference}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
            />

            <input
              type="password"
              value={confirmNewPassword}
              ref={inputConfirmPasswordReference}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm New Password"
            />

            {isLoaderActive ? (
              <PleaseWaitButton className="float-right btn-xs ml-2 font-weight-medium auth-form-btn" />
            ) : (
              <button
                type="button"
                className="btn btn-success float-right btn-xs ml-2"
                onClick={handleResetPasswordSubmit}
              >
                Reset Password
              </button>
            )}
          </form>
        </div>
        <div
          className="form-container sign-in-container"
          onKeyDown={(e) => onEnterKeyPress(e)}
        >
          <form action="#">
            <h3>Sign in</h3>

            <h6 className="mb-3">
              Please enter your email and password for sign In
            </h6>
            <input
              type="email"
              ref={inputUserEmailReference}
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Your Email"
            />
            <input
              type="password"
              ref={inputUserPasswordReference}
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
              placeholder="Your Password"
            />
            {isLoaderActive ? (
              <PleaseWaitButton className="btn-sm  font-weight-medium auth-form-btn" />
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  handleSignInAccount(e);
                }}
              >
                Sign In
              </button>
            )}
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <img
                src={require("../../assets/images/Hlogo.png")}
                className="logo"
                alt="logo"
              />
              <h3>Welcome Back!</h3>
              <p style={{ color: "#353535" }}>
                To keep connected with us please reset your password
              </p>
              <button
                type="button"
                className="ghost"
                id="signIn"
                onClick={(e) => {
                  handleSignIn(e);
                }}
              >
                Sign In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <img
                src={require("../../assets/images/Hlogo.png")}
                className="logo"
                alt="logo"
              />
              <h3>Hello, Friend!</h3>
              <p style={{ color: "#353535" }}>
                Enter your credential details and start your today journey
              </p>
              <button
                type="button"
                className="ghost"
                id="signUp"
                onClick={(e) => {
                  handleResetPassword(e);
                }}
              >
                Reset your password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
