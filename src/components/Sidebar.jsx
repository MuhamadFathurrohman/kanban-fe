// Sidebar.jsx - Komponen universal tunggal
import React, { useEffect, useState } from "react";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import "../sass/components/SideBar/SideBar.css";
import logo from "../assets/images/logo.svg";
import Builder from "../assets/images/builder1.svg";
import Logout from "../assets/icons/logout-icon.svg";
import closeIcon from "../assets/icons/xmark-solid.svg";
import API from "../service/api";
import { DEPARTMENT_MAP } from "../utils/constants";
import SIDEBAR_CONFIGS from "../config/sidebar";

const Sidebar = ({ type, isSidebarOpen, toggleSidebar }) => {
    const [time, setTime] = useState(new Date());
    const [id_department, setIdDepartment] = useState("");
    const [departmentName, setDepartmentName] = useState("");
    const [internalSidebarOpen, setInternalSidebarOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const config = SIDEBAR_CONFIGS[type];

    // Mobile check (hanya untuk user dan userLead)
    useEffect(() => {
        if (config.hasMobileCheck) {
            const isMobile = window.innerWidth <= 1024;
            if (isMobile && toggleSidebar) {
                toggleSidebar(false);
            }
        }
    }, [config.hasMobileCheck, toggleSidebar]);

    // Timer
    useEffect(() => {
        const interval = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    // Fetch department
    useEffect(() => {
        const fetchDepartment = async () => {
            try {
                const userStorage = JSON.parse(localStorage.getItem("user"));
                const userId = userStorage.id_users;
                await API.get(`user/me/${userId}`).then((res) => {
                    const deptCode = res.data.data.department.name;
                    const fullDeptName =
                        DEPARTMENT_MAP[deptCode] ||
                        "Departemen Tidak Diketahui";
                    setIdDepartment(deptCode);
                    setDepartmentName(fullDeptName);
                });
            } catch (err) {
                setDepartmentName("Departemen Tidak Diketahui", err);
            }
        };

        if (!id_department) {
            fetchDepartment();
        }
    }, [id_department]);

    const formattedTime = time.toLocaleTimeString("en-GB");
    const formattedDate = time.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleToggleSidebar = () => {
        setInternalSidebarOpen((prev) => !prev);
    };

    // Menentukan apakah sidebar terbuka
    const isOpen = toggleSidebar ? isSidebarOpen : internalSidebarOpen;

    // Helper untuk cek active nav item
    const isNavItemActive = (item) => {
        if (item.activePaths) {
            return item.activePaths.some((path) =>
                location.pathname.startsWith(path)
            );
        }
        return false;
    };

    return (
        <div
            className={`sidebar ${isOpen ? "open" : "closed"}`}
            onToggleSidebar={toggleSidebar ? undefined : handleToggleSidebar}
        >
            <img src={logo} alt="Logo" className="logo" />

            {config.showCloseButton && (
                <div className="close-sidebar-button" onClick={toggleSidebar}>
                    <img src={closeIcon} alt="Close Sidebar" />
                </div>
            )}

            <div className="profile-card">
                <div className="avatar">
                    <img src={Builder} alt="" className="icon" />
                </div>
                <div className="info">
                    <div className={`department dep-${id_department}`}>
                        {departmentName}
                    </div>
                    <div className="time">{formattedTime}</div>
                    <div className="date">{formattedDate}</div>
                </div>
            </div>

            <div className="nav-buttons">
                {config.navItems.map((item, index) => (
                    <NavLink
                        key={index}
                        to={item.path}
                        className={
                            item.activePaths
                                ? `nav-button ${item.class}${
                                      isNavItemActive(item) ? " active" : ""
                                  }`
                                : ({ isActive }) =>
                                      `nav-button ${item.class}${
                                          isActive ? " active" : ""
                                      }`
                        }
                        onClick={toggleSidebar}
                    >
                        <img src={item.icon} alt="" className="img-nav" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>

            <div className="logout-section">
                <button className="logout-button" onClick={handleLogout}>
                    <img src={Logout} alt="Logout" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

// Komponen wrapper untuk setiap tipe (opsional, untuk backward compatibility)
export const SideUser = ({ isSidebarOpen, toggleSidebar }) => (
    <Sidebar
        type="user"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
    />
);

export const SideUserLead = ({ isSidebarOpen, toggleSidebar }) => (
    <Sidebar
        type="userLead"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
    />
);

export const SideAdmin = ({ isSidebarOpen, toggleSidebar }) => (
    <Sidebar
        type="admin"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
    />
);

export const SidePCLead = ({ isSidebarOpen, toggleSidebar }) => (
    <Sidebar
        type="pcLead"
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
    />
);

export default Sidebar;
