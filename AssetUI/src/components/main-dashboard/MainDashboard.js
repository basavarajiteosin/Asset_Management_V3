import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { removeExtraSpaces } from '../../common/textOperations';
import { toast } from 'react-toastify';
import { getFirstTwoLetters } from '../../common/textOperations';
import PleaseWaitButton from '../../shared/PleaseWaitButton';
import { changeApplicationClientIdAndMenuItems } from '../../reduxStorage/personalInformation';
import { useDispatch } from "react-redux";
import axios from 'axios';
import $ from "jquery";
import './MainDashboard.css';
const config = require('../../services/config.json');

const MainDashboard = () => {
  let navigate = useNavigate();
  const personalInfo = useSelector((state) => state.personalInformationReducer);
  const [newsNotifications, setNewsNotifications] = useState([]);
  const [isLoaderActive, setIsLoaderActive] = useState(false);
  const dispatch = useDispatch()

  useEffect(() => {
    window.initScroller();
    getNewsNotifications();
    // console.log("personalInfo --->", personalInfo);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("persist:am_user");
    localStorage.removeItem("isUserDataAuthenticated");
    localStorage.removeItem("user_id");
    localStorage.clear();
    navigate("/");
    // console.log("Logging out...");
  };

  const cardClickHandler = (clientId, isActive) => {
    if (isActive) {
      if (clientId == "crmAuthApp") {
        //if ((personalInfo.department == "Sales and Marketing Team" && (personalInfo.userRole == "Manager" || personalInfo.userRole == "User")) || personalInfo.userRole == "Administrator" || (personalInfo.userRole != "Manager" && personalInfo.userRole != "User" && personalInfo.userRole != "Administrator")) {
        getSidebarMenus(clientId);
        // } else {
        //   toast.warn("You are not authorized person to access this module.", config.tostar_config);
        // }
      } else if (clientId == "pmoAuthApp") {
        // if (personalInfo.department == "Development Team" || ((personalInfo.userRole == "Manager" || personalInfo.userRole == "User") && personalInfo.department != "Sales and Marketing Team") || personalInfo.userRole == "Administrator" || personalInfo.userRole == "HR" || (personalInfo.userRole != "Manager" && personalInfo.userRole != "User" && personalInfo.userRole != "Administrator")) {
        getSidebarMenus(clientId);
        // } else {
        //   toast.warn("You are not authorized person to access this module.", config.tostar_config);
        // }
      } else if (clientId == "rmsAuthApp") {
        // if (personalInfo.userRole == "HR" || personalInfo.userRole == "Administrator" || personalInfo.userRole == "Manager" || (personalInfo.userRole != "Manager" && personalInfo.userRole != "User" && personalInfo.userRole != "Administrator")) {
        getSidebarMenus(clientId);
        // } else {
        //   toast.warn("You are not authorized person to access this module.", config.tostar_config);
        // }
      } else if (clientId == "amsAuthApp") {
        // if (personalInfo.userRole == "HR" || personalInfo.userRole == "Administrator" || personalInfo.userRole == "Manager" || (personalInfo.userRole != "Manager" && personalInfo.userRole != "User" && personalInfo.userRole != "Administrator")) {
        getSidebarMenus(clientId);
        // } else {
        //   toast.warn("You are not authorized person to access this module.", config.tostar_config);
        // }
      }
    } else {
      toast.warn("Comming Soon...This service is launching soon.Currently in in development phase.", config.tostar_config);
    }
  }

  const getSidebarMenus = (clientId) => {
    axios.post(config.API_URL + 'AuthController/GetUserDetailes', {
      "userId": personalInfo.userID,
      "clientId": clientId
    }, {
      headers: config.headers2,
    }).then((response) => {

      if (response.status == 200) {
        if (response.data.success == 'success') {
          // console.log("response.data Menu=========>", response.data.data);
          if (response.data.data.length > 0) {
            let validationBit = true;
            if (response.data.data.length == 1) {
              if (response.data.data[0].appName == "Manage Profile") {
                validationBit = false;
              } else {
                validationBit = true;
              }
            } else {
              validationBit = true;
            }
            if (validationBit) {

              dispatch(changeApplicationClientIdAndMenuItems({
                clientId: clientId,
                menuItemNames: response.data.data
              }));
              setTimeout(() => {
                if (response.data.data.length > 0) {
                  navigate(response.data.data[0].appRoute);
                }
              }, 1000);
            } else {
              toast.warn("You are not authorized person to access this module.", config.tostar_config);
            }
          } else {
            toast.warn("You are not authorized person to access this module.", config.tostar_config);
          }
        } else {
          toast.error(response.data.message, config.tostar_config);
        }
      } else if (response.data.status.status == 500) {
        toast.error("Invalid username or password", config.tostar_config);
      }
    }).catch((error) => {
      toast.error("Please try again later.", config.tostar_config);
    })
  }

  const getNewsNotifications = async () => {
    try {
      setIsLoaderActive(true);
      const response = await axios.get(
        config.API_URL + "EmailCofigureController/GetAllNewsAndNotifications"
      );
      if (response.data.data.length > 0) {
        // console.log("data", response.data.data);
        setNewsNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching Data:", error);
      toast.error("Failed to fetch Data.", config.tostar_config);
    } finally {
      setIsLoaderActive(false);
    }
  };

  return (
    <>
      <div className="wrapper">
        <nav className="navbar navbar-expand navbar-black navbar-dark">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a href="#" className="brand-link">
                <img
                  src={require("../../assets/images/shortLogo.png")}
                  alt="Iteos Logo"
                  className="brand-image"
                />
                <span className="brand-text font-weight-light">ITEOS</span>
              </a>
            </li>
          </ul>
          <marquee attribute_name="attribute_value" style={{ color: 'lightyellow', fontSize: 'small', fontStyle: 'italic', marginLeft: '40px' }}>
            Hello {personalInfo.firstName}, Welcome to ITEOS, Thank you being part of our services.
          </marquee>
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <a
                className="nav-link"
                data-widget="fullscreen"
                href="#"
                role="button"
              >
                <i className="fas fa-expand-arrows-alt"></i>
              </a>
            </li>
            <li className="nav-item dropdown show">
              <a className="nav-link" data-toggle="dropdown" href="#" aria-expanded="true">
                <i className="fas fa-cog"></i>
              </a>
              <div className="dropdown-menu dropdown-menu-sm dropdown-menu-right" style={{ left: 'inherit', right: '0px' }}>
                <a href="#" style={{
                  cursor: "pointer",
                }} className="dropdown-item" onClick={handleLogout}>
                  <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </a>

              </div>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container-fluid myclass" >
        <div className='row ml-5 mr-5 '>
          <div className="col-md-12 mt-4">
            <div className='row'>
              <div className="col-md-8">
                <div className='row' style={{ justifyContent: 'center', alignItems: 'center' }}>
                  <div className="col-md-4">
                    <a href="#" className="card myCard education" onClick={(e) => { cardClickHandler('pmoAuthApp', true) }}>
                      <div className="ribbon-wrapper ribbon-lg">
                        <div className="ribbon bg-info fontSmall">
                          Newly Launch
                        </div>
                      </div>
                      <div className="overlayC"></div>
                      <div className="circle">
                        <svg width="71px" height="76px" viewBox="29 14 71 76" version="1.1" >

                          <desc>Created with Sketch.</desc>
                          <defs></defs>
                          <g id="Group" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(30.000000, 14.000000)">
                            <g id="Group-8" fill="#D98A19">
                              <g id="Group-7">
                                <g id="Group-6">
                                  <path d="M0,0 L0,75.9204805 L69.1511499,75.9204805 L0,0 Z M14.0563973,32.2825679 L42.9457663,63.9991501 L14.2315268,63.9991501 L14.0563973,32.2825679 Z" id="Fill-1"></path>
                                </g>
                              </g>
                            </g>
                            <g id="Group-20" transform="translate(0.000000, 14.114286)" stroke="#FFFFFF" stroke-linecap="square">
                              <path d="M0.419998734,54.9642857 L4.70316223,54.9642857" id="Line"></path>
                              <path d="M0.419998734,50.4404762 L4.70316223,50.4404762" id="Line"></path>
                              <path d="M0.419998734,45.9166667 L4.70316223,45.9166667" id="Line"></path>
                              <path d="M0.419998734,41.3928571 L2.93999114,41.3928571" id="Line"></path>
                              <path d="M0.419998734,36.8690476 L4.70316223,36.8690476" id="Line"></path>
                              <path d="M0.419998734,32.3452381 L4.70316223,32.3452381" id="Line"></path>
                              <path d="M0.419998734,27.8214286 L4.70316223,27.8214286" id="Line"></path>
                              <path d="M0.419998734,23.297619 L2.93999114,23.297619" id="Line"></path>
                              <path d="M0.419998734,18.7738095 L4.70316223,18.7738095" id="Line"></path>
                              <path d="M0.419998734,14.25 L4.70316223,14.25" id="Line"></path>
                              <path d="M0.419998734,9.72619048 L4.70316223,9.72619048" id="Line"></path>
                              <path d="M0.419998734,5.20238095 L2.93999114,5.20238095" id="Line"></path>
                              <path d="M0.419998734,0.678571429 L4.70316223,0.678571429" id="Line"></path>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <p>Project Management <br /> (PMO)</p>
                      <a href="#" className="small-box-footer" style={{ zIndex: '9' }}>Click To Continue <i className="fas fa-arrow-circle-right"></i></a>
                    </a>
                  </div>
                  <div className="col-md-4">
                    <a href="#" className="card myCard credentialing" onClick={(e) => { cardClickHandler('crmAuthApp', true) }}>
                      <div className="ribbon-wrapper ribbon-lg">
                        <div className="ribbon bg-info fontSmall">
                          Newly Launch
                        </div>
                      </div>
                      <div className="overlayC"></div>
                      <div className="circle">
                        <svg width="64px" height="72px" viewBox="27 21 64 72" version="1.1" >

                          <desc>Created with Sketch.</desc>
                          <defs>
                            <polygon id="path-1" points="60.9784821 18.4748913 60.9784821 0.0299638385 0.538377293 0.0299638385 0.538377293 18.4748913"></polygon>
                          </defs>
                          <g id="Group-12" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(27.000000, 21.000000)">
                            <g id="Group-5">
                              <g id="Group-3" transform="translate(2.262327, 21.615176)">
                                <mask id="mask-2" fill="white">
                                  <use xlinkHref="#path-1"></use>
                                </mask>
                                <g id="Clip-2"></g>
                                <path d="M7.17774177,18.4748913 L54.3387782,18.4748913 C57.9910226,18.4748913 60.9789911,15.7266455 60.9789911,12.3681986 L60.9789911,6.13665655 C60.9789911,2.77820965 57.9910226,0.0299638385 54.3387782,0.0299638385 L7.17774177,0.0299638385 C3.52634582,0.0299638385 0.538377293,2.77820965 0.538377293,6.13665655 L0.538377293,12.3681986 C0.538377293,15.7266455 3.52634582,18.4748913 7.17774177,18.4748913" id="Fill-1" fill="#59A785" mask="url(#mask-2)"></path>
                              </g>
                              <polygon id="Fill-4" fill="#FFFFFF" transform="translate(31.785111, 30.877531) rotate(-2.000000) translate(-31.785111, -30.877531) " points="62.0618351 55.9613216 7.2111488 60.3692832 1.50838775 5.79374073 56.3582257 1.38577917"></polygon>
                              <ellipse id="Oval-3" fill="#25D48A" opacity="0.216243004" cx="30.0584472" cy="21.7657707" rx="9.95169733" ry="9.17325562"></ellipse>
                              <g id="Group-4" transform="translate(16.959615, 6.479082)" fill="#54C796">
                                <polygon id="Fill-6" points="10.7955395 21.7823628 0.11873799 11.3001058 4.25482787 7.73131106 11.0226557 14.3753897 27.414824 1.77635684e-15 31.3261391 3.77891399"></polygon>
                              </g>
                              <path d="M4.82347935,67.4368303 L61.2182039,67.4368303 C62.3304205,67.4368303 63.2407243,66.5995595 63.2407243,65.5765753 L63.2407243,31.3865871 C63.2407243,30.3636029 62.3304205,29.5263321 61.2182039,29.5263321 L4.82347935,29.5263321 C3.71126278,29.5263321 2.80095891,30.3636029 2.80095891,31.3865871 L2.80095891,65.5765753 C2.80095891,66.5995595 3.71126278,67.4368303 4.82347935,67.4368303" id="Fill-8" fill="#59B08B"></path>
                              <path d="M33.3338063,67.4368303 L61.2181191,67.4368303 C62.3303356,67.4368303 63.2406395,66.5995595 63.2406395,65.5765753 L63.2406395,31.3865871 C63.2406395,30.3636029 62.3303356,29.5263321 61.2181191,29.5263321 L33.3338063,29.5263321 C32.2215897,29.5263321 31.3112859,30.3636029 31.3112859,31.3865871 L31.3112859,65.5765753 C31.3112859,66.5995595 32.2215897,67.4368303 33.3338063,67.4368303" id="Fill-10" fill="#4FC391"></path>
                              <path d="M29.4284029,33.2640869 C29.4284029,34.2202068 30.2712569,34.9954393 31.3107768,34.9954393 C32.3502968,34.9954393 33.1931508,34.2202068 33.1931508,33.2640869 C33.1931508,32.3079669 32.3502968,31.5327345 31.3107768,31.5327345 C30.2712569,31.5327345 29.4284029,32.3079669 29.4284029,33.2640869" id="Fill-15" fill="#FEFEFE"></path>
                              <path d="M8.45417501,71.5549073 L57.5876779,71.5549073 C60.6969637,71.5549073 63.2412334,69.2147627 63.2412334,66.3549328 L63.2412334,66.3549328 C63.2412334,63.4951029 60.6969637,61.1549584 57.5876779,61.1549584 L8.45417501,61.1549584 C5.34488919,61.1549584 2.80061956,63.4951029 2.80061956,66.3549328 L2.80061956,66.3549328 C2.80061956,69.2147627 5.34488919,71.5549073 8.45417501,71.5549073" id="Fill-12" fill="#5BD6A2"></path>
                            </g>
                          </g>
                        </svg>
                      </div>
                      <p>Customer relationship management (CRM)</p>
                      <a href="#" className="small-box-footer" style={{ zIndex: '9' }}>Click To Continue <i className="fas fa-arrow-circle-right"></i></a>
                    </a>
                  </div>

                  <div className="col-md-4">
                    <a href="#" className="card myCard human-resources inActiveCard" onClick={(e) => { cardClickHandler('pmoAuthAPP', false) }}>
                      <div className="ribbon-wrapper ribbon-lg">
                        <div className="ribbon bg-danger fontSmall">
                          Comming Soon
                        </div>
                      </div>
                      <div className="overlayC"></div>
                      <div className="circle">
                        <svg width="66px" height="77px" viewBox="1855 26 66 77" version="1.1" >

                          <desc>Created with Sketch.</desc>
                          <defs></defs>
                          <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(1855.000000, 26.000000)">
                            <path d="M4.28872448,42.7464904 C4.28872448,39.3309774 5.4159227,33.7621426 6.40576697,30.4912557 C10.5920767,32.1098991 14.3021264,35.1207513 18.69596,35.1207513 C30.993618,35.1207513 42.5761396,28.7162991 49.9992251,17.9014817 C56.8027248,23.8881252 60.8188351,33.0463165 60.8188351,42.7464904 C60.8188351,60.817447 47.6104607,76.6693426 32.5537798,76.6693426 C17.4970989,76.6693426 4.28872448,60.817447 4.28872448,42.7464904" id="Fill-8" fill="#AFCEFF"></path>
                            <path d="M64.3368879,31.1832696 L62.8424171,46.6027478 L60.6432609,46.7824348 L59.8340669,34.6791304 L47.6573402,25.3339478 C44.2906753,34.068487 34.3459503,40.2903304 24.4684093,40.2903304 C17.7559812,40.2903304 10.046244,37.4168 5.80469412,32.8004522 L5.80469412,34.6791304 L5.80469412,46.6027478 L4.28932167,46.6027478 L1.30187314,27.8802435 C1.30187314,20.9790957 3.52342407,15.5432 7.27229127,11.3578087 C13.132229,4.79558261 21.8124018,0.0492173913 30.5672235,0.342852174 C37.4603019,0.569286957 42.6678084,2.72991304 50.8299179,0.342852174 C51.4629405,1.44434783 51.8615656,3.00455652 51.5868577,5.22507826 C51.4629405,6.88316522 51.2106273,7.52302609 50.8299179,8.45067826 C58.685967,14.1977391 64.3368879,20.7073739 64.3368879,31.1832696" id="Fill-10" fill="#3B6CB7"></path>
                            <path d="M58.9405197,54.5582052 C62.0742801,54.8270052 65.3603242,52.60064 65.6350321,49.5386574 C65.772386,48.009127 65.2617876,46.5570226 64.3182257,45.4584487 C63.3761567,44.3613357 62.0205329,43.6162922 60.4529062,43.4818922 L58.9405197,54.5582052 Z" id="Fill-13" fill="#568ADC"></path>
                            <path d="M6.32350389,54.675367 C3.18227865,54.8492104 0.484467804,52.4957496 0.306803449,49.4264626 C0.217224782,47.8925496 0.775598471,46.4579757 1.75200594,45.3886191 C2.7284134,44.3192626 4.10792487,43.6165843 5.67853749,43.530393 L6.32350389,54.675367 Z" id="Fill-15" fill="#568ADC"></path>
                          </g>
                        </svg>
                      </div>
                      <p>Human Resources Portal<br /> (HR)</p>
                      {/* <a href="#" className="small-box-footer" style={{ zIndex: '9' }}>More info <i className="fas fa-arrow-circle-right"></i></a> */}
                    </a>
                  </div>
                  <div className="col-md-4">
                    <a href="#" className="card myCard credentialing" onClick={(e) => { cardClickHandler('amsAuthApp', true) }}>
                      <div className="ribbon-wrapper ribbon-lg">
                        <div className="ribbon bg-info fontSmall">
                          Newly Launch
                        </div>
                      </div>
                      <div className="overlayC"></div>
                      <div className="circle">
                        <svg viewBox="0 0 64 64" width="66px" height="77px" version="1.1" ><path fill="#ffa88a" d="M59.42,20.24l-7.57,9L38.67,45,31,48.28,33,40.18,48.75,21.36l5-5.91a2.48,2.48,0,0,1,3.5-.3l1.9,1.59A2.49,2.49,0,0,1,59.42,20.24Z"></path><path fill="#fff" d="M46,11.83V59a2,2,0,0,1-2,2H6a2,2,0,0,1-2-2V5A2,2,0,0,1,6,3H37.17a2,2,0,0,1,1.42.59l6.82,6.82A2,2,0,0,1,46,11.83Z"></path><path fill="#e6e6e6" d="M46 20V40.9l-5.49 6.54L30.39 51.83a2 2 0 0 1-2.74-2.3l2.56-10.74zM46 11.83V14H37a2 2 0 0 1-2-2V3h2.17a2 2 0 0 1 1.42.59l6.82 6.82A2 2 0 0 1 46 11.83z"></path><path fill="#fd9467" d="M51.85,29.26,38.67,45,31,48.28,33,40.18,48.75,21.36A17.26,17.26,0,0,1,51.85,29.26Z"></path><polygon fill="#61c3b6" points="38 3 38 11 46 11 38 3"></polygon><path fill="#61c3b6" d="M59.42 20.24L57 23.09l-5.7-4.79 2.39-2.85a2.48 2.48 0 0 1 3.5-.3l1.9 1.59A2.49 2.49 0 0 1 59.42 20.24zM22 14H33a1 1 0 0 0 0-2H22a1 1 0 0 0 0 2zM21 26H39a1 1 0 0 0 0-2H21a1 1 0 0 0 0 2z"></path><path fill="#fd9467" d="M29,37a1,1,0,0,0-1-1H21a1,1,0,0,0,0,2h7A1,1,0,0,0,29,37Z"></path><path fill="#61c3b6" d="M17,33H11a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V34A1,1,0,0,0,17,33Zm-1,6H12V35h4Z"></path><path fill="#fd9467" d="M25,48H21a1,1,0,0,0,0,2h4a1,1,0,0,0,0-2Z"></path><path fill="#61c3b6" d="M17,45H11a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h6a1,1,0,0,0,1-1V46A1,1,0,0,0,17,45Zm-1,6H12V47h4Z"></path><path fill="#fd9467" d="M13.29 28.71A1 1 0 0 0 14 29h.16a1 1 0 0 0 .73-.54l3-6a1 1 0 1 0-1.78-.9l-2.38 4.76-2-2a1 1 0 0 0-1.42 1.42zM13.29 16.71A1 1 0 0 0 14 17h.16a1 1 0 0 0 .73-.54l3-6a1 1 0 1 0-1.78-.9l-2.38 4.76-2-2a1 1 0 0 0-1.42 1.42z"></path><polygon fill="#fff" points="38.67 44.97 31.03 48.28 32.96 40.18 38.67 44.97"></polygon><path fill="#4e5b5f" d="M61,18.34A3.43,3.43,0,0,0,59.76,16l-1.91-1.6a3.48,3.48,0,0,0-4.9.43l-2.4,2.85h0L47,21.9V11.83a3,3,0,0,0-.88-2.12L39.29,2.88A3,3,0,0,0,37.17,2H6A3,3,0,0,0,3,5V59a3,3,0,0,0,3,3H44a3,3,0,0,0,3-3V36.6L60.19,20.88A3.48,3.48,0,0,0,61,18.34ZM39,5.41,43.59,10H39ZM45,59a1,1,0,0,1-1,1H6a1,1,0,0,1-1-1V5A1,1,0,0,1,6,4H37v7a1,1,0,0,0,1,1h7V24a1,1,0,0,0,0,.23L32.2,39.54a.93.93,0,0,0-.2.38s0,0,0,0l-1.93,8.1a1,1,0,0,0,.33,1,1,1,0,0,0,.64.24,1.14,1.14,0,0,0,.4-.08l7.64-3.32h0a1,1,0,0,0,.36-.27L45,39ZM33.56,42l3.23,2.71-4.32,1.88Zm5,1.58-4.18-3.5L51.44,19.71l4.18,3.51Zm20.1-24L56.9,21.68l-4.17-3.5,1.75-2.09a1.49,1.49,0,0,1,2.09-.18l1.9,1.6a1.49,1.49,0,0,1,.18,2.09Z"></path></svg>
                      </div>
                      <p>Asset Management System (AMS)</p>
                      <a href="#" className="small-box-footer" style={{ zIndex: '9' }}>Click To Continue <i className="fas fa-arrow-circle-right"></i></a>
                    </a>
                  </div>
                  <div className="col-md-4">
                    <a href="#" className="card myCard human-resources" onClick={(e) => { cardClickHandler('rmsAuthApp', true) }}>
                      <div className="ribbon-wrapper ribbon-lg">
                        <div className="ribbon bg-info fontSmall">
                          Newly Launch
                        </div>
                      </div>
                      <div className="overlayC"></div>
                      <div className="circle">
                        <svg viewBox="0 0 130 130" width="66px" height="77px"><circle cx="65" cy="65" r="64" fill="#569cd6" transform="rotate(-9.22 64.975 64.967)"></circle><path fill="#305166" d="M76.51,68.42V66.56l-2.1-.26a7,7,0,0,0-1.2-2.9l1.3-1.67-1.32-1.31-1.67,1.3a7,7,0,0,0-2.89-1.2l-.26-2.1H66.51l-.27,2.1a7.06,7.06,0,0,0-2.89,1.2l-1.67-1.3-1.31,1.31,1.3,1.67a7,7,0,0,0-1.2,2.9l-2.1.26v1.86l2.1.26a7,7,0,0,0,1.2,2.89l-1.3,1.67,1.31,1.32,1.67-1.3a7.19,7.19,0,0,0,2.89,1.2l.27,2.1h1.86l.26-2.1a7.14,7.14,0,0,0,2.89-1.2l1.67,1.3,1.32-1.32-1.3-1.67a7,7,0,0,0,1.2-2.89ZM67.44,71a3.49,3.49,0,1,1,3.48-3.48A3.48,3.48,0,0,1,67.44,71Z"></path><rect width="7.75" height="8.36" x="83.11" y="73.49" fill="#fcbd88"></rect><path fill="#d5d6db" d="M102.55,85.15a4.2,4.2,0,0,0-3-3.41,19.88,19.88,0,0,1-5.21-2.19h0a7.59,7.59,0,0,1-2.62-2.27s0,.56-.12,1.51l-.8-.9L87,80.16l-2.15-.61-2.44-.69c-.09-1-.13-1.63-.13-1.63a7.87,7.87,0,0,1-2.64,2.32h0a20,20,0,0,1-5.22,2.19,4.22,4.22,0,0,0-3,3.41c-.34,2.31-.82,5.86-1.24,9.66a.62.62,0,0,0,.62.69h32.38a.62.62,0,0,0,.62-.69C103.38,91,102.89,87.46,102.55,85.15Z"></path><polygon fill="#27a2db" points="85.36 95.5 88.63 95.5 87.66 84.04 89.47 80.97 87.64 80.28 85.77 79.95 84.32 81.51 86.13 84.13 85.36 95.5"></polygon><polygon fill="#e1e6e9" points="93.07 78.78 90.86 75.75 86.99 80.1 83.11 75.76 80.85 78.7 83.44 83.28 86.98 80.16 90.6 83.63 93.07 78.78"></polygon><path fill="#fcbd88" d="M94.17 67a.87.87 0 0 0-.47-.47.75.75 0 0 0-.68.09.77.77 0 0 0-.32.6l-.35 2.18a1 1 0 0 0 .11.59c0 .08-.07.26 0 .31.77.57 1-.35 1.09-.56A5.47 5.47 0 0 1 94.15 68a1.12 1.12 0 0 0 .1-.31A1.18 1.18 0 0 0 94.17 67zM79.79 67a.85.85 0 0 1 .48-.47.73.73 0 0 1 .67.09.72.72 0 0 1 .32.6l.36 2.18a1 1 0 0 1-.12.59c0 .08.08.26 0 .31-.78.57-1.06-.35-1.09-.56a5.69 5.69 0 0 0-.6-1.76 1.58 1.58 0 0 1-.09-.31A1.18 1.18 0 0 1 79.79 67z"></path><path fill="#fcbd88" d="M93,65.53l-.67-5.23L87,58.53l-5.33,2.93-.73,4.07a18.56,18.56,0,0,0,.66,6.4,8.35,8.35,0,0,0,2.6,3.39,4.45,4.45,0,0,0,5.6,0,8.26,8.26,0,0,0,2.6-3.39A18.68,18.68,0,0,0,93,65.53Z"></path><path fill="#eda977" d="M92.36,71.93a8.26,8.26,0,0,1-2.6,3.39,4.45,4.45,0,0,1-5.6,0c-.27-.22-.55-.48-.84-.76l.05,0a4.45,4.45,0,0,0,5.6,0,8.35,8.35,0,0,0,2.6-3.39,18.56,18.56,0,0,0,.66-6.4l-.6-4.75.73.24L93,65.53A18.56,18.56,0,0,1,92.36,71.93Z" opacity=".5"></path><path fill="#253e4c" d="M92.25,59.65c-1.08-1.65-3.76-2.36-7.43-1.86-2.58.34-2.45,2.31-2.45,2.31-2.16-.23-2.45,2.87-2.26,4.72a24.85,24.85,0,0,0,1,4.24h.61c0-.44-.19-2.44-.3-4a3.93,3.93,0,0,1,1.66-3.28s.83,2.28,5.63,1.91a6.37,6.37,0,0,1-2.86-1.46c1,0,1.92-.23,2.52-.25,1.11,0,2.31-.2,3.17,1.38s.66,5.13.63,5.65h.62c.1-.38.65-2.53,1-4.65C94.15,62.09,93.32,61.3,92.25,59.65Z"></path><path fill="#305166" d="M93.79,64.39c-.24,1.48-.59,3-.81,3.88.17-.78.34-1.7.48-2.61.37-2.33-.68-2.72-1.71-4.36S89.54,59.56,86,60.06c-2.46.34-.59,2.94-.59,2.94-1.39-.41-1.91-1.85-2.59-1.77,0,0-2.64,1.05-2.41,4.84a11.77,11.77,0,0,0,.28,1.68,20.15,20.15,0,0,1-.6-2.94c-.19-1.86.1-5,2.26-4.73,0,0-.13-2,2.45-2.31,3.67-.5,6.35.21,7.43,1.86S94.17,62.07,93.79,64.39Z"></path><rect width="7.75" height="8.36" x="42.47" y="73.79" fill="#fcbd88"></rect><path fill="#d5d6db" d="M61.91,85.45a4.2,4.2,0,0,0-3-3.41,19.88,19.88,0,0,1-5.21-2.19h0a7.59,7.59,0,0,1-2.62-2.27s0,.55-.12,1.51l-.8-.91-3.83,2.28-2.15-.61-2.44-.69c-.09-1-.13-1.64-.13-1.64A7.79,7.79,0,0,1,39,79.85h0A20,20,0,0,1,33.76,82a4.22,4.22,0,0,0-3,3.41c-.33,2.24-.8,5.67-1.2,9.36a.62.62,0,0,0,.62.69H62.5a.62.62,0,0,0,.62-.69C62.71,91.12,62.24,87.69,61.91,85.45Z"></path><polygon fill="#44c4a1" points="44.74 95.5 47.97 95.5 47.02 84.34 48.83 81.27 47 80.58 45.13 80.25 43.68 81.81 45.49 84.42 44.74 95.5"></polygon><polygon fill="#e1e6e9" points="52.43 79.08 50.22 76.04 46.35 80.4 42.47 76.06 40.21 79 42.8 83.58 46.34 80.46 49.96 83.92 52.43 79.08"></polygon><path fill="#fcbd88" d="M53.58 67.38a.85.85 0 0 0-.48-.47.75.75 0 0 0-.68.09.74.74 0 0 0-.32.6l-.36 2.2a1 1 0 0 0 .11.59c0 .09-.07.26 0 .32.78.56 1.07-.36 1.1-.57a5.19 5.19 0 0 1 .6-1.77 1.81 1.81 0 0 0 .09-.31A1.21 1.21 0 0 0 53.58 67.38zM39.11 67.38a.85.85 0 0 1 .48-.47.73.73 0 0 1 .67.09.75.75 0 0 1 .33.6l.35 2.2a1 1 0 0 1-.11.59c0 .09.07.26 0 .32-.78.56-1.06-.36-1.09-.57a5.67 5.67 0 0 0-.6-1.77 1.24 1.24 0 0 1-.1-.31A1.21 1.21 0 0 1 39.11 67.38z"></path><path fill="#fcbd88" d="M52.42,65.88l-.66-5.26-5.44-1.78L41,61.79l-.74,4.09a18.64,18.64,0,0,0,.67,6.44,8.22,8.22,0,0,0,2.62,3.41,4.46,4.46,0,0,0,5.63,0,8.39,8.39,0,0,0,2.62-3.41A18.79,18.79,0,0,0,52.42,65.88Z"></path><path fill="#305166" d="M40.41,69.43H41c0-.44-.18-2.45-.3-4a4,4,0,0,1,1.67-3.31c2.11.88,4.21.23,5.33.2s2.33-.2,3.19,1.39.66,5.16.64,5.68h.62c.09-.37.65-2.54,1-4.67.38-2.34-.45-3.14-1.53-4.79s-3.78-2.38-7.47-1.88c-2.6.35-2.47,2.33-2.47,2.33-2.17-.23-2.46,2.89-2.27,4.75A25.18,25.18,0,0,0,40.41,69.43Z"></path><path fill="#253e4c" d="M51.57,67.85a11,11,0,0,0-.66-4.1c-.86-1.59-2.08-1.42-3.19-1.39s-3.22.68-5.33-.2a4.12,4.12,0,0,0-1.65,2.66c0-.07,0-.14,0-.2a4,4,0,0,1,1.67-3.31c2.11.89,4.21.23,5.33.21s2.33-.21,3.19,1.39C51.53,64.07,51.59,66.56,51.57,67.85Z"></path><path fill="#305166" d="M51.55,69.26l-1.23,2.9-1.84-1.07a2,2,0,0,0-1-.27H45.08a2,2,0,0,0-1,.27l-1.84,1.07L41,69.42l-.67-.19A23.78,23.78,0,0,0,41,73.32a4.69,4.69,0,0,0,1.2,2.18,13.31,13.31,0,0,0,2.56,2,2.92,2.92,0,0,0,3.08,0,13.27,13.27,0,0,0,2.58-2.06,5,5,0,0,0,1.22-2.21,19.81,19.81,0,0,0,.64-4.16Z"></path><path fill="#253e4c" d="M52.15,70.44a21.07,21.07,0,0,1-.54,2.83,4.91,4.91,0,0,1-1.18,2.17,13.35,13.35,0,0,1-2.62,2.1,2.92,2.92,0,0,1-3.08,0,13.65,13.65,0,0,1-2.5-2A4.89,4.89,0,0,1,41,73.32a23.16,23.16,0,0,1-.49-2.72c.09.47.19.94.3,1.4a4.78,4.78,0,0,0,1.31,2.25,14.17,14.17,0,0,0,2.59,2,3.15,3.15,0,0,0,3.18,0,13.34,13.34,0,0,0,2.72-2.11A4.72,4.72,0,0,0,51.8,72C51.93,71.46,52.05,71,52.15,70.44Z"></path><rect width="7.75" height="8.36" x="62.8" y="32.19" fill="#fcbd88"></rect><path fill="#d5d6db" d="M82.25,43.84a4.2,4.2,0,0,0-3-3.4A20.29,20.29,0,0,1,74,38.25h0A7.69,7.69,0,0,1,71.42,36s0,.56-.12,1.52l-.8-.91-3.82,2.28-2.16-.61-2.43-.7c-.1-1-.13-1.63-.13-1.63a7.74,7.74,0,0,1-2.65,2.33h0a20.07,20.07,0,0,1-5.21,2.19,4.2,4.2,0,0,0-3,3.4c-.34,2.31-.83,5.86-1.24,9.66a.63.63,0,0,0,.62.7H82.87a.63.63,0,0,0,.62-.7C83.08,49.7,82.59,46.15,82.25,43.84Z"></path><polygon fill="#e55e5e" points="65.06 54.2 68.33 54.2 67.36 42.74 69.17 39.66 67.34 38.98 65.46 38.65 64.01 40.21 65.83 42.82 65.06 54.2"></polygon><polygon fill="#e1e6e9" points="72.77 37.47 70.55 34.44 66.69 38.8 62.8 34.46 60.55 37.4 63.14 41.98 66.68 38.86 70.3 42.32 72.77 37.47"></polygon><path fill="#fcbd88" d="M72.9 24.82a.76.76 0 0 1 1-.7.87.87 0 0 1 .5.48 1.25 1.25 0 0 1 .07.69 1.68 1.68 0 0 1-.09.32 5.73 5.73 0 0 0-.62 1.82c0 .21-.32 1.15-1.12.58-.08-.06 0-.24 0-.33a1 1 0 0 1-.12-.61zM60.45 24.69a.77.77 0 0 0-.32-.62.79.79 0 0 0-.7-.09.87.87 0 0 0-.49.49 1.25 1.25 0 0 0-.07.69.9.9 0 0 0 .09.32 5.65 5.65 0 0 1 .62 1.81c0 .21.38 1.15 1.18.57a.53.53 0 0 0 .17-.24c.09-.18-.07-.47-.11-.68z"></path><path fill="#fcbd88" d="M72.93,23.84l-.69-5.38-5.56-1.83-5.57,1.83-.68,5.38a19.39,19.39,0,0,0,.68,6.6,8.55,8.55,0,0,0,2.69,3.49,4.58,4.58,0,0,0,5.76,0,8.45,8.45,0,0,0,2.68-3.49A19.24,19.24,0,0,0,72.93,23.84Z"></path><path fill="#eda977" d="M72.71,22.13h-.56l.12.91a19.41,19.41,0,0,1-.68,6.6,8.62,8.62,0,0,1-2.69,3.49,4.58,4.58,0,0,1-5.76,0A10,10,0,0,1,62,32a10.47,10.47,0,0,0,1.82,1.91,4.61,4.61,0,0,0,2.89,1,4.56,4.56,0,0,0,2.88-1,8.53,8.53,0,0,0,2.68-3.49,19.25,19.25,0,0,0,.69-6.6Z"></path><path fill="#305166" d="M60.53,27.57l.73-.09c0-.46-.2-2.52-.31-4.06A4,4,0,0,1,62.66,20c2.15.91,4.31.24,5.45.21s2.38-.21,3.26,1.42.68,5.29.66,5.82h.82c.1-.39.48-2.61.84-4.79.39-2.39-.46-3.21-1.57-4.91s-3.86-2.42-7.65-1.91c-2.66.35-2.52,2.38-2.52,2.38-2.23-.24-2.53,3-2.33,4.87A29.31,29.31,0,0,0,60.53,27.57Z"></path><path fill="#2b4959" d="M72.05,25.78a10.79,10.79,0,0,0-.68-4.12c-.88-1.63-2.12-1.45-3.26-1.42s-3.3.7-5.45-.21A4.26,4.26,0,0,0,61,22.67c0-.12,0-.23,0-.34a4,4,0,0,1,1.71-3.39c2.15.91,4.3.24,5.45.21s2.38-.21,3.26,1.42C72,21.8,72.07,24.52,72.05,25.78Z"></path><path fill="#305166" d="M72.05 26.39h0c0-.1 0-.3 0-.58zM94.3 43.57l1-2.24-8.2 1 4.65 7.22.9-2.07c9.1 3.83 5.55 13 5.55 13C104.47 48.85 97.13 44.69 94.3 43.57zM31.92 52.19l-2.43-.1L33.3 59.4l5.08-6.92-2.25-.1c.33-9.87 10.12-9.82 10.12-9.82C33.21 40.8 32 49.14 31.92 52.19z"></path></svg>
                      </div>
                      <p>Resource Management<br /> (RM)</p>
                      <a href="#" className="small-box-footer" style={{ zIndex: '9' }}>Click To Continue <i className="fas fa-arrow-circle-right"></i></a>
                    </a>
                  </div>
                  <div className="col-md-4">
                    <a href="#" className="card myCard wallet inActiveCard" onClick={(e) => { cardClickHandler('pmoAuthAPP', false) }}>
                      <div className="ribbon-wrapper ribbon-lg">
                        <div className="ribbon bg-danger fontSmall">
                          Comming Soon
                        </div>
                      </div>
                      <div className="overlayC"></div>
                      <div className="circle">
                        <svg width="100" height="100" id="web"><path fill="#8fb6d7" d="M45.996 65.001h36.5c1.385 0 2.5-1.115 2.5-2.5s-1.115-2.5-2.5-2.5h-2a2.495 2.495 0 0 1-2.5-2.5c0-1.385 1.115-2.5 2.5-2.5h6c1.385 0 2.5-1.115 2.5-2.5s-1.115-2.5-2.5-2.5h-9a2.495 2.495 0 0 1-2.5-2.5c0-1.385 1.115-2.5 2.5-2.5h3.5v-.05c1.144-.231 2-1.236 2-2.45a2.492 2.492 0 0 0-2-2.45v-.05h-35zm48.5-15a2.495 2.495 0 0 0-2.5 2.5c0 1.385 1.115 2.5 2.5 2.5h1c1.385 0 2.5-1.115 2.5-2.5s-1.115-2.5-2.5-2.5z"></path><path fill="#ee7581" d="M11.496 40.001a2.495 2.495 0 0 0-2.5 2.5c0 1.385 1.115 2.5 2.5 2.5h2.5v.051c1.144.23 2 1.236 2 2.45a2.492 2.492 0 0 1-2 2.449V50h-10.5a2.495 2.495 0 0 0-2.5 2.5c0 1.386 1.115 2.5 2.5 2.5h16c1.385 0 2.5 1.116 2.5 2.5 0 1.386-1.115 2.5-2.5 2.5h-3a2.495 2.495 0 0 0-2.5 2.5c0 1.386 1.115 2.5 2.5 2.5h29.5v-25h-32zm-4 20a2.495 2.495 0 0 0-2.5 2.5c0 1.385 1.115 2.5 2.5 2.5h1c1.385 0 2.5-1.115 2.5-2.5s-1.115-2.5-2.5-2.5z"></path><path fill="none" stroke="#105286" stroke-linecap="round" stroke-linejoin="round" d="M2.996 67.501h11.438m6.7 0h77.362m-81.035 0h1.14"></path><g transform="translate(-757.371 -1241.866)"><path fill="#f0f4f7" fill-rule="evenodd" stroke="#105286" d="M787.12 1306.69v-26.527c0-.995.799-1.796 1.791-1.796h39.417c.993 0 1.792.8 1.792 1.796v26.528z"></path><path fill="#406b95" stroke="#105286" stroke-linejoin="round" d="M833.12 1304.396a4.961 4.961 0 0 1-4.973 4.971h-39.054a4.961 4.961 0 0 1-4.973-4.971z"></path><path fill="#8fb6d7" stroke="#105286" d="M804.12 1304.396h9v1.327c0 .735-.573 1.327-1.286 1.327h-6.428c-.712 0-1.286-.592-1.286-1.327z"></path><path fill="#d2dce9" d="M818.557 1301.618H789.87v-20.505h37.5v20.505h-3.438"></path><path fill="none" stroke="#105286" stroke-linejoin="round" stroke-width=".5" d="M798.37 1301.618h-8.5v-20.505h37.5v20.505h-18.125"></path><rect width="28" height="17" x="791.62" y="1282.867" fill="#f0f4f7" rx="1" ry="1"></rect><g stroke="#105286" stroke-linecap="round" stroke-linejoin="round" transform="translate(774.62 244.505)"><rect width="3" height="4" x="19.5" y="1046.862" fill="#2dbca4" rx="0" ry="0"></rect><rect width="3" height="4" x="11.5" y="1046.862" fill="#2dbca4" rx="0" ry="0"></rect><rect width="17" height="5" x="8.5" y="1052.862" fill="#2dbca4" rx="0" ry="0"></rect><rect width="11" height="3" x="11" y="1058.862" fill="#2dbca4" rx="0" ry="0"></rect><g fill="#2dbca4"><rect width="10" height="3" x="5.5" y="1068.862" rx=".5" ry=".5"></rect><rect width="10" height="3" x="18.5" y="1068.862" rx=".5" ry=".5"></rect></g><path fill="#2dbca4" d="M7 1057.862h7l.5 11h-8zm13 0h7l.5 11h-8z"></path><rect width="9" height="5" x="12.5" y="1054.862" fill="#2dbca4" rx="2.5" ry="2.5"></rect><circle cx="15" cy="1057.362" r=".5" fill="#70979c"></circle><circle cx="19" cy="1057.362" r=".5" fill="#70979c"></circle><rect width="5" height="4" x="10.5" y="1048.862" fill="#2dbca4" rx="0" ry="0"></rect><rect width="5" height="4" x="18.5" y="1048.862" fill="#2dbca4" rx="0" ry="0"></rect></g><path fill="#105286" d="M792.62 1282.867h26c.554 0 1 .446 1 1v2h-28v-2c0-.554.446-1 1-1z"></path><circle cx="793.12" cy="1284.367" r=".5" fill="#e6dfd2"></circle><circle cx="795.12" cy="1284.367" r=".5" fill="#eb8e68"></circle><circle cx="797.12" cy="1284.367" r=".5" fill="#2dbca4"></circle><path fill="#ee7581" stroke="#105286" stroke-linecap="round" stroke-linejoin="round" d="M818.12 1269.357h18c.554 0 1 .446 1 1v23c0 .554-.446 1-1 1h-18c-.554 0-1-.446-1-1v-23c0-.554.446-1 1-1z"></path><path fill="#fff" d="M819.65 1291.112h12.184l3.536-3.533v-16.794c0-.653-.526-1.178-1.179-1.178H820.05c-.653 0-1.179.525-1.179 1.178v19.084c0 .652.137 1.137.78 1.243z"></path><path fill="none" stroke="#105286" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5" d="M818.87 1287.717v2.208c0 .652.526 1.177 1.179 1.177h11.785l3.536-3.532v-16.785c0-.653-.526-1.178-1.179-1.178H820.05c-.653 0-1.179.525-1.179 1.178v14.914"></path><path fill="#105286" stroke="#105286" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5" d="m831.834 1291.102 3.536-3.532h-2.357c-1.179 0-1.179 1.164-1.179 1.164z"></path><rect width="8" height="3.01" x="823.12" y="1268.357" fill="#70979c" stroke="#105286" stroke-linecap="round" stroke-linejoin="round" rx=".5" ry="0"></rect><path fill="#fff" stroke="#105286" stroke-linecap="round" stroke-linejoin="round" stroke-width=".5" d="M830.865 1275.862h2.024a.48.48 0 0 1 .481.481v9.289a.48.48 0 0 1-.48.48h-11.54a.48.48 0 0 1-.48-.48v-9.289a.48.48 0 0 1 .48-.48h8.029"></path><path fill="none" stroke="#2dbca4" stroke-linecap="round" stroke-linejoin="round" d="m822.625 1277.751.571.61 1.419-.994m-1.99 3.384.571.61 1.419-.994m-1.99 3.384.571.61 1.419-.994m1.998-5.005h5m-5 3h5m-5 3h5"></path><g transform="rotate(-90 562.59 756.156)"><path fill="#ee7581" d="m12.217 1016.881-2.36 1.361-1.478.852-1.253.723-1.064.613-2.043 1.178a1.535 1.535 0 0 0-.564 2.103c.426.738 1.365.99 2.105.564l8.198-4.728"></path><path fill="#2dbca4" stroke="#105286" stroke-linejoin="round" d="M-890.77 493.874h4.409v4.912h-4.409z" transform="matrix(-.50047 -.86575 -.8663 .49953 0 0)"></path><path fill="#2dbca4" d="M27.255 1005.361a8.366 8.356.925 0 0-8.536-.099 8.366 8.356.925 0 0-3.061 11.414 8.366 8.356.925 0 0 11.427 3.058 8.366 8.356.925 0 0 3.062-11.414 8.366 8.356.925 0 0-2.892-2.958zm-.802 1.316a6.825 6.817.925 0 1 2.36 2.412 6.825 6.817.925 0 1-2.498 9.312 6.825 6.817.925 0 1-9.324-2.496 6.825 6.817.925 0 1 2.5-9.311 6.825 6.817.925 0 1 6.962.083z"></path><path fill="none" stroke="#105286" stroke-linejoin="round" stroke-width=".5" d="M-881.747 486.9a6.819 6.823 0 0 1-5.97 6.77 6.819 6.823 0 0 1-7.456-5.082 6.819 6.823 0 0 1 4.111-8.037 6.819 6.823 0 0 1 8.481 3.08" transform="matrix(-.50047 -.86575 -.8663 .49953 0 0)"></path><path fill="none" stroke="#105286" stroke-linejoin="round" stroke-width=".5" d="m12.217 1016.881-2.36 1.361m-1.478.852-.462.266m-.521.3-.27.157-1.064.613-2.043 1.179a1.535 1.535 0 0 0-.564 2.102c.426.738 1.365.99 2.105.564l8.198-4.728"></path><ellipse cx="-888.566" cy="486.901" fill="none" stroke="#105286" stroke-linejoin="round" rx="8.359" ry="8.363" transform="matrix(-.50047 -.86575 -.8663 .49953 0 0)"></ellipse></g></g></svg>
                      </div>
                      <p>Content Management System (CMS)</p>
                      {/* <a href="#" className="small-box-footer" style={{ zIndex: '9' }}>More info <i className="fas fa-arrow-circle-right"></i></a> */}
                    </a>
                  </div>
                </div>

              </div>
              <div className="col-md-4">
                <div className='row'>
                  <figure className="snip1253" style={{ marginLeft: '43px', marginTop: '0px' }}>
                    <figcaption style={{ background: 'rgb(201 216 155)', textAlign: 'center' }}>
                      <h6 style={{ marginLeft: '0px', minHeight: '10px', marginBottom: '0px', textTransform: 'capitalize' }}>News, Notice & Announcement</h6>
                    </figcaption>
                  </figure>
                  <div className="">
                    <div className="">
                      <div className="marquee">
                        <div className="marquee-content-wrapper">
                          {newsNotifications.map((notification, index) => (
                            <ul className="marquee-content" key={index}>
                              <li>
                                <figure className="snip1253">
                                  <figcaption>
                                    <div className="date">
                                      <span className="day">
                                        {new Date(notification.nDate)
                                          .getDate()
                                          .toString()
                                          .padStart(2, "0")}
                                      </span>{" "}
                                      <span className="month">
                                        {new Date(
                                          notification.nDate
                                        ).toLocaleString("default", {
                                          month: "long",
                                        })}
                                      </span>
                                    </div>
                                    <h6>{notification.nTital}</h6>
                                    <p>
                                      {notification.nDescription.split(".")
                                        .map((sentence, idx, array) => (
                                          <React.Fragment key={idx}>
                                            {sentence.trim()}
                                            {idx < array.length - 1 && "."}
                                            {idx < array.length - 1 &&
                                              (idx + 1) % 2 === 0 && (
                                                <React.Fragment>
                                                  <br />
                                                  <br />
                                                </React.Fragment>
                                              )}
                                          </React.Fragment>
                                        ))}
                                    </p>
                                  </figcaption>
                                </figure>
                              </li>
                            </ul>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>

  );
}

export default MainDashboard;
