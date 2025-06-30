import React, { useEffect, useState } from "react";
import { useNavigate, Link, useOutletContext } from "react-router-dom";
import "../../sass/Users/Users/Users.css";
import Plus from "../../assets/icons/plus.svg";
import Trash from "../../assets/icons/trash.svg";
import Edit from "../../assets/icons/edit.svg";
import Search from "../../assets/icons/search.svg";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import API from "../../service/api";
import { DEPARTMENT_MAP } from "../../utils/constants";
import { LoaderTable } from "../../components/LoaderTable";

export default function Users() {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { showConfirmDelete } = useOutletContext();
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 10;

  const navigate = useNavigate();

  const loadData = async (page = 1, keyword = "") => {
    try {
      setLoading(true);
      const response = await API.get("/user", {
        params: {
          page,
          limit: itemsPerPage,
          search: keyword,
        },
      });

      const res = response.data;
      setData(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      alert("Gagal memuat data user!", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentPage, search);
  }, [currentPage, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (id_users) => {
    localStorage.setItem("id_users", id_users);
    navigate(`/admin/edit-users`);
  };

  const handleDelete = async (id_users) => {
    setData((prev) => prev.filter((item) => item.id_users !== id_users));
    await API.delete(`/user/${id_users}`);
  };

  const handleClickDelete = (user) => {
    showConfirmDelete(user, () => handleDelete(user.id_users));
  };

  const indexOfFirstItem = (currentPage - 1) * itemsPerPage;

  const paginatedData = data;

  return (
    <div className="users-admin">
      <div className="header-admin">
        <h2>
          <strong>LIST USERS</strong>
        </h2>
        <Link to="/admin/add-users" className="add-users-btn-admin">
          <img src={Plus} alt="Add Icon" />
          Add Users
        </Link>
      </div>

      <div className="search-box-admin">
        <img src={Search} alt="Search Icon" className="img-search-admin" />
        <input
          type="text"
          placeholder="Search by Name or Email"
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="table-container-admin">
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Department</th>
              <th>Role</th>
              <th>Email</th>
              <th>Phone</th>
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
            ) : paginatedData.length === 0 ? (
              <tr>
                <td colSpan="7" className="empty-row-admin">
                  No data available.
                </td>
              </tr>
            ) : (
              paginatedData.map((user, index) => (
                <tr key={user.id}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td>{user.name}</td>
                  <td>{DEPARTMENT_MAP[user.department.name]}</td>
                  <td>{user.role}</td>
                  <td>{user.email}</td>
                  <td>{user.no_hp}</td>
                  <td className="actions-admin">
                    <button
                      className="edit-btn-admin"
                      onClick={() => handleEdit(user.id_users)}
                      title="Edit"
                    >
                      <img
                        src={Edit}
                        alt="Edit Icon"
                        className="img-action-admin"
                      />
                    </button>
                    <button
                      className="delete-btn-admin"
                      onClick={(e) => {
                        e.preventDefault();
                        handleClickDelete(user);
                      }}
                      title="Delete"
                    >
                      <img
                        src={Trash}
                        alt="Delete Icon-admin"
                        className="img-action-admin"
                      />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination-admin">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="pagination-button-admin previous"
        >
          <FaArrowLeft size={12} className="previous-icon" /> Previous
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx + 1}
            className={`pagination-button-admin ${
              currentPage === idx + 1 ? "active" : ""
            }`}
            onClick={() => setCurrentPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="pagination-button-admin next"
        >
          Next <FaArrowRight size={12} className="next-icon" />
        </button>
      </div>
    </div>
  );
}
