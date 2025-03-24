import React, { useState } from "react";
import AssetTypeMaster from "../assetType-master/AssetTypeMaster";
import ModelMaster from "../model-master/ModelMaster";
import ProcessorMaster from "../processor-master/ProcessorMaster";
import GenerationMaster from "../generation-master/GenerationMaster";
import RamMaster from "../ram-master/RAMMaster";
import HddMaster from "../hdd-master/HDDMaster";
import WarrantyMaster from "../warranty-master/WarrantyMaster";
import OsMaster from "../os-master/OsMaster";
import ChargerMaster from "../charger-master/ChargerMaster";
import ChargerTypeMaster from "../chargerType-master/ChargerTypeMaster";

function HrMasters() {
  const [selectedComponent, setSelectedComponent] = useState("AssetType");

  const renderComponent = () => {
    switch (selectedComponent) {
      case "AssetType":
        return <AssetTypeMaster />;
      case "Model":
        return <ModelMaster />;
      case "Processor":
        return <ProcessorMaster />;
      case "Generation":
        return <GenerationMaster />;
      case "RAM":
        return <RamMaster />;
      case "HDD":
        return <HddMaster />;
      case "Warranty":
        return <WarrantyMaster />;
      case "OS":
        return <OsMaster />;
      case "Charger":
        return <ChargerMaster />;
      case "ChargerType":
        return <ChargerTypeMaster />;
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="content-header">
        <div className="container-fluid">
          <div className="row mb-0">
            <div className="col-sm-6" style={{ marginBottom: "-10px" }}>
              <h4 className="m-0">Masters List</h4>
            </div>
            <div className="col-sm-6" style={{ marginBottom: "-10px" }}>
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Masters</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-danger card-outline">
                {/* <div className="card-header">
                  <h3 className="card-title text-sm">Masters</h3>

                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
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
                </div> */}
                <div className="card-body">
                  <div className="row ml-4">
                    <button
                      className="btn btn-info btn-m text-center mr-3 mb-2"
                      onClick={() => setSelectedComponent("AssetType")}
                      style={{ width: "200px" }}
                    >
                      AssetType Master
                    </button>
                    <button
                      className="btn btn-info btn-m text-center mr-3 mb-2"
                      onClick={() => setSelectedComponent("Model")}
                      style={{ width: "200px" }}
                    >
                      Model Master
                    </button>
                    <button
                      className="btn btn-info btn-m text-center mr-3 mb-2"
                      onClick={() => setSelectedComponent("Processor")}
                      style={{ width: "200px" }}
                    >
                      Processor Master
                    </button>
                    <button
                      className="btn btn-info btn-m text-center mr-3 mb-2"
                      onClick={() => setSelectedComponent("Generation")}
                      style={{ width: "200px" }}
                    >
                      Generation Master
                    </button>
                    <button
                      className="btn btn-info btn-m text-center mr-3 mb-2"
                      onClick={() => setSelectedComponent("RAM")}
                      style={{ width: "200px" }}
                    >
                      RAM Master
                    </button>
                    <button
                      className="btn btn-info btn-m text-center mr-3 mb-2"
                      onClick={() => setSelectedComponent("HDD")}
                      style={{ width: "200px" }}
                    >
                      HDD Master
                    </button>
                    <button
                      className="btn btn-info btn-m text-center mr-3 mb-2"
                      onClick={() => setSelectedComponent("Warranty")}
                      style={{ width: "200px" }}
                    >
                      Warranty Status Master
                    </button>
                    <button
                      className="btn btn-info btn-m text-center mr-3 mb-2"
                      onClick={() => setSelectedComponent("OS")}
                      style={{ width: "200px" }}
                    >
                      OS Master
                    </button>
                    <button
                      className="btn btn-info btn-m text-center mr-3 mb-2"
                      onClick={() => setSelectedComponent("Charger")}
                      style={{ width: "200px" }}
                    >
                      Charger Master
                    </button>
                    <button
                      className="btn btn-info btn-m text-center mr-3 mb-2"
                      onClick={() => setSelectedComponent("ChargerType")}
                      style={{ width: "200px" }}
                    >
                      ChargerType Master
                    </button>
                  </div>
                </div>
              </div>
              <div>{renderComponent()}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HrMasters;
