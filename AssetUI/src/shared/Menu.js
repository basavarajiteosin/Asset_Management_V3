// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import * as $ from "jquery";

// const Menu = () => {
//     const personalInfo = useSelector((state) => state.personalInformationReducer);
//     const [allRoutsList, setAllRoutsList] = useState([]);
//     let navigate = useNavigate();

//     useEffect(() => {
//         setAllRoutsList(personalInfo.menuItemNames)
//     }, []);

//     setTimeout(() => {
//         window.$('[data-widget="treeview"]').Treeview("init");
//     }, 1000);

//     const location = useLocation();

//     const isPathActive = (path) => {
//         return location.pathname === path;
//     };

//     const headerLogoClickHandler = () => {
//         navigate('/main-dashboard');
//     }
//     return (
//         <>
//             <aside className="main-sidebar">
//                 <a href="#" className="brand-link" onClick={(e) => { headerLogoClickHandler() }}>
//                 <img src={require("../assets/images/iteosLogo.png")} alt="Iteos Logo" className="brand-image" />

//                     {/* <span className="brand-text font-weight-light">ITEOS : Team</span> */}
//                 </a>

//                 <div className="sidebar">

//                     {/* <div className="user-panel mt-3 pb-3 mb-3 d-flex">
//                         <div className="image" style={{paddingTop: '10px'}}>
//                             <img src={personalInfo.profilePic == null ? require("../assets/images/user2-160x160.jpg") : personalInfo.profilePic} className="img-circle elevation-2" style={{ height: '2em' }} alt="User Image" />
//                         </div>
//                         <div className="info w-100">
//                             <a href="#" className="d-block">{personalInfo.firstName} {personalInfo.lastName} </a>
//                             <a href="#" style={{fontSize: 'x-small'}} className="d-block">({personalInfo.userRole})</a>
//                         </div>

//                     </div> */}


//                     <nav className="mt-2">
//                         <ul className="nav nav-pills nav-sidebar flex-column text-sm" data-widget="treeview" role="menu" data-accordion="true">
//                             {allRoutsList.length > 0 ?
//                                 allRoutsList.map((routesObj, index) => {
//                                     return (
//                                         <li key={'route_' + (index + 1)} className={isPathActive(routesObj.appRoute) ? 'nav-item active' : 'nav-item'}>
//                                             <Link className={isPathActive(routesObj.appRoute) ? 'nav-link active' : 'nav-link'} to={routesObj.appRoute}>
//                                                 <i className="nav-icon far fa-circle text-danger"></i>
//                                                 <p>{routesObj.appName}</p>
//                                             </Link>
//                                         </li>
//                                     )
//                                 })
//                                 : ""}

//                         </ul>
//                     </nav>
//                 </div>
//             </aside>
//         </>
//     );
// };
// export default Menu;


// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import * as $ from "jquery";

// const Menu = () => {
//     const personalInfo = useSelector((state) => state.personalInformationReducer);
//     const [allRoutsList, setAllRoutsList] = useState([]);
//     let navigate = useNavigate();

//     useEffect(() => {
//         setAllRoutsList(personalInfo.menuItemNames);
//         console.log(personalInfo.menuItemNames)
//     }, []);

//     setTimeout(() => {
//         window.$('[data-widget="treeview"]').Treeview("init");
//     }, 1000);

//     const location = useLocation();

//     const isPathActive = (path) => location.pathname === path;

//     const headerLogoClickHandler = () => navigate('/dashboard');

//     // Function to get the appropriate icon class
//     const getMenuIcon = (menuName) => {
//         switch (menuName) {
//             case "Dashboard":
//                 return "fa fa-th-large"; // Dashboard icon
//             case "Manage Users":
//                 return "fa fa-users"; // User creation icon
//             case "Manage Roles":
//                 return "fa fa-user-shield"; // Settings icon
//             case "A Sales And Marketing":
//                 return "fa fa-cash-register"; // Reports icon
//             case "M Sales And Marketing":
//                 return "fa fa-chart-line"; // Tasks icon
//             case "Manage Assets":
//                 return "fa fa-address-book"; // Tasks icon
//             case "Sales Email Configuration":
//                 return "fa fa-paper-plane"; // Tasks icon
//             case "Manager & Sales Mapping":
//                 return "fa fa-user-tie"; // Tasks icon
//             default:
//                 return "far fa-circle"; // Default circle icon
//         }
//     };

//     return (
//         <aside className="main-sidebar">
//             <a href="#" className="brand-link" onClick={headerLogoClickHandler}>
//                 <img src={require("../assets/images/iteosLogo.png")} alt="Iteos Logo" className="brand-image" />
//             </a>
//             <div className="sidebar">
//                 <nav className="mt-2">
//                     <ul className="nav nav-pills nav-sidebar flex-column text-sm" data-widget="treeview" role="menu" data-accordion="true">
//                         {allRoutsList.length > 0 &&
//                             allRoutsList.map((routesObj, index) => (
//                                 <li key={'route_' + (index + 1)} className={`nav-item ${isPathActive(routesObj.appRoute) ? "active" : ""}`}>
//                                     <Link className={`nav-link ${isPathActive(routesObj.appRoute) ? "active" : ""}`} to={routesObj.appRoute}>
//                                         <i className={`nav-icon ${getMenuIcon(routesObj.appName)}`}></i>
//                                         <p>{routesObj.appName}</p>
//                                     </Link>
//                                 </li>
//                             ))}
//                     </ul>
//                 </nav>
//             </div>
// </aside>
//     ); 
// };

// export default Menu;



import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Menu = () => {
    const personalInfo = useSelector((state) => state.personalInformationReducer);
    const [allRoutsList, setAllRoutsList] = useState([]);
    const [tooltip, setTooltip] = useState({ visible: false, text: "", x: 0, y: 0 });
    let navigate = useNavigate();

    useEffect(() => {
        setAllRoutsList(personalInfo.menuItemNames);
    }, [personalInfo]);

    const location = useLocation();
    const isPathActive = (path) => location.pathname === path;
    const headerLogoClickHandler = () => navigate('/dashboard');

    const getMenuIcon = (menuName) => {
        switch (menuName) {
            case "AMS - Dashboard": return "fa fa-th-large";
            case "Manage Users": return "fa fa-users";
            case "Manage Roles": return "fa fa-user-shield";
            case "Asset Information": return "fa fa-cash-register";
            case "M Sales And Marketing": return "fa fa-chart-line";
            case "Manage Assets": return "fa fa-cubes";
            case "Sales Email Configuration": return "fa fa-paper-plane";
            case "Assets Assignment": return "fa fa-users-cog";
            case "Manage Profile": return "fa fa-user-circle";
            case "Create Ticket": return "fa fa-ticket-alt";
            case "Ticket Dashboard": return "fa fa-clipboard-list";
            case "All Masters": return "fa fa-cogs";
            case "Asset Creation": return "fa fa-plus-square";
            default: return "far fa-circle";
        }
    };


    const showTooltip = (event, text) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setTooltip({
            visible: true,
            text,
            x: rect.right + 10,  // Position tooltip slightly to the right
            y: rect.top + rect.height / 16, // Center vertically
        });
    };

    const hideTooltip = () => setTooltip({ visible: false, text: "", x: 0, y: 0 });

    return (
        <>
            <aside className="main-sidebar">
                {/* <a href="#" className="brand-link" onClick={headerLogoClickHandler}> */}
                <a href="" className="brand-link">
                    <img src="/am/iteoswhitelogo.svg" alt="Iteos Logo" className="brand-image" />
                </a>
                <div className="sidebar">
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column text-sm" data-widget="treeview" role="menu" data-accordion="true">
                            {allRoutsList.length > 0 &&
                                allRoutsList.map((routesObj, index) => (
                                    <li key={'route_' + (index + 1)} className={`nav-item ${isPathActive(routesObj.appRoute) ? "active" : ""}`}>
                                        <Link
                                            className={`nav-link sidebar-hover-effect ${isPathActive(routesObj.appRoute) ? "active" : ""}`}
                                            to={routesObj.appRoute}
                                            onMouseEnter={(e) => showTooltip(e, routesObj.appName)}
                                            onMouseLeave={hideTooltip}
                                        >
                                            <i className={`nav-icon ${getMenuIcon(routesObj.appName)}`}></i>
                                        </Link>
                                    </li>
                                ))}
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Tooltip (renders globally) */}
            {tooltip.visible && (
                <div
                    className="tooltip-text"
                    style={{ top: `${tooltip.y}px`, left: `${tooltip.x}px`, opacity: 1, visibility: "visible" }}
                >
                    {tooltip.text}
                </div>

            )}
        </>
    );
};

export default Menu;
