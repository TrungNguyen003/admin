import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { ClipLoader } from "react-spinners";
import Staff1Header from "../layout/Staff_1_Header";
import "../styles/ad_dashboard.css";
// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Staff1Dashboard = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const [combinedStats, setCombinedStats] = useState({
    stats: { totalOrders: 0, revenue: 0 },
    ordersRevenue: { daily: [], weekly: [], monthly: [] },
    cancelledOrders: { daily: [], weekly: [], monthly: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("daily");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [unresolvedOrdersCount, setUnresolvedOrdersCount] = useState(0);
  useEffect(() => {
    const fetchCombinedStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:10000/staff/dashboard/combined-stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setCombinedStats(response.data);
      } catch (err) {
        setError("Error fetching combined stats data.");
      } finally {
        setLoading(false);
      }
    };
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:10000/staffdb/orders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        // Lọc ra các đơn hàng chưa giải quyết
        const unresolvedOrders = response.data.orders.filter(
          (order) =>
            order.status === "chưa giải quyết" && order.status === "đang xử lý"
        );

        // Cập nhật số lượng đơn hàng chưa giải quyết
        setUnresolvedOrdersCount(unresolvedOrders.length);
        setOrders(response.data.orders);
        setLoading(false);
      } catch (err) {
        setError("Error fetching orders");
        setLoading(false);
      }
    };

    fetchOrders();
    fetchCombinedStats();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:10000/admin/users?page=${page}&limit=${limit}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setUsers(response.data.users);
      } catch (err) {
        setError("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:10000/staff/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Cập nhật lại danh sách đơn hàng sau khi thay đổi trạng thái
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      toast.success("Orders updated successfully");
    } catch (err) {
      setError("Error updating order status.");
    }
  };

  const openModal = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:10000/staff/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setSelectedOrder(response.data);
      setModalIsOpen(true);
    } catch (error) {
      setError("Error fetching order details.");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <ClipLoader size={50} color={"#3498db"} loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  const getChartData = () => {
    switch (viewMode) {
      case "daily":
        return {
          labels: combinedStats.ordersRevenue.daily.map((stat) => stat.date),
          datasets: [
            {
              label: "Tổng số đơn hàng (Hàng ngày)",
              data: combinedStats.ordersRevenue.daily.map(
                (stat) => stat.totalOrders
              ),
              backgroundColor: "#FF6384",
            },
            {
              label: "Tổng doanh thu (Hàng ngày)",
              data: combinedStats.ordersRevenue.daily.map(
                (stat) => stat.totalRevenue
              ),
              backgroundColor: "#36A2EB",
            },
            {
              label: "Đơn hàng đã hủy (Hàng ngày)",
              data: combinedStats.cancelledOrders.daily.map(
                (stat) => stat.total
              ),
              backgroundColor: "#FFCE56",
            },
          ],
        };
      case "weekly":
        return {
          labels: combinedStats.ordersRevenue.weekly.map(
            (stat) => `Tuần ${stat.week}`
          ),
          datasets: [
            {
              label: "Tổng số đơn hàng (hàng tuần)",
              data: combinedStats.ordersRevenue.weekly.map(
                (stat) => stat.totalOrders
              ),
              backgroundColor: "#FF6384",
            },
            {
              label: "Tổng doanh thu (hàng tuần)",
              data: combinedStats.ordersRevenue.weekly.map(
                (stat) => stat.totalRevenue
              ),
              backgroundColor: "#36A2EB",
            },
            {
              label: "Đơn hàng đã hủy (Hàng tuần)",
              data: combinedStats.cancelledOrders.weekly.map(
                (stat) => stat.total
              ),
              backgroundColor: "#FFCE56",
            },
          ],
        };
      case "monthly":
        return {
          labels: combinedStats.ordersRevenue.monthly.map(
            (stat) => `Tháng ${stat.month}`
          ),
          datasets: [
            {
              label: "Tổng số đơn hàng (Hàng tháng)",
              data: combinedStats.ordersRevenue.monthly.map(
                (stat) => stat.totalOrders
              ),
              backgroundColor: "#FF6384",
            },
            {
              label: "Tổng doanh thu (Hàng tháng)",
              data: combinedStats.ordersRevenue.monthly.map(
                (stat) => stat.totalRevenue
              ),
              backgroundColor: "#36A2EB",
            },
            {
              label: "Đơn hàng đã hủy (Hàng tháng)",
              data: combinedStats.cancelledOrders.monthly.map(
                (stat) => stat.total
              ),
              backgroundColor: "#FFCE56",
            },
          ],
        };
      default:
        return {};
    }
  };

  return (
    <>
      <div className="main-container-120">
        <Staff1Header
          isAuthenticated={isAuthenticated}
          user={user}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
        />
        <div className="rectangle-9-120">
          <div className="flex-row-fac-120">
            <div className="vector-a-120" />
            <span className="text-f-120"> {unresolvedOrdersCount}</span>
          </div>
          <span className="daily-views-120">Đơn hàng chưa giải quết</span>
        </div>
        <div className="rectangle-e-120">
          <div className="flex-row-c-120">
            <div className="group-f-120" />
            <span className="text-100-120">
              {" "}
              {combinedStats.cancelledOrders[viewMode].reduce(
                (acc, item) => acc + item.total,
                0
              )}
            </span>
          </div>
          <span className="message-120">Đơn hoàn trả</span>
        </div>
        <div className="rectangle-10-120">
          <div className="flex-row-be-120">
            <div className="vector-11-120" />
            <span className="dollar-1000-120">
              {" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              })
                .format(combinedStats.stats.revenue)
                .replace("₫", "VND")}
            </span>
          </div>
          <span className="total-income-120">Tổng doanh thu</span>
        </div>
        <button
          className="rectangle-12-120"
          onClick={() => setViewMode("daily")}
        >
          <span className="daily-120">Ngày</span>
        </button>
        <button
          className="rectangle-13-120"
          onClick={() => setViewMode("monthly")}
        >
          <span className="monthly-120">Tháng</span>
        </button>
        <button
          className="rectangle-14-120"
          onClick={() => setViewMode("weekly")}
        >
          <span className="weekly-120">Tuần</span>
        </button>
        <div className="rectangle-15-120" />
        <div className="rectangle-16-120">
          <div className="rectangle-17-120">
            <h2>
              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
              &nbsp; &nbsp; &nbsp; Tổng đơn hàng và doanh thu (
              {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)})
            </h2>
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
              <Bar data={getChartData()} />
            </div>
          </div>
        </div>
        <span className="member-120">Thành viên</span>
        <div className="user-list">
          <div className="rectangle-18-120">
            {users.map((user) => (
              <div className="user-item-120" key={user.id}>
                <div className="rectangle-19-120">
                  <img src={user.avatar} alt="" />
                </div>
                <div className="user-info-120">
                  <span className="jon-smish-120">{user.username}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* <span className="recent-orders-120">recent orders</span> */}
        {orders.length === 0 ? (
          <div>Không tìm thấy đơn hàng nào</div>
        ) : (
          <div className="rectangle-1d-120">
            <table className="scrollable-table">
              <thead>
                <tr>
                  <th>ID đơn hàng</th>
                  <th>Giá</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })
                        .format(order.total)
                        .replace("₫", "VND")}
                    </td>
                    <td>{new Date(order.orderDate).toLocaleString()}</td>
                    <td>{order.status}</td>
                    <td>
                      {/* <select
                        value={order.status}
                        className="form-select"
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)
                        }
                      >
                        <option value="chưa giải quyết">Đang chờ</option>
                        <option value="đơn vị vận chuyển lấy hàng thành công">Đã giao hàng</option>
                        <option value="hủy bỏ">Đã hủy</option>
                        <option value="hoàn trả">Hoàn trả</option>
                        <option value="đơn hàng đã hoàn thành">Hoàn thành</option>
                      </select> */}
                      <button
                        className="btn btn-info"
                        onClick={() => openModal(order._id)}
                      >
                        Xem chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal-dialog modal-lg" // Sử dụng class modal của Bootstrap
        overlayClassName="modal-backdrop"
        contentLabel="Order Details"
        ariaHideApp={false}
      >
        {selectedOrder ? (
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chi tiết đơn hàng</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={closeModal}
              ></button>
            </div>
            <div className="modal-body">
              <p>
                <strong>ID:</strong> {selectedOrder._id}
              </p>
              <p>
                <strong>Trạng thái:</strong> {selectedOrder.status}
              </p>
              <p>
                <strong>Tổng cộng:</strong>{" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
                  .format(selectedOrder.total)
                  .replace("₫", "VND")}
              </p>
              <p>
                <strong>Mặt hàng:</strong>
              </p>

              {/* Hiển thị thông tin sản phẩm dưới dạng bảng */}
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Sản phẩm</th>
                    <th scope="col">Hình ảnh</th>
                    <th scope="col">Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={item._id}>
                      <th scope="row">{index + 1}</th>
                      <td>{item.product.name}</td>
                      <td>
                        <img
                          src={`http://localhost:10000/product_images/${item.product._id}/${item.product.image}`}
                          alt={item.product.name}
                          className="img-fluid"
                          style={{ maxWidth: "100px" }}
                        />
                      </td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={closeModal}
              >
                Đóng
              </button>
            </div>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </Modal>

      <ToastContainer />
    </>
  );
};

export default Staff1Dashboard;
