import React, { useState, useEffect } from "react";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "bootstrap/dist/css/bootstrap.min.css";

const AddProduct = ({ closeModal }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [stock, setStock] = useState("");
  const [weight, setWeight] = useState(""); // Single weight input (optional)
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New state for prices by weight
  const [pricesByWeight, setPricesByWeight] = useState([{ weight: "", price: "" }]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:10000/admin/categories");
        if (Array.isArray(response.data.categories)) {
          setCategories(response.data.categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching categories", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handlePricesByWeightChange = (index, field, value) => {
    const updatedPricesByWeight = [...pricesByWeight];
    updatedPricesByWeight[index][field] = value;
    setPricesByWeight(updatedPricesByWeight);
  };

  const handleAddPriceByWeight = () => {
    setPricesByWeight([...pricesByWeight, { weight: "", price: "" }]);
  };

  const handleRemovePriceByWeight = (index) => {
    const updatedPricesByWeight = pricesByWeight.filter((_, i) => i !== index);
    setPricesByWeight(updatedPricesByWeight);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category_id", categoryId);
    formData.append("stock", stock);
    formData.append("weight", weight); // Optional default weight
    formData.append("image", image);
  
    // Kiểm tra dữ liệu prices_by_weight trước khi gửi
    console.log("Prices by Weight:", pricesByWeight);
  
    // Chuyển đổi mảng prices_by_weight thành JSON string
    formData.append("prices_by_weight", JSON.stringify(pricesByWeight));

    // Append prices_by_weight array to formData
    pricesByWeight.forEach((priceByWeight, index) => {
      formData.append(`prices_by_weight[${index}][weight]`, priceByWeight.weight);
      formData.append(`prices_by_weight[${index}][price]`, priceByWeight.price);
    });

    try {
      const response = await axios.post(
        "http://localhost:10000/admin/products/add-product",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      );

      if (response.status === 200) {
        setMessage("Product added successfully");
        setName("");
        setDescription("");
        setPrice("");
        setCategoryId("");
        setStock("");
        setWeight(""); // Reset weight field
        setPricesByWeight([{ weight: "", price: "" }]); // Reset prices_by_weight
        setImage(null);
        closeModal(); // Close modal after successful submission
      } else {
        setMessage("Failed to add product");
      }
    } catch (error) {
      console.error("Error adding product", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2>Thêm sản phẩm</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên sản phẩm</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Mô tả</label>
          <CKEditor
            editor={ClassicEditor}
            data={description}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDescription(data);
            }}
          />
        </div>
        <div className="form-group">
          <label>Giá</label>
          <input
            type="number"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Danh mục</label>
          <select
            className="form-control"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
          >
            <option value="">Chọn một danh mục</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.Name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Stock</label>
          <input
            type="number"
            className="form-control"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Cân nặng (kg)</label>
          <input
            type="number"
            className="form-control"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Giá theo Trọng lượng</label>
          {pricesByWeight.map((priceByWeight, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <input
                type="number"
                placeholder="Cân nặng (kg)"
                className="form-control mr-2"
                value={priceByWeight.weight}
                onChange={(e) =>
                  handlePricesByWeightChange(index, "weight", e.target.value)
                }
                required
              />
              <input
                type="number"
                placeholder="Giá"
                className="form-control mr-2"
                value={priceByWeight.price}
                onChange={(e) =>
                  handlePricesByWeightChange(index, "price", e.target.value)
                }
                required
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleRemovePriceByWeight(index)}
              >
                Bỏ
              </button>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAddPriceByWeight}
          >
            Thêm giá theo trọng lượng
          </button>
        </div>
        <div className="form-group">
          <label>Hình ảnh</label>
          <input
            type="file"
            className="form-control-file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Product"}
        </button>
      </form>
      <h3 className="mt-4">Xem trước: </h3>
      <div
        dangerouslySetInnerHTML={{ __html: description }}
        className="border p-3 mt-2"
      />
    </div>
  );
};

export default AddProduct;
