import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useDropzone } from "react-dropzone";
import "bootstrap/dist/css/bootstrap.min.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    categoryName: "",
    stock: "",
    image: "",
    galleryImages: [],
    prices_by_weight: [{ weight: "", price: "" }], // Thêm trạng thái cho prices_by_weight
  });
  const [categories, setCategories] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:10000/admin/products/edit-product/${id}`
        );
        const fetchedProduct = response.data.product;
        console.log("Fetched product:", fetchedProduct); // In ra để kiểm tra
        setProduct({
          ...fetchedProduct,
          price: fetchedProduct.price
            ? new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              })
                .format(fetchedProduct.price)
                .replace("₫", "VND")
            : "",
          category_id: fetchedProduct.category_id
            ? fetchedProduct.category_id._id
            : "",
          categoryName: fetchedProduct.categoryName,
          galleryImages: fetchedProduct.galleryImages,
          weight: fetchedProduct.weight || "",
          prices_by_weight: fetchedProduct.prices_by_weight || [
            { weight: "", price: "" },
          ], // Set giá theo cân nặng từ API
        });
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching product", error);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const strippedValue =
      name === "price" ? value.replace(/[^\d]/g, "") : value;

    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: strippedValue,
    }));
  };

  const handleFileChange = (e) => {
    setProduct({ ...product, image: e.target.files[0] });
  };

  const onDropGallery = useCallback(
    (acceptedFiles) => {
      setGalleryFiles([...galleryFiles, ...acceptedFiles]);
    },
    [galleryFiles]
  );

  const handleDescriptionChange = (event, editor) => {
    const data = editor.getData();
    setProduct((prevProduct) => ({
      ...prevProduct,
      description: data,
    }));
  };

  const handleGalleryImageDelete = async (imageName) => {
    try {
      await axios.delete(
        `http://localhost:10000/admin/products/delete-image/${imageName}`,
        {
          params: { id: product.id },
        }
      );

      // Cập nhật danh sách hình ảnh sau khi xóa thành công
      setProduct((prevProduct) => ({
        ...prevProduct,
        galleryImages: prevProduct.galleryImages.filter(
          (img) => img !== imageName
        ),
      }));
    } catch (error) {
      console.error("Error deleting image", error);
    }
  };

  const handlePriceByWeightChange = (index, field, value) => {
    const updatedPricesByWeight = [...product.prices_by_weight];
    updatedPricesByWeight[index][field] =
      field === "price" ? value.replace(/[^\d]/g, "") : value;
    setProduct({ ...product, prices_by_weight: updatedPricesByWeight });
  };

  const handleAddPriceByWeight = () => {
    setProduct({
      ...product,
      prices_by_weight: [
        ...product.prices_by_weight,
        { weight: "", price: "" },
      ],
    });
  };

  const handleRemovePriceByWeight = (index) => {
    const updatedPricesByWeight = product.prices_by_weight.filter(
      (_, i) => i !== index
    );
    setProduct({ ...product, prices_by_weight: updatedPricesByWeight });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Product data:", product);
    console.log("Gallery files:", galleryFiles);
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("description", product.description);
    formData.append("price", parseFloat(product.price.replace(/[^\d]/g, "")));
    formData.append("category_id", product.category_id);
    formData.append("stock", product.stock);
    formData.append(
      "prices_by_weight",
      JSON.stringify(product.prices_by_weight)
    ); // Thêm prices_by_weight
    if (product.image) formData.append("image", product.image);

    try {
      await axios.post(
        `http://localhost:10000/admin/products/edit-product/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (galleryFiles.length > 0) {
        const galleryFormData = new FormData();
        galleryFiles.forEach((file) => {
          galleryFormData.append("images", file);
        });

        await axios.post(
          `http://localhost:10000/admin/products/product-gallery/${id}`,
          galleryFormData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      navigate("/admin/products");
    } catch (error) {
      console.error("Error updating product", error);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropGallery,
    accept: "image/*",
    multiple: true,
  });

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Chỉnh sửa sản phẩm</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Tên</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Mô tả</label>
          <CKEditor
            editor={ClassicEditor}
            data={product.description}
            onChange={handleDescriptionChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Giá</label>
          <input
            type="text"
            name="price"
            value={product.price}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Danh mục</label>
          <select
            name="category_id"
            value={product.category_id}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.Name}
              </option>
            ))}
          </select>
          <div className="form-text">
            Tên danh mục hiện tại: {product.categoryName}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Kho hàng</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Giá theo cân nặng</label>
          {product.prices_by_weight && product.prices_by_weight.length > 0 ? (
            product.prices_by_weight.map((item, index) => (
              <div key={index} className="d-flex gap-3 mb-2">
                <input
                  type="number"
                  placeholder="Cân nặng (kg)"
                  value={item.weight}
                  onChange={(e) =>
                    handlePriceByWeightChange(index, "weight", e.target.value)
                  }
                  className="form-control"
                  required
                />
                <input
                  type="text"
                  placeholder="Giá (VND)"
                  value={new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                    .format(item.price)
                    .replace("₫", "VND")}
                  onChange={(e) =>
                    handlePriceByWeightChange(index, "price", e.target.value)
                  }
                  className="form-control"
                  required
                />
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemovePriceByWeight(index)}
                >
                  Xóa
                </button>
              </div>
            ))
          ) : (
            <p>Chưa có mức giá theo cân nặng</p>
          )}
          <button
            type="button"
            className="btn btn-success"
            onClick={handleAddPriceByWeight}
          >
            Thêm mức giá
          </button>
        </div>
        <div className="mb-3">
          <label className="form-label">Hình ảnh hiện tại</label>
          {product.image && (
            <div className="mb-2">
              <img
                src={`http://localhost:10000/product_images/${product.id}/${product.image}`}
                alt="Current product"
                style={{ width: "200px", height: "auto" }}
              />
            </div>
          )}
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Hình ảnh trưng bày hiện tại</label>
          <div className="d-flex gap-2 flex-wrap">
            {product.galleryImages.length > 0 ? (
              product.galleryImages.map((img, index) => (
                <div
                  key={index}
                  className="position-relative"
                  style={{ display: "inline-block" }}
                >
                  <img
                    src={`http://localhost:10000/product_images/${product.id}/gallery/${img}`}
                    alt=""
                    style={{ width: "100px", height: "auto" }}
                  />
                  <button
                    type="button"
                    onClick={() => handleGalleryImageDelete(img)}
                    className="btn btn-danger btn-sm position-absolute top-0 end-0"
                    style={{ borderRadius: "50%" }}
                  >
                    X
                  </button>
                </div>
              ))
            ) : (
              <p>Không có hình ảnh trưng bày</p>
            )}
          </div>
          <div
            {...getRootProps()}
            className="dropzone mt-3"
            style={{
              border: "2px dashed #0087F7",
              padding: "20px",
            }}
          >
            <input {...getInputProps()} />
            <p>Kéo thả hình ảnh trưng bày vào đây hoặc click để chọn ảnh</p>
            <div className="d-flex gap-2">
              {galleryFiles.map((file, index) => (
                <div key={index} style={{ display: "inline-block" }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    style={{ width: "100px", height: "auto" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Cập nhật sản phẩm
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
