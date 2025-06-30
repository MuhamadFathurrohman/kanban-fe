import React, { useEffect, useRef, useState, useContext } from "react";
import { useNavigate, useOutletContext, Link } from "react-router-dom";
import Detail from "../../assets/icons/list.svg";
import Search from "../../assets/icons/search.svg";
import Check from "../../assets/icons/check.svg";
import Cross from "../../assets/icons/xmark-white.svg";
import Plus from "../../assets/icons/plus.svg";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import API from "../../service/api";
import { DEPARTMENT_MAP } from "../../utils/constants";
import { LoaderTable } from "../../components/LoaderTable";
import "../../sass/Kanban/ReqKanban/ReqKanban.css";

export default function ReqKanban({
  userType = "",
  showCreateButton = false,
  apiEndpoint = "",
  title = "",
  showApproveReject = false,
}) {
  // State
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Ref
  const typingTimeout = useRef(null);

  // Navigation
  const navigate = useNavigate();

  // Context (safe access)
  const context = useOutletContext() || {};
  const {
    handleShowAlertPCLeadApprove,
    showConfirmRejectPCLead,
    handleShowAlertUserLeadApprove,
    showConfirmReject,
  } = context;

  // Load data on page change or search
  useEffect(() => {
    loadData(currentPage, search);
  }, [currentPage, search]);

  // Debounce for search input - FIXED VERSION
  const handleSearch = (e) => {
    const keyword = e.target.value;

    // Clear existing timeout
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Update search immediately for UI responsiveness
    setSearch(keyword);

    // Debounce the actual search execution
    typingTimeout.current = setTimeout(() => {
      setCurrentPage(1); // This will trigger useEffect to load data
    }, 500);
  };

  // Load data with API
  const loadData = async (page, keyword = "") => {
    try {
      setLoading(true);
      const res = await API.get(apiEndpoint, {
        params: {
          page,
          limit: 10,
          search: keyword,
        },
      });

      let processedData;
      if (apiEndpoint === "/kanban/pending") {
        processedData = res.data.data.map((item) => ({
          id_kanban: item.id_kanban,
          tgl_produksi: item.requestKanban.tgl_produksi,
          parts_number: item.requestKanban.parts_number,
          process: item.requestKanban.klasifikasi,
          nama_requester: item.requestKanban.nama_requester,
          status: item.requestKanban.status,
        }));
      } else {
        processedData = res.data.requests;
      }

      setData(processedData);
      setTotalPages(res.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Event Handlers
  const handleView = (id_kanban) => {
    localStorage.setItem("id_kanban", id_kanban);
    const routes = {
      admin: "/admin/detail-kanbanreq",
      "pc-lead": "/pc-lead/detailreq-pc-lead",
      user: "/user/detail-request",
      "user-lead": "/user-lead/detailreq-user-lead",
    };
    navigate(routes[userType]);
  };

  const handleApprove = async (id_kanban) => {
    try {
      await API.post("/kanban/approve", { id_kanban });
      if (userType === "pc-lead" && handleShowAlertPCLeadApprove) {
        handleShowAlertPCLeadApprove(true);
      } else if (userType === "user-lead" && handleShowAlertUserLeadApprove) {
        handleShowAlertUserLeadApprove(true);
      }
      loadData(currentPage, search);
    } catch (err) {
      alert("Gagal approve: " + err.message);
    }
  };

  const handleReject = async (id_kanban) => {
    try {
      await API.post("/kanban/reject", { id_kanban });
      if (userType === "pc-lead" && showConfirmRejectPCLead) {
        showConfirmRejectPCLead(true);
      } else if (userType === "user-lead" && showConfirmReject) {
        showConfirmReject(true);
      }
      loadData(currentPage, search);
    } catch (err) {
      alert("Gagal reject: " + err.message);
    }
  };

  // Helper functions
  const formatDate = (dateString) => {
    return apiEndpoint === "/kanban/pending"
      ? new Date(dateString).toLocaleDateString("id-ID")
      : new Date(dateString).toLocaleDateString("en-CA");
  };

  const getProcessName = (item) => {
    return apiEndpoint === "/kanban/pending"
      ? item.process
      : DEPARTMENT_MAP[item.department?.name] || item.process;
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeout.current) {
        clearTimeout(typingTimeout.current);
      }
    };
  }, []);

  return (
    <div className="kanban-request-table">
      <div className="table-header">
        <h2>
          <strong>{title}</strong>
        </h2>
        {showCreateButton && (
          <Link to="/user/request-form" className="create-button">
            <img src={Plus} alt="Plus Icon" />
            Form Request
          </Link>
        )}
      </div>

      <div className="search-container">
        <img src={Search} alt="Search" className="search-icon" />
        <input
          type="text"
          placeholder="Search by Parts Number or Requester Name"
          value={search}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Production Date</th>
              <th>Parts Number</th>
              <th>
                {apiEndpoint === "/kanban/pending"
                  ? "Classification"
                  : "Process"}
              </th>
              <th>
                {userType === "user-lead"
                  ? "Requester Name"
                  : "Requesting Name"}
              </th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="empty-row"
                  style={{ height: "100px" }}
                >
                  <LoaderTable />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row">
                  No data available.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={item.id_kanban}>
                  <td>{(currentPage - 1) * 10 + index + 1}</td>
                  <td>{formatDate(item.tgl_produksi)}</td>
                  <td>{item.parts_number}</td>
                  <td>{getProcessName(item)}</td>
                  <td>{item.nama_requester}</td>
                  <td>
                    <span className={`status ${item.status.toLowerCase()}`}>
                      {item.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="actions">
                    <button
                      className="action-button view-button"
                      onClick={() => handleView(item.id_kanban)}
                      title="View Detail Request"
                    >
                      <img src={Detail} alt="View" className="action-icon" />
                    </button>
                    {showApproveReject && (
                      <>
                        <button
                          className="action-button approve-button"
                          onClick={() => handleApprove(item.id_kanban)}
                          title="Approve Request"
                        >
                          <img
                            src={Check}
                            alt="Approve"
                            className="action-icon"
                          />
                        </button>
                        <button
                          className="action-button reject-button"
                          onClick={() => handleReject(item.id_kanban)}
                          title="Reject Request"
                        >
                          <img
                            src={Cross}
                            alt="Reject"
                            className="action-icon"
                          />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="pagination-button previous"
        >
          <FaArrowLeft size={12} className="previous-icon" />
          Previous
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            className={`pagination-button ${
              currentPage === idx + 1 ? "active" : ""
            }`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="pagination-button next"
        >
          Next <FaArrowRight size={12} className="next-icon" />
        </button>
      </div>
    </div>
  );
}
