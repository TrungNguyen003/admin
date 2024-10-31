import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify'; // Nhập ToastContainer và toast
import 'react-toastify/dist/ReactToastify.css'; // Nhập stylesheet cho Toastify
import "./styles/register.css";

const Register = () => {
  // State để lưu trữ dữ liệu form
  const [formData, setFormData] = useState({
    username: "",
    gmail: "",
    password: "",
    password2: "",
    role: "customer", // Vai trò mặc định là "customer"
  });

  // State để lưu trữ thông báo lỗi hoặc thành công
  const [message, setMessage] = useState("");
  // Hàm điều hướng để chuyển trang
  const navigate = useNavigate();

  // Destructuring các giá trị từ formData
  const { username, gmail, password, password2, role } = formData;

  // Hàm xử lý sự kiện thay đổi input
  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Hàm xử lý sự kiện khi form được submit
  const onSubmit = async (e) => {
    e.preventDefault(); // Ngăn chặn hành vi mặc định của form

    // Kiểm tra xem mật khẩu và xác nhận mật khẩu có khớp không
    if (password !== password2) {
      toast.error("Mật khẩu không khớp"); // Hiển thị thông báo lỗi
    } else {
      const newUser = {
        username,
        gmail,
        password,
        password2,
        role,
      };

      try {
        // Gửi yêu cầu đăng ký người dùng mới
        const res = await axios.post(
          "http://localhost:10000/users/register",
          newUser
        );
        toast.success("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản."); // Hiển thị thông báo thành công

        // Chuyển đến trang đăng nhập sau 2 giây
        setTimeout(() => navigate("/login"), 2000);
      } catch (err) {
        // Xử lý lỗi nếu có
        toast.error(
          err.response && err.response.data
            ? err.response.data.msg || "Đã xảy ra lỗi trong quá trình đăng ký"
            : "Đã xảy ra lỗi trong quá trình đăng ký"
        ); // Hiển thị thông báo lỗi
      }
    }
  };

  return (
    <>
      <div className="main-container-4">
        <span className="create-account-4">Create an account</span>
        <div className="image-4">
          <div className="inner-plugin-iframe-4">
            <div className="vector-4" />
          </div>
          <Link to="/"><span className="back-to-website-4">back to website</span></Link>
        </div>
        <div className="rectangle-4" />
        <Link to="/login"><span className="login-4">Login</span></Link>
        <span className="already-have-account-4">Already have an account?</span>
        
        {/* {message && <p className="message">{message}</p>} */} {/* Thay thế thông báo bằng Toastify */}
        
        <form onSubmit={onSubmit}>
          <input
            className="rectangle-1-4"
            type="text"
            placeholder="User Name"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
          <input
            className="rectangle-2-4"
            type="email"
            placeholder="Gmail"
            name="gmail"
            value={gmail}
            onChange={onChange}
            required
          />
          <input
            className="rectangle-3-4"
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={onChange}
            required
          />
          <input
            className="rectangle-4-4"
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={onChange}
            required
          />
          <span className="terms-conditions-4">Terms & Conditions</span>
          <span className="agree-terms-4">I agree to the</span>
          <div className="rectangle-5-4">
            <div className="vector-6-4" />
          </div>
          <button className="rectangle-7-4" type="submit">
            <span className="create-account-8-4">Create Account</span>
          </button>
        </form>
        <span className="register-with-4">Or register with</span>
        <div className="line-4" />
        <div className="line-9-4" />
        <button className="rectangle-a-4" />
        <button className="rectangle-b-4" />
        <div className="facebook-4">
          <div className="vector-c-4" />
        </div>
        <div className="vector-d-4" />
        <span className="google-4">Google</span>
        <span className="facebook-e-4">Facebook</span>
      </div>
      <ToastContainer /> {/* Thêm ToastContainer vào cuối component */}
    </>
  );
};

export default Register;
