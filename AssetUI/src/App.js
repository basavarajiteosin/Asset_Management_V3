import React, { useState, useEffect } from "react";
import AppRoutes from "./AppRoutes";
import { useLocation } from "react-router-dom";
import { Provider } from "react-redux";
import reduxStore from "./reduxStorage/combinedReducers";
import Header from "./shared/Header";
import Menu from "./shared/Menu";
import Footer from "./shared/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [isFullPageLayout, setIsFullPageLayout] = useState(false);

  const location = useLocation();

  const fullPageLayoutRoutes = ["/login", "/main-dashboard", "/ResetPassword","/404"];

  useEffect(() => {
    onRouteChanged();
  });

  const onRouteChanged = () => {
    window.scrollTo(0, 0);
    let flag = false;
    fullPageLayoutRoutes.map((path) => {
      if (location.pathname === path) {
        flag = true;
      }
    });
    setIsFullPageLayout(flag);
  };

  return (
    <Provider store={reduxStore}>
      {!isFullPageLayout ? (
        <>
          <div className="wrapper">
            <Header />
            <Menu />
            <div className="content-wrapper">
              <AppRoutes />
            </div>
            <Footer />
            <ToastContainer
              position="top-center"
              limit={1}
              containerId="myHalfContainer"
              autoClose={2200}
              theme ="light"
            />
          </div>
        </>
      ) : (
        <>
          <ToastContainer position="top-center" autoClose={2200} />
          <AppRoutes />
        </>
      )}
    </Provider>
  );
};

export default App;
