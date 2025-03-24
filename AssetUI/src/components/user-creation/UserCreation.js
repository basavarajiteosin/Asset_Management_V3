import React, { useRef, useEffect, useState, useLayoutEffect } from "react";
import { useSelector } from "react-redux";
import { removeExtraSpaces } from "../../common/textOperations";
import { isValidContact, isValidEmail } from "../../common/validations";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import axios from "axios";
import Switch from "react-switch";
// import { useLoader } from '../../Customhook/LoaderContext';
import $ from "jquery";

const config = require("../../services/config.json");

const UserCreation = () => {
  const inputFirstNameReference = useRef(null);
  const inputLastNameReference = useRef(null);
  const inputDesignationReference = useRef(null);
  const inputDivisionReference = useRef(null);

  const inputEmployeeIdReference = useRef(null);
  const inputEmailReference = useRef(null);
  const inputRoleReference = useRef(null);
  const inputPasswordReference = useRef(null);
  const inputContactNumberReference = useRef(null);
  const personalInfo = useSelector((state) => state.personalInformationReducer);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [employeeId, setemployeeId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [roleId, setRoleId] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [designation, setdesignation] = useState("");
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [allRolesList, setAllRolesList] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  const [updateOrDeleteId, setUpdateOrDeleteId] = useState("");
  const [division, setDivision] = useState("");
  const inputIsActiveReference = useRef(null);
  const [isActive, setIsActive] = useState("");

  const [userName, setUserName] = useState("");
  const inputUserNameReference = useRef(null);

  const [accountGroup, setAccountGroup] = useState("");
  const inputAccountGroupReference = useRef(null);

  const [dateOfBirth, setDateOfBirth] = useState("");
  const dateOfBirthReference = useRef(null);

  const [joiningDate, setJoiningDate] = useState("");
  const inputJoiningDateReference = useRef(null);

  const addressReference = useRef(null);



  // const { showLoader, hideLoader } = useLoader();


  const [emailDomains, setEmailDomains] = useState([]);


  // const fetchEmailDomains = async () => {
  //   // window.initDestroyDataTableFuncation();
  //   try {
  //     const response = await axios.get(
  //       `${config.API_URL}FieldMaster/GetAllEmailDomains`,
  //       { headers: config.headers2 }
  //     );
  //     setEmailDomains(response.data.data);
  //     setTimeout(() => {
  //       window.initDataTableFuncation();
  //     }, 1000);
  //   } catch (error) {
  //     console.error("Error fetching email domains");
  //     console.error("Error fetching email domains:", error);
  //   }
  // };


  useEffect(() => {
    getAllRolesList();
    getUsersList();
    // fetchEmailDomains();
  }, []);

  // const isEmailDomainValid = (email) => {
  //   const emailDomain = email.split('@')[1];
  //   return emailDomains.some(domain => domain.domain === emailDomain);
  // };


  const firstUpdate = useRef(true);
  useLayoutEffect(() => {
    if (firstUpdate.current) {
      window.initDatePickerFuncation();
      return;
    }


  });

  const handleCancelClick = () => {
    clearAllFields();
    addProjectCardHeaderButtonClick();
  };

  const getUsersList = () => {
    window.initDestroyDataTableFuncation();
    axios
      .get(
        config.API_URL +
        "AuthMasterController/GetAllUsers?ClientId=" +
        config.clientId,
        {
          headers: config.headers2,
        }
      )
      .then((response) => {
        if (response.status == 200) {
          // console.log("response.data.data============>", response.data);
          if (response.data.success == "success") {
            if (response.data.data.length > 0) {
              setTimeout(() => {
                window.initDataTableFuncation();
              }, 30);
              const sortedUsers = response.data.data.sort((a, b) => {
                if (a.userName < b.userName) {
                  return -1;
                }
                if (a.userName > b.userName) {
                  return 1;
                }
                return 0;
              });
              setAllUsersList(sortedUsers);
            }
          } else {
            setTimeout(() => {
              window.initDataTableFuncation();
            }, 30);
            setAllUsersList([]);
            toast.error(response.data.message);

          }
        } else if (response.data.status.status == 500) {
          toast.error("Invalid username or password");
        }
      })
      .catch((error) => {
        toast.error("Please try again later.");
      });
  };

  const getAllRolesList = () => {
    axios
      .get(
        config.API_URL +
        "AuthMasterController/GetAllRoles?ClientId=" +
        config.clientId,
        {
          headers: config.headers2,
        }
      )
      .then((response) => {
        if (response.status === 200) {

          if (response.data.success === "success") {
            if (response.data.data.length > 0) {
              // Sort the roles alphabetically by role name
              const sortedRoles = response.data.data.sort((a, b) => {
                return a.roleName.localeCompare(b.roleName); // assuming the role name field is 'roleName'
              });
              setAllRolesList(sortedRoles);
            }
          } else {
            toast.error(response.data.message);
          }
        } else if (response.data.status.status === 500) {
          toast.error("Invalid username or password");
        }
      })
      .catch((error) => {
        toast.error("Oops, something went wrong. Please try again later.");
      });
  };

  const addProjectCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  };

  const listOfProjectsHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButton").click();
  };

  // const handleEditTaskDetails = (userObj) => {


  //   setemployeeId(userObj.employeeId);
  //   setUserEmail(userObj.email);
  //   setRoleId(userObj.roleID);
  //   setPassword(userObj.password);
  //   setContactNumber(userObj.contactNumber);
  //   setdesignation(userObj.designation);
  //   setDivision(userObj.division);
  //   setUpdateOrDeleteId(userObj.userID);

  //   setFirstName(userObj.firstName);
  //   setLastName(userObj.lastName);
  //   setAddress(userObj.address);
  //   setIsActive(userObj.isActive);

  //   listOfProjectsHeaderExpandButtionClick();
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  const handleEditTaskDetails = (userObj) => {
    console.log("userObj .....____>>>", userObj);
    setUserName(userObj.userName);
    setUserEmail(userObj.email);
    setRoleId(userObj.roleID);
    setPassword(userObj.password);
    setContactNumber(userObj.contactNumber);
    setAccountGroup(userObj.accountGroup);
    setUpdateOrDeleteId(userObj.userID);

    setFirstName(userObj.firstName);
    setLastName(userObj.lastName);
    setAddress(userObj.address);
    setDateOfBirth(userObj.dateOfBirth);
    setJoiningDate(userObj.joiningDate);
    setIsActive(userObj.isActive);
    listOfProjectsHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemoveUser = (userObj) => {
    setUpdateOrDeleteId(userObj.userID);
    window.confirmModalShow();
  };

  const yesConfirmSubmitRequest = () => {
    // setIsLoaderActive(true);
    let APIMethodName =
      "AuthMasterController/DeleteUser?ClientId=" +
      config.clientId +
      "&UserID=" +
      updateOrDeleteId;
    axios
      .post(config.API_URL + APIMethodName, {
        headers: config.headers2,
      })
      .then((response) => {

        if (response.data.success == "success") {
          toast.success("User deleted successfully...");
          window.confirmModalHide();
          clearAllFields();
          getUsersList();
          setIsLoaderActive(false);
        } else {
          setIsLoaderActive(false);
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        if (!error.response.data.success) {
          toast.error(error.response.data.message);
        } else {
          toast.error("oops something went wrong. please try again later.");
        }
        setIsLoaderActive(false);
      });
  };

  const clearAllFields = () => {
    setemployeeId("");
    setUserEmail("");
    setRoleId("");
    setPassword("");
    setContactNumber("");
    setdesignation("");
    setDivision("");
    setUpdateOrDeleteId("");
    setUserName("");
    setFirstName("");
    setLastName("");
    setAddress("");
    setIsActive("");
    setAccountGroup("");
    setDivisions("");
    setDateOfBirth("");
    setJoiningDate("");
  };

  const handleUserSubmit = (e) => {
    if (!roleId) {
      toast.error("Please select role.");
      inputRoleReference.current.focus();
      inputRoleReference.current.classList.add("is-invalid");
      return;
    }

    if (!removeExtraSpaces(firstName)) {
      toast.error("Please enter first name.");
      inputFirstNameReference.current.focus();
      inputFirstNameReference.current.classList.add("is-invalid");
      return;
    }

    if (!removeExtraSpaces(lastName)) {
      toast.error("Please enter last name.");
      inputLastNameReference.current.focus();
      inputLastNameReference.current.classList.add("is-invalid");
      return;
    }

    if (!removeExtraSpaces(userName)) {
      toast.error("Please enter user name.");
      inputUserNameReference.current.focus();
      inputUserNameReference.current.classList.add("is-invalid");
      return;
    }

    if (!removeExtraSpaces(userEmail)) {
      toast.error("Please enter email.");
      inputEmailReference.current.focus();
      inputEmailReference.current.classList.add("is-invalid");
      return;
    }

    if (!isValidEmail(userEmail)) {
      toast.error("Please enter valid email.");
      inputEmailReference.current.focus();
      inputEmailReference.current.classList.add("is-invalid");
      return;
    }

    if (!password) {
      toast.error("Please enter password.");
      inputPasswordReference.current.focus();
      inputPasswordReference.current.classList.add("is-invalid");
      return;
    }

    // New password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9])(?=.*[a-z]).{9,}$/;
    if (!passwordRegex.test(password)) {
      toast.error(
        "Password must contain at least one uppercase letter, one special character, one number, and be at least 9 characters long.",

      );
      inputPasswordReference.current.focus();
      inputPasswordReference.current.classList.add("is-invalid");
      return;
    }

    if (!contactNumber) {
      toast.error("Please enter contact number.");
      inputContactNumberReference.current.focus();
      inputContactNumberReference.current.classList.add("is-invalid");
      return;
    }

    // New contact number validation
    if (contactNumber.length !== 10 || !/^\d+$/.test(contactNumber)) {
      toast.error("Please enter a valid 10-digit contact number.");
      inputContactNumberReference.current.focus();
      inputContactNumberReference.current.classList.add("is-invalid");
      return;
    }

    if (!accountGroup) {
      toast.error("Please select department.");
      inputAccountGroupReference.current.focus();
      inputAccountGroupReference.current.classList.add("is-invalid");
      return;
    }
    // if (!dateOfBirth) {
    //   toast.error("Please enter Date of Birth.");
    //   dateOfBirthference.current.focus();
    //   dateOfBirthference.current.classList.add("is-invalid");
    //   return;
    // }
    // if (!joiningDate) {
    //   toast.error("Please select Joining Date.");
    //   inputJoiningDateReference.current.focus();
    //   inputJoiningDateReference.current.classList.add("is-invalid");
    //   return;
    // }

    if (!address) {
      toast.error("Please enter Address.");
      addressReference.current.focus();
      addressReference.current.classList.add("is-invalid");
      return;
    }


    // Proceed with API call
    setIsLoaderActive(true);
    let APIMethodName = updateOrDeleteId !== "" ? "AuthMasterController/UpdateUser" : "AuthMasterController/CreateUser";
    const getRoleName = allRolesList.find((x) => x.roleID === roleId);

    axios
      .post(
        config.API_URL + APIMethodName,
        {
          createdBy: personalInfo.userID,
          clientId: config.clientId,
          modifiedBy: personalInfo.userID,
          userID: updateOrDeleteId,
          roleID: roleId,
          userName: userName,
          email: userEmail,
          password: password,
          contactNumber: contactNumber,
          accountGroup: accountGroup,
          firstName: firstName,
          lastName: lastName,
          address: address,
          // dateOfBirth: $("#inputDateOfBirthV").val(),
          // isActive: isActiveUser,
          // joiningDate: $("#joiningDateV").val(),
          dateOfBirth: dateOfBirth, // Use state directly
          isActive: updateOrDeleteId ? isActive : true,
          joiningDate: joiningDate,
          roleName: getRoleName.roleName,
        },
        {
          headers: config.headers2,
        }
      )
      .then((response) => {
        if (response.data.success === "success") {
          toast.success(`User ${updateOrDeleteId !== "" ? "Updated" : "Created"} Successfully...`);
          clearAllFields();
          addProjectCardHeaderButtonClick();
          getUsersList();
        } else {
          toast.error(response.data.message);
        }
        setIsLoaderActive(false);
      })
      .catch((error) => {
        if (!error.response.data.success) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Oops, something went wrong. Please try again later.");
        }
        setIsLoaderActive(false);
      })
      .finally(() => {
        setIsLoaderActive(false);
      });
  };

  const handleToggleUserStatus = async (userObj) => {
    setIsLoaderActive(true);
    try {
      // Construct the URL without query parameters
      const url = `${config.API_URL}AuthMasterController/UpdateUser`;

      // Prepare the data object
      const data = {
        userID: userObj.userID,
        roleID: userObj.roleID,
        userName: userObj.userName,
        email: userObj.email,
        password: userObj.password,
        contactNumber: userObj.contactNumber,
        // designation: userObj.designation,
        // division: userObj.division,
        accountGroup: userObj.accountGroup,
        firstName: userObj.firstName,
        lastName: userObj.lastName,
        address: userObj.address,
        dateOfBirth: userObj.dateOfBirth,
        joiningDate: userObj.joiningDate,
        roleName: userObj.roleName,
        createdBy: personalInfo.userID,
        clientId: config.clientId,
        modifiedBy: personalInfo.userID,
        isActive: !userObj.isActive,
      };

      // Send the POST request
      const response = await axios.post(url, data, {
        headers: config.headers2,
      });

      if (response.data.success) {
        toast.success("User status updated successfully!");
        getUsersList();
      } else {
        toast.error("Failed to update user status");
      }
    } catch (error) {
      toast.error("An error occurred while updating user status");
    } finally {
      setIsLoaderActive(false);
    }
  };

  // division dropdown

  const [divisions, setDivisions] = useState([]);
  // useEffect(() => {
  //   // Fetch the division data from the API
  //   axios
  //     .get(config.API_URL + "FieldMaster/GetAllDivisionMasters", {
  //       headers: config.headers2,
  //     })
  //     .then((response) => {
  //       if (response.data.success) {
  //         // Sort divisions alphabetically by description before setting state
  //         const sortedDivisions = response.data.data.sort((a, b) =>
  //           a.description.localeCompare(b.description)
  //         );
  //         setDivisions(sortedDivisions);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("There was an error fetching the divisions!", error);
  //     });
  // }, []);
  return (
    <>
      <section className="content">

        <div className="card  ">
          <div className="card-header">
            <h3 className="card-title text-sm">Create New User</h3>
          </div>
          <div className="card-body text-sm">
            <div className="row">
              <div className="form-group col-md-4">
                <label>
                  Select Role<sup style={{ color: "red" }}>*</sup>
                </label>
                <select
                  className="form-control form-control-sm"
                  ref={inputRoleReference}
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                >
                  <option value="">--Select--</option>
                  {allRolesList.map((role) => {
                    return (
                      <option
                        key={"Mana_" + role.roleID}
                        value={role.roleID}
                      >
                        {role.roleName}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group col-md-4">
                <label for="firstNameInput">
                  First Name<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="firstNameInput"
                  ref={inputFirstNameReference}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder=" First Name"
                />
              </div>
              <div className="form-group col-md-4">
                <label for="lastNameInput">
                  Last Name<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="lastNameInput"
                  ref={inputLastNameReference}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder=" Last Name"
                />
              </div>
              <div className="form-group col-md-4">
                <label for="userNameInput">
                  User Name<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="userNameInput"
                  ref={inputUserNameReference}
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="User Name"
                />
              </div>
              <div className="form-group  col-md-4">
                <label for="userEmailInput">
                  Email<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="userEmailInput"
                  ref={inputEmailReference}
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder=" Email"
                />
              </div>
              <div className="form-group col-md-4">
                <label for="passwordInput">
                  Password<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  type="password"
                  className="form-control form-control-sm"
                  id="passwordInput"
                  ref={inputPasswordReference}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
                <span
                  toggle="#passwordInput"
                  class="fa fa-fw fa-eye field-icon-password toggle-password"
                ></span>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="contactNumberInput">
                  Contact Number<sup style={{ color: "red" }}>*</sup>
                </label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="contactNumberInput"
                  ref={inputContactNumberReference}
                  value={contactNumber}
                  onChange={(e) => {
                    // Get the numeric value and keep the first character as '+'
                    const inputValue = e.target.value;
                    const numericValue = inputValue.replace(
                      /[^+\d]/g,
                      ""
                    );

                    // Limit the length to 20 characters
                    const limitedValue = numericValue.slice(0, 20);

                    // Update state with the limited value
                    setContactNumber(limitedValue);
                  }}
                  placeholder="Contact Number"
                  pattern="\d*"
                  inputMode="numeric"
                  maxLength={20} // This limits the number of characters the user can enter
                />
              </div>

              <div className="form-group col-md-4">
                <label>
                  Select Department<sup style={{ color: "red" }}>*</sup>
                </label>
                <select
                  className="form-control form-control-sm"
                  ref={inputAccountGroupReference}
                  value={accountGroup}
                  onChange={(e) => setAccountGroup(e.target.value)}
                >
                  <option value="">--Select--</option>

                  <option value="Sales and Marketing">
                    Sales and Marketing
                  </option>

                  <option value="MS">MS</option>
                  <option value="UI/UX">UI/UX</option>
                  <option value="SAP">SAP</option>
                  <option value="HR">HR</option>

                </select>
              </div>
              <div className="form-group col-md-4">
                <label>Date Of Birth<sup style={{ color: "red" }}>*</sup></label>
                <div
                  className="input-group"
                  id="inputDateOfBirth"
                  data-target-input="nearest"
                >
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    id="inputDateOfBirthV"
                    ref={dateOfBirthReference}
                    value={dateOfBirth}
                    required
                    // onSelect={(e) => {
                    //   setDateOfBirth(e.target.value);
                    // }}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    placeholder="Date Of Birth"
                  // data-target="#inputDateOfBirth"
                  />
                  {/* <div
                      className="input-group-append"
                      custDatePicker
                      data-target="#inputDateOfBirthV"
                      data-toggle="datetimepicker"
                    >
                      <div className="input-group-text">
                        <i className="fa fa-calendar"></i>
                      </div>
                    </div> */}
                </div>
              </div>
              <div className="form-group col-md-6">
                <label>Joining Date<sup style={{ color: "red" }}>*</sup></label>
                <div
                  className="input-group"
                  id="joiningDate"
                  data-target-input="nearest"
                >
                  <input
                    type="date"
                    className="form-control form-control-sm"
                    id="joiningDateV"
                    ref={inputJoiningDateReference}
                    value={joiningDate}
                    required
                    // onSelect={(e) => {
                    //   setJoiningDate(e.target.value);
                    // }}
                    onChange={(e) => setJoiningDate(e.target.value)}
                    placeholder="Project Joining Date"
                  // data-target="#joiningDate"
                  />
                  {/* <div
                      className="input-group-append"
                      custDatePicker
                      data-target="#joiningDateV"
                      data-toggle="datetimepicker"
                    >
                      <div className="input-group-text">
                        <i className="fa fa-calendar"></i>
                      </div>
                    </div> */}
                </div>
              </div>


              <div className="form-group col-md-6">
                <label htmlFor="isActiveInput">
                  isActive
                </label>
                <select
                  className="form-control form-control-sm"
                  id="isActiveInput"
                  ref={inputIsActiveReference}
                  value={isActive}
                  onChange={(e) => setIsActive(e.target.value)}
                  placeholder="Select Status"
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="form-group  col-md-12">
                <label htmlFor="addressInput">Address<sup style={{ color: "red" }}>*</sup></label>
                <textarea
                  className="form-control form-control-sm"
                  style={{ resize: "none", minHeight: "90px" }}
                  id="addressInput"
                  ref={addressReference}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter Address"
                ></textarea>
                {/* <input type="text" className="form-control form-control-sm" id="addressInput" ref={addressReference} value={address} onChange={(e) => setContactNumber(e.target.value)} placeholder="Enter Address" /> */}
              </div>

            </div>
            <div className="card-footer mt-2">
              {isLoaderActive ? (
                <PleaseWaitButton className="float-right btn-xs mr-2 font-weight-medium auth-form-btn" />
              ) : (
                <button
                  type="submit"
                  className="custom-success-button mr-2"
                  onClick={(e) => {
                    handleUserSubmit(e);
                  }}
                >
                  {updateOrDeleteId ? 'Update & Submit' : 'Save & Submit'}
                </button>

              )}
              <button
                type="submit"
                className="custom-secondary-button"
                onClick={(e) => {
                  handleCancelClick(e);
                }}
              >
                Cancel
              </button>
            </div>
          </div>

        </div>


        <div className="card ">
          <div className="card-header">
            <h3 className="card-title text-sm">
              Users List ( {allUsersList.length} )
            </h3>
          </div>
          <div className="card-body table-container">
            <table id="example1" className="improved-table">
              <thead>
                <tr>
                  <th


                  >
                    Sr. No.
                  </th>
                  <th >
                    User Name
                  </th>
                  <th >
                    First Name
                  </th>
                  <th >
                    Last Name
                  </th>
                  <th >
                    Role
                  </th>
                  <th >
                    Email
                  </th>
                  <th >
                    Contact Number
                  </th>
                  <th >
                    Department Name
                  </th>
                  <th >
                    Date Of Birth
                  </th>
                  <th >
                    Date Of Joining
                  </th>


                  <th className="sticky-status">Status</th>
                  <th className="sticky-action">Action</th>
                </tr>
              </thead>
              <tbody>
                {allUsersList.length > 0
                  ? allUsersList.map((userObj, index) => {
                    return (
                      <tr>
                        <td

                        >
                          {index + 1}
                        </td>
                        <td

                        >
                          {userObj.userName}
                        </td>
                        <td

                        >
                          {userObj.firstName}
                        </td>
                        <td

                        >
                          {userObj.lastName}
                        </td>
                        <td

                        >
                          {userObj.roleName}
                        </td>
                        <td

                        >
                          {userObj.email}
                        </td>
                        <td

                        >
                          {userObj.contactNumber}
                        </td>

                        <td

                        >
                          {userObj.accountGroup}
                        </td>
                        <td

                        >
                          {userObj.dateOfBirth}
                        </td>
                        <td

                        >
                          {userObj.joiningDate}
                        </td>


                        {/* <td className="sticky-status">

                                <div
                                  className={`d-flex align-items-center ${userObj.roleName === "Administrator"
                                      ? "disabled"
                                      : ""
                                    }`}
                                  style={{
                                    opacity:
                                      userObj.roleName === "Administrator"
                                        ? 0.5
                                        : 1,
                                    pointerEvents:
                                      userObj.roleName === "Administrator"
                                        ? "none"
                                        : "auto",
                                  }}
                                >
                                  <label
                                    style={{
                                      fontWeight: "400",
                                      fontSize: "smaller",
                                      color: userObj.isActive
                                        ? "white"
                                        : "white",
                                      backgroundColor: userObj.isActive
                                        ? "green"
                                        : "red",
                                      padding: "2px 6px",
                                      borderRadius: "5px",
                                    }}
                                    className="mr-3"
                                  >
                                    {userObj.isActive ? "Active" : "Inactive"}
                                  </label>
                                  <Switch
                                    checked={userObj.isActive}
                                    width={30}
                                    height={15}
                                    className=""
                                    onChange={() =>
                                      handleToggleUserStatus(
                                        userObj,
                                        "isActive"
                                      )
                                    }
                                  />
                                </div>
                              </td> */}
                        <td className="sticky-status">
                          <div
                            className={`d-flex align-items-center ${userObj.roleName === "Administrator" ? "disabled" : ""}`}
                            style={{
                              opacity: userObj.roleName === "Administrator" ? 0.5 : 1,
                              pointerEvents: userObj.roleName === "Administrator" ? "none" : "auto",
                            }}
                          >
                            {/* Displaying the status dot */}
                            <div
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                backgroundColor: userObj.isActive ? "green" : "orange", // Green for Active, Orange for Inactive
                                marginRight: "8px",
                              }}
                            />
                            {/* Optional label for text display if you want it */}

                            {/* Switch for toggling status */}
                            <Switch
                              checked={userObj.isActive}
                              width={30}
                              height={15}
                              onChange={() => handleToggleUserStatus(userObj, "isActive")}
                            />
                          </div>
                        </td>


                        <td className="sticky-action">
                          <button
                            type="button"
                            className="custom-success-button mr-2"
                            onClick={(e) => {
                              handleEditTaskDetails(userObj);
                            }}

                          >
                            <i
                              className="fas fa-pen"

                            ></i>
                          </button>
                          {userObj.roleName !== "Administrator" ? (
                            <>

                              <button
                                type="button"
                                className="custom-primary-button"
                                onClick={() =>
                                  handleRemoveUser(userObj)
                                }

                              >
                                <i
                                  className="fas fa-trash"

                                ></i>
                              </button>
                            </>
                          ) : (
                            <>

                              <button
                                type="button"
                                className="custom-primary-button"
                                style={{ backgroundColor: 'gray' }}
                                disabled
                                onClick={() =>
                                  handleRemoveUser(userObj)
                                }

                              >
                                <i
                                  className="fas fa-trash"

                                ></i>
                              </button>
                            </>
                          )}


                        </td>
                      </tr>
                    );
                  })
                  : ""}
              </tbody>
            </table>
          </div>
        </div>



      </section>

      <div
        id="confirmCommonModal"
        class="modal fade confirmCommonModal"
        data-backdrop="static"
        tabindex="-1"
        role="dialog"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog modal-confirm">
          <div class="modal-content">
            <div class="modal-header">
              <div class="icon-box">
                <i class="fas fa-info"></i>
              </div>
              <h5 class="modal-title w-100">Are you sure ?</h5>
            </div>
            <div class="modal-body">
              <p class="text-center">
                By clicking 'Yes', you will delete the user's access to this portal. Once deleted, you can reassign access to the user using the 'Edit' option.
              </p>
            </div>
            <div class="modal-footer col-md-12">
              <button class="btn btn-default btn-sm" data-dismiss="modal">
                Cancel
              </button>
              {isLoaderActive ? (
                <PleaseWaitButton className="btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn" />
              ) : (
                <button
                  class="btn btn-warning btn-sm pl-3 pr-3 ml-2"
                  onClick={(e) => {
                    yesConfirmSubmitRequest(e);
                  }}
                >
                  Yes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCreation;
