import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminHeader from "../layout/AdminHeader";
import "../styles/Bookings.css";
const AdminManageBookings = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:10000/spa/admin/bookings"
        );
        setBookings(response.data);
      } catch (err) {
        setError(err.response.data.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:10000/spa/admin/bookings/${id}`, {
        status,
      });
      setBookings(
        bookings.map((booking) =>
          booking._id === id ? { ...booking, bookingStatus: status } : booking
        )
      );
      toast.success("Trạng thái đặt lịch đã được cập nhật thành công!");
    } catch (err) {
      setError(
        err.response.data.message || "Không cập nhật được trạng thái đặt chỗ"
      );
      toast.error("Không cập nhật được trạng thái đặt chỗ.");
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:10000/spa/admin/bookings/${id}`);
      setBookings(bookings.filter((booking) => booking._id !== id));
      toast.success("Đã hủy đặt lịch thành công!");
    } catch (err) {
      setError(err.response.data.message || "Không thể hủy đặt lịch");
      toast.error("Không thể hủy đặt lịch.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const formatBookingDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <>
      <div className="main-container-127">
        <AdminHeader
          isAuthenticated={isAuthenticated}
          user={user}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
        />
        <div className="container-127">
          <h1>Quản lý Đặt lịch</h1>
          {bookings.length === 0 ? (
            <p>Không tìm thấy đặt</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Tên thú cưng</th>
                  <th>Loại thú cưng</th>
                  <th>Tên chủ sở hữu</th>
                  <th>loại dịch vụ</th>
                  <th>Ngày đặt chỗ</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.petName}</td>
                    <td>{booking.petType}</td>
                    <td>{booking.owner.username}</td>
                    <td>
                      {booking.selectedServices.map((service, index) => (
                        <div key={index}>{service.serviceName}</div>
                      ))}
                    </td>
                    <td>{formatBookingDate(booking.bookingDate)}</td>{" "}
                    {/* Hiển thị ngày với AM/PM */}
                    <td>{booking.bookingStatus}</td>
                    <td>
                      <button
                        className="btn btn-success me-2"
                        onClick={() =>
                          handleUpdateStatus(booking._id, "confirmed")
                        }
                      >
                        Xác nhận
                      </button>
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Loại bỏ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <ToastContainer />
        </div>
      </div>
    </>
  );
};

export default AdminManageBookings;
