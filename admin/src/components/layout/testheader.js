import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import Navigation from "./Navigation";

function HeaderTest({ isAuthenticated, user, setIsAuthenticated, setUser }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isAdmin = localStorage.getItem("role") === "admin";

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

  useEffect(() => {
    const fetchCartCount = async () => {
      if (isAuthenticated && user) {
        try {
          const res = await axios.get(`http://localhost:10000/cart/${user._id}`);
          setCartCount(res.data.items.length);
        } catch (err) {
          console.error("Error fetching cart data:", err);
        }
      }
    };

    fetchCartCount();
  }, [isAuthenticated, user]);

  // Debugging log
  useEffect(() => {
    console.log("User data:", user);
  }, [user]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="main-container">
      <span className="welcome-message">Welcome to shop !!!</span>
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
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="ellipse" />
        <span className="category">Category</span>
        <span className="number">{cartCount}</span>
        <div className="shopping-cart">
          <Link to="/cart">
            <div className="shopping-cart-3"></div>
          </Link>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>
        <div className="notification-bell">
          <i className="fa-regular fa-bell"></i>
        </div>
        <div className="user-profile">
          {isAuthenticated ? (
            <>
              {isAdmin && (
                <>
                  <Link to="/admin/products/add">Add Product</Link>
                  <Link to="/admin/categories">Category Management</Link>
                  <Link to="/admin/products">Product Management</Link>
                  <Link to="/admin/users">Users Management</Link>
                  <Link to="/admin/orders">Order Management</Link>
                  <Link to="/admin/dashboard">Admin Dashboard</Link>
                </>
              )}
              <div className="user-dropdown">
                <button onClick={toggleDropdown}>
                  {user && <span><i className="fa-solid fa-user"></i> {user.username}</span>}
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <Link to="/orders">Orders</Link>
                    <Link to="/account">Account</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
                
              </div>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
}

export default HeaderTest;
