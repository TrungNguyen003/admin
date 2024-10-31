import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./components/Logins";
import Register from "./components/Register";
import ProductDetail from "./components/admin/ProductDetail";
import ProductsList from "./components/admin/ProductsList";
import EditProduct from "./components/admin/EditProduct";
import AddProduct from "./components/admin/AddProduct";
import UserManagement from "./components/admin/UserManagement";
import AdminRoute from "./components/AdminRoute";
import CategoryManager from "./components/admin/CategoryManager";
import AdminOrders from "./components/admin/OrderManager";
import AdminDashboard from "./components/admin/DashBoard";
import CreateShipmentForm from "./components/admin/CreateShipmentForm";
import AdminManageBookings from "./components/admin/AdminManageBookings";

// Các Route mới
import RoleRoute from "./components/RoleRoute";
import ManagerDashboard from "./components/manager/ManagerDashboard";
import AccountantDashboard from "./components/accountant/AccountantDashboard";
import SalesDashboard from "./components/sales/SalesDashboard";
import ShipperDashboard from "./components/shipper/ShipperDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("http://localhost:10000/users/check-auth", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (res.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(res.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("authToken");
          localStorage.removeItem("role");
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <Routes>
      {/* Chuyển hướng root / đến /admin/dashboard */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/admin/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/login"
        element={
          <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
        }
      />
      
      {/* Bọc các trang admin trong AdminRoute */}
      <Route
        element={<AdminRoute isAuthenticated={isAuthenticated} user={user} />}
      >
          <Route
          path="/admin/products"
          element={
            <ProductsList
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/admin/Bookings"
          element={
            <AdminManageBookings
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/admin/categories"
          element={
            <CategoryManager
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
            />
          }
        />
        <Route path="/admin/product-detail/:id" element={<ProductDetail />} />
        <Route path="/admin/products/add" element={<AddProduct />} />
        <Route
          path="/admin/orders"
          element={
            <AdminOrders
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/create-shipment"
          element={
            <CreateShipmentForm
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <AdminDashboard
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/admin/products/edit-product/:id"
          element={<EditProduct />}
        />
        <Route
          path="/admin/users"
          element={
            <UserManagement
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
            />
          }
        />
      </Route>

      {/* Manager Route */}
      <Route
        element={
          <RoleRoute
            isAuthenticated={isAuthenticated}
            allowedRoles={["manager"]}
          />
        }
      >
        <Route path="/manager/dashboard" element={<ManagerDashboard />} />
      </Route>

      {/* Accountant Route */}
      <Route
        element={
          <RoleRoute
            isAuthenticated={isAuthenticated}
            allowedRoles={["accountant"]}
          />
        }
      >
        <Route path="/accountant/dashboard" element={<AccountantDashboard />} />
      </Route>

      {/* Sales Staff Route */}
      <Route
        element={
          <RoleRoute
            isAuthenticated={isAuthenticated}
            allowedRoles={["sales_staff"]}
          />
        }
      >
        <Route path="/sales/dashboard" element={<SalesDashboard />} />
      </Route>

      {/* Shipper Route */}
      <Route
        element={
          <RoleRoute
            isAuthenticated={isAuthenticated}
            allowedRoles={["shipper"]}
          />
        }
      >
        <Route path="/shipper/dashboard" element={<ShipperDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
