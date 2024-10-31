import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Header_ad.css";
import axios from "axios";
function AdminHeader({ isAuthenticated, user, setIsAuthenticated, setUser }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

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
        <div className="flex-row-dce-119">
          <div className="rectangle-1-119" />
          {/* <span className="micelle-amoid-119">{user.username}</span> */}
          {/* <span className="micelle-amoid-119">PetsStore</span> */}
        </div>
        <button className="rectangle-2-119">
          <div className="vector-119" />
          <span className="dashboard-119">dashboard</span>
          <div className="vector-3-119" />
        </button>
      </div>
      <div className="rectangle-4-119">
        <div className="rectangle-5-119" />
        <span className="welcome-back-119">Welcome back,</span>
        <button className="ellipse-119" />
        <span className="text-c-119">4</span>
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
