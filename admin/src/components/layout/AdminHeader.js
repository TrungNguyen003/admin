import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/header_admin.css";
import axios from "axios";
function AdminHeader({ isAuthenticated, user, setIsAuthenticated, setUser }) {
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
          {/* <div className="logo-119" /> */}
          <div className="pets-store-119">
            <span className="pets-119">Pets</span>
            <span className="store-119">Store</span>
          </div>
        </div>
        {/* <div className="flex-row-dce-119">
          <div className="rectangle-1-119" />
          <span className="micelle-amoid-119">PetsStore</span>
          {user.username}
        </div> */}
        <button className="rectangle-2-119" onClick={toggleDropdown}>
        <div className="vector-119" />
        <Link to="/admin/dashboard">
          <span className="dashboard-119">Trang chủ</span>
        </Link>
        <div className="vector-3-119" />
      </button>
      
      {dropdownOpen && (
        <div className="dropdown-menu-119">
          <div className="flex-row-eb-119">
            <div className="frame-119" />
            <Link to="/admin/orders">
              <span className="bill-order-119"><i class="fa-solid fa-box"></i>&nbsp;Đơn hàng </span>
            </Link>
            <div className="octicon-people-119" />
            <Link to="/admin/users">
              <span className="user-management-119"><i class="fa-solid fa-user"></i>&nbsp; Người dùng</span>
            </Link>
            <Link to="/admin/categories">
              <span className="messenger-119"><i class="fa-solid fa-list"></i> &nbsp; doanh mục</span>
            </Link>
            <Link to="/admin/products"> 
              <span className="product-119"><i class="fa-solid fa-cat"></i> &nbsp;sản phẩm</span>
            </Link>
            <div className="carbon-product-119" />
            <Link to="/admin/Bookings">
            <span className="setting-119"><i class="fa-solid fa-paw"></i> &nbsp;Đơn spa</span>
            </Link>
            <button onClick={handleLogout} className="sign-out-119">đăng xuất &nbsp; <i class="fa-solid fa-right-from-bracket"></i></button>
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

export default AdminHeader;

{
  /* <span className="welcome-message">Welcome to shop !!!</span>
      <div className="rectangle">
        <div className="logo" />
        <div className="pets-store">
          <Link to="/">
            <span className="pets">Pets</span>
            <span className="store">Store</span>
          </Link>
        </div>
        <div className="rectangle-1">
          <input
            type="text"
            placeholder="Search by Category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            <i className="fa fa-search"></i>
          </button>
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion._id}
                  onClick={() => setSearchQuery(suggestion.Name)}
                >
                  {suggestion.Name}
                </li>f
              ))}
            </ul>
          )}
        </div>
        <span className="category">Category</span>
        <div className="notification-bell">
          <i className="fa-regular fa-bell"></i>
        </div>
        <div className="user-profile">
          {isAuthenticated ? (
            <div className="user-dropdown">
              <button onClick={toggleDropdown}>
                {user && (
                  <span>
                  {user.username}
                  </span>
                )}
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/admin/products/add">Add Product</Link>
                  <Link to="/admin/categories">Category Management</Link>
                  <Link to="/admin/products">Product Management</Link>
                  <Link to="/admin/users">Users Management</Link>
                  <Link to="/admin/orders">Order Management</Link>
                  <Link to="/admin/dashboard">Admin Dashboard</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div> */
}
