import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "./views/Auth/Login";
import ReqKanban from "./views/Kanban/ReqKanban";
import ProtectedRoute from "./components/ProtectedRoute";
import ReqForm from "./views/Kanban/ReqForm";
import Users from "./views/Users/Users";
import AddUser from "./views/Users/AddUser";
import EditUser from "./views/Users/EditUser";
import Layout from "./components/Layout";
import Home from "./views/Home";
import DetailReqKanban from "./views/Kanban/DetailReqKanban";
import ApprovalReqKanban from "./views/ApprovalReqKanban";
import Report from "./views/Report";
import SignUp from "./views/Auth/Signup";
import ForgotPassword from "./views/Auth/ForgotPassword";
import Profile from "./views/Users/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />, // Route untuk login
  },
  {
    path: "/login",
    element: <Login />, // Route untuk login
  },
  {
    path: "/signup",
    element: <SignUp />, // Route untuk login
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />, // Route untuk login
  },
  {
    path: "/user", // Semua route dengan layout
    element: (
      <ProtectedRoute>
        <Layout layoutType="user" />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // Default route saat buka "/"
        element: <Home />,
      },
      {
        path: "home-user",
        element: <Home />,
      },
      {
        path: "request-kanban",
        element: (
          <ReqKanban
            userType="user"
            title="REQUEST KANBAN"
            apiEndpoint="/kanban/all"
            showCreateButton={true}
          />
        ),
      },
      {
        path: "request-form",
        element: <ReqForm />,
      },
      {
        path: "detail-request",
        element: <DetailReqKanban />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/user-lead", // Semua route dengan layout
    element: (
      <ProtectedRoute>
        <Layout layoutType="userLead" />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // Default route saat buka "/"
        element: <Home />,
      },
      {
        path: "home-user-lead",
        element: <Home />,
      },
      {
        path: "reqkanban-user-lead",
        element: (
          <ReqKanban
            userType="user-lead"
            title="REQUEST KANBAN"
            apiEndpoint="/kanban/pending"
            showApproveReject={true}
          />
        ),
      },
      {
        path: "approve-user-lead",
        element: (
          <ApprovalReqKanban navigationPath="/user-lead/detailreq-user-lead" />
        ),
      },
      {
        path: "detailreq-user-lead",
        element: <DetailReqKanban />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/admin", // Semua route dengan layout
    element: (
      <ProtectedRoute>
        <Layout layoutType="admin" />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // Default route saat buka "/"
        element: <Home />,
      },
      {
        path: "home-admin",
        element: <Home />,
      },
      {
        path: "kanbanreq-admin",
        element: (
          <ReqKanban
            userType="admin"
            title="KANBAN REQUEST"
            apiEndpoint="/kanban/all"
          />
        ),
      },
      {
        path: "detail-kanbanreq",
        element: <DetailReqKanban />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "add-users",
        element: <AddUser />,
      },
      {
        path: "edit-users",
        element: <EditUser />,
      },
      {
        path: "report-admin",
        element: <Report />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/pc-lead", // Semua route dengan layout
    element: (
      <ProtectedRoute>
        <Layout layoutType="pcLead" />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // Default route saat buka "/"
        element: <Home />,
      },
      {
        path: "home-pc-lead",
        element: <Home />,
      },
      {
        path: "kanbanreq-pc-lead",
        element: (
          <ReqKanban
            userType="pc-lead"
            title="REQUEST KANBAN"
            apiEndpoint="/kanban/pending"
            showApproveReject={true}
          />
        ),
      },
      {
        path: "detailreq-pc-lead",
        element: <DetailReqKanban />,
      },
      {
        path: "approve-pc-lead",
        element: (
          <ApprovalReqKanban navigationPath="/pc-lead/detailreq-pc-lead" />
        ),
      },
      {
        path: "report-pc-lead",
        element: <Report />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
]);

export default router;
