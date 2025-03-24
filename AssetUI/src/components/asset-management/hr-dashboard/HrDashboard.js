import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import $ from "jquery";

const config = require("../../../services/config.json");

function HrDashboard() {
  const [totalAssetsCount, setTotalAssetsCount] = useState(0);
  const [assignedAsset, setAssignedAsset] = useState(0);
  const [unassignedAsset, setUnassignedAsset] = useState(0);
  const [discardedAsset, setDiscardedAsset] = useState(0);
  const [allManagesList, setAllManagesList] = useState([]);
  const [allAssetList, setAllAssetList] = useState([]);
  const [tailName, setTailName] = useState("");


  useEffect(() => {
    getTotalCount();
    getAllManagerList();
  }, []);

  const getManagerName = (managerId) => {
    if (!managerId) return "Not Assigned";
    const manager = allManagesList.find((x) => x.managerId === managerId);
    if (manager) {
      return `${manager.managerFirstName} ${manager.managerLastName}`;
    }
    return "Not Found";
  };

  const getAllAssetList = (getStatus) => {
    // window.changeTilesClass(getStatus);
    window.initDestroyDataTableFuncation();
    axios
      .get(
        config.API_URL +
        "AssetAssignment/assigned-assets?status=" +
        getStatus,
        {
          headers: config.headers2,
        }
      )
      .then((response) => {
        if (response && response.data) {
          if (response.data.length > 0) {
            setTimeout(() => {
              window.initDataTableFuncation();
            }, 900);
            setAllAssetList(response.data);
          } else {
            setTimeout(() => {
              window.initDataTableFuncation();
            }, 900);
            setAllAssetList([]);
          }
          // setTimeout(() => {
          //   window.initDataTableFuncation();
          // }, 1000);
        } else if (response.data.status.status === 500) {
          toast.error("Invalid username or password", config.tostar_config);
        }
      })
      .catch((error) => {
        toast.error("Please try again later.", config.tostar_config);
      });
  };

  const getAllManagerList = () => {
    axios
      .get(
        config.API_URL +
        "AuthMasterController/GetAllUsers?ClientId=" +
        "pmoAuthApp",
        {
          headers: config.headers2,
        }
      )
      .then((response) => {
        if (response.status == 200) {
          if (response.data.success == "success") {
            if (response.data.data.length > 0) {
              let tempArray = [];
              response.data.data.map((manager) => {
                let tempObj = {
                  managerId: manager.userID,
                  managerName: manager.userName,
                  managerFirstName: manager.firstName,
                  managerLastName: manager.lastName,
                  managerStatus: manager.isActive,
                };
                tempArray.push(tempObj);
              });
              setAllManagesList(tempArray);
            }
          } else {
            toast.error(response.data.message, config.tostar_config);
          }
        } else if (response.data.status.status == 500) {
          toast.error("Invalid username or password", config.tostar_config);
        }
      })
      .catch((error) => {
        toast.error("Please try again later.", config.tostar_config);
      });
  };

  const getTotalCount = () => {
    axios
      .get(config.API_URL + "AssetAssignment/GetTotalCountsOfAsset")
      .then((response) => {
        if (response.status === 200 && response.data?.success) {
          const { totalAssetCount, totalAssetsAvailable, totalAssetsInUse, totalDiscarded } =
            response.data?.data || {}; // Ensure response.data.data exists

          setTotalAssetsCount(totalAssetCount || 0);
          setUnassignedAsset(totalAssetsAvailable || 0);
          setAssignedAsset(totalAssetsInUse || 0);
          setDiscardedAsset(totalDiscarded || 0); // Ensure discarded asset count is included

          getAllAssetList("total");
          setTailName("Total");

        } else {
          toast.error(response.data?.message || "An error occurred while fetching data.");
        }
      })
      .catch((error) => {
        console.error("Error fetching total asset count:", error);
        toast.warn(
          error.response?.data?.message || "No records found. Please add assets."
        );
      });
  };

  return (
    <div>
      <div className="row p-2">
        <div className="col-md-3 col-sm-3 col-8">
          <div
            id="totalAssets"
            onClick={(e) => {
              getAllAssetList("total");
              setTailName("Total");
            }}
            className="info-box commonTilesClass"
          >
            <span className="info-box-icon bg-1st-Tiles">
              <i className="far fa-chart-bar"></i>
            </span>
            <div className="info-box-content">
              <span className="info-box-text">Total Assets</span>
              <span
                className="info-box-number"
                style={{ fontSize: "x-large", lineHeight: "1" }}
              >
                {totalAssetsCount}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-3 col-8">
          <div
            id="assignedAssets"
            onClick={(e) => {
              getAllAssetList("assigned");
              setTailName("Assigned");

            }}
            className="info-box commonTilesClass"
          >
            <span className="info-box-icon bg-3rd-Tiles">
              <i className="fas fa-user-plus"></i>
            </span>
            <div className="info-box-content">
              <span className="info-box-text">Assigned Assets</span>
              <span
                className="info-box-number"
                style={{ fontSize: "x-large", lineHeight: "1" }}
              >
                {assignedAsset}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-3 col-8">
          <div
            id="unAssignedAssets"
            onClick={(e) => {
              getAllAssetList("notAssigned");
              setTailName("UnAssigned");

            }}
            className="info-box commonTilesClass"
          >
            <span className="info-box-icon bg-2nd-Tiles">
              <i className="fas fa-user-minus"></i>
            </span>
            <div className="info-box-content">
              <span className="info-box-text">UnAssigned Assets</span>
              <span
                className="info-box-number"
                style={{ fontSize: "x-large", lineHeight: "1" }}
              >
                {unassignedAsset}
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-3 col-sm-3 col-8">
          <div
            id="discarded"
            onClick={(e) => {
              getAllAssetList("discarded");
              setTailName("Discarded");

            }}
            className="info-box commonTilesClass"
          >
            <span className="info-box-icon bg-4th-Tiles">
              <i className="fas fa-light fa-ban"></i>
            </span>
            <div className="info-box-content">
              <span className="info-box-text">Discarded</span>
              <span
                className="info-box-number"
                style={{ fontSize: "x-large", lineHeight: "1" }}
              >
                {discardedAsset}
              </span>
            </div>
          </div>
        </div>
      </div>


      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-danger card-outline">
                <div className="card-header">
                  <h3 className="card-title text-sm">
                    {tailName ? `${tailName} Assets List` : "Your All Assets List"} ({allAssetList.length})
                  </h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      id="listOfProjectsHeaderExpandButtion"
                      onClick={(e) => { }}
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
                        <th className="text-center" style={{ fontWeight: "bold", fontSize: "smaller" }}>Sr. No</th>
                        <th className="text-center" style={{ fontWeight: "bold", fontSize: "smaller" }}>Asset Type</th>
                        <th className="text-center" style={{ fontWeight: "bold", fontSize: "smaller" }}>Model</th>
                        <th className="text-center" style={{ fontWeight: "bold", fontSize: "smaller" }}>Warranty</th>
                        <th className="text-center" style={{ fontWeight: "bold", fontSize: "smaller" }}>Location</th>
                        <th className="text-center" style={{ fontWeight: "bold", fontSize: "smaller" }}>Purchase Date</th>
                        <th className="text-center" style={{ fontWeight: "bold", fontSize: "smaller" }}>Assigned User</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allAssetList.length > 0 && !allAssetList[0].placeholder
                        ? allAssetList.map((asset, index) => (
                          <tr key={index}>
                            <td className="text-center text-sm">{index + 1}</td>
                            <td className="text-center">{asset.assetType}</td>
                            <td className="text-center">{asset.model}</td>
                            <td className="text-center">
                              {asset.warrantyStatus ? asset.warrantyStatus : "Not Required"}
                            </td>
                            <td className="text-center">{asset.location}</td>
                            <td className="text-center">
                              {asset.purchaseDate
                                ? new Date(asset.purchaseDate).toLocaleDateString()
                                : "Invalid Date"}
                            </td>
                            <td className="text-center">
                              {getManagerName(asset.assigned)}
                            </td>
                          </tr>
                        ))
                        : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HrDashboard;
