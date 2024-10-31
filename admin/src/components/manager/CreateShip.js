import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ManagerHeader from "../layout/ManagerHeader";
import "../styles/ad_shipping.css";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const CreateShipmentForm = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const location = useLocation();
  const { order } = location.state || {};
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    payment_type_id: 1,
    note: "",
    required_note: "KHONGCHOXEMHANG",
    return_phone: "",
    return_address: "",
    return_district_id: "",
    return_ward_code: "",
    client_order_code: "",
    from_name: "Trung",
    from_phone: "0373516609",
    from_address: "",
    from_ward_name: "",
    from_district_name: "",
    from_province_name: "",
    to_name: "",
    to_phone: "",
    to_address: "",
    to_ward_code: "",
    to_ward_name: "",
    to_district_name: "",
    to_province_name: "",
    cod_amount: 0,
    content: "",
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    cod_failed_amount: 0,
    pick_station_id: "",
    deliver_station_id: "",
    insurance_value: 0,
    service_id: 0,
    service_type_id: 2,
    coupon: null,
    pickup_time: null,
    pick_shift: [],
    items: [],
  });

  useEffect(() => {
    if (order) {
      const totalWeight = order.items.reduce((total, item) => {
        return total + (parseInt(item.weight, 10) || 0) * item.quantity;
      }, 0);

      setFormData((prevFormData) => ({
        ...prevFormData,
        from_address: order.address,
        to_name: order.username,
        to_phone: order.phone,
        to_address: order.address,
        to_ward_code: "20308",
        client_order_code: order._id,
        cod_amount: parseInt(order.total, 10) || 0,
        content: order.items.map((item) => item.product.name).join(", "),
        items: order.items.map((item) => ({
          name: item.product.name,
          code: item.product.code,
          quantity: item.quantity,
          price: parseInt(item.price, 10) || 0,
          length: parseInt(item.product.length, 10) || 0,
          width: parseInt(item.product.width, 10) || 0,
          weight: parseInt(item.product.weight, 10) || 0,
          height: parseInt(item.product.height, 10) || 0,
        })),
        weight: totalWeight, // Gán tổng trọng lượng vào form
      }));
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const integerFields = [
      "weight",
      "length",
      "width",
      "height",
      "insurance_value",
      "cod_amount",
      "pick_station_id",
      "deliver_station_id",
    ];

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: integerFields.includes(name) ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Bước 1: Tạo đơn hàng vận chuyển
      const response = await axios.post(
        "http://localhost:10000/ship/create",
        formData
      );
      console.log("Đơn hàng vận chuyển đã được tạo:", response.data);
      toast.success("Đơn hàng vận chuyển đã được tạo thành công!");
  
      // Bước 2: Cập nhật trạng thái đơn hàng sau khi tạo đơn hàng vận chuyển thành công
      const orderId = formData.client_order_code; // Sử dụng ID đơn hàng từ formData
      await axios.put(
        `http://localhost:10000/manager/orders/${orderId}`, // Đường dẫn API cập nhật trạng thái đơn hàng
        { status: "đã bàn giao cho đơn vị vận chuyển" } // Gửi trạng thái mới
      );
      console.log("Trạng thái đơn hàng đã được cập nhật");
      toast.success("Trạng thái đơn hàng đã được cập nhật thành công!");
  
      // Điều hướng về trang chủ sau khi hoàn tất
      setTimeout(() => {
        navigate("/manager/orders"); // Điều hướng về trang chủ sau 2 giây
      }, 2000);
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng vận chuyển:", error.response?.data || error.message);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };
  

  return (
    <div className="main-container-125">
      <ManagerHeader
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />

      <form onSubmit={handleSubmit} className="container-125">
        <h1>Tạo vận chuyển</h1>
        <p></p>
        {/* Sender Information */}
        <div className="form-group">
          <label>Tên người gửi:</label>
          <input
            type="text"
            name="from_name"
            value={formData.from_name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại người gửi:</label>
          <input
            type="text"
            name="from_phone"
            value={formData.from_phone}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Địa chỉ người gửi:</label>
          <input
            type="text"
            name="from_address"
            value={formData.from_address}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Receiver Information */}
        <div className="form-group">
          <label>Tên người nhận:</label>
          <input
            type="text"
            name="to_name"
            value={formData.to_name}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Số điện thoại người nhận:</label>
          <input
            type="text"
            name="to_phone"
            value={formData.to_phone}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Địa chỉ người nhận:</label>
          <input
            type="text"
            name="to_address"
            value={formData.to_address}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        {/* Additional Information */}
        <div className="form-group">
          <label>Ghi chú:</label>
          <input
            type="text"
            name="note"
            value={formData.note}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Yêu cầu ghi chú:</label>
          <input
            type="text"
            name="required_note"
            value={formData.required_note}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Mã đơn hàng:</label>
          <input
            type="text"
            name="client_order_code"
            value={formData.client_order_code}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Tổng tiền thu hộ (COD):</label>
          <input
            type="number"
            name="cod_amount"
            value={formData.cod_amount}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Nội dung hàng hóa:</label>
          <input
            type="text"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Trọng lượng (gram):</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label>Kích thước (dài x rộng x cao) cm:</label>
          <div className="d-flex">
            <input
              type="number"
              name="length"
              value={formData.length}
              onChange={handleChange}
              className="form-control mr-2"
              placeholder="Dài"
            />
            <input
              type="number"
              name="width"
              value={formData.width}
              onChange={handleChange}
              className="form-control mr-2"
              placeholder="Rộng"
            />
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className="form-control"
              placeholder="Cao"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Giá trị bảo hiểm (VND):</label>
          <input
            type="number"
            name="insurance_value"
            value={formData.insurance_value}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Tạo đơn hàng vận chuyển
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreateShipmentForm;
