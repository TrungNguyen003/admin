import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/header_admin.css";
import axios from "axios";

function ShipperHeader({ isAuthenticated, user, setIsAuthenticated, setUser }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(true);


  const handleLogout = async () => {
    try {
      const res = await axios.get("http://localhost:10000/users/logout", {
        withCredentials: true,
      });
      if (res.status === 200) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const handleSearch = () => {
    navigate(`/search?query=${searchQuery}`);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 0) {
        try {
          const res = await axios.get(
            "http://localhost:10000/categories/suggestions",
            {
              params: { query: searchQuery },
            }
          );
          setSuggestions(res.data);
        } catch (err) {
          console.error("Error fetching category suggestions:", err);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchQuery]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="Main-Header-119">
      <div className="rectangle-119">
        <div className="flex-row-bba-119">
          <div className="pets-store-119">
            <span className="pets-119">Pets</span>
            <span className="store-119">Store</span>
          </div>
        </div>
        <button className="rectangle-2-119" onClick={toggleDropdown}>
        <div className="vector-119" />
        <Link to="/shipper/dashboard">
          <span className="dashboard-119">Trang chủ</span>
        </Link>
        <div className="vector-3-119" />
      </button>
      
      {dropdownOpen && (
        <div className="dropdown-menu-119">
          <div className="flex-row-eb-119">
            <div className="frame-119" />
            <Link to="/shipper/dashboard">
              <span className="bill-order-119"><i class="fa-solid fa-box"></i>&nbsp;Đơn hàng </span>
            </Link>
            <div className="octicon-people-119" />
            {/* <Link to="/manager/categories">
              <span className="user-management-119"><i class="fa-solid fa-list"></i> &nbsp; danh mục</span>
            </Link> */}
            {/* <Link to="/staff2/products"> 
              <span className="user-management-119"><i class="fa-solid fa-cat"></i> &nbsp;sản phẩm</span>
            </Link> */}
            <button onClick={handleLogout} className="sign-out-119">đăng xuất &nbsp; <i class="fa-solid fa-right-from-bracket"></i></button>
            {/* <Link to="/admin/users">
              <span className="user-management-119"><i class="fa-solid fa-user"></i>&nbsp; Người dùng</span>
            </Link> */}
            {/* <Link to="/admin/categories">
              <span className="messenger-119"><i class="fa-solid fa-list"></i> &nbsp; doanh mục</span>
            </Link> */}
            {/* <Link to="/admin/products"> 
              <span className="product-119"><i class="fa-solid fa-cat"></i> &nbsp;sản phẩm</span>
            </Link> */}
            <div className="carbon-product-119" />
            {/* <Link to="/admin/Bookings">
            <span className="setting-119"><i class="fa-solid fa-paw"></i> &nbsp;Đơn spa</span>
            </Link> */}
            {/* <button onClick={handleLogout} className="sign-out-119">đăng xuất &nbsp; <i class="fa-solid fa-right-from-bracket"></i></button> */}
          </div>
        </div>
      )}
      </div>
      <div className="rectangle-4-119">
        <div className="rectangle-5-119" />
        <span className="welcome-back-119">Welcome back,</span>
        <button className="ellipse-119" />

        <div className="rectangle-6-119">
          <input className="group-input-119" />
        </div>

        {/* <span className="micelle-amoid-8-119">{user.username}</span> */}
        <span className="micelle-amoid-8-119">PetsStore</span>
      </div>
    </div>
  );
}

export default ShipperHeader;

