

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import Modal from "./Modal";

const emptyCategoryForm = {
  title: "",
  description: "",
  image: null,
  isActive: true,
  order: 1,
};

export default function CategorySection() {
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState(emptyCategoryForm);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/category/all");
      setCategories(data.categories || []);
    } catch (error) {
      showAlert(
        error?.response?.data?.msg ||
          error?.response?.data?.error ||
          "Failed to fetch categories",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openEditCategory = (category) => {
    setSelectedCategory(category);
    setCategoryForm({
      title: category.title || "",
      description: category.description || "",
      image: null,
      isActive: Boolean(category.isActive),
      order: category.order ?? 0,
    });
    setEditCategoryOpen(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!selectedCategory) return;

    try {
      const formData = new FormData();
      formData.append("title", categoryForm.title);
      formData.append("description", categoryForm.description);
      formData.append("isActive", String(categoryForm.isActive));
      formData.append("order", String(categoryForm.order));

      if (categoryForm.image) {
        formData.append("image", categoryForm.image);
      }

      await api.put(`/admin/category/update/${selectedCategory._id}`, formData);

      showAlert("Category updated successfully");
      setEditCategoryOpen(false);
      fetchCategories();
    } catch (error) {
      showAlert(
        error?.response?.data?.msg ||
          error?.response?.data?.error ||
          "Failed to update category",
        "error"
      );
    }
  };

  return (
    <section className="admin-section">
      <div className="admin-section__header">
        <h2>Our Courses</h2>
      </div>

      {loading ? (
        <div className="state-card">Loading categories...</div>
      ) : (
        <div className="category-grid">
          {categories.map((category) => (
            <div className="category-card" key={category._id}>
              <button
                type="button"
                className="category-edit-hover-icon"
                title="Edit category"
                onClick={() => openEditCategory(category)}
              >
                ✎
              </button>

              <div className="category-card__image">
                {category.image ? (
                  <img src={getMediaUrl(category.image)} alt={category.title} />
                ) : (
                  <div className="fallback-media">
                    {category.title?.charAt(0) || "C"}
                  </div>
                )}
              </div>

              <div className="category-card__body">
                <h3>{category.title}</h3>
                <p>{category.description || "No description added yet."}</p>

                <button
                  type="button"
                  className="category-view-btn"
                  onClick={() => navigate(`/admin/courses/${category._id}`)}
                >
                  View Courses
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={editCategoryOpen}
        title={`Edit ${selectedCategory?.title || "Category"}`}
        onClose={() => setEditCategoryOpen(false)}
        width="760px"
      >
        <form className="form-grid" onSubmit={handleUpdateCategory}>
          {selectedCategory?.image ? (
            <div className="preview-box preview-box--large">
              <img
                src={getMediaUrl(selectedCategory.image)}
                alt={selectedCategory.title}
              />
            </div>
          ) : null}

          <label className="form-field">
            <span>Heading</span>
            <input
              type="text"
              value={categoryForm.title}
              onChange={(e) =>
                setCategoryForm((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </label>

          <label className="form-field">
            <span>Description</span>
            <textarea
              rows="5"
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </label>

          <label className="form-field">
            <span>Change image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCategoryForm((prev) => ({
                  ...prev,
                  image: e.target.files?.[0] || null,
                }))
              }
            />
          </label>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setEditCategoryOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Update Category
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}