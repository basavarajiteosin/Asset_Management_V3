import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    let isAuthenticated = localStorage.getItem('isUserDataAuthenticated');
    let persist = localStorage.getItem("persist:am_user");
    return isAuthenticated === "true" && persist ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;