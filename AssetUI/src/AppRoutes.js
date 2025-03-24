import React, { Suspense, lazy } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Spinner from "./shared/Spinner";

import Error from "./components/404Error/Error";

const MainDashboard = lazy(() =>
  import("./components/main-dashboard/MainDashboard")
);
const Dashboard = lazy(() => import("./components/dashboard/Dashboard"));
const ManageProjects = lazy(() =>
  import("./components/manage-projects/ManageProjects")
);
const Login = lazy(() => import("./components/login/Login"));
// const ResetPassword = lazy(() => import("./components/login/ResetPassword"));
const ResetPassword = lazy(() => import("./components/ResetPassword/ResetPassword"))

const ProtectedRoute = lazy(() => import("./protectedRoute/ProtectedRoute"));



const UserCreation = lazy(() =>
  import("./components/user-creation/UserCreation")
);

const TicketCreatingPage = lazy(() =>
  import("./components/ticket-creation/TicketCreatingPage")
);
const TicketList = lazy(() =>
  import("./components/ticket-creation/TicketList")
);
const TicketDashboard = lazy(() =>
  import("./components/ticket-creation/TicketDashboard")
);

const ManageRoles = lazy(() => import("./components/manage-roles/ManageRoles"));
const Profile = lazy(() => import("./components/profile/profile"));

const ManagerAndUserMapping = lazy(() =>
  import("./components/manager-user-mapping/ManagerAndUserMapping")
);


const AllMasters = lazy(() => import("./components/master/Masters"));
const NewsAnnouncements = lazy(() =>
  import("./components/news-title-announcement/NewsAnnouncements")
);

const ManageAssets = lazy(() =>
  import("./components/asset-management/manage-assets/ManageAssets")
);
const AssetMaster = lazy(() =>
  import("./components/asset-management/asset-master/AssetMaster")
);
const AssetTypeMaster = lazy(() =>
  import("./components/asset-management/assetType-master/AssetTypeMaster")
);
const HrMasters = lazy(() =>
  import("./components/asset-management/hr-masters/HrMasters")
);
const ModelMaster = lazy(() =>
  import("./components/asset-management/model-master/ModelMaster")
);
const RAMMaster = lazy(() =>
  import("./components/asset-management/ram-master/RAMMaster")
);
const HDDMaster = lazy(() =>
  import("./components/asset-management/hdd-master/HDDMaster")
);
const ProcessorMaster = lazy(() =>
  import("./components/asset-management/processor-master/ProcessorMaster")
);
const OsMaster = lazy(() =>
  import("./components/asset-management/os-master/OsMaster")
);
const WarrantyMaster = lazy(() =>
  import("./components/asset-management/warranty-master/WarrantyMaster")
);
const ChargerMaster = lazy(() =>
  import("./components/asset-management/charger-master/ChargerMaster")
);
const ChargerTypeMaster = lazy(() =>
  import("./components/asset-management/chargerType-master/ChargerTypeMaster")
);
const GenerationMaster = lazy(() =>
  import("./components/asset-management/generation-master/GenerationMaster")
);
const AssetHistory = lazy(() =>
  import("./components/asset-management/asset-history/AssetHistory")
);
const HrDashboard = lazy(() =>
  import("./components/asset-management/hr-dashboard/HrDashboard")
);
const AssetDashboard = lazy(() =>
  import("./components/asset-dashboard/AssetDashboard")
);


const AppRoutes = () => {
  const isUserDataAuthenticated = localStorage.getItem('isUserDataAuthenticated') === "true";

  return (
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* <Route exact path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} /> */}
        <Route path="/" element={isUserDataAuthenticated ? <Navigate to="/asset-dashboard" /> : <Navigate to="/login" />} />
        <Route
          path="/login"
          element={isUserDataAuthenticated ? <Navigate to="/asset-dashboard" /> : <Login />}
        />
        {/* <Route path="/ResetPassword" element={<ResetPassword />} /> */}
        <Route path="/ResetPassword" element={<ResetPassword />} />

        {/* <Route exact path="/" element={<ProtectedRoute />}> */}

        {/* CMR ROUTES */}
        {/* <Route
          path="/admin-sales-and-marketing"
          element={<AdminSalesAndMarketing />}
        />
        <Route
          path="/manager-sales-and-marketing"
          element={<ManagerSalesAndMarketing />}
        />
        <Route
          path="/asset-manager"
          element={<SalesAndMarketingTeamManageContacts />}
        />
        <Route
          path="/asset-manage/create-asset"
          element={<CreateContacts />}
        /> */}
        {/* <Route
          path="/asset-dashboard"
          element={<AssetDashboard />}
        /> */}

        {/* <Route
          path="/sales-email-configuration"
          element={<SalesEmailConfiguration />}
        />
    

        {/* RMS ROUTES */}
        {/* <Route path="/resource-management" element={<ResourceManagement />} /> */}

        {/* All Masters */}
        {/* <Route path="/all-masters" element={<AllMasters />} /> */}
        {/* <Route path="/industry-type" element={<IndustryType />} /> */}
        {/* <Route path="/mode-master" element={<ModeMaster />} /> */}
        {/* <Route path="/company-master" element={<CompanyType />} /> */}
        {/* <Route path="/lead-status-master" element={<LeadStatusMaster />} /> */}
        {/* <Route path="/technology-master" element={<TechnologyMaster />} /> */}
        {/* <Route path="/Product-Master" element={<ProductMaster />} /> */}
        {/* RMS ROUTES */}
        {/* <Route path="/resource-management" element={<ResourceManagement />} /> */}
        {/* <Route path="/hr-dashboard" element={<HrDashboard />} />
        <Route path="/manage-assets" element={<ManageAssets />} /> */}

        <Route element={<ProtectedRoute />}>
          <Route
            path="/asset-dashboard"
            element={<AssetDashboard />}
          />
          <Route path="/tickets" element={<TicketList />} />
          <Route path="/tickets-dashboard" element={<TicketDashboard />} />
          <Route
            path="/tickets/create-new-ticket"
            element={<TicketCreatingPage />}
          />
          <Route path="/create-user" element={<UserCreation />} />
          <Route path="/manage-roles" element={<ManageRoles />} />
          <Route path="/manage-profile" element={<Profile />} />
          <Route path="/all-masters" element={<AllMasters />} />
          <Route path="/hr-dashboard" element={<HrDashboard />} />
          <Route path="/manage-assets" element={<ManageAssets />} />
          <Route path="asset-master" element={<AssetMaster />} />
          <Route path="/asset-history" element={<AssetHistory />} />
        </Route>
        {/* <Route path="/hr-masters" element={<HrMasters />} /> */}
        {/* <Route path="asset-master" element={<AssetMaster />} /> */}
        {/* <Route path="/asset-history" element={<AssetHistory />} /> */}
        {/* <Route path="*" element={<div className="text-center">404 Not Found</div>} />
         */}
        <Route path="/404" element={<Error />} />
        <Route path="*" element={<Navigate to="/404" />} />
        {/* HR Masters */}
        {/* <Route path="/assetType-master" element={<AssetTypeMaster />} />
        <Route path="/model-master" element={<ModelMaster />} />
        <Route path="/processor-master" element={<ProcessorMaster />} />
        <Route path="/generation-master" element={<GenerationMaster />} />
        <Route path="/ram-master" element={<RAMMaster />} />
        <Route path="/hdd-master" element={<HDDMaster />} />
        <Route path="/warranty-master" element={<WarrantyMaster />} />
        <Route path="/os-master" element={<OsMaster />} />
        <Route path="/charger-master" element={<ChargerMaster />} /> */}
        {/* Asset User Routes start */}


        {/* Sales user Routes Ended */}
        {/* </Route> */}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
