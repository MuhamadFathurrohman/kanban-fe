import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../sass/Registration/Registration.css";
import Detail from "../assets/icons/list.svg";
import Check from "../assets/icons/check.svg";
import Cross from "../assets/icons/xmark-white.svg";
import Search from "../assets/icons/search.svg";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import API from "../service/api";
import { LoaderTable } from "../components/LoaderTable";

export default function Registration({
  navigationPath = "/user-lead/detailreq-user-lead",
}) {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const formatDate = (isoString) => {
    if (!isoString || isoString === "-") return "-";

    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "-";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}/${month}/${day} - ${hours}:${minutes}:${seconds}`;
  };

  const userStorage = JSON.parse(localStorage.getItem("user"));
  const userRole = userStorage.role;
  const userId = userStorage.id_users;
  const userDepartment = userStorage.id_department;

  const fetchData = async (page = 1, role = "", search = "") => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: itemsPerPage,
        role,
        userId,
        departmentId: userDepartment,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      const res = await API.get("/kanban/approved", { params });
      const result = res.data.approved;

      const formattedData = result.data.map((item) => ({
        ...item,
        approvedAt: item.approvedAt ? formatDate(item.approvedAt) : "-",
      }));

      setData(formattedData);
      setTotalPages(result.totalPages);
      setCurrentPage(result.page);
      setTotalItems(result.total);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Gagal memuat data approved!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (search) {
      setCurrentPage(1);
    }
  }, [search]);

  useEffect(() => {
    fetchData(currentPage, userRole, search);
  }, [currentPage, userRole, search]);

  const handleSearch = (e) => {
    const keyword = e.target.value;
    setSearch(keyword);
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  const handleView = (id_kanban) => {
    localStorage.setItem("id_kanban", id_kanban);
    navigate(`${navigationPath}?id=${id_kanban}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="registration">
      <div className="registration__header">
        <h2>
          <strong>LIST REGISTRATION</strong>
        </h2>
      </div>

      <div className="registration__search">
        <img src={Search} alt="" className="registration__search-icon" />
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={search}
          onChange={handleSearch}
          className="registration__search-input"
        />
      </div>

      <div className="registration__table-container">
        <table className="registration__table">
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Division</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="registration__empty-row"
                  style={{ height: "100px" }}
                >
                  <LoaderTable />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="6" className="registration__empty-row">
                  No data available.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={`${item.id_kanban}-${item.approvedAt}-${index}`}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{item.approvedAt}</td>
                  <td>{item.parts_number}</td>
                  <td>{item.requester_name}</td>
                  <td>
                    <span
                      className={`registration__status registration__status--${item.status.toLowerCase()}`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="registration__actions">
                    <button
                      className="registration__action-button view-button"
                      onClick={() => handleView(item.id_kanban)}
                      title="View Detail Request"
                    >
                      <img
                        src={Detail}
                        alt=""
                        className="registration__action-icon"
                      />
                    </button>
                    <button
                      className="registration__action-button approve-button"
                      onClick={() => handleApprove(item.id_kanban)}
                      title="Approve Register"
                    >
                      <img
                        src={Check}
                        alt="Approve"
                        className="registration__action-icon"
                      />
                    </button>
                    <button
                      className="registration__action-button reject-button"
                      onClick={() => handleReject(item.id_kanban)}
                      title="Reject Register"
                    >
                      <img
                        src={Cross}
                        alt="Reject"
                        className="registration__action-icon"
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="registration__pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="registration__pagination-btn previous-btn"
        >
          <FaArrowLeft size={12} className="previous-icon" /> Previous
        </button>
        {[...Array(totalPages)].map((_, idx) => {
          const page = idx + 1;
          return (
            <button
              key={page}
              className={`registration__pagination-btn ${
                page === currentPage ? "active-btn" : ""
              }`}
              onClick={() => handlePageChange(page)}
            >
              {page}
            </button>
          );
        })}
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="registration__pagination-btn next-btn"
        >
          Next <FaArrowRight size={12} className="next-icon" />
        </button>
      </div>
    </div>
  );
}
