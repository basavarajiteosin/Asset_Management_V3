import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import PleaseWaitButton from "../../shared/PleaseWaitButton";
import axios from "axios";
import $ from "jquery";

const config = require("../../services/config.json");

function ProductMaster() {
  const inputProductMasterReference = useRef(null);

  const [modeTypes, setModeTypes] = useState([]);
  const [pname, setNewModeType] = useState("");
  const [selectedModeType, setSelectedModeType] = useState(null);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const [error, setError] = useState("");
  const [productDeleteId, setProductDeleteId] = useState("");

  useEffect(() => {
    getModeTypes();
  }, []);

  const addProjectCardHeaderButtonClick = () => {
    $("#listOfProjectsHeaderExpandButtion").click();
  };

  const listOfProjectsHeaderExpandButtionClick = () => {
    $("#AddNewHeaderButton").click();
  };

  const getModeTypes = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.get(config.API_URL +`Masters/GetAllProducts`);
      if (response.data.data.length > 0) {
        setModeTypes(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching mode types:", error);
      toast.error("Failed to fetch mode types.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (pname.trim() === "") {
      // setError("Please enter Product type.");
      toast.error("Enter Product type.", config.tostar_config);
      inputProductMasterReference.current.focus();
      inputProductMasterReference.current.classList.add("is-invalid");
      return;
    }

    try {
      setIsLoaderActive(true);
      let response;
      if (selectedModeType) {
        // Check if the modified data already exists
        const existingProduct = modeTypes.find(
          (product) =>
            product.pId !== selectedModeType.pId &&
            product.pName.toLowerCase() === pname.toLowerCase()
        );
        if (existingProduct) {
          toast.error("Product with this name already exists.", config.tostar_config);
          return; // Stop further execution
        }

        response = await axios.post(config.API_URL +`Masters/UpdateProduct/`,
          { pId: selectedModeType.pId, pname: pname }
        );
        toast.success("Product Successfully Updated.", config.tostar_config);
      } else {
        // Check if the new data already exists
        const existingProduct = modeTypes.find((product) => product === pname);
        if (existingProduct) {
          toast.error("Product with this name already exists.", config.tostar_config);
          return; // Stop further execution
        }

        response = await axios.post(config.API_URL +`Masters/CreateProduct`,
          { pname: pname }
        );
        toast.success("Product Successfully Created.", config.tostar_config);
        listOfProjectsHeaderExpandButtionClick();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      if (response.status === 200) {
        getModeTypes();
        setSelectedModeType(null);
        setNewModeType("");
        setError("");
      }
    } catch (error) {
      console.error("Error adding/updating product type:", error);
      toast.error("Product Already exist", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
  };

  const handleCancelClick = () => {
    setNewModeType("");
    setError("");
    inputProductMasterReference.current.classList.remove("is-invalid");
    listOfProjectsHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleEdit = (modeType) => {
    listOfProjectsHeaderExpandButtionClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setSelectedModeType(modeType);
    setNewModeType(modeType.pName);
  };

  const handleRemove = async (modeType) => {
    setProductDeleteId(modeType.pId);
    window.confirmModalShow();
    // yesConfirmSubmitRequest();
    //  $("#confirmCommonModal").modal("show");
  };

  const yesConfirmSubmitRequest = async () => {
    setIsLoaderActive(true);
    try {
      const response = await axios.post(config.API_URL +`Masters/DeleteProduct/${productDeleteId}`);
      if (response.status === 200) {
        window.confirmModalHide();
        toast.success("Product deleted successfully.", config.tostar_config);
        setProductDeleteId("");
        getModeTypes();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
      // $("#confirmCommonModal").modal("hide");
    }
  };

  return (
    <div>
   

      <section className="content">
       
            
              <div className="card ">
                <div className="card-header">
                  <h3 className="card-title text-sm">Create New Product</h3>
              
                </div>
                <div className="card-body text-sm">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="form-group col-md-4">
                        <label htmlFor="modeTypeInput">
                          Product Type<sup style={{ color: "red" }}>*</sup>
                        </label>
                        <input
                          type="text"
                          name="pname"
                          className="form-control form-control-sm"
                          id="pname"
                          value={pname}
                          ref={inputProductMasterReference}
                          onChange={(e) => setNewModeType(e.target.value)}
                        />
                        {error && <div className="text-danger">{error}</div>}
                      </div>
                      <div className="card-footer col-md-12 d-flex justify-content-end mt-2">
                     
                      
                     <button
                       type="submit"
                       className="custom-success-button mr-2"
                     >
                       Save & Submit
                     </button>
                 
                   <button
                     type="button"
                     className="custom-secondary-button"
                     onClick={handleCancelClick}
                   >
                     Cancel
                   </button>
                 </div>
                    </div>
                    {/* <div className="card-footer text-sm">
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
                    </div> */}
                  </form>
                </div>
              </div>
           
         
          {modeTypes.length > 0 && (
          
                <div className="card ">
                  <div className="card-header">
                    <h3 className="card-title text-sm">
                      Products List ( {modeTypes.length} )
                    </h3>
                    <div className="card-tools">
                      <button
                        type="button"
                        className="btn btn-tool"
                        id="listOfProjectsHeaderExpandButtion"
                        onClick={(e) => {
                          listOfProjectsHeaderExpandButtionClick(e);
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
                  <div className="card-body">
                  <table className="improved-common-table">
                      <thead>
                        <tr>
                          <th >Sr. No.</th>

                          <th>Product Type</th>
                          <th >Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {modeTypes.map((modeType, index) => (
                          <tr key={index}>
                            <td id={modeType.pId} >
                              {index + 1}
                            </td>
                            <td name="pName">{modeType.pName}</td>

                            <td >
                              <button
                                type="button"
                                className="custom-success-button  mr-2"
                                onClick={() => handleEdit(modeType)}
                              >
                                <i className="fas fa-pen"></i>
                              </button>
                              <button
                                type="button"
                                className="custom-primary-button"
                                onClick={() => handleRemove(modeType)}
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
             
          )}
       
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
                By clicking on Yes Product will be deleted it can not be
                recovered.
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
    </div>

    // </div>
  );
}

export default ProductMaster;
