import React, { useEffect } from "react";
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { removeExtraSpaces } from "../../../common/textOperations";
import PleaseWaitButton from "../../../shared/PleaseWaitButton";
import axios from "axios";
import $ from "jquery";

const config = require("../../../services/config.json");

function AssetMaster() {
  const inputAssetReference = useRef(null);
  const inputModelReference = useRef(null);
  const inputProcessorReference = useRef(null);
  const inputRamReference = useRef(null);
  const inputHddReference = useRef(null);
  const inputChargerReference = useRef(null);
  const inputChargerTypeReference = useRef(null);
  const inputGenrationReference = useRef(null);
  const inputWarrantyReference = useRef(null);
  const inputOsReference = useRef(null);
  const inputLocationReference = useRef(null);
  const inputSpecificationReference = useRef(null);
  const inputSerialNoReference = useRef(null);
  const inputRemarksReference = useRef(null);
  const inputbrandReference = useRef(null);
  const inputAccessoriesTypeReference = useRef(null);
  const inputTaskAttachmentsNameReference = useRef(null);
  const inputTaskAttachmentsFileReference = useRef(null);

  const [taskAttachmentsName, setTaskAttachmentsName] = useState("");
  const [taskAttachmentsFile, setTaskAttachmentsFile] = useState([]);
  const [mandateAttachmentsFile, setMandateAttachmentsFile] = useState([]);
  const [previewIndex, setPreviewIndex] = useState(null);
  const [selectedAttachmentsFileName, setSelectedAttachmentsFileName] = useState("Choose file");
  const [selectedAttachmentsFile, setSelectedAttachmentsFile] = useState(null);
  const [removeOldFilesArrayList, setRemoveOldFilesArrayList] = useState([]);
  const [asset, setAsset] = useState("");
  const [assets, setAssets] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [models, setModels] = useState([]);
  const [model, setModel] = useState("");
  const [charger, setCharger] = useState("");
  const [chargers, setChargers] = useState([]);
  const [chargerType, setChargerType] = useState("");
  const [chargerTypes, setChargerTypes] = useState([]);
  const [hdd, setHdd] = useState("");
  const [hdds, setHdds] = useState([]);
  const [ram, setRam] = useState("");
  const [rams, setRams] = useState([]);
  const [processor, setProcessor] = useState("");
  const [processors, setProcessors] = useState([]);
  const [genration, setGenration] = useState("");
  const [genrations, setGenrations] = useState([]);
  const [warranty, setWarranty] = useState("");
  const [warrantys, setWarrantys] = useState([]);
  const [location, setLocation] = useState("");
  const [brand, setBrand] = useState("");
  const [specification, setSpecification] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [remarks, setRemarks] = useState("");
  const [os, setOs] = useState("");
  const [OSs, setOSs] = useState([]);
  const [purchaseDate, setPurchaseDate] = useState("");
  const [keyboard, setKeyboard] = useState("");
  const [mouse, setMouse] = useState("");
  const [wlan, setWlan] = useState("");
  const [cables, setCables] = useState("");
  const [adaptor, setAdaptor] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [extendedDisplay, setExtendedDisplay] = useState("");
  const [accessoriesType, setAccessoriesType] = useState("");
  const [assetToDelete, setAssetToDelete] = useState("");
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    fetchAssetDetails();
    fetchAssetTypes();
    fetchModels();
    fetchProcessors();
    fetchGenrations();
    fetchRAMs();
    fetchHDDs();
    fetchWarrantys();
    fetchChargerTypes();
    fetchChargers();
    fetchOSs();
    setAsset("Laptop");
  }, []);

  const fetchAssetDetails = async () => {
    try {
      window.initDestroyDataTableFuncation();
      setIsLoaderActive(true);
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllAssetDetails"
      );
      if (response.data && Array.isArray(response.data.data)) {
        setTimeout(() => {
          window.initDataTableFuncation();
        }, 30);
        setAssets(response.data.data);
      } else {
        setTimeout(() => {
          window.initDataTableFuncation();
        }, 30);
        setAssets([]);
      }
    } catch (error) {
      toast.error("Error fetching asset details");
      console.error("Error fetching asset details:", error);
    } finally {
      setIsLoaderActive(false);
    }
  };

  const addCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  };
  const addProjectCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  };

  const listOfHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButtion").click();
  };

  const editButton = () => {
    $("#viewButton").show();
    $("#editButton").hide();
    setIsDisabled(false);
    setIsReadOnly(false);
  };

  const viewButton = () => {
    $("#viewButton").hide();
    $("#editButton").show();
    setIsDisabled(true);
    setIsReadOnly(true);
  };

  const fetchAssetTypes = async () => {
    try {
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllAssetTypeDetails"
      );
      setAssetTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching asset types:", error);
    }
  };

  const fetchModels = async () => {
    try {
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllModelsDetails"
      );
      setModels(response.data.data);
    } catch (error) {
      console.error("Error fetching Models:", error);
    }
  };

  const fetchProcessors = async () => {
    try {
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllProcessorDetails"
      );
      setProcessors(response.data.data);
    } catch (error) {
      console.error("Error fetching Processors:", error);
    }
  };

  const fetchGenrations = async () => {
    try {
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllGenrationDetails"
      );
      setGenrations(response.data.data);
    } catch (error) {
      console.error("Error fetching genrations:", error);
    }
  };

  const fetchRAMs = async () => {
    try {
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllRAMDetails"
      );
      setRams(response.data.data);
    } catch (error) {
      console.error("Error fetching RAMs:", error);
    }
  };

  const fetchHDDs = async () => {
    try {
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllHDDDetails"
      );
      setHdds(response.data.data);
    } catch (error) {
      console.error("Error fetching HDDs:", error);
    }
  };

  const fetchWarrantys = async () => {
    try {
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllWarrantyDDetails"
      );
      setWarrantys(response.data.data);
    } catch (error) {
      console.error("Error fetching Warrantys:", error);
    }
  };

  const fetchOSs = async () => {
    try {
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllOSDetails"
      );
      setOSs(response.data.data);
    } catch (error) {
      console.error("Error fetching OSs:", error);
    }
  };

  const fetchChargers = async () => {
    try {
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllChargerDetails"
      );
      setChargers(response.data.data);
    } catch (error) {
      console.error("Error fetching Chargers:", error);
    }
  };

  function formatDate(dateString) {
    const datePart = dateString.split("T")[0];
    return datePart;
  }

  const fetchChargerTypes = async () => {
    try {
      const response = await axios.get(
        config.API_URL + "AssetManagement/GetAllChargerTypeDetails"
      );
      setChargerTypes(response.data.data);
    } catch (error) {
      console.error("Error fetching ChargerTypes:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (asset.trim() === "") {
      toast.error("Please select Asset Type.");
      inputAssetReference.current.focus();
      inputAssetReference.current.classList.add("is-invalid");
      return;
    }

    const newMandateAttachments = mandateAttachmentsFile.filter(
      (fileObj) => fileObj.fileAdded === "New"
    );

    if (mandateAttachmentsFile.length < 8) {
      toast.error("Please upload at least 8 mandatory asset images.");
      setIsLoaderActive(false);
      return;
    }

    const assetData = {
      assetType: asset,
      model: model,
      serialNumber: serialNo,
      processor: processor,
      genration: genration,
      ram: ram,
      hdd: hdd,
      purchaseDate: purchaseDate,
      warrantyStatus: warranty,
      os: os,
      brand: brand,
      accessoriesType: accessoriesType,
      remarks: remarks,
      chargerAllocation: charger,
      chargerType: chargerType,
      location: location,
      specificationIfAny: specification,
      isActive: true,
    };

    const formData = new FormData();
    for (const key in assetData) {
      if (Array.isArray(assetData[key])) {
        assetData[key].forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, assetData[key]);
      }
    }

    if (asset === "Laptop" && Array.isArray(taskAttachmentsFile)) {
      taskAttachmentsFile.forEach((fileObj, index) => {
        if (fileObj.fileAdded === "New") {
          formData.append(`attachments`, fileObj.selectedFile);
          formData.append(`DocumentName`, fileObj.fileName);
        }
      });
    } else {
      console.warn("taskAttachmentsFile is not an array or is undefined:", taskAttachmentsFile);
    }

    newMandateAttachments.forEach((fileObj) => {
      formData.append("mandateAttchment", fileObj.selectedFile);
    });

    try {
      setIsLoaderActive(true);
      let response;
      if (selectedId !== "") {
        formData.append("deviceId", selectedId);
        if (removeOldFilesArrayList.length > 0) {
          formData.append("DeleteDocIds", removeOldFilesArrayList);
        } else {
          formData.append("DeleteDocIds", "");
        }
        response = await axios.post(
          `${config.API_URL}AssetManagement/UpdateAsset`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        formData.append("deviceId", 0);
        response = await axios.post(
          `${config.API_URL}AssetManagement/CreateAsset`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        toast.success("Data submitted successfully!");
        setIsLoaderActive(false);
        handleCancelClick();
      } else {
        toast.error("Failed to submit data.");
        setIsLoaderActive(false);
      }
    } catch (error) {
      toast.error("Please check all required fields.");
      console.error("Error submitting data:", error);
    } finally {
      setIsLoaderActive(false);
    }

    setPreviewIndex(null);
    setMandateAttachmentsFile([]);
    $("#editButton").hide();
    $("#viewButton").hide();
    fetchAssetDetails();
    addCardHeaderButtonClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleView = (assetData) => {
    if (!assetData) return;
    setMandateAttachmentsFile([]);

    const {
      id,
      assetType,
      model,
      serialNumber,
      processor,
      genration,
      ram,
      hdd,
      purchaseDate,
      warrantyStatus,
      os,
      remarks,
      chargerAllocation,
      chargerType,
      location,
      brand,
      specificationIfAny,
      mouse,
      keyboard,
      wlan,
      cables,
      adaptor,
      extendedDisplay,
      accessoriesType,
      mandateDocAsset,
      attachmentMasters,
    } = assetData ?? {};

    setSelectedId(id ?? "");
    setAsset(assetType ?? "");
    setModel(model ?? "");
    setSerialNo(serialNumber ?? "");
    setProcessor(processor ?? "");
    setGenration(genration ?? "");
    setRam(ram ?? "");
    setHdd(hdd ?? "");
    let purchaseDate1 = purchaseDate;
    let formattedPurchaseDate = formatDate(purchaseDate1);
    setPurchaseDate(formattedPurchaseDate ?? "");
    setWarranty(warrantyStatus ?? "");
    setOs(os ?? "");
    setRemarks(remarks ?? "");
    setCharger(chargerAllocation ?? "");
    setChargerType(chargerType ?? "");
    setLocation(location ?? "");
    setBrand(brand ?? "");
    setSpecification(specificationIfAny ?? "");
    setMouse(mouse ?? "");
    setKeyboard(keyboard ?? "");
    setWlan(wlan ?? "");
    setCables(cables ?? "");
    setAdaptor(adaptor ?? "");
    setExtendedDisplay(extendedDisplay ?? "");
    setAccessoriesType(accessoriesType ?? "");

    if (mandateDocAsset && mandateDocAsset.length > 0) {
      const existingImages = mandateDocAsset.map((file) => ({
        selectedFile: file.attachmentServerPath,
        fileName: file.documentName || file.attachmentFilePath.split("/").pop(),
        fileAdded: "Old",
        attachId: file.attachId,
      }));
      setMandateAttachmentsFile(existingImages);
    } else {
      setMandateAttachmentsFile([]);
    }

    if (attachmentMasters && attachmentMasters.length > 0) {
      const tempArray = attachmentMasters.map((attachObj) => {
        return {
          fileAdded: "Old",
          fileName: attachObj.documentName,
          selectedFile: attachObj.fileName,
          attachId: attachObj.id,
          attachmentFile: "",
        };
      });
      setTaskAttachmentsFile(tempArray);
    } else {
      setTaskAttachmentsFile([]);
    }
    setIsReadOnly(true);
    setIsDisabled(true);
    $("#editButton").show();
    addCardHeaderButtonClick();
    listOfHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getFileExtension = (filePath) => {
    return filePath.split('.').pop();
  };

  const handleCancelClick = (e) => {
    setSelectedId("");
    $("#projectStartDateV").val("");
    setAsset("");
    setModel("");
    setProcessor("");
    setGenration("");
    setRam("");
    setHdd("");
    setWarranty("");
    setLocation("");
    setSpecification("");
    setSerialNo("");
    setPurchaseDate("");
    setRemarks("");
    setOs("");
    setKeyboard("");
    setMouse("");
    setBrand("");
    setWlan("");
    setCables("");
    setAdaptor("");
    setExtendedDisplay("");
    setCharger("");
    setChargerType("");
    setAccessoriesType("");
    setRemoveOldFilesArrayList("");
    setSelectedAttachmentsFile("");
    setSelectedAttachmentsFileName("");
    setTaskAttachmentsFile("");
    setTaskAttachmentsName("");
    setSelectedId("");

    setIsReadOnly(false);
    setIsDisabled(false);
    $("#editButton").hide();
    $("#viewButton").hide();
    setPreviewIndex(null);
    setMandateAttachmentsFile([]);
    inputAssetReference.current.classList.remove("is-invalid");

    listOfHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRemove = (asset) => {
    setAssetToDelete(asset);
    window.confirmModalShow();
  };

  const confirmDelete = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.post(
        config.API_URL +
        `AssetManagement/RemoveAsset?id=${assetToDelete.id}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        setAssets((prevAsset) =>
          prevAsset.filter((item) => item.id !== assetToDelete.id)
        );
      }
      setIsLoaderActive(false);
      window.confirmModalHide();
    } catch (error) {
      console.error("Error deleting Data:", error);
      toast.error("Failed to delete Data.");
      setIsLoaderActive(false);
    }
  };

  function ValidateSingleInput(event) {
    if (event.target.files && event.target.files[0]) {
      if (event.target.files[0].size > 8 * 1000 * 1024) {
        toast.error("File with maximum size of 8MB is allowed");
        return false;
      }
      var fileName = event.target.files[0].name;
      var fileNameExt = fileName.substr(fileName.lastIndexOf(".") + 1);
      if (!config._validFileExtensions.includes(fileNameExt)) {
        toast.error(
          "Please upload files having extensions: " +
          config._validFileExtensions.join(", ") +
          " only."
        );
        $(event).val("");
        return false;
      }
      setSelectedAttachmentsFileName(fileName);
      setSelectedAttachmentsFile(event.target.files[0]);
    }
  }

  const handleRemoveAttachment = (getIndex) => {
    let tempArray = [...taskAttachmentsFile];
    let tempOldFileArray = [...removeOldFilesArrayList];
    if (tempArray[getIndex].fileAdded === "Old") {
      tempOldFileArray.push(tempArray[getIndex].attachId);
      tempArray.splice(getIndex, 1);
    } else {
      tempArray.splice(getIndex, 1);
    }
    setRemoveOldFilesArrayList(tempOldFileArray);
    setTaskAttachmentsFile(tempArray);
  };

  const handleMandateFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (mandateAttachmentsFile.length + files.length > 20) {
      toast.error("You can upload a maximum of 20 images.");
      return;
    }

    const newFiles = files.map((file) => ({
      selectedFile: file,
      fileName: file.name,
      fileAdded: "New",
    }));

    setMandateAttachmentsFile((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveMandateAttachment = (index) => {
    setMandateAttachmentsFile((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteMandateAttachment = async (attachId, index) => {
    try {
      setIsLoaderActive(true);
      const response = await axios.post(
        `${config.API_URL}AssetManagement/delete`,
        { attachId }
      );

      if (response.status === 200) {
        toast.success("Attachment deleted successfully!");
        setMandateAttachmentsFile((prev) => prev.filter((_, i) => i !== index));
        fetchAssetDetails();
      } else {
        toast.error("Failed to delete attachment.");
      }
    } catch (error) {
      console.error("Error deleting attachment:", error);
      toast.error("Error deleting attachment.");
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleAddNewAttachment = () => {
    const cleanedName = removeExtraSpaces(taskAttachmentsName);
    if (cleanedName) {
      if (selectedAttachmentsFile) {
        let tempArray = [...taskAttachmentsFile];
        let tempObj = {
          fileAdded: "New",
          fileName: taskAttachmentsName,
          selectedFile: selectedAttachmentsFile,
          attachId: "",
          attachmentFile: "",
        };
        tempArray.push(tempObj);
        setTaskAttachmentsFile(tempArray);
        setSelectedAttachmentsFile(null);
        setSelectedAttachmentsFileName("Choose file");
        setTaskAttachmentsName("");
        document.getElementById("customFile").value = "";
      } else {
        toast.error("Please select attachment file.");
        inputTaskAttachmentsFileReference.current.focus();
        inputTaskAttachmentsFileReference.current.classList.add("is-invalid");
      }
    } else {
      toast.error("Please enter attachment name.");
      inputTaskAttachmentsNameReference.current.focus();
      inputTaskAttachmentsNameReference.current.classList.add("is-invalid");
    }
  };

  return (
    <>
      <section className="content">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-danger card-outline collapsed-card">
                <div className="card-header">
                  <h3 className="card-title text-sm">Create New Asset</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-warning btn-xs"
                      id="editButton"
                      onClick={(e) => editButton(e)}
                      style={{ marginRight: "10px", display: "none" }}
                    >
                      <i className="fas fa-pen"></i>
                    </button>
                    <button
                      type="button"
                      className="btn btn-info btn-xs"
                      id="viewButton"
                      onClick={(e) => viewButton(e)}
                      style={{ marginRight: "10px", display: "none" }}
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      type="button"
                      className="custom-primary-gradient-button mr-2"
                      id="AddNewHeaderButtion"
                      onClick={(e) => addProjectCardHeaderButtonClick(e)}
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-plus"></i> Add New Asset
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
                      <div className="form-group col-md-4">
                        <label>
                          Asset Type
                          <sup style={{ color: "red" }}>*</sup>
                        </label>
                        <select
                          className="custom-select form-control-sm"
                          ref={inputAssetReference}
                          value={asset || (assetTypes.some((type) => type.value === "Laptop") ? "Laptop" : "")}
                          onChange={(e) => setAsset(e.target.value)}
                          disabled={isDisabled}
                          required
                        >
                          <option value="">--Select Asset Type--</option>
                          {assetTypes.map((type) => (
                            <option key={type.id} value={type.value}>
                              {type.assetTypeName}
                            </option>
                          ))}
                        </select>
                      </div>
                      {asset?.toLowerCase() === "laptop" && (
                        <>
                          <div className="form-group col-md-4">
                            <label>
                              Select {asset} Model
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <select
                              className="custom-select form-control-sm"
                              ref={inputModelReference}
                              value={model}
                              onChange={(e) => setModel(e.target.value)}
                              disabled={isDisabled}
                              required
                            >
                              <option value="">--Select {asset} Model--</option>
                              {models
                                .filter((mType) => mType.accetType === asset)
                                .map((mType) => (
                                  <option
                                    key={mType.modelName + "_assetProperties"}
                                    value={mType.modelName}
                                  >
                                    {mType.modelName}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="form-group col-md-4">
                            <label>
                              Processor
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <select
                              className="custom-select form-control-sm"
                              ref={inputProcessorReference}
                              value={processor}
                              onChange={(e) => setProcessor(e.target.value)}
                              disabled={isDisabled}
                              required
                            >
                              <option value="">--Select Processor--</option>
                              {processors.map((pType) => (
                                <option key={pType.id} value={pType.value}>
                                  {pType.processorName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-md-4">
                            <label>
                              Generation
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <select
                              className="custom-select form-control-sm"
                              ref={inputGenrationReference}
                              value={genration}
                              onChange={(e) => setGenration(e.target.value)}
                              disabled={isDisabled}
                              required
                            >
                              <option value="">--Select generation--</option>
                              {genrations.map((gType) => (
                                <option key={gType.id} value={gType.value}>
                                  {gType.genrationName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-md-4">
                            <label>
                              Select RAM
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <select
                              className="custom-select form-control-sm"
                              ref={inputRamReference}
                              value={ram}
                              onChange={(e) => setRam(e.target.value)}
                              disabled={isDisabled}
                              required
                            >
                              <option value="">--Select RAM--</option>
                              {rams.map((rType) => (
                                <option key={rType.id} value={rType.value}>
                                  {rType.ramName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-md-4">
                            <label>
                              Select HDD
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <select
                              className="custom-select form-control-sm"
                              ref={inputHddReference}
                              value={hdd}
                              onChange={(e) => setHdd(e.target.value)}
                              disabled={isDisabled}
                              required
                            >
                              <option value="">--Select HDD--</option>
                              {hdds.map((hType) => (
                                <option key={hType.id} value={hType.value}>
                                  {hType.hddName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-md-4">
                            <label>
                              Select Warranty Status
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <select
                              className="custom-select form-control-sm"
                              ref={inputWarrantyReference}
                              value={warranty}
                              onChange={(e) => setWarranty(e.target.value)}
                              disabled={isDisabled}
                              required
                            >
                              <option value="">--Select Warranty--</option>
                              {warrantys.map((wType) => (
                                <option key={wType.id} value={wType.value}>
                                  {wType.warranty}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-md-4">
                            <label>
                              Select OS
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <select
                              className="custom-select form-control-sm"
                              ref={inputOsReference}
                              value={os}
                              onChange={(e) => setOs(e.target.value)}
                              disabled={isDisabled}
                              required
                            >
                              <option value="">--Select OS--</option>
                              {OSs.map((oType) => (
                                <option key={oType.id} value={oType.value}>
                                  {oType.osName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-md-4">
                            <label>
                              Select Charger
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <select
                              className="custom-select form-control-sm"
                              ref={inputChargerReference}
                              value={charger}
                              onChange={(e) => setCharger(e.target.value)}
                              disabled={isDisabled}
                              required
                            >
                              <option value="">--Select Charger--</option>
                              {chargers.map((cType) => (
                                <option key={cType.id} value={cType.value}>
                                  {cType.chargerName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-md-4">
                            <label>
                              Select Charger Type
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <select
                              className="custom-select form-control-sm"
                              ref={inputChargerTypeReference}
                              value={chargerType}
                              onChange={(e) => setChargerType(e.target.value)}
                              disabled={isDisabled}
                              required
                            >
                              <option value="">--Select Charger Type--</option>
                              {chargerTypes.map((ctType) => (
                                <option key={ctType.id} value={ctType.value}>
                                  {ctType.chargerTypeName}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="locationInput">
                              Location <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="locationInput"
                              value={location}
                              ref={inputLocationReference}
                              onChange={(e) => setLocation(e.target.value)}
                              readOnly={isReadOnly}
                              placeholder="Enter Locations..."
                              required
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="serialNoInput">
                              Serial Number{" "}
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="serialNoInput"
                              value={serialNo}
                              ref={inputSerialNoReference}
                              onChange={(e) => setSerialNo(e.target.value)}
                              readOnly={isReadOnly}
                              placeholder="Enter Serial Number..."
                              required
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="purchaseDateInput">
                              Purchase Date
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <div
                              className="input-group"
                              id="purchaseDate"
                              data-target-input="nearest"
                            >
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                id="purchaseDate"
                                placeholder="Purchase Date"
                                data-target="#projectStartDate"
                                value={purchaseDate}
                                onChange={(e) => setPurchaseDate(e.target.value)}
                                readOnly={isReadOnly}
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="specificationsInput">
                              Specification (If any){" "}
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="specificationsInput"
                              value={specification}
                              ref={inputSpecificationReference}
                              onChange={(e) => setSpecification(e.target.value)}
                              readOnly={isReadOnly}
                              placeholder="Enter Specification..."
                              required
                            />
                          </div>
                          <div className="form-group col-md-8">
                            <label htmlFor="remarksInput">
                              Remarks <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="remarksInput"
                              value={remarks}
                              ref={inputRemarksReference}
                              onChange={(e) => setRemarks(e.target.value)}
                              readOnly={isReadOnly}
                              placeholder="Enter Remarks..."
                              required
                            />
                          </div>
                          <div className="col-md-12 text-sm">
                            <label>
                              Upload Asset Images <sup style={{ color: "red" }}>*</sup> (Max 10)
                            </label>
                            <div className="row">
                              {mandateAttachmentsFile.map((file, index) => (
                                <div key={index} className="col-md-1 text-center mb-1">
                                  <div className="position-relative">
                                    <img
                                      src={
                                        file.fileAdded === "New"
                                          ? URL.createObjectURL(file.selectedFile)
                                          : file.selectedFile
                                      }
                                      alt={`Asset ${index + 1}`}
                                      className="img-thumbnail"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                        opacity: file.fileAdded === "Old" && isReadOnly ? "0.6" : "1",
                                      }}
                                      onClick={() => setPreviewIndex(index)}
                                    />

                                    {/* Delete Button (For both New and Old images when not read-only) */}
                                    {!isReadOnly && (
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger position-absolute"
                                        style={{
                                          top: "0px",
                                          right: "0px",
                                          padding: "2px 5px",
                                          fontSize: "10px",
                                        }}
                                        onClick={() => {
                                          if (file.fileAdded === "New") {
                                            handleRemoveMandateAttachment(index);
                                          } else {
                                            deleteMandateAttachment(file.attachId, index);
                                          }
                                        }}
                                      >
                                        <i className="fas fa-trash"></i>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}

                              {/* Upload Button for New Files */}
                              {mandateAttachmentsFile.length < 10 && (
                                <div className="col-md-1 text-center">
                                  <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.jfif"
                                    multiple={true}
                                    className="d-none"
                                    id="mandateFileInput"
                                    disabled={isDisabled}
                                    onChange={handleMandateFileChange}
                                  />
                                  <label
                                    htmlFor="mandateFileInput"
                                    className="btn btn-outline-primary d-block"
                                    readOnly={isReadOnly}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      fontSize: "10px",
                                      padding: "5px",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    <i className="fas fa-upload"></i>
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-12 text-sm">
                            <label>
                              Documents Upload{" "}
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <table className="table table-bordered table-sm">
                              <thead>
                                <tr>
                                  <th style={{ width: "45%", fontWeight: "500", fontSize: "smaller" }}>
                                    Document Name
                                  </th>
                                  <th style={{ width: "45%", fontWeight: "500", fontSize: "smaller" }}>
                                    Select File
                                  </th>
                                  <th style={{ width: "80px", fontWeight: "500", fontSize: "smaller" }}>
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>
                                    <div>
                                      <input
                                        type="text"
                                        ref={inputTaskAttachmentsNameReference}
                                        value={taskAttachmentsName}
                                        className="form-control form-control-sm"
                                        onChange={(e) => setTaskAttachmentsName(e.target.value)}
                                        disabled={isDisabled}
                                        id="documentName"
                                        placeholder="Enter Document Name..."
                                      />
                                    </div>
                                  </td>
                                  <td>
                                    <div>
                                      <div className="custom-file">
                                        <input
                                          type="file"
                                          ref={inputTaskAttachmentsFileReference}
                                          className="custom-file-input form-control-sm"
                                          id="customFile"
                                          onChange={(e) => {
                                            ValidateSingleInput(e);
                                            setSelectedAttachmentsFile(e.target.files[0]);
                                            setSelectedAttachmentsFileName(e.target.files[0].name);
                                          }}
                                          disabled={isDisabled}
                                        />
                                        <label className="custom-file-label" htmlFor="customFile">
                                          {selectedAttachmentsFileName}
                                        </label>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn btn-block btn-warning btn-xs"
                                      onClick={(e) => handleAddNewAttachment(e)}
                                      disabled={isDisabled}
                                    >
                                      Add File
                                    </button>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          {taskAttachmentsFile.length > 0 && (
                            <div className="row">
                              <div className="col-md-12 text-sm">
                                <label>Selected Documents</label>
                                <table className="table table-bordered table-sm table-striped">
                                  <thead>
                                    <tr>
                                      <th style={{ width: "10%", fontWeight: "500", fontSize: "smaller" }} className="text-center">
                                        Sr. No.
                                      </th>
                                      <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                                        Attachment Name
                                      </th>
                                      <th style={{ fontWeight: "500", fontSize: "smaller" }}>
                                        File Name
                                      </th>
                                      <th style={{ width: "10%", fontWeight: "500", fontSize: "smaller" }} className="text-center text-sm">
                                        Action
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {taskAttachmentsFile.map((children, index) => (
                                      <tr key={index}>
                                        <td style={{ fontWeight: "400", fontSize: "smaller" }} className="text-center text-sm">
                                          {index + 1}
                                        </td>
                                        <td style={{ fontWeight: "400", fontSize: "smaller" }}>
                                          {children.fileName}
                                        </td>
                                        <td style={{ fontWeight: "400", fontSize: "smaller" }}>
                                          {children.fileAdded === "New" ? children.selectedFile.name : children.selectedFile}
                                        </td>
                                        <td style={{ fontWeight: "400", fontSize: "smaller" }} className="text-center text-sm">
                                          <button
                                            type="button"
                                            className="btn bg-gradient-danger btn-xs"
                                            onClick={(e) => handleRemoveAttachment(index)}
                                            style={{ padding: "5px", fontSize: ".75rem", lineHeight: "0", borderRadius: ".15rem" }}
                                          >
                                            <i className="fas fa-trash" style={{ fontSize: "smaller" }}></i>
                                          </button>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      {asset?.toLowerCase() === "accessories" && (
                        <>
                          <div className="form-group col-md-4">
                            <label>
                              Select Accessories Type
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <select
                              className="custom-select form-control-sm"
                              ref={inputAccessoriesTypeReference}
                              value={accessoriesType}
                              onChange={(e) => setAccessoriesType(e.target.value)}
                              disabled={isDisabled}
                            >
                              <option value="">--Select Accessories Type--</option>
                              <option value="desktop">Desktop</option>
                              <option value="ram">RAM</option>
                              <option value="hdd">HDD</option>
                              <option value="keyboard">Keyboard</option>
                              <option value="mouse">Mouse</option>
                              <option value="wlan">WLAN</option>
                              <option value="cables">Cables</option>
                              <option value="charger">Charger</option>
                              <option value="adaptor">Adaptor</option>
                              <option value="monitor">Monitor</option>
                              <option value="microphone">Microphone</option>
                              <option value="headphones">Headphones</option>
                              <option value="speakers">Speakers</option>
                              <option value="printer">Printer</option>
                              <option value="scanner">Scanner</option>
                              <option value="webcam">Webcam</option>
                              <option value="usb-hub">USB Hub</option>
                              <option value="external-ssd">External SSD</option>
                              <option value="external-hdd">External HDD</option>
                              <option value="power-bank">Power Bank</option>
                              <option value="projector">Projector</option>
                              <option value="network-switch">Network Switch</option>
                              <option value="router">Router</option>
                              <option value="firewall">Firewall</option>
                            </select>

                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="brandInput">
                              Brand
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="brandInput"
                              value={brand}
                              ref={inputbrandReference}
                              onChange={(e) => setBrand(e.target.value)}
                              readOnly={isReadOnly}
                              placeholder="Enter Brand..."
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label>
                              Select {asset} Model
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <select
                              className="custom-select form-control-sm"
                              ref={inputModelReference}
                              value={model}
                              onChange={(e) => setModel(e.target.value)}
                              disabled={isDisabled}
                            >
                              <option value="">--Select {asset} Model--</option>
                              {models
                                .filter((mType) => mType.accetType === asset)
                                .map((mType) => (
                                  <option
                                    key={mType.modelName + "_assetProperties"}
                                    value={mType.modelName}
                                  >
                                    {mType.modelName}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="purchaseDateInput">
                              Purchase Date
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <div
                              className="input-group"
                              id="purchaseDate"
                              data-target-input="nearest"
                            >
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                id="purchaseDate"
                                placeholder="Purchase Date"
                                data-target="#projectStartDate"
                                value={purchaseDate}
                                onChange={(e) => setPurchaseDate(e.target.value)}
                                readOnly={isReadOnly}
                                required
                              />
                            </div>
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="specificationsInput">
                              Specification (If any){" "}
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="specificationsInput"
                              value={specification}
                              ref={inputSpecificationReference}
                              onChange={(e) => setSpecification(e.target.value)}
                              readOnly={isReadOnly}
                              placeholder="Enter Specification..."
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="locationInput">
                              Location <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="locationInput"
                              value={location}
                              ref={inputLocationReference}
                              onChange={(e) => setLocation(e.target.value)}
                              readOnly={isReadOnly}
                              placeholder="Enter Locations..."
                            />
                          </div>
                          <div className="form-group col-md-8">
                            <label htmlFor="remarksInput">
                              Remarks <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="remarksInput"
                              value={remarks}
                              ref={inputRemarksReference}
                              onChange={(e) => setRemarks(e.target.value)}
                              readOnly={isReadOnly}
                              placeholder="Enter Remarks..."
                            />
                          </div>
                          <div className="col-md-12 text-sm">
                            <label>
                              Upload Asset Images <sup style={{ color: "red" }}>*</sup> (Max 10)
                            </label>
                            <div className="row">
                              {mandateAttachmentsFile.map((file, index) => (
                                <div key={index} className="col-md-1 text-center mb-1">
                                  <div className="position-relative">
                                    <img
                                      src={
                                        file.fileAdded === "New"
                                          ? URL.createObjectURL(file.selectedFile)
                                          : file.selectedFile
                                      }
                                      alt={`Asset ${index + 1}`}
                                      className="img-thumbnail"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                        opacity: file.fileAdded === "Old" && isReadOnly ? "0.6" : "1",
                                      }}
                                      onClick={() => setPreviewIndex(index)}
                                    />

                                    {/* Delete Button (For both New and Old images when not read-only) */}
                                    {!isReadOnly && (
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger position-absolute"
                                        style={{
                                          top: "0px",
                                          right: "0px",
                                          padding: "2px 5px",
                                          fontSize: "10px",
                                        }}
                                        onClick={() => {
                                          if (file.fileAdded === "New") {
                                            handleRemoveMandateAttachment(index);
                                          } else {
                                            deleteMandateAttachment(file.attachId, index);
                                          }
                                        }}
                                      >
                                        <i className="fas fa-trash"></i>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {mandateAttachmentsFile.length < 10 && (
                                <div className="col-md-1 text-center">
                                  <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.jfif"
                                    multiple={true}
                                    className="d-none"
                                    id="mandateFileInput"
                                    disabled={isDisabled}
                                    onChange={handleMandateFileChange}
                                  />
                                  <label
                                    htmlFor="mandateFileInput"
                                    className="btn btn-outline-primary d-block"
                                    readOnly={isReadOnly}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      fontSize: "10px",
                                      padding: "5px",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    <i className="fas fa-upload"></i>
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                      {asset?.toLowerCase() === "other it assets" && (
                        <>
                          <div className="form-group col-md-4">
                            <label>
                              Select Other Assets
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <select
                              className="custom-select form-control-sm"
                              ref={inputAccessoriesTypeReference}
                              value={accessoriesType}
                              onChange={(e) => setAccessoriesType(e.target.value)}
                              disabled={isDisabled}
                            >
                              <option value="">--Select Other Assets--</option>
                              <option value="ram">RAM</option>
                              <option value="hdd">HDD</option>
                              <option value="keyboard">Keyboard</option>
                              <option value="mouse">Mouse</option>
                              <option value="wlan">WLAN</option>
                              <option value="cables">Cables</option>
                              <option value="charger">Charger</option>
                              <option value="adaptor">Adaptor</option>
                              <option value="docking-station">Docking Station</option>
                              <option value="power-supply">Power Supply</option>
                              <option value="external-ssd">External SSD</option>
                              <option value="external-hdd">External HDD</option>
                              <option value="usb-hub">USB Hub</option>
                              <option value="network-switch">Network Switch</option>
                              <option value="router">Router</option>
                              <option value="firewall">Firewall</option>
                              <option value="projector">Projector</option>
                              <option value="webcam">Webcam</option>
                              <option value="headphones">Headphones</option>
                              <option value="speakers">Speakers</option>
                            </select>
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="brandInput">
                              Brand
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="brandInput"
                              value={brand}
                              ref={inputbrandReference}
                              onChange={(e) => setBrand(e.target.value)}
                              readOnly={isReadOnly}
                              placeholder="Enter Brand..."
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label>
                              Select {asset} Model
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <select
                              className="custom-select form-control-sm"
                              ref={inputModelReference}
                              value={model}
                              onChange={(e) => setModel(e.target.value)}
                              disabled={isDisabled}
                            >
                              <option value="">--Select {asset} Model--</option>
                              {models
                                .filter((mType) => mType.accetType === asset)
                                .map((mType) => (
                                  <option
                                    key={mType.modelName + "_assetProperties"}
                                    value={mType.modelName}
                                  >
                                    {mType.modelName}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="purchaseDateInput">
                              Purchase Date
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <div
                              className="input-group"
                              id="purchaseDate"
                              data-target-input="nearest"
                            >
                              <input
                                type="date"
                                className="form-control form-control-sm"
                                id="purchaseDate"
                                placeholder="Purchase Date"
                                data-target="#projectStartDate"
                                value={purchaseDate}
                                onChange={(e) => setPurchaseDate(e.target.value)}
                                readOnly={isReadOnly}
                              />
                            </div>
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="specificationsInput">
                              Specification (If any){" "}
                              <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="specificationsInput"
                              value={specification}
                              ref={inputSpecificationReference}
                              onChange={(e) => setSpecification(e.target.value)}
                              readOnly={isReadOnly}
                              placeholder="Enter Specification..."
                            />
                          </div>
                          <div className="form-group col-md-4">
                            <label htmlFor="locationInput">
                              Location <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="locationInput"
                              value={location}
                              ref={inputLocationReference}
                              onChange={(e) => setLocation(e.target.value)}
                              readOnly={isReadOnly}
                              placeholder="Enter Locations..."
                            />
                          </div>
                          <div className="form-group col-md-8">
                            <label htmlFor="remarksInput">
                              Remarks <sup style={{ color: "red" }}>*</sup>
                            </label>
                            <input
                              type="text"
                              className="form-control form-control-sm"
                              id="remarksInput"
                              value={remarks}
                              ref={inputRemarksReference}
                              onChange={(e) => setRemarks(e.target.value)}
                              readOnly={isReadOnly}
                              placeholder="Enter Remarks..."
                            />
                          </div>
                          <div className="col-md-12 text-sm">
                            <label>
                              Upload Asset Images <sup style={{ color: "red" }}>*</sup> (Max 10)
                            </label>
                            <div className="row">
                              {mandateAttachmentsFile.map((file, index) => (
                                <div key={index} className="col-md-1 text-center mb-1">
                                  <div className="position-relative">
                                    <img
                                      src={
                                        file.fileAdded === "New"
                                          ? URL.createObjectURL(file.selectedFile)
                                          : file.selectedFile
                                      }
                                      alt={`Asset ${index + 1}`}
                                      className="img-thumbnail"
                                      style={{
                                        width: "50px",
                                        height: "50px",
                                        objectFit: "cover",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                        opacity: file.fileAdded === "Old" && isReadOnly ? "0.6" : "1",
                                      }}
                                      onClick={() => setPreviewIndex(index)}
                                    />

                                    {/* Delete Button (For both New and Old images when not read-only) */}
                                    {!isReadOnly && (
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger position-absolute"
                                        style={{
                                          top: "0px",
                                          right: "0px",
                                          padding: "2px 5px",
                                          fontSize: "10px",
                                        }}
                                        onClick={() => {
                                          if (file.fileAdded === "New") {
                                            handleRemoveMandateAttachment(index);
                                          } else {
                                            deleteMandateAttachment(file.attachId, index);
                                          }
                                        }}
                                      >
                                        <i className="fas fa-trash"></i>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {mandateAttachmentsFile.length < 10 && (
                                <div className="col-md-1 text-center">
                                  <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.jfif"
                                    multiple={true}
                                    className="d-none"
                                    id="mandateFileInput"
                                    disabled={isDisabled}
                                    onChange={handleMandateFileChange}
                                  />
                                  <label
                                    htmlFor="mandateFileInput"
                                    className="btn btn-outline-primary d-block"
                                    readOnly={isReadOnly}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      cursor: "pointer",
                                      fontSize: "10px",
                                      padding: "5px",
                                      borderRadius: "5px",
                                    }}
                                  >
                                    <i className="fas fa-upload"></i>
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="card-footer mt-2">
                      {isLoaderActive ? (
                        <PleaseWaitButton className="float-right btn-xs mr-2 font-weight-medium auth-form-btn" />
                      ) : (
                        <button
                          type="submit"
                          className="custom-success-button mr-2"
                          disabled={isDisabled}
                        >
                          Save & Submit
                        </button>
                      )}
                      <button
                        type="button"
                        className="custom-secondary-button"
                        disabled={isDisabled}
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
          <div className="row">
            <div className="col-md-12">
              <div className="card card-danger card-outline">
                <div className="card-header">
                  <h3 className="card-title text-sm">
                    Assets List ( {assets.length} )
                  </h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      id="listOfProjectsHeaderExpandButtion"
                      onClick={(e) => listOfHeaderExpandButtionClick(e)}
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
                        <th style={{ fontWeight: "500", fontSize: "smaller" }} className="text-center">
                          Sr. No
                        </th>
                        <th className="text-center" style={{ fontWeight: "bold", fontSize: "smaller" }}>
                          Asset Type
                        </th>
                        <th className="text-center" style={{ fontWeight: "bold", fontSize: "smaller" }}>
                          Model
                        </th>
                        <th className="text-center" style={{ fontWeight: "bold", fontSize: "smaller" }}>
                          Warranty
                        </th>
                        <th className="text-center" style={{ fontWeight: "bold", fontSize: "smaller" }}>
                          Location
                        </th>
                        <th className="text-center" style={{ fontWeight: "bold", fontSize: "smaller" }}>
                          Purchase Date
                        </th>
                        <th className="text-center" style={{ fontWeight: "bold", fontSize: "smaller" }}>
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {assets.length > 0
                        ? assets.map((asset, index) => (
                          <tr key={asset.id}>
                            <td className="text-center text-sm">{index + 1}</td>
                            <td className="text-center">{asset.assetType}</td>
                            <td className="text-center">{asset.model}</td>
                            <td className="text-center">
                              {asset.warrantyStatus ? asset.warrantyStatus : "Not Required"}
                            </td>
                            <td className="text-center">{asset.location}</td>
                            <td className="text-center">
                              {new Date(asset.purchaseDate).toLocaleDateString()}
                            </td>
                            <td className="text-center">
                              <button
                                type="button"
                                className="btn bg-info btn-xs"
                                onClick={() => handleView(asset)}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                type="button"
                                className="btn bg-gradient-danger btn-xs ml-2"
                                onClick={() => handleRemove(asset)}
                              >
                                <i className="fas fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                        : ""}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {previewIndex !== null && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: "600px" }}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Preview Image</h5>
                <button
                  type="button"
                  className="close"
                  onClick={() => setPreviewIndex(null)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body text-center position-relative">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => setPreviewIndex((prev) => (prev > 0 ? prev - 1 : prev))}
                  hidden={previewIndex === 0}
                  style={{
                    position: "absolute",
                    left: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    padding: "5px 10px",
                    fontSize: "20px",
                    borderRadius: "50%",
                  }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div
                  style={{
                    maxWidth: "100%",
                    maxHeight: "400px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={
                      mandateAttachmentsFile[previewIndex].fileAdded === "New"
                        ? URL.createObjectURL(mandateAttachmentsFile[previewIndex].selectedFile)
                        : mandateAttachmentsFile[previewIndex].selectedFile
                    }
                    alt="Preview"
                    style={{
                      maxWidth: "90%",
                      maxHeight: "350px",
                      objectFit: "contain",
                      borderRadius: "5px",
                      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
                    }}
                  />
                </div>
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() =>
                    setPreviewIndex((prev) =>
                      prev < mandateAttachmentsFile.length - 1 ? prev + 1 : prev
                    )
                  }
                  hidden={previewIndex === mandateAttachmentsFile.length - 1}
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 10,
                    padding: "5px 10px",
                    fontSize: "20px",
                    borderRadius: "50%",
                  }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        id="confirmCommonModal"
        className="modal fade confirmCommonModal"
        data-backdrop="static"
        tabIndex="-1"
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
                By clicking on Yes Asset will be Deleted. Once you deleted it
                can not be recovered.
              </p>
            </div>
            <div className="modal-footer col-md-12">
              <button className="btn btn-default btn-sm" data-bs-dismiss="modal">
                Cancel
              </button>
              {isLoaderActive ? (
                <PleaseWaitButton className="btn-sm pl-3 pr-3 ml-2 font-weight-medium auth-form-btn" />
              ) : (
                <button
                  className="btn btn-warning btn-sm pl-3 pr-3 ml-2"
                  onClick={(e) => confirmDelete(e)}
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
}

export default AssetMaster;