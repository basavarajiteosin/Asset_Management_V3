import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import axios from "axios";
import $ from "jquery";

const config = require("../../services/config.json");

function NewsAnnouncements() {
  const inputNewsAnnouncementReference = useRef(null);
  const inputDescriptionReference = useRef(null);
  const inputDateReference = useRef(null);

  const [newsNotifications, setNewsNotifications] = useState([]);
  const [newNewsNotifications, setNewNewsNotifications] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [cdate, setDate] = useState("");
  const [selectedNewsNotifications, setSelectedNewsNotifications] =
    useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [error, setError] = useState("");
  const [newsNotificationToDelete, setNewsNotificationToDelete] =
    useState(null);

  useEffect(() => {
    getNewsNotifications();
    window.initDateTimePickerFuncation();
    window.initDataTableFuncation();
  }, []);

  const getNewsNotifications = async () => {
    try {
      window.initDestroyDataTableFuncation();
      setIsLoaderActive(true);
      const response = await axios.get(
        config.API_URL + "EmailCofigureController/GetAllNewsAndNotifications"
      );
      // console.log("d", response);
      if (response.data.data.length > 0) {
        // console.log("data", response.data.data);
        setNewsNotifications(response.data.data);
      }
      setTimeout(() => {
        window.initDataTableFuncation();
      }, 1000);
    } catch (error) {
      console.error("Error fetching Data:", error);
      toast.error("Failed to fetch Data.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let getStartDate = $("#projectStartDateV").val();

    if (newNewsNotifications.trim() === "") {
      toast.error("Please enter Title.", config.tostar_config);
      inputNewsAnnouncementReference.current.focus();
      inputNewsAnnouncementReference.current.classList.add("is-invalid");
      return;
    }

    if (getStartDate.trim() === "") {
      toast.error("Please select date.", config.tostar_config);
      inputDateReference.current.focus();
      inputDateReference.current.classList.add("is-invalid");
      return;
    }

    if (newDescription.trim() === "") {
      toast.error("Please enter Description.", config.tostar_config);
      inputDescriptionReference.current.focus();
      inputDescriptionReference.current.classList.add("is-invalid");
      return;
    }

    const isDuplicate = newsNotifications.some(
      (news) =>
        news.nTital &&
        news.nTital.toLowerCase().trim() ===
          newNewsNotifications.toLowerCase().trim()
    );

    if (isDuplicate) {
      setError("Data already exists.");
      setTimeout(() => {
        setError("");
      }, 3000);

      toast.error("Data already exists.", config.tostar_config);
      return;
    }

    const dateParts = getStartDate.split(/[\s/:]+/);
    const day = dateParts[0];
    const month = dateParts[1];
    const year = dateParts[2];
    const hour = dateParts[3];
    const minute = dateParts[4];
    const period = dateParts[5];

    let hours24Format = parseInt(hour, 10);
    if (period.toLowerCase() === "pm" && hours24Format !== 12) {
      hours24Format += 12;
    } else if (period.toLowerCase() === "am" && hours24Format === 12) {
      hours24Format = 0;
    }

    const date = new Date(year, month - 1, day, hours24Format, minute);
    date.setMinutes(date.getMinutes() + 330);

    const isoDate = date.toISOString();

    try {
      setIsLoaderActive(true);
      let response;

      if (selectedNewsNotifications) {
        response = await axios.post(
          config.API_URL + "EmailCofigureController/UpdateNewsAndNotification",
          {
            nid: selectedNewsNotifications.nid,
            nTital: newNewsNotifications.trim(),
            nDate: isoDate,
            nDescription: newDescription.trim(),
          }
        );
        toast.success("News Announcement Updated Successfully.", config.tostar_config);
      } else {
        response = await axios.post(
          config.API_URL + "EmailCofigureController/CreateNewsAndNotification",
          {
            nTital: newNewsNotifications.trim(),
            nDate: isoDate,
            nDescription: newDescription.trim(),
          }
        );
        toast.success("Successfully Created News Announcement.", config.tostar_config);
      }

      if (response.status === 200) {
        const responseData = response.data;
        if (responseData.success) {
          const newNewsNotificationData = {
            nid: responseData.nid,
            nTital: responseData.nTital,
            nDate: responseData.nDate,
            nDescription: responseData.nDescription,
          };
          if (selectedNewsNotifications) {
            const updatedNewsNotification = newsNotifications.map((news) =>
              news.nid === selectedNewsNotifications.nid
                ? {
                    ...news,
                    nTital: responseData.nTital,
                    nDate: responseData.nDate,
                    nDescription: responseData.nDescription,
                  }
                : news
            );
            setNewsNotifications(updatedNewsNotification);
          } else {
            setNewsNotifications([
              ...newsNotifications,
              newNewsNotificationData,
            ]);
          }
          setNewNewsNotifications("");
          setDate("");
          setNewDescription("");
          setError("");
          setSelectedNewsNotifications(null);
        } else {
          toast.error(responseData.message || "Failed to Update News.", config.tostar_config);
        }
      }
    } catch (error) {
      console.error("Error adding/updating News:", error);
      toast.error("Failed to add/update News Announcement.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }

    listOfHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
    getNewsNotifications();
  };

  const handleEdit = (news) => {
    const startDateISO = new Date(news.nDate);
    const formattedStartDate = `${(startDateISO.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${startDateISO
      .getDate()
      .toString()
      .padStart(2, "0")}/${startDateISO.getFullYear()} ${startDateISO
      .getHours()
      .toString()
      .padStart(2, "0")}:${startDateISO
      .getMinutes()
      .toString()
      .padStart(2, "0")} ${startDateISO.getHours() >= 12 ? "PM" : "AM"}`;

    $("#projectStartDateV").val(formattedStartDate);

    setSelectedNewsNotifications(news);
    setNewNewsNotifications(news.nTital);
    setDate(formattedStartDate);
    setNewDescription(news.nDescription);
    const newsNotificationInput = document.getElementById(
      "newsNotificationInput"
    );
    if (newsNotificationInput) {
      newsNotificationInput.focus();
    }

    listOfHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelClick = (e) => {
    setNewNewsNotifications("");
    setNewDescription("");
    setDate("");

    inputNewsAnnouncementReference.current.classList.remove("is-invalid");
    inputDateReference.current.classList.remove("is-invalid");
    inputDescriptionReference.current.classList.remove("is-invalid");

    listOfHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemove = (news) => {
    setNewsNotificationToDelete(news);
    window.confirmModalShow();
  };

  const confirmDelete = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.post(
        config.API_URL +
          `EmailCofigureController/DeleteNewsAndNotification/${newsNotificationToDelete.nid}`
      );
      if (response.status === 200) {
        toast.success("News Data deleted successfully.", config.tostar_config);
        window.confirmModalHide();
        setNewsNotifications((prevNewsNotifications) =>
          prevNewsNotifications.filter(
            (item) => item.nid !== newsNotificationToDelete.nid
          )
        );
      }
      setIsLoaderActive(false);
    } catch (error) {
      console.error("Error deleting News:", error);
      toast.error("Failed to delete News Announcement.", config.tostar_config);
      setIsLoaderActive(false);
    }
  };

  const addCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  };

  const listOfHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButton").click();
  };

  return (
    <div>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1 className="m-0">News & Notifications </h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <Link to="#">Home</Link>
                </li>
                <li className="breadcrumb-item active">News</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-danger card-outline collapsed-card">
                <div className="card-header">
                  <h3 className="card-title text-sm">
                    Create New News Announcement
                  </h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-danger btn-xs"
                      id="AddNewHeaderButton"
                      onClick={(e) => {
                        addCardHeaderButtonClick(e);
                      }}
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-plus"></i> Add New News
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="maximize"
                    >
                      <i className="fas fa-expand"></i>
                    </button>
                  </div>
                </div>
                <div className="card-body text-sm">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="form-group col-md-6">
                        <label htmlFor="newsNotificationInput">
                          Title <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          id="newsNotificationInput"
                          placeholder="Enter Title.."
                          value={newNewsNotifications}
                          ref={inputNewsAnnouncementReference}
                          onChange={(e) =>
                            setNewNewsNotifications(e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group col-md-4">
                        <label>
                          Task Start Date<sup style={{ color: "red" }}>*</sup>
                        </label>
                        <div
                          className="input-group"
                          id="projectStartDate"
                          data-target-input="nearest"
                        >
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            id="projectStartDateV"
                            ref={inputDateReference}
                            value={cdate}
                            onSelect={(e) => {
                              setDate(e.target.value);
                            }}
                            placeholder="Date"
                            data-target="#projectStartDate"
                          />
                          <div
                            className="input-group-append"
                            custDatePicker
                            data-target="#projectStartDate"
                            data-toggle="datetimepicker"
                          >
                            <div className="input-group-text">
                              <i className="fa fa-calendar"></i>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* <div className="form-group col-md-4">
                        <label htmlFor="dateTimeInput">
                          Date and Time <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <div className="input-group date" id="projectStartDate">
                          <input
                            type="datetime-local"
                            className="form-control custDatePicker form-control-sm"
                            id="projectStartDateV"
                            ref={inputDateReference}
                            value={cdate}
                            onChange={(e) => setDate(e.target.value)}
                          />
                        </div>
                      </div> */}
                      <div className="form-group  col-md-12">
                        <label>
                          Description<sup style={{ color: "red" }}>*</sup>
                        </label>
                        <textarea
                          className="form-control form-control-sm"
                          style={{ resize: "none", minHeight: "60px" }}
                          rows="3"
                          value={newDescription}
                          ref={inputDescriptionReference}
                          onChange={(e) => setNewDescription(e.target.value)}
                          placeholder="Enter description ..."
                        ></textarea>
                      </div>
                    </div>
                    <div className="card-footer text-sm">
                      {isLoaderActive ? (
                        <PleaseWaitButton className="float-right btn-xs ml-2 font-weight-medium auth-form-btn" />
                      ) : (
                        <button
                          type="submit"
                          className="btn btn-success float-right btn-xs ml-2"
                        >
                          Save & Submit
                        </button>
                      )}
                      <button
                        type="button"
                        className="btn btn-default float-right btn-xs"
                        onClick={handleCancelClick}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          {newsNotifications.length > 0 && (
            <div className="row">
              <div className="col-md-12">
                <div className="card card-danger card-outline">
                  <div className="card-header">
                    <h3 className="card-title text-sm">
                      News & Notifications List ( {newsNotifications.length} )
                    </h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        id="listOfProjectsHeaderExpandButtion"
                        onClick={(e) => {
                          listOfHeaderExpandButtionClick(e);
                        }}
                        data-card-widget="collapse"
                      >
                        <i className="fas fa-minus"></i>
                      </button>
                      <button
                        type="button"
                        className="btn btn-tool"
                        data-card-widget="maximize"
                      >
                        <i className="fas fa-expand"></i>
                      </button>
                    </div>
                  </div>
                  <div className="card-body text-sm">
                    <table
                      id="example1"
                      className="table table-bordered table-sm table-striped"
                    >
                      <thead>
                        <tr>
                          <th className="text-center">Sr. No.</th>
                          <th>Title</th>
                          <th>Date & Time</th>
                          <th>Description</th>
                          <th className="text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newsNotifications.map((newsNotification, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td>{newsNotification.nTital}</td>
                            <td>
                              {new Date(
                                newsNotification.nDate
                              ).toLocaleString()}
                            </td>
                            <td>{newsNotification.nDescription}</td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="btn bg-gradient-warning btn-xs"
                                onClick={() => handleEdit(newsNotification)}
                              >
                                <i className="fas fa-pen"></i>
                              </button>
                              <button
                                type="button"
                                className="btn bg-gradient-danger btn-xs ml-2"
                                onClick={() => handleRemove(newsNotification)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <div
        id="confirmCommonModal"
        className="modal fade confirmCommonModal"
        data-backdrop="static"
        tabindex="-1"
        role="dialog"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-confirm">
          <div className="modal-content">
            <div className="modal-header">
              <div className="icon-box">
                <i className="fas fa-info"></i>
              </div>
              <h5 className="modal-title w-100">Are you sure ?</h5>
            </div>
            <div className="modal-body">
              <p className="text-center">
                By clicking on Yes delete all the task details. Once you deleted
                it can not be recovered.
              </p>
            </div>
            <div className="modal-footer col-md-12">
              <button className="btn btn-default btn-sm"  data-bs-dismiss="modal">
                Cancel
              </button>
              {isLoaderActive ? (
                <PleaseWaitButton className="btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn" />
              ) : (
                <button
                  className="btn btn-warning btn-sm pl-3 pr-3 ml-2"
                  onClick={(e) => {
                    confirmDelete(e);
                  }}
                >
                  Yes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsAnnouncements;
