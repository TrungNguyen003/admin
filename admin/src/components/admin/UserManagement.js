import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminHeader from "../layout/AdminHeader";
import "../styles/usermanager.css"; // Custom styles
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserManagement = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterUsername, setFilterUsername] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editUserId, setEditUserId] = useState(null); // To track the user being edited
  const [editRole, setEditRole] = useState(""); // To track the new role to set
  const limit = 10;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, filterUsername, filterRole]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:10000/admin/users", {
        params: {
          page: currentPage,
          limit,
          username: filterUsername,
          role: filterRole,
        },
      });
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }
    try {
      await axios.post("http://localhost:10000/admin/users/register", {
        username,
        password,
        password2,
        role,
      });
      setSuccess("User registered successfully!");
      setError("");
      setUsername("");
      setPassword("");
      setPassword2("");
      setRole("");
      fetchUsers();
    } catch (err) {
      console.error("Error registering user:", err);
      toast.error("Error registering user");
      setError(err.response.data.msg || "Error registering user");
      setSuccess("");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:10000/admin/users/${userId}`);
      setSuccess("User deleted successfully!");
      setError("");
      fetchUsers();
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Error deleting user");
      setError("Error deleting user");
      setSuccess("");
    }
  };

  const openEditRoleModal = (userId, currentRole) => {
    setEditUserId(userId);
    setEditRole(currentRole);
  };

  const handleEditRole = async () => {
    try {
      await axios.put(`http://localhost:10000/admin/users/${editUserId}/role`, {
        role: editRole,
      });
      setSuccess("User role updated successfully!");
      setError("");
      setEditUserId(null); // Close the modal
      setEditRole("");
      fetchUsers();
    } catch (err) {
      console.error("Error updating role:", err);
      toast.error("Error updating role");
      setError("Error updating role");
      setSuccess("");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="main-container-121">
      <ToastContainer />
      <AdminHeader
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <div className="container-121">
        <h1 className="my-4">Quản lý người dùng</h1>

        {/* Register User Modal */}
        <button
          type="button"
          className="btn btn-primary mb-4"
          data-bs-toggle="modal"
          data-bs-target="#registerModal"
        >
          Đăng ký người dùng
        </button>
        {/* Registration Modal Structure */}
        <div
          className="modal fade"
          id="registerModal"
          tabIndex="-1"
          aria-labelledby="registerModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="registerModalLabel">
                  Đăng ký người dùng
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleRegister}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Confirm Password"
                      value={password2}
                      onChange={(e) => setPassword2(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <select
                      className="form-select"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <option value="">Chọn vai trò</option>
                      <option value="customer">Khách hàng</option>
                      <option value="admin">Quản trị viên</option>
                      <option value="manager">Quản lý</option>
                      <option value="staff">Nhân viên</option>
                    </select>
                  </div>
                  {error && <p className="text-danger mt-2">{error}</p>}
                  {success && <p className="text-success mt-2">{success}</p>}
                  <button type="submit" className="btn btn-primary">
                    Đăng ký
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <h2>Lọc người dùng</h2>
        <div className="form-row mb-4">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Filter by Username"
              value={filterUsername}
              onChange={(e) => setFilterUsername(e.target.value)}
            />
          </div>
          <div className="col">
            <select
              className="form-select"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="">Tất cả các vai trò</option>
              <option value="customer">Khách hàng</option>
              <option value="admin">Quản trị viên</option>
              <option value="manager">Quản lý</option>
              <option value="staff">Nhân viên</option>
            </select>
          </div>
        </div>

        <h2>Người dùng đã đăng ký</h2>
        {loading ? (
          <p>Loading...</p>
        ) : users.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Tên người dùng</th>
                <th>Vai trò</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => openEditRoleModal(user._id, user.role)}
                      data-bs-toggle="modal"
                      data-bs-target="#editRoleModal"
                    >
                      Chỉnh sửa vai trò
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(user._id)}
                    >
                      Loại bỏ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Không có người dùng nào có sẵn</p>
        )}

        {/* Edit Role Modal */}
        <div
          className="modal fade"
          id="editRoleModal"
          tabIndex="-1"
          aria-labelledby="editRoleModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="editRoleModalLabel">
                  Chỉnh sửa vai trò người dùng
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => { e.preventDefault(); handleEditRole(); }}>
                  <div className="form-group">
                    <select
                      className="form-select"
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value)}
                      required
                    >
                      <option value="customer">Khách hàng</option>
                      <option value="admin">Quản trị viên</option>
                      <option value="manager">Quản lý</option>
                      <option value="sales_staff_1">Nhân viên 1</option>
                      <option value="sales_staff_2">Nhân viên 2</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary mt-3">
                    Cập nhật vai trò
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <button
            className="btn btn-outline-primary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <span>
            Trang {currentPage} của {totalPages}
          </span>
          <button
            className="btn btn-outline-primary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Kế tiếp
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
