import React, { useState } from "react";
import AssetTypeMaster from "../../components/all-masters/AssetTypeMaster";
import WarrantyMaster from "../../components/all-masters/WarrantyMaster";
import RAMMaster from "../../components/all-masters/RAMMaster";
import ModelsMasters from "../../components/all-masters/ModelsMasters";
import GenrationMasters from "../../components/all-masters/GenrationMasters";
import ChargerTypeMaster from "../../components/all-masters/ChargerTypeMaster";
import HDDMaster from "../../components/all-masters/HDDMaster";
import ProcessorMaster from "../../components/all-masters/ProcessorMaster";
import AccessoriesTypeMaster from "../../components/all-masters/AccessoriesTypeMaster";
import ChargerMaster from "../../components/all-masters/ChargerMaster";
import TicketTypesMaster from "../../components/all-masters/TicketTypesMaster";
import HardwareTypesMaster from "../../components/all-masters/HardwareTypesMaster";
import SoftwareTypesMaster from "../../components/all-masters/SoftwareTypesMaster";
import OSMaster from "../../components/all-masters/OSMaster";
// import "./Masters.css"; // Import your CSS file

function Masters() {
  const [activeTab, setActiveTab] = useState("company1");

  return (
    <>
      <section className="content pt-3">

        <div className="row">
          <div className="col-md-12">
            <div className="card ">
              <div className="card-header">
                <h3 className="card-title text-sm">Masters</h3>
              </div>
              <div className="card-body">
                <ul className="custom-nav-tabs justify-content-center align-items-center">
                  <li className="custom-nav-item">
                    <button
                      className={`nav-link ${activeTab === "company1" ? "active" : ""}`}
                      onClick={() => setActiveTab("company1")}
                    >
                      AssetType Master
                    </button>
                  </li>
                  <li className="custom-nav-item">
                    <button
                      className={`nav-link ${activeTab === "industry" ? "active" : ""}`}
                      onClick={() => setActiveTab("industry")}
                    >
                      Warranty Status
                    </button>
                  </li>
                  <li className="custom-nav-item">
                    <button
                      className={`nav-link ${activeTab === "mode" ? "active" : ""}`}
                      onClick={() => setActiveTab("mode")}
                    >
                      RAM Master
                    </button>
                  </li>
                  <li className="custom-nav-item">
                    <button
                      className={`nav-link ${activeTab === "product" ? "active" : ""}`}
                      onClick={() => setActiveTab("product")}
                    >
                      Processor Master
                    </button>
                  </li>
                  <li className="custom-nav-item">
                    <button
                      className={`nav-link ${activeTab === "model" ? "active" : ""}`}
                      onClick={() => setActiveTab("model")}
                    >
                      Models Master
                    </button>
                  </li>
                  <li className="custom-nav-item">
                    <button
                      className={`nav-link ${activeTab === "hdd" ? "active" : ""}`}
                      onClick={() => setActiveTab("hdd")}
                    >
                      HDD Master
                    </button>
                  </li>
                  <li className="custom-nav-item">
                    <button
                      className={`nav-link ${activeTab === "genrate" ? "active" : ""}`}
                      onClick={() => setActiveTab("genrate")}
                    >
                      Generation Master
                    </button>
                  </li>
                  <li className="custom-nav-item">
                    <button
                      className={`nav-link ${activeTab === "leadstatus" ? "active" : ""}`}
                      onClick={() => setActiveTab("leadstatus")}
                    >
                      Charger Master
                    </button>
                  </li>
                </ul>
                <ul className="custom-nav-tabs justify-content-center align-items-center">


                  <li className="custom-nav-item">
                    <button
                      className={`nav-link ${activeTab === "charger" ? "active" : ""}`}
                      onClick={() => setActiveTab("charger")}
                    >
                      ChargerType Master
                    </button>
                  </li>
                  <li className="custom-nav-item">
                    <button
                      className={`nav-link ${activeTab === "accessories" ? "active" : ""}`}
                      onClick={() => setActiveTab("accessories")}
                    >
                      OSMaster Master
                    </button>
                  </li>
                  <li className="custom-nav-item">
                    <button
                      className={`nav-link ${activeTab === "tickettype" ? "active" : ""}`}
                      onClick={() => setActiveTab("tickettype")}
                    >
                      TiketType Master
                    </button>
                  </li>
                  <li className="custom-nav-item">
                    <button
                      className={`nav-link ${activeTab === "hardwaretype" ? "active" : ""}`}
                      onClick={() => setActiveTab("hardwaretype")}
                    >
                      HardWareType Master
                    </button>
                  </li>
                  <li className="custom-nav-item">
                    <button
                      className={`nav-link ${activeTab === "softwaretype" ? "active" : ""}`}
                      onClick={() => setActiveTab("softwaretype")}
                    >
                      SoftwareTypes Master
                    </button>
                  </li>
                </ul>

                <div className="content mt-3">
                  {activeTab === "company1" && <AssetTypeMaster />}
                  {activeTab === "industry" && <WarrantyMaster />}
                  {activeTab === "mode" && <RAMMaster />}
                  {activeTab === "product" && <ProcessorMaster />}
                  {activeTab === "model" && <ModelsMasters />}
                  {activeTab === "hdd" && <HDDMaster />}
                  {activeTab === "genrate" && <GenrationMasters />}
                  {activeTab === "charger" && <ChargerTypeMaster />}
                  {activeTab === "accessories" && <OSMaster />}
                  {activeTab === "leadstatus" && <ChargerMaster />}
                  {activeTab === "tickettype" && <TicketTypesMaster />}
                  {activeTab === "hardwaretype" && <HardwareTypesMaster />}
                  {activeTab === "softwaretype" && <SoftwareTypesMaster />}
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
}

export default Masters;
