import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import AddProduct from "./AddProduct";
import Modal from "react-modal";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminHeader from "../layout/AdminHeader";
import "../styles/product_list.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
Modal.setAppElement("#root");

const ProductList = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const [products, setProducts] = useState([]);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(7);
  const [filterName, setFilterName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPrice, setFilterPrice] = useState("");
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:10000/admin/products",
          {
            params: {
              page: currentPage,
              limit: productsPerPage,
              name: filterName,
              category: filterCategory,
              price: filterPrice,
            },
          }
        );
        setProducts(response.data.products);
        setCount(response.data.count);
      } catch (error) {
        console.error("Error fetching products", error);
        toast.error("Không tải được sản phẩm.");
      }
    };

    fetchProducts();
  }, [currentPage, filterName, filterCategory, filterPrice]);

  const handleDelete = async (productId) => {
    try {
      await axios.get(
        `http://localhost:10000/admin/products/delete-product/${productId}`
      );
      setProducts(products.filter((product) => product._id !== productId));
      toast.success("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product", error);
      toast.error("Không xóa được sản phẩm.");
    }
  };

  const totalPages = Math.ceil(count / productsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="main-container-122">
      <ToastContainer />
      <AdminHeader
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <div className="container-122">
        <h2 className="my-4">Danh sách sản phẩm</h2>
        <button className="btn btn-primary mb-3" onClick={openModal}>
          Add Product
        </button>
        <p>Total Products: {count}</p>

        <div className="mb-3">
          <label>Lọc theo Tên:</label>
          <input
            type="text"
            value={filterName}
            className="form-control"
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Nhập tên sản phẩm"
          />
        </div>
        <div className="mb-3">
          <label>Lọc theo danh mục:</label>
          <input
            type="text"
            value={filterCategory}
            className="form-control"
            onChange={(e) => setFilterCategory(e.target.value)}
            placeholder="Nhập danh mục"
          />
        </div>
        <div className="mb-3">
          <label>Lọc theo giá:</label>
          <input
            type="number"
            value={filterPrice}
            className="form-control"
            onChange={(e) => setFilterPrice(e.target.value)}
            placeholder="Nhập giá tối đa"
          />
        </div>
        <button
          className="btn btn-success mb-4"
          onClick={() => setCurrentPage(1)}
        >
          Áp dụng bộ lọc
        </button>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th>Mô tả</th>
              <th>Giá</th>
              <th>Hình ảnh</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  {product.name.length > 50
                    ? product.name.substring(0, 5) + "..."
                    : product.name}
                </td>
                <td
                  dangerouslySetInnerHTML={{
                    __html:
                      product.description.length > 100
                        ? product.description.substring(0, 40) + "..."
                        : product.description,
                  }}
                ></td>
                <td>{formatCurrency(product.price).replace("₫", "VND")}</td>
                <td>
                  {product.image && (
                    <img
                      src={`http://localhost:10000/product_images/${product._id}/${product.image}`}
                      alt={product.name}
                      className="img-fluid"
                      style={{ width: "100px", height: "auto" }}
                    />
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() =>
                      navigate(`/admin/products/edit-product/${product._id}`)
                    }
                  >
                    Chỉnh sửa
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(product._id)}
                  >
                    Loại bỏ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="d-flex justify-content-between my-3">
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          <span>
            Trang {currentPage} của {totalPages}
          </span>
          <button
            className="btn btn-secondary"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Add Product Modal"
          className="modal-content-124"
          overlayClassName="modal-overlay"
        >
          <AddProduct />
          <p></p>
          <button className="btn btn-secondary mb-3" onClick={closeModal}>
            Đóng
          </button>
        </Modal>
      </div>
    </div>
  );
};

export default ProductList;
