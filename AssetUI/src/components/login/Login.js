
import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserPersonalInformation } from "../../reduxStorage/personalInformation";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import { removeExtraSpaces } from "../../common/textOperations";
import "./login.css";

const config = require("../../services/config.json");

const Login = () => {
  const inputUserEmailReference = useRef(null);
  const inputUserPasswordReference = useRef(null);
  const inputForgotEmailReference = useRef(null);
  // const inputForgotConfirmEmailReference = useRef(null);
  const dispatch = useDispatch();
  let navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [forgotPasswordClick, setForgotPasswordClick] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userForgotEmail, setUserForgotEmail] = useState("");
  // const [userForgotConfirmEmail, setUserForgotConfirmEmail] = useState("");
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [inputErrors, setInputErrors] = useState({
    userEmail: false,
    userPassword: false,
    userForgotEmail: false,
    // userForgotConfirmEmail: false,
  });
  const urlPath = window.location.origin;
  const handleForgotPassword = () => {
    setUserEmail("");
    setUserPassword("");
    setForgotPasswordClick(true);
  };

  const handleSignIn = () => {
    setUserForgotEmail("");
    // setUserForgotConfirmEmail("");
    setForgotPasswordClick(false);
  };

  const clearFormFields = () => {
    setUserEmail("");
    setUserPassword("");
    setUserForgotEmail("");
    // setUserForgotConfirmEmail("");
  };
  const validateInputs = () => {
    let valid = true;
    let errors = {
      userEmail: false,
      userPassword: false,
      userForgotEmail: false,
      userForgotConfirmEmail: false,
    };

    if (!removeExtraSpaces(userEmail)) {
      errors.userEmail = true;
      valid = false;
      inputUserEmailReference.current.focus();
      toast.error("Please enter your email address.");
    } else if (!userPassword) {
      errors.userPassword = true;
      valid = false;
      inputUserPasswordReference.current.focus();
      toast.error("Please enter your password.");
    }

    setInputErrors(errors);
    return valid;
  };
  const validateForgotPasswordInputs = () => {
    let valid = true;
    let errors = {
      userEmail: false,
      userPassword: false,
      userForgotEmail: false,
      userForgotConfirmEmail: false,
    };

    if (!removeExtraSpaces(userForgotEmail)) {
      errors.userForgotEmail = true;
      valid = false;
      inputForgotEmailReference.current.focus();
      toast.error("Please enter your email address.");
    }
    // else if (!removeExtraSpaces(userForgotConfirmEmail)) {
    //   errors.userForgotConfirmEmail = true;
    //   valid = false;
    //   inputForgotConfirmEmailReference.current.focus();
    //   toast.error("Please confirm your email.");
    // } else if (
    //   removeExtraSpaces(userForgotConfirmEmail) !==
    //   removeExtraSpaces(userForgotEmail)
    // ) {
    //   errors.userForgotConfirmEmail = true;
    //   valid = false;
    //   inputForgotConfirmEmailReference.current.focus();
    //   toast.error("The email and confirm email are not the same.");
    // }

    setInputErrors(errors);
    return valid;
  };

  const handleSignInAccount = () => {
    if (validateInputs()) {
      setIsLoaderActive(true);

      axios
        .post(
          `${config.API_URL}AuthController/token`,
          {
            userName: userEmail,
            password: userPassword,
            clientId: "pmoAuthApp",
          },
          {
            headers: config.headers2,
          }
        )
        .then((response) => {
          setIsLoaderActive(false);
          if (response.status === 200 && response.data.success === "success") {
            const responseData = response.data.data;
            if (responseData.isChangePasswordRequired === "Yes") {
              toast.error(responseData.reasonForReset);
            } else {

              toast.success(response.data.message);
            }

            localStorage.setItem("user_id", responseData.userID);
            localStorage.setItem("isUserDataAuthenticated", true);

            dispatch(
              setUserPersonalInformation({
                userID: responseData.userID,
                userName: responseData.userName,
                userRole: responseData.userRole,
                displayName: responseData.displayName,
                emailAddress: responseData.emailAddress,
                menuItemNames: responseData.menuItemNames,
                token: responseData.token,
                profilePic: responseData.profilePic,
                firstName: responseData.firstName,
                lastName: responseData.lastName,
                clientId: "",
                department: responseData.accountGroup,
              })
            );

            let firstRoute;

            if (responseData.userRole === "Administrator") {
              firstRoute = "/hr-dashboard";
            } else if (responseData.userRole === "Asset User") {
              firstRoute = "/asset-dashboard";
            } else if (responseData.userRole === "View User") {
              firstRoute = "/hr-dashboard";
            } else {
              // Handle other cases or set a default route if necessary
              firstRoute = "/manage-profile"; // Example default route
            }
            setTimeout(() => navigate(firstRoute), 1000);
            clearFormFields();
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          setIsLoaderActive(false);
          toast.error("Oops! Something went wrong. Please try again later.");
        });
    }
  };

  const handleForgotPasswordSubmit = () => {
    if (validateForgotPasswordInputs()) {
      setIsLoaderActive(true);

      axios
        .post(
          `${config.API_URL}AuthMasterController/SendResetLinkToMail`,
          {
            emailAddress: userForgotEmail,
            siteURL: urlPath + "/am/ResetPassword",
          },
          {
            headers: config.headers2,
          }
        )
        .then((response) => {
          setIsLoaderActive(false);
          if (response.status === 200 && response.data.success === "success") {
            toast.success(response.data.message);
            clearFormFields();
            setTimeout(() => {
              handleSignIn();
              navigate("/login");
            }, 2000);
          } else {
            toast.error(response.data.message);
          }
        })
        .catch((error) => {
          setIsLoaderActive(false);
          const statusCode = error.response?.status;
          const errorMessages = {
            400: "Bad request",
            401: "You are not an authorized person",
            403: "Forbidden",
            404: "Not found",
            500: "Internal server error",
            502: "Bad gateway",
            503: "Service unavailable",
            504: "Gateway timeout",
          };
          toast.error(errorMessages[statusCode] || "An error occurred.");
        });
    }
  };
  const toggleNewPasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onEnterKeyPress = (event) => {
    if (event.keyCode === 13) {
      if (forgotPasswordClick) {
        handleForgotPasswordSubmit();
      } else {
        handleSignInAccount();
      }
    }
  };

  return (
    <div className="container login-container">
      <div className="row">
        <div className="col-md-6 login-left">
          <img
            alt="logo"
            height="300"
            src={require("../../assets/images/loginvec.png")}
            width="400"
          />

          <h2>Log In to Your Account</h2>
          <p>
            Manage company assets efficiently and stay organized with our powerful asset management system. Track laptops, accessories, and more—all in one place.
          </p>

        </div>
        <div className="col-md-6 login-right">
          <img
            alt="Company logo"
            height="50"
            src={require("../../assets/images/iteosLogo.png")}
            width="120"
            className="mb-2"
          />
          {forgotPasswordClick ? (
            <>
              <h2>Forgot Your Password?</h2>
              <p>
                Enter your email address below, and we'll send you a link to reset your password.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleForgotPasswordSubmit();
                }}
              >
                <div className="mb-3 mt-2">
                  <input
                    ref={inputForgotEmailReference}
                    // className="form-control"
                    className={`form-control  ${inputErrors.userForgotEmail ? "input-error" : ""
                      }`}
                    placeholder="Email ID"
                    type="email"
                    value={userForgotEmail}
                    // onChange={(e) => setUserForgotEmail(e.target.value)}
                    onChange={(e) => {
                      setUserForgotEmail(e.target.value);
                      setInputErrors((prevErrors) => ({
                        ...prevErrors,
                        userForgotEmail: false,
                      }));
                    }}
                    onKeyUp={onEnterKeyPress}
                  />
                </div>
                {/* <div className="mb-3">
                  <input
                    ref={inputForgotConfirmEmailReference}
                    // className="form-control"
                    className={`form-control ${
                      inputErrors.userForgotConfirmEmail ? "input-error" : ""
                    }`}
                    placeholder="Confirm Email ID"
                    type="email"
                    value={userForgotConfirmEmail}
                    // onChange={(e) => setUserForgotConfirmEmail(e.target.value)}
                    onChange={(e) => {
                      setUserForgotConfirmEmail(e.target.value);
                      setInputErrors((prevErrors) => ({
                        ...prevErrors,
                        userForgotConfirmEmail: false,
                      }));
                    }}
                    onKeyUp={onEnterKeyPress}
                  />
                </div> */}
                {/* {isLoaderActive ? (
                  <PleaseWaitButton className="btn-sm  font-weight-medium auth-form-btn" />
                ) : ( */}
                <a
                  className="forgot-password mb-1"
                  // href="/login"
                  onClick={handleSignIn}
                >
                  Back to Sign In
                </a>
                <button className="btn btn-primary w-100 mt-3" type="submit">
                  Request Link
                </button>
                {/* )} */}
              </form>

            </>
          ) : (
            <>
              <h2>Hello! Welcome Back</h2>
              <p>Login with your email id &amp; password</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSignInAccount();
                }}
              >
                <div className="mb-3">
                  <input
                    className="form-control"
                    placeholder="Email ID"
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    ref={inputUserEmailReference}
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    placeholder="Password"
                    type={passwordVisible ? "text" : "password"}
                    value={userPassword}
                    onChange={(e) => setUserPassword(e.target.value)}
                    ref={inputUserPasswordReference}
                  />
                  <i
                    className={`fa ${passwordVisible ? "fa-eye" : "fa-eye-slash"
                      }`}
                    onClick={toggleNewPasswordVisibility}
                    style={{
                      position: "absolute",
                      right: "70px",
                      top: "52%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#929292",
                    }}
                  ></i>
                </div>
                <Link
                  className="forgot-password"
                  href="#"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </Link>
                {isLoaderActive ? (
                  <PleaseWaitButton className="font-weight-medium w-100 mt-3 auth-form-btn" />
                ) : (
                  <button className="btn btn-primary w-100 mt-3" type="submit">
                    Login
                  </button>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;