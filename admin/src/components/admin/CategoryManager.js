import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import { Button, Form, Table, Pagination, Alert } from "react-bootstrap"; // Import Bootstrap components
import AdminHeader from "../layout/AdminHeader";
import "../styles/categories.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const CategoryManager = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    Category_ID: "",
    Name: "",
    Description: "",
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterName, setFilterName] = useState("");
  const [filterID, setFilterID] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:10000/admin/categories`,
          {
            params: {
              page: currentPage,
              pageSize,
              name: filterName,
              categoryId: filterID,
            },
          }
        );
        setCategories(response.data.categories);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching categories", error);
        setMessage("Failed to load categories");
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, [currentPage, filterName, filterID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      try {
        const response = await axios.put(
          `http://localhost:10000/admin/categories/edit-category/${currentId}`,
          form
        );
        setMessage(response.data.message);
        setCategories(
          categories.map((cat) =>
            cat._id === currentId ? response.data.category : cat
          )
        );
      } catch (error) {
        console.error("Error updating category", error);
        setMessage("Failed to update category");
        toast.error("Failed to update category");
      }
    } else {
      try {
        const response = await axios.post(
          "http://localhost:10000/admin/categories/add-category",
          form
        );
        setMessage(response.data.message);
        toast.success(response.data.message);
        setCategories([...categories, response.data.category]);
      } catch (error) {
        console.error("Error adding category", error);
        setMessage("Failed to add category");
        toast.error("Failed to add category");
      }
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (category) => {
    setForm({
      Category_ID: category.Category_ID,
      Name: category.Name,
      Description: category.Description,
    });
    setEditMode(true);
    setCurrentId(category._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:10000/admin/categories/delete-category/${id}`
      );
      setMessage(response.data.message);
      toast.success(response.data.message);
      setCategories(categories.filter((category) => category._id !== id));
    } catch (error) {
      console.error("Error deleting category", error);
      setMessage("Failed to delete category");
      toast.error("Failed to delete category");
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const resetForm = () => {
    setForm({ Category_ID: "", Name: "", Description: "" });
    setEditMode(false);
    setCurrentId(null);
  };

  return (
    <div className="main-container-123">
      <AdminHeader
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <div className="container-123">
        <h2>Quản lý danh mục</h2>
        {message && <Alert variant="info">{message}</Alert>}

        {/* Filter Section */}
        <div className="d-flex mb-4">
          <Form.Group className="mr-3">
            <Form.Label>Lọc theo Tên:</Form.Label>
            <Form.Control
              type="text"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              placeholder="Nhập tên danh mục"
            />
          </Form.Group>

          <Form.Group className="mr-3">
            <Form.Label>Lọc theo ID danh mục:</Form.Label>
            <Form.Control
              type="text"
              value={filterID}
              onChange={(e) => setFilterID(e.target.value)}
              placeholder="Nhập ID danh mục"
            />
          </Form.Group>

          <Button className="align-self-end" onClick={handleFilterChange}>
            Áp dụng bộ lọc
          </Button>
        </div>

        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          Thêm danh mục
        </Button>

        {/* Modal for Add/Edit Category */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          className="ReactModal__Content-3"
          overlayClassName="ReactModal__Overlay-2"
          contentLabel="Refund Reason"
        >
          <div className="modal-header">
            <h5 className="modal-title">
              {editMode ? "Chỉnh sửa danh mục" : "Thêm danh mục"}
            </h5>
            <Button variant="close" onClick={() => setIsModalOpen(false)} />
          </div>
          <div className="modal-body">
            <Form onSubmit={handleSubmit}>
              <Form.Group>
                <Form.Label>ID danh mục</Form.Label>
                <Form.Control
                  type="text"
                  name="Category_ID"
                  value={form.Category_ID}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Tên</Form.Label>
                <Form.Control
                  type="text"
                  name="Name"
                  value={form.Name}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Mô tả</Form.Label>
                <Form.Control
                  as="textarea"
                  name="Description"
                  value={form.Description}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>

              <div className="modal-footer">
                <Button variant="primary" type="submit">
                  {editMode ? "Cập nhật" : "Thêm"} Loại
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </Form>
          </div>
        </Modal>

        {/* Categories Table */}
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên</th>
              <th>Mô tả</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category._id}>
                <td>{category.Category_ID}</td>
                <td>{category.Name}</td>
                <td>{category.Description}</td>
                <td>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(category)}
                  >
                    Chỉnh sửa
                  </Button>{" "}
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(category._id)}
                  >
                    Xóa bỏ
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* Pagination */}
        <Pagination>
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          <Pagination.Item>{currentPage}</Pagination.Item>
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CategoryManager;
