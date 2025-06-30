import React, { useState } from "react";
import Sidebar from "./Sidebar";
import BarUp from "./BarUp";
import BaseAlert from "./BaseAlert";
import { Outlet } from "react-router-dom";
import { useAlert } from "../hooks/useAlert";
import { getButtonsForAlert } from "../config/alertButton";
import "../sass/components/Layouts/Layout.css";
import LAYOUT_CONFIGS from "../config/layout";

const Layout = ({ layoutType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const config = LAYOUT_CONFIGS[layoutType];

  if (!config) {
    throw new Error(`Layout type "${layoutType}" not found`);
  }

  const { alerts, showAlert, closeAlert } = useAlert(config.redirectPath);
  const handlers = config.handlers(showAlert, closeAlert, alerts);

  const toggleSidebar = (value) => {
    setIsSidebarOpen((prev) => (typeof value === "boolean" ? value : !prev));
  };

  const closeSidebar = () => {
    if (isSidebarOpen === true) {
      setIsSidebarOpen(false);
    }
  };

  // Generate content for special cases
  const getContentForAlert = (alertType, alertConfig) => {
    if (layoutType === "admin" && alertType === "confirmDelete") {
      return (
        <p>
          Are you sure you want to delete user
          <span> {alerts.confirmDelete?.user?.name}</span>? <br />
          This action cannot be undone.
        </p>
      );
    }
    return alertConfig.content;
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <Sidebar
        type={config.sidebarType}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div className="main-content">
        <BarUp
          departmentPC="PRODUCTION CONTROL DEPARTMENT"
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="page-container" onClick={closeSidebar}>
          <Outlet context={handlers} />
        </div>
      </div>

      {/* Dynamic Alerts */}
      {Object.entries(config.alerts).map(([alertType, alertConfig]) => (
        <BaseAlert
          key={alertType}
          isVisible={alerts[alertType]?.visible}
          fadeOut={alerts[alertType]?.fadeOut}
          icon={alertConfig.icon}
          title={alertConfig.title}
          content={getContentForAlert(alertType, alertConfig)}
          buttons={getButtonsForAlert(
            layoutType,
            alertType,
            handlers,
            closeAlert
          )}
          className={alertConfig.className}
        />
      ))}
    </div>
  );
};

export default Layout;
