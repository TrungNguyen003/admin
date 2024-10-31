import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
} from "docx";
import { saveAs } from "file-saver";
import Staff2Header from "../layout/Staff_2_Header";
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

  const generateDocx = (booking) => {
    const doc = new Document({
      sections: [
        {
          children: [
            // Company Header
            new Paragraph({
              children: [
                new TextRun({
                  text: "Hoá đơn mua sắm",
                  bold: true,
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Paragraph({
              children: [
                new TextRun("Shoppets"),
                new TextRun({
                  text: "\n123 Tam Trinh, Hà Nội, Việt Nam",
                  break: 1,
                }),
                new TextRun({ text: "\nSĐT: 0373516608", break: 1 }),
                new TextRun({ text: "\nEmail: info@shoppets.com", break: 1 }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 800 },
            }),

            // Invoice Title
            new Paragraph({
              children: [
                new TextRun({
                  text: `Hóa đơn cho mã đặt chỗ: ${booking._id}`,
                  bold: true,
                  size: 24,
                  underline: { type: "single" },
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),

            // Booking and Client Details
            new Paragraph({
              children: [
                new TextRun({
                  text: `Tên khách hàng: ${booking.owner.username}`,
                  bold: true,
                }),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [new TextRun(`Tên thú cưng: ${booking.petName}`)],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [new TextRun(`Loại thú cưng: ${booking.petType}`)],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun(
                  `Ngày đặt: ${formatBookingDate(booking.bookingDate)}`
                ),
              ],
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [new TextRun(`Trạng thái: ${booking.bookingStatus}`)],
              spacing: { after: 400 },
            }),

            // Services Summary
            new Paragraph({
              children: [
                new TextRun({
                  text: "Chi tiết dịch vụ",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { after: 300 },
            }),
            ...booking.selectedServices.map(
              (service) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `• ${
                        service.serviceName
                      }: ${service.price.toLocaleString()} VND`,
                    }),
                  ],
                  spacing: { after: 150 },
                  indent: { left: 400 },
                })
            ),

            // Total Cost
            new Paragraph({
              children: [
                new TextRun({
                  text: `Tổng chi phí: ${booking.selectedServices
                    .reduce((sum, service) => sum + service.price, 0)
                    .toLocaleString()} VND`,
                  bold: true,
                }),
              ],
              spacing: { before: 400, after: 400 },
              alignment: AlignmentType.RIGHT,
            }),

            // Footer
            new Paragraph({
              children: [
                new TextRun({
                  text: "Cảm ơn bạn đã lựa chọn Shoppet! Chúng tôi mong được phục vụ bạn và thú cưng của bạn một lần nữa.",
                  italics: true,
                  size: 20,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { before: 600, after: 200 },
            }),
          ],
        },
      ],
    });

    // Save document
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `Shoppets_Invoice_${booking.petName}_${booking._id}.docx`);
    });
  };

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="main-container-127">
        <Staff2Header
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
                    <td>{formatBookingDate(booking.bookingDate)}</td>
                    <td>{booking.bookingStatus}</td>
                    <td>
                      {booking.bookingStatus !== "confirmed" && (
                        <button
                          className="btn btn-success me-2"
                          onClick={() =>
                            handleUpdateStatus(booking._id, "confirmed")
                          }
                        >
                          Xác nhận
                        </button>
                      )}
                      <button
                        className="btn btn-danger me-2"
                        onClick={() => handleCancelBooking(booking._id)}
                      >
                        Loại bỏ
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => generateDocx(booking)}
                      >
                        Tải File DOCX
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
