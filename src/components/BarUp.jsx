import "../sass/components/BarUp/BarUp.css";
import menuIcon from "../assets/icons/bars-solid.svg";
import closeIcon from "../assets/icons/xmark-solid.svg";

export default function BarUp({
  departmentPC = "PRODUCTION CONTROL DEPARTMENT",
  isSidebarOpen,
  toggleSidebar,
}) {
  return (
    <div className="barup-container">
      <div className="toggle-sidebar-btn" onClick={toggleSidebar}>
        <img
          src={isSidebarOpen ? closeIcon : menuIcon}
          alt="Toggle Sidebar"
          className="sidebar-toggle-icon"
        />
      </div>
      <div className="barup-content">
        <span>{departmentPC}</span>
      </div>
    </div>
  );
}
