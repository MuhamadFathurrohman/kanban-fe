import Home from "../assets/icons/home.svg";
import Clipboard from "../assets/icons/clipboard.svg";
import Users from "../assets/icons/users.svg";
import File from "../assets/icons/file.svg";
import FileApprv from "../assets/icons/approve.svg";
import Profile from "../assets/icons/profile.svg";
import Audit from "../assets/icons/audit.svg";
import Register from "../assets/icons/register.svg";

const SIDEBAR_CONFIGS = {
  user: {
    showCloseButton: true,
    hasMobileCheck: false,
    navItems: [
      {
        path: "/user/home-user",
        icon: Home,
        label: "Dashboard",
        class: "primary",
      },
      {
        path: "/user/request-kanban",
        icon: Clipboard,
        label: "Request Kanban",
        class: "secondary",
        activePaths: [
          "/user/request-kanban",
          "/user/request-form",
          "/user/detail-request",
        ],
      },
      {
        path: "/user/profile",
        icon: Profile,
        label: "Profile",
        class: "primary",
      },
    ],
  },

  userLead: {
    showCloseButton: true,
    hasMobileCheck: false,
    navItems: [
      {
        path: "/user-lead/home-user-lead",
        icon: Home,
        label: "Dashboard",
        class: "primary",
      },
      {
        path: "/user-lead/reqkanban-user-lead",
        icon: Clipboard,
        label: "Request Kanban",
        class: "secondary",
        activePaths: [
          "/user-lead/reqkanban-user-lead",
          "/user-lead/detailreq-user-lead",
        ],
      },
      {
        path: "/user-lead/approve-user-lead",
        icon: FileApprv,
        label: "Approval",
        class: "primary",
      },
      {
        path: "/user-lead/profile",
        icon: Profile,
        label: "Profile",
        class: "primary",
      },
    ],
  },

  admin: {
    showCloseButton: true,
    hasMobileCheck: false,
    navItems: [
      {
        path: "/admin/home-admin",
        icon: Home,
        label: "Dashboard",
        class: "primary",
      },
      {
        path: "/admin/kanbanreq-admin",
        icon: Clipboard,
        label: "Kanban Request",
        class: "secondary",
        activePaths: ["/admin/kanbanreq-admin", "/admin/detail-kanbanreq"],
      },
      {
        path: "/admin/users",
        icon: Users,
        label: "Users",
        class: "secondary",
        activePaths: ["/admin/users", "/admin/add-users", "/admin/edit-users"],
      },
      {
        path: "/admin/report-admin",
        icon: File,
        label: "Report",
        class: "secondary",
      },
      {
        path: "/admin/profile",
        icon: Profile,
        label: "Profile",
        class: "primary",
      },
      {
        path: "/admin/auditlog",
        icon: Audit,
        label: "Audit Log",
        class: "primary",
      },
      {
        path: "/admin/registration",
        icon: Register,
        label: "Registration",
        class: "primary",
      },
    ],
  },

  pcLead: {
    showCloseButton: true,
    hasMobileCheck: false,
    navItems: [
      {
        path: "/pc-lead/home-pc-lead",
        icon: Home,
        label: "Dashboard",
        class: "primary",
      },
      {
        path: "/pc-lead/kanbanreq-pc-lead",
        icon: Clipboard,
        label: "Kanban Request",
        class: "secondary",
        activePaths: [
          "/pc-lead/kanbanreq-pc-lead",
          "/pc-lead/detailreq-pc-lead",
        ],
      },
      {
        path: "/pc-lead/approve-pc-lead",
        icon: FileApprv,
        label: "Approval",
        class: "primary",
      },
      {
        path: "/pc-lead/report-pc-lead",
        icon: File,
        label: "Report",
        class: "secondary",
      },
      {
        path: "/pc-lead/profile",
        icon: Profile,
        label: "Profile",
        class: "primary",
      },
    ],
  },
};

export default SIDEBAR_CONFIGS;
