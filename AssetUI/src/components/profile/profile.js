import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { removeExtraSpaces } from "../../common/textOperations";
import { toast } from "react-toastify";
import { getFirstTwoLetters } from "../../common/textOperations";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import { changePersonalInfo } from "../../reduxStorage/personalInformation";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import $ from "jquery";

const config = require("../../services/config.json");

const Profile = () => {
  const inputCurrentPasswordReference = useRef(null);
  const inputNewPasswordReference = useRef(null);
  const inputConfirmPasswordReference = useRef(null);

  const personalInfo = useSelector((state) => state.personalInformationReducer);
  const managerIdd = personalInfo.userID;
  // console.log("Personal Info", personalInfo);
  console.log("Personal Info profile picture", personalInfo.profilePic);

  const [lastName, setLastName] = useState("");
  const [contactNumber, setMobileNumber] = useState("");
  const [department, setDepartment] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [email, setEmail] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [plant, setPlant] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileDetails, setProfileDetails] = useState([]);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [currentFirstName, setCurrentFirstName] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    getProfileDetails();
    window.initDatePickerFuncation();
  }, []);

  const resetChangePassword = () => {
    setConfirmPassword("");
    setCurrentPassword("");
    setNewPassword("");
  };

  const resetProfileUpdate = () => {
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setMobileNumber("");
    setAddress("");
  };

  const getProfileDetails = () => {
    axios
      .get(
        `${config.API_URL}AuthMasterController/GetEmpInfoByEmpId?id=${personalInfo.userID}`,
        {
          headers: config.headers2,
        }
      )
      .then((response) => {
        if (response.status === 200) {
          if (response.data.success) {
            if (response.data.data) {
              const formattedProfileDetails = {
                ...response.data.data,
                dateOfBirth: response.data.data.dateOfBirth,
                joiningDate: response.data.data.joiningDate,
              };

              setProfileDetails(formattedProfileDetails);
              console.log("Profile Details Updated:", formattedProfileDetails); // Debugging
            } else {
              setProfileDetails([]);
            }

            setTimeout(() => {
              window.initDataTableFuncation();
            }, 3000);
          } else {
            toast.error(response.data.message, config.tostar_config);
          }
        } else if (response.data.status?.status === 500) {
          toast.error("Invalid username or password", config.tostar_config);
        }
      })
      .catch((error) => {
        console.error("Error fetching profile details:", error);
        toast.error("Please try again later.", config.tostar_config);
      });
  };

  useEffect(() => {
    console.log("Updated profileDetails:", profileDetails);
  }, [profileDetails]);


  const handleChangePassSubmit = (e) => {
    if (removeExtraSpaces(currentPassword)) {
      if (removeExtraSpaces(newPassword)) {
        if (removeExtraSpaces(confirmPassword)) {
          if (
            removeExtraSpaces(newPassword) == removeExtraSpaces(confirmPassword)
          ) {
            var formData = new FormData();
            formData.append("UserID", personalInfo.userID);
            formData.append("CurrentPassword", currentPassword);
            formData.append("NewPassword", newPassword);
            formData.append("UserName", personalInfo.userName);
            axios
              .post(
                config.API_URL + "AuthMasterController/ChangePassword",
                formData,
                {
                  headers: config.headers3,
                }
              )
              .then((response) => {
                if (response.data.success == "success") {
                  toast.success(response.data.message, config.tostar_config);
                  resetChangePassword();
                  setIsLoaderActive(false);
                } else {
                  resetChangePassword();
                  toast.error(response.data.message, config.tostar_config);
                }
              })
              .catch((error) => {
                if (!error.response.data.success) {
                  toast.error(
                    error.response.data.message,
                    config.tostar_config
                  );
                } else {
                  toast.error("Please try again later.", config.tostar_config);
                }
              });
          } else {
            toast.error(
              "Please check entered new password and confirm new passowrd shouled be the same.",
              config.tostar_config
            );
            inputConfirmPasswordReference.current.focus();
            //inputConfirmPasswordReference.current.classNameList.add("is-invalid");
          }
        } else {
          toast.error("Please enter confirm password.", config.tostar_config);
          inputConfirmPasswordReference.current.focus();
          //inputConfirmPasswordReference.current.classNameList.add("is-invalid");
        }
      } else {
        toast.error("Please enter new password.", config.tostar_config);
        inputNewPasswordReference.current.focus();
        //inputNewPasswordReference.current.classNameList.add("is-invalid");
      }
    } else {
      toast.error("Please enter current password.", config.tostar_config);
      inputCurrentPasswordReference.current.focus();
      //  inputCurrentPasswordReference.current.classNameList.add("is-invalid");
    }
  };

  const handleEditProfileDetails = (e) => {
    e.preventDefault();
    let getDob = $("#projectStartDateV").val();
    let getDatebirth = $("#projectStartDateV").val();
    setDateOfBirth(getDob);
    let getFirstName = $("#FirstName").val();
    let getLastName = $("#LastName").val();
    let getMobileNumber = $("#contactNumber").val();
    let getAddress = $("#address").val();

    const updatedProfileData = {
      firstName,
      lastName,
      contactNumber,
      address,
      dateOfBirth,
    };

    var formData = new FormData();
    formData.append("empId", personalInfo.userID);
    if (getFirstName === "") {
      formData.append("firstName", profileDetails.firstName);
    } else {
      formData.append("firstName", getFirstName);
    }
    if (getLastName == "") {
      formData.append("lastName", profileDetails.lastName);
    } else {
      formData.append("lastName", lastName);
    }
    if (getAddress == "") {
      formData.append("address", profileDetails.address);
    } else {
      formData.append("address", address);
    }
    if (getMobileNumber == "") {
      formData.append("contactNumber", profileDetails.contactNumber);
    } else {
      formData.append("contactNumber", contactNumber);
    }
    if (getDatebirth == "") {
      formData.append("dateOfBirth", profileDetails.dateOfBirth);
      // console.log("DOb ----if", profileDetails.dateOfBirth);
    } else {
      formData.append("dateOfBirth", getDob);
      // console.log("DOb ---elseee", getDob);
    }
    axios
      .put(
        config.API_URL + "AuthMasterController/UpdateFromEmployeeEmpInfo",
        formData,
        {
          headers: config.headers2,
        }
      )
      .then((response) => {
        if (response.data.success == true) {
          toast.success(response.data.message, config.tostar_config);
          resetProfileUpdate();
          getProfileDetails();
          setIsLoaderActive(false);
        } else {
          resetProfileUpdate();
          toast.error(response.data.message, config.tostar_config);
        }
      })
      .catch((error) => {
        if (!error.response.data.success) {
          toast.error(error.response.data.message, config.tostar_config);
        } else {
          toast.error("Please try again later.", config.tostar_config);
        }
      });
  };

  const loadFile = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size > 8 * 1000 * 1024) {
        toast.error(
          "File with maximum size of 8MB is allowed",
          config.tostar_config
        );
        return false;
      }
      var fileName = event.target.files[0].name;
      var fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1);
      if (!config._validImageFileExtensions.includes(fileNameExt)) {
        toast.error(
          "Please upload files having extensions: " +
          config._validImageFileExtensions.join(", ") +
          " only.",
          config.tostar_config
        );
        $(event).val("");
        return false;
      }
      var image = document.getElementById("output");
      image.src = URL.createObjectURL(event.target.files[0]);
      var formData = new FormData();
      formData.append("UserID", personalInfo.userID);
      formData.append("CreatedBy", personalInfo.userID);
      formData.append("ProfilePic", event.target.files[0]);

      axios
        .post(
          config.API_URL + "AuthMasterController/ProfileUpdateUser",
          formData,
          {
            headers: config.headers3,
          }
        )
        .then((response) => {
          // console.log("response Profile Pic Changes", response);
          if (response.data.success == "success") {
            toast.success(response.data.message, config.tostar_config);
            dispatch(
              changePersonalInfo({
                profilePic: response.data.data,
              })
            );
          } else {
            setIsLoaderActive(false);
            toast.error(response.data.message, config.tostar_config);
          }
        })
        .catch((error) => {
          toast.error(
            "oops something went wrong. please try again later.",
            config.tostar_config
          );
          setIsLoaderActive(false);
        });
    }
  };

  return (
    <>
      {/* <div className="content-header"> */}
      {/* <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">Profile</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="#">Home</Link>
                </li>
                <li className="breadcrumb-item active">Profile</li>
              </ol>
            </div>
          </div>
        </div> */}
      {/* </div> */}
      <section className="content">

        <div className="row">
          <div className="col-md-3">
            <div className="card card-danger card-outline">
              {/* {Profile} */}
              <div className="card-body box-profile">
                <div className="text-center">
                  {/* <img
                      className="profile-user-img img-fluid img-circle"
                      src="./dist/img/avatar5.png"
                      alt="User profile picture"
                    /> */}
                  <div class="profile-pic">
                    <label class="-label" htmlFor="file">
                      <span class="glyphicon glyphicon-camera"></span>
                      <span>Change Image</span>
                    </label>
                    <input
                      id="file"
                      type="file"
                      onChange={(e) => loadFile(e)}
                    />
                    <img
                      src={
                        personalInfo.profilePic == null
                          ? require("../../assets/images/user2-160x160.jpg")
                          : personalInfo.profilePic
                      }
                      id="output"
                      width="200"
                    />
                  </div>
                </div>

                <h3 className="profile-username text-center">
                  {" "}
                  {profileDetails.firstName} {profileDetails.lastName}
                </h3>

                <p className="text-muted text-center">
                  [ {profileDetails.department} - Department ]
                </p>
              </div>
            </div>
            <div className="card card-danger">
              <div className="card-header">
                <h3 className="card-title">ITEOS LLP</h3>
              </div>

              <div className="card-body">

                <p >
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  <span className="text-muted">E210, HustleHub Tech Park, 1, 27th Main Rd, ITI Layout,
                    Sector-I, HSR Layout, Bengaluru, Karnataka 560102</span>

                </p>
                <p >
                  <i className="fas fa-map-marker-alt mr-1"></i>
                  <span className="text-muted"> Anchor co-working space, Insignia 32, Pan Card Club Rd, near westport, Baner, Pune, Maharashtra 411045</span>

                </p>
                <hr />

                <strong>
                  <i className="fa fa-globe mr-2"></i>
                  <span className="text-muted">
                    <a href="https://www.iteos.in/">https://www.iteos.in/</a>
                  </span>
                </strong>
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <div className="card">
              <div className="card-header">

                <ul className="nav nav-pills m-2">
                  <li className="custom-nav-item">
                    <a
                      className="custom-nav-link active btn-sm"
                      href="#activity"
                      data-toggle="tab"
                    >
                      Overview
                    </a>
                  </li>
                  <li className="custom-nav-item">
                    <a
                      className="custom-nav-link btn-sm"
                      href="#timeline"
                      data-toggle="tab"
                    >
                      Change Password
                    </a>
                  </li>
                  <li className="custom-nav-item ">
                    <a
                      className="custom-nav-link btn-sm"
                      href="#settings"
                      data-toggle="tab"
                    >
                      Profile Update
                    </a>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                <div className="tab-content">
                  <div className="active tab-pane" id="activity">
                    {/* Overview */}
                    <div className="tab-pane" id="activity">
                      <div className="from-group row">
                        <div className="col-sm-6">
                          <h5 className="m-20">Profile Details</h5>
                        </div>
                      </div>
                      <form className="form-horizontal mt-3">
                        <div className="row mb-2">
                          <label className="col-md-2 text-md-end">
                            First Name :
                          </label>
                          <div className="col-md-10">
                            <p className="text-muted">
                              {profileDetails.firstName}
                            </p>
                          </div>
                        </div>

                        <div className="row mb-2">
                          <label className="col-md-2 text-md-end">
                            Last Name :
                          </label>
                          <div className="col-md-10">
                            <p className="text-muted">
                              {profileDetails.lastName}
                            </p>
                          </div>
                        </div>

                        <div className="row mb-2">
                          <label className="col-md-2 text-md-end">
                            Mobile No. :
                          </label>
                          <div className="col-md-10">
                            <p className="text-muted">
                              {profileDetails.contactNumber}
                            </p>
                          </div>
                        </div>

                        <div className="row mb-2">
                          <label className="col-md-2 text-md-end">
                            Department :
                          </label>
                          <div className="col-md-10">
                            <p className="text-muted">
                              {profileDetails.department}
                            </p>
                          </div>
                        </div>

                        <div className="row mb-2">
                          <label className="col-md-2 text-md-end">
                            Address :
                          </label>
                          <div className="col-md-10">
                            <p className="text-muted">
                              {profileDetails.address}
                            </p>
                          </div>
                        </div>

                        <div className="row mb-2">
                          <label className="col-md-2 text-md-end">
                            Date of Birth :
                          </label>
                          <div className="col-md-10">
                            <p className="text-muted">
                              {profileDetails.dateOfBirth}
                            </p>
                          </div>
                        </div>

                        <div className="row mb-2">
                          <label className="col-md-2 text-md-end">
                            Email :
                          </label>
                          <div className="col-md-10">
                            <p className="text-muted">
                              {personalInfo.emailAddress}
                            </p>
                          </div>
                        </div>

                        <div className="row mb-2">
                          <label className="col-md-2 text-md-end">
                            Joining Date :
                          </label>
                          <div className="col-md-10">
                            <p className="text-muted">
                              {profileDetails.joiningDate}
                            </p>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  {/* {Change Password} */}
                  <div className="tab-pane" id="timeline">
                    {/* Your Timeline content here */}
                    <form className="form-horizontal">
                      <div className="form-group row">
                        <label
                          htmlFor="currentPassword"
                          className="col-sm-2 col-form-label"
                        >
                          Current Password
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="password"
                            className="form-control form-control-sm"
                            id="currentPassword"
                            placeholder="Enter Current Password"
                            ref={inputCurrentPasswordReference}
                            value={currentPassword}
                            onChange={(e) =>
                              setCurrentPassword(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          htmlFor="newPassword"
                          className="col-sm-2 col-form-label"
                        >
                          New Password
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="password"
                            className="form-control form-control-sm"
                            id="newPassword"
                            placeholder="Enter New Password"
                            ref={inputNewPasswordReference}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          htmlFor="confirmPassword"
                          className="col-sm-2 col-form-label"
                        >
                          Confirm Password
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="password"
                            className="form-control form-control-sm"
                            id="confirmPassword"
                            placeholder="Enter Confirm Password"
                            ref={inputConfirmPasswordReference}
                            value={confirmPassword}
                            onChange={(e) =>
                              setConfirmPassword(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div className="">
                        <div className="d-flex justify-content-end">
                          <button
                            type="button"
                            className="custom-success-button"
                            onClick={(e) => {
                              handleChangePassSubmit(e);
                            }}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                  {/* Profile Update  */}
                  <div className="tab-pane" id="settings">
                    {/* Your Settings content here */}
                    <form className="form-horizontal">
                      {/* {First name} */}
                      <div className="form-group row">
                        <label
                          htmlFor="FirstName"
                          className="col-sm-2 col-form-label"
                        >
                          First Name
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="FirstName"
                            placeholder={profileDetails.firstName}
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                      </div>
                      {/* {Last Name} */}
                      <div className="form-group row">
                        <label
                          htmlFor="LastName"
                          className="col-sm-2 col-form-label"
                        >
                          Last Name
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="LastName"
                            placeholder={profileDetails.lastName}
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      {/* {Mobile Number} */}
                      <div className="form-group row">
                        <label
                          htmlFor="contactNumber"
                          className="col-sm-2 col-form-label"
                        >
                          Mobile Number
                        </label>
                        <div className="col-sm-10">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="contactNumber"
                            placeholder={profileDetails.contactNumber}
                            value={contactNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          htmlFor="address"
                          className="col-sm-2 col-form-label"
                        >
                          Address
                        </label>
                        <div className="col-sm-10">
                          <input
                            className="form-control form-control-sm"
                            id="address"
                            placeholder={profileDetails.address}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                          ></input>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label
                          htmlFor="dob"
                          className="col-sm-2 col-form-label"
                        >
                          Date Of Birth
                        </label>
                        <div className="col-sm-10">
                          <div
                            className="input-group"
                            id="projectStartDate"
                            data-target-input="nearest"
                          >
                            <input
                              type="text"
                              className="form-control custDatePicker form-control-sm"
                              id="projectStartDateV"
                              value={dateOfBirth}
                              onSelect={(e) => setDateOfBirth(e.target.value)}
                              placeholder={profileDetails.dateOfBirth}
                              data-target="#projectStartDate"
                            />
                            <div
                              className="input-group-append"
                              data-target="#projectStartDate"
                              data-toggle="datetimepicker"
                            >
                              <div className="input-group-text">
                                <i className="fa fa-calendar"></i>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="d-flex justify-content-end">
                          <button
                            type="submit"
                            className=" custom-success-button"
                            // onClick={(e) => {
                            //   handleEditProfileDetails();
                            // }}
                            onClick={handleEditProfileDetails}
                          >
                            Update
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
};

export default Profile;
