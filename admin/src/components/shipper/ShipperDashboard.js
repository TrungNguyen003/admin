import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  Button,
  Table,
  Form,
  Pagination,
  Spinner,
  Alert,
} from "react-bootstrap";
import ShipperHeader from "../layout/Shipper_Header";
import "../styles/ad_orders.css";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ShipperRouter = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterUsername, setFilterUsername] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const navigate = useNavigate();
  const [isUpdated, setIsUpdated] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:10000/staff3/orders`, {
        params: {
          page,
          status: filterStatus,
          username: filterUsername,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setOrders(response.data.orders);
      // toast.success("Order added successfully");
      setTotalPages(response.data.totalPages);
      setLoading(false);
    } catch (err) {
      setError("Error fetching orders");
      toast.error("Error fetching orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, filterStatus, filterUsername]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:10000/staff/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setOrderDetails(response.data);
      setSelectedOrder(orderId);
      setShowModal(true);
    } catch (err) {
      setError("Error fetching order details");
      toast.error("Error fetching order details");
    }
  };

  const updateOrderStatus = async (orderId) => {
    try {
      // Tạo đối tượng chứa dữ liệu cập nhật
      const updateData = { status };

      // Nếu trạng thái là "từ chối đơn hàng", thêm refundReason vào dữ liệu gửi
      if (status === "từ chối đơn hàng" && refundReason) {
        updateData.refundReason = refundReason;
      }

      await axios.put(
        `http://localhost:10000/staff/orders/${orderId}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Gọi lại fetchOrders để lấy dữ liệu cập nhật
      fetchOrders();

      // Đặt lại trạng thái sau khi cập nhật thành công
      setStatus("");
      setRefundReason(""); // Đặt lại refundReason sau khi cập nhật
      setIsUpdated(true); // Đánh dấu đã cập nhật
    } catch (err) {
      setError("Error updating order status");
      toast.error("Error updating");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:10000/staff/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      setError("Error deleting order");
    }
  };

  const handleCreateShipment = (order) => {
    navigate("/create-shipment", { state: { order } });
  };

  const handleCloseModal = () => setShowModal(false);

  const exportInvoiceToDoc = () => {
    if (!orderDetails) return;

    const invoiceContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>PetStore Invoice</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1, h2, h3 { text-align: center; }
            .invoice-header { text-align: center; margin-bottom: 40px; }
            .invoice-header img { max-width: 150px; }
            .invoice-header h1 { font-size: 24px; margin: 10px 0; }
            .invoice-info, .customer-info, .summary { margin-bottom: 20px; }
            .invoice-info p, .customer-info p, .summary p { margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            table, th, td { border: 1px solid #ddd; padding: 8px; }
            th { background-color: #f4f4f4; }
            .summary-table td { text-align: right; }
          </style>
        </head>
        <body>
          <!-- Header -->
          <div class="invoice-header">
            <img src="https://example.com/logo.png" alt="PetStore Logo" />
            <h1>PetStore Invoice</h1>
            <p>Email: support@petstore.com | SĐT: 0123456789</p>
            <p><strong>Mã đơn hàng:</strong> ${orderDetails._id}</p>
            <p><strong>Trạng thái:</strong> ${orderDetails.status}</p>
            <p><strong>Ngày: </strong> ${new Date(
              orderDetails.createdAt
            ).toLocaleDateString()}</p>
          </div>
  
          <!-- Customer Information -->
          <h2>Thông tin khách hàng</h2>
          <div class="customer-info">
            <p><strong>Tên:</strong> ${orderDetails.username}</p>
            <p><strong>Email:</strong> ${orderDetails.email}</p>
            <p><strong>Điện thoại:</strong> ${orderDetails.phone}</p>
            <p><strong>Địa chỉ giao hàng:</strong> ${orderDetails.address}</p>
          </div>
  
          <!-- Products Table -->
          <h2>Products</h2>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Trọng lượng</th>
                <th>Giá</th>
                <th>Tổng cộng</th>
              </tr>
            </thead>
            <tbody>
              ${orderDetails.items
                .map(
                  (item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>${item.product.name}</td>
                  <td>${item.quantity}</td>
                  <td>${item.weight} kg</td>
                  <td>${new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price)}</td>
                  <td>${new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(item.price * item.quantity)}</td>
                </tr>`
                )
                .join("")}
            </tbody>
          </table>
  
          <!-- Order Summary -->
          <h2>Tóm tắt đơn hàng</h2>
          <table class="summary-table">
            <tbody>
              <tr>
                <td><strong>Tổng cộng:</strong></td>
                <td>${new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderDetails.total)}</td>
              </tr>
              <tr>
                <td><strong>Phí vận chuyển:</strong></td>
                <td>${new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(orderDetails.shippingFee)}</td>
              </tr>
              <tr>
                <td><strong>Tổng cộng:</strong></td>
                <td><strong>${new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                }).format(
                  orderDetails.total + orderDetails.shippingFee
                )}</strong></td>
              </tr>
            </tbody>
          </table>
  
          <!-- Footer -->
          <h3>Cảm ơn bạn đã mua sắm tại PetStore!</h3>
          <p style="text-align: center;">Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi tại support@petstore.com</p>
        </body>
      </html>
    `;

    // Create a blob and save the file
    const blob = new Blob([invoiceContent], { type: "application/msword" });
    saveAs(blob, `invoice_${orderDetails._id}.doc`);
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="text-center">
        {error}
      </Alert>
    );
  }

  return (
    <div className="main-container-124">
      <ShipperHeader
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <div className="container-124">
        <h1>Quản lý đơn hàng quản trị</h1>

        {/* Bộ lọc */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <Form.Group className="mr-3">
            <Form.Label>&nbsp; Bộ lọc trạng thái</Form.Label>
            <Form.Control
              as="select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả</option>
              <option value="chưa giải quyết">Đang chờ</option>
              <option value="Đơn vị vận chuyển lấy hàng thành công">
                Đã giao hàng
              </option>
              <option value="đơn hàng đã hoàn thành">Hoàn thành</option>
              <option value="hủy bỏ">Đã hủy</option>
              <option value="hoàn trả">Hoàn trả</option>
              <option value="từ chối đơn hàng">Từ chối</option>
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Bộ lọc tên người dùng</Form.Label>
            <Form.Control
              type="text"
              value={filterUsername}
              onChange={(e) => setFilterUsername(e.target.value)}
              placeholder="Filter by username"
            />
          </Form.Group>
        </div>

        {orders.length === 0 ? (
          <div className="text-center">Không tìm thấy đơn hàng nào</div>
        ) : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID đơn hàng</th>
                <th>Tên người dùng</th>
                <th>Số điện thoại</th>
                <th>Tổng cộng</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.username}</td>
                  <td>{order.phone}</td>
                  <td>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.total)}
                  </td>
                  <td>{order.status}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => fetchOrderDetails(order._id)}
                    >
                      Xem chi tiết
                    </Button>{" "}
                    {/* <Button
                      variant="danger"
                      size="sm"
                      onClick={() => deleteOrder(order._id)}
                    >
                      loại bỏ
                    </Button>{" "}
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleCreateShipment(order)}
                    >
                      Tạo đơn giao hàng(GHN)
                    </Button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {/* Pagination */}
        <Pagination>
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index}
              active={page === index + 1}
              onClick={() => setPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>

        {/* Modal hiển thị chi tiết đơn hàng */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Đặt hàng hóa đơn</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {orderDetails && (
              <>
                <div className="invoice-header text-center mb-4">
                  <h2>Hóa đơn PetStore</h2>
                  <p>102 Tam Trinh, Hoàng Mai, Hà Nội, Việt Nam</p>
                  <p>Email: support@petstore.com | SĐT: 0123456789</p>
                </div>

                <div className="invoice-info">
                  <p>
                    <strong>Mã đơn hàng:</strong> {orderDetails._id}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong> {orderDetails.status}
                  </p>
                  <p>
                    <strong>Ngày:</strong>{" "}
                    {new Date(orderDetails.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="customer-info my-4">
                  <h5>Thông tin khách hàng</h5>
                  <p>
                    <strong>Khách hàng:</strong> {orderDetails.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {orderDetails.email}
                  </p>
                  <p>
                    <strong>Điện thoại:</strong> {orderDetails.phone}
                  </p>
                  <p>
                    <strong>Địa chỉ giao hàng:</strong> {orderDetails.address}
                  </p>
                </div>
                <div className="interactions-info my-4">
                  <h5>Thông tin tương tác</h5>
                  {orderDetails.interactions.length > 0 ? (
                    <ul>
                      {orderDetails.interactions.map((interaction, index) => (
                        <li key={index}>
                          <strong>Nhân viên:</strong> {interaction.staff} <br />
                          <strong>Hành động:</strong> {interaction.action}{" "}
                          <br />
                          <strong>Thời gian:</strong>{" "}
                          {new Date(interaction.timestamp).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Không có thông tin tương tác nào.</p>
                  )}
                </div>

                {orderDetails.refundReason && (
                  <div className="refund-reason my-4">
                    <h5>Lý do từ chối đơn hàng</h5>
                    <p>{orderDetails.refundReason}</p>
                  </div>
                )}

                {/* Hiển thị các sản phẩm trong bảng */}
                <Table striped bordered hover className="invoice-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Hình ảnh</th>
                      <th>Sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Trọng lượng</th>
                      <th>Giá</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderDetails.items.map((item, index) => (
                      <tr key={item._id}>
                        <td>{index + 1}</td>
                        <td>
                          <img
                            src={`http://localhost:10000/product_images/${item.product._id}/${item.product.image}`}
                            alt={item.product.name}
                            className="product-image"
                          />
                        </td>
                        <td>{item.product.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.weight} kg</td>
                        <td>
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })
                            .format(item.price)
                            .replace("₫", "VND")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Tổng tiền */}
                <div className="invoice-summary my-4">
                  <p>
                    <strong>Tổng cộng:</strong>{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(orderDetails.total)}
                  </p>
                  <p>
                    <strong>Phí vận chuyển:</strong>{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(orderDetails.shippingFee)}
                  </p>
                  <p>
                    <strong>Tổng cộng:</strong>{" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(orderDetails.total + orderDetails.shippingFee)}
                  </p>
                </div>

                <div className="invoice-footer text-center mt-4">
                  <p>Cảm ơn bạn đã mua hàng!</p>
                </div>
                {/* Cập nhật trạng thái đơn hàng */}
                {orderDetails.status !== "đã giao hàng" &&
                  (
                    <>
                      <Form.Group>
                        <Form.Label>Cập nhật trạng thái</Form.Label>
                        <Form.Control
                          as="select"
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                        >
                          <option value="">Chọn trạng thái</option>
                          <option value="đã giao hàng">Đã giao hàng</option>
                          <option value="đang vận chuyển">Đang vận chuyển</option>
                          <option value="không liên lạc được người nhận">
                          Không liên lạc được người nhận
                          </option>
                        </Form.Control>
                      </Form.Group>

                      {/* Hiển thị form lý do từ chối nếu chọn "từ chối đơn hàng" */}
                      {status === "từ chối đơn hàng" && (
                        <Form.Group>
                          <Form.Label>Lý do từ chối đơn hàng</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            value={refundReason}
                            onChange={(e) => setRefundReason(e.target.value)}
                            placeholder="Nhập lý do từ chối đơn hàng"
                          />
                        </Form.Group>
                      )}
                      <Button
                        variant="primary"
                        onClick={() => updateOrderStatus(orderDetails._id)}
                      >
                        Cập nhật trạng thái
                      </Button>
                    </>
                  )}
                <Button onClick={exportInvoiceToDoc} variant="success">
                  Xuất Hóa Đơn
                </Button>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ShipperRouter;
