import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS cho toastify
import { ClipLoader } from 'react-spinners'; // Hoặc import spinner bạn muốn sử dụng
import "./styles/login.css";

const Login = ({ setIsAuthenticated, setUser }) => {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State cho Remember Me
  const [loading, setLoading] = useState(false); // State cho loading
  const navigate = useNavigate();

  useEffect(() => {
    // Tự động điền thông tin đăng nhập nếu có trong localStorage
    const savedGmail = localStorage.getItem("rememberedGmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedGmail && savedPassword) {
      setGmail(savedGmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (gmail, password) => {
    setLoading(true); // Bắt đầu loading
    try {
      const res = await axios.post(
        "http://localhost:10000/users/login",
        { gmail, password },
        { withCredentials: true }
      );
      const { userId, token, role, user } = res.data;
      localStorage.setItem("userId", userId);
      localStorage.setItem("authToken", token);
      localStorage.setItem("role", role);

      if (res.data.msg === "Đăng nhập thành công") {
        setIsAuthenticated(true);
        setUser(user); // Set the user state
        toast.success("Đăng nhập thành công. Đang chuyển hướng...");

        if (rememberMe) {
          localStorage.setItem("rememberedGmail", gmail);
          localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberedGmail");
          localStorage.removeItem("rememberedPassword");
        }

        // Chuyển hướng dựa trên vai trò
        switch (role) {
          case "admin":
            setTimeout(() => navigate("/admin/dashboard"), 2000);
            break;
          case "manager":
            setTimeout(() => navigate("/manager/dashboard"), 2000);
            break;
          case "sales_staff_1":
            setTimeout(() => navigate("/staff1/dashboard"), 2000);
            break;
          case "sales_staff_2":
            setTimeout(() => navigate("/staff2/dashboard"), 2000);
            break;
          case "shipper":
            setTimeout(() => navigate("/shipper/dashboard"), 2000);
            break;
          default:
            break;
        }
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      if (err.response) {
        toast.error(err.response.data.msg);
      } else if (err.request) {
        toast.error("Không có phản hồi từ máy chủ. Vui lòng thử lại sau.");
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(gmail, password);
  };

  return (
    <>
      <div className="main-container-5">
        <div className="flex-row-dd-5">
          <div className="rectangle-1-5">
            <div className="flex-row-5">
              <div className="vector-5" />
              <div className="logo-2-5" />
              <span className="dashboard-5">dashboard</span>
            </div>
            <span className="welcome-back-5">Chào mừng trở lại!</span>
            <span className="login-3-5">Đăng nhập</span>
            <span className="sign-in-account-5">
              Đăng nhập vào tài khoản của bạn
            </span>
            <form onSubmit={handleSubmit}>
              <div className="rectangle-4-5">
                <div className="flex-row-d-5">
                  <div className="lets-icons-user-duotone-5">
                    <div className="vector-5-5" />
                    <div className="vector-6-5" />
                  </div>
                  <input
                    className="user-name-5"
                    type="email"
                    placeholder="Gmail"
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                    required
                  />
                </div>
                <div className="rectangle-7-5" />
              </div>
              <div className="rectangle-8-5">
                <div className="flex-row-fe-5">
                  <div className="ph-key-bold-5">
                    <div className="vector-9-5" />
                  </div>
                  <input
                    className="password-5"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="rectangle-a-5" />
              </div>

              <button className="rectangle-btn-5" disabled={loading}>
                {loading ? ( // Hiển thị spinner khi loading
                  <ClipLoader size={20} color={"#fff"} loading={loading} />
                ) : (
                  <span className="login-span-5">Đăng nhập</span>
                )}
              </button>
            </form>
          </div>
          <div className="rectangle-b-5" />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;


{
  /* <div className="image-5" />
<span className="welcome-back-5">Welcome back</span>
<div className="inner-plugin-iframe-5">
  <div className="vector-5" />
</div>
<button className="rectangle-5" />
<Link to="/"><span className="back-to-website-5">back to website</span></Link>
<Link to="/register"><span className="register-5">Register</span></Link>
<span className="no-account-5">You do not have an account?</span>
<form onSubmit={handleSubmit}>
  <div className="rectangle-1-5" />
  <input
    className="group-input-5"
    type="email"
    placeholder="Gmail"
    value={gmail}
    onChange={(e) => setGmail(e.target.value)}
    required
  />
  <div className="rectangle-2-5" />
  <input
    className="group-input-3-5"
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
  />
  <label className="remember-me-5">
    <input
      type="checkbox"
      checked={rememberMe}
      onChange={(e) => setRememberMe(e.target.checked)}
    />
    Remember me
  </label>
  <button className="rectangle-button-5">
    <span className="login-span-5">Login</span>
  </button>
</form>
<span className="or-login-span-5">Or login with</span>
<div className="line-div-5" />
<div className="line-div-6-5" />
<button className="rectangle-button-7-5" />
<button className="rectangle-button-8-5" />
<div className="vector-9-5" />
<div className="facebook-5">
  <div className="vector-a-5" />
</div>
<span className="facebook-text-5">Facebook</span>
<span className="google-text-5">Google</span> */
}
