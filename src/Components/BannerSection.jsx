
import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import Modal from "./Modal";

const emptyForm = {
  title: "",
  image: null,
};

export default function BannerSection() {
  const { showAlert } = useAlert();

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [addOpen, setAddOpen] = useState(false);
  const [manageEditOpen, setManageEditOpen] = useState(false);
  const [manageDeleteOpen, setManageDeleteOpen] = useState(false);
  const [singleEditOpen, setSingleEditOpen] = useState(false);

  const [createForm, setCreateForm] = useState(emptyForm);
  const [editForm, setEditForm] = useState(emptyForm);
  const [selectedBanner, setSelectedBanner] = useState(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/admin/banner/all");
      const bannerList = data?.banners || [];
      setBanners(bannerList);

      if (currentIndex >= bannerList.length) {
        setCurrentIndex(0);
      }
    } catch (error) {
      showAlert(
        error?.response?.data?.msg ||
          error?.response?.data?.error ||
          "Failed to fetch banners",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [banners]);

  const currentBanner = useMemo(() => {
    if (!banners.length) return null;
    return banners[currentIndex] || banners[0];
  }, [banners, currentIndex]);

  const openSingleEdit = (banner) => {
    setSelectedBanner(banner);
    setEditForm({
      title: banner?.title || "",
      image: null,
    });
    setSingleEditOpen(true);
  };

  const handleCreateBanner = async (e) => {
    e.preventDefault();

    if (!createForm.image) {
      showAlert("Please choose a banner image", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", createForm.title || "");
      formData.append("image", createForm.image);

      await api.post("/admin/banner/create", formData);

      showAlert("Banner created successfully");
      setCreateForm(emptyForm);
      setAddOpen(false);
      fetchBanners();
    } catch (error) {
      showAlert(
        error?.response?.data?.msg ||
          error?.response?.data?.error ||
          "Failed to create banner",
        "error"
      );
    }
  };

  const handleUpdateBanner = async (e) => {
    e.preventDefault();

    if (!selectedBanner) return;

    try {
      const formData = new FormData();
      formData.append("title", editForm.title || selectedBanner.title || "");

      if (editForm.image) {
        formData.append("image", editForm.image);
      }

      await api.put(`/admin/banner/update/${selectedBanner._id}`, formData);

      showAlert("Banner updated successfully");
      setSingleEditOpen(false);
      setManageEditOpen(false);
      setSelectedBanner(null);
      setEditForm(emptyForm);
      fetchBanners();
    } catch (error) {
      showAlert(
        error?.response?.data?.msg ||
          error?.response?.data?.error ||
          "Failed to update banner",
        "error"
      );
    }
  };

  const handleDeleteBanner = async (bannerId) => {
    try {
      await api.delete(`/admin/banner/delete/${bannerId}`);
      showAlert("Banner deleted successfully");
      fetchBanners();
    } catch (error) {
      showAlert(
        error?.response?.data?.msg ||
          error?.response?.data?.error ||
          "Failed to delete banner",
        "error"
      );
    }
  };

  return (
    <section className="admin-section">
      <div className="admin-section__header">
        <h2>Welcome Back</h2>

        <div className="section-icon-actions">
          <button
            type="button"
            className="header-plain-icon"
            title="Add banner"
            onClick={() => setAddOpen(true)}
          >
            +
          </button>

          <button
            type="button"
            className="header-plain-icon"
            title="Edit banners"
            onClick={() => setManageEditOpen(true)}
          >
            ✎
          </button>

          <button
            type="button"
            className="header-plain-icon"
            title="Delete banners"
            onClick={() => setManageDeleteOpen(true)}
          >
            🗑
          </button>
        </div>
      </div>

      <div className="banner-wrapper">
        {loading ? (
          <div className="state-card">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="state-card">
            <p>No banners found.</p>
            <button
              type="button"
              className="primary-btn"
              onClick={() => setAddOpen(true)}
            >
              Add First Banner
            </button>
          </div>
        ) : (
          <div className="banner-carousel">
            <div className="banner-full-card">
              <img
                src={getMediaUrl(currentBanner?.image)}
                alt={currentBanner?.title || "Banner"}
              />
              {currentBanner?.title ? (
                <div className="banner-full-card__title">
                  {currentBanner.title}
                </div>
              ) : null}
            </div>

            <div className="banner-dots">
              {banners.map((banner, index) => (
                <button
                  key={banner._id}
                  type="button"
                  className={`banner-dot ${
                    currentIndex === index ? "banner-dot--active" : ""
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Modal
        open={addOpen}
        title="Add New Banner"
        onClose={() => setAddOpen(false)}
        width="600px"
      >
        <form className="form-grid" onSubmit={handleCreateBanner}>
          <div className="upload-size-note">
            Recommended banner size:
            <strong> 1600 × 500 px</strong> or
            <strong> 1920 × 600 px</strong>
            <br />
            Use a wide image for better clarity in the banner section.
          </div>

          <label className="form-field">
            <span>Banner title</span>
            <input
              type="text"
              value={createForm.title}
              onChange={(e) =>
                setCreateForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter banner title"
            />
          </label>

          <label className="form-field">
            <span>Banner image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setCreateForm((prev) => ({
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
              onClick={() => setAddOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Save Banner
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={manageDeleteOpen}
        title="Delete Banners"
        onClose={() => setManageDeleteOpen(false)}
        width="820px"
      >
        <div className="banner-manage-list">
          {banners.length === 0 ? (
            <div className="state-card">No banners found.</div>
          ) : (
            banners.map((banner) => (
              <div className="banner-manage-item" key={banner._id}>
                <div className="banner-manage-item__media">
                  <img
                    src={getMediaUrl(banner.image)}
                    alt={banner.title || "Banner"}
                  />
                </div>

                <div className="banner-manage-item__info">
                  <h4>{banner.title || "Untitled banner"}</h4>
                </div>

                <button
                  type="button"
                  className="manage-inline-icon delete"
                  onClick={() => handleDeleteBanner(banner._id)}
                  title="Delete banner"
                >
                  🗑
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>

      <Modal
        open={manageEditOpen}
        title="Edit Banners"
        onClose={() => setManageEditOpen(false)}
        width="820px"
      >
        <div className="banner-manage-list">
          {banners.length === 0 ? (
            <div className="state-card">No banners found.</div>
          ) : (
            banners.map((banner) => (
              <div className="banner-manage-item" key={banner._id}>
                <div className="banner-manage-item__media">
                  <img
                    src={getMediaUrl(banner.image)}
                    alt={banner.title || "Banner"}
                  />
                </div>

                <div className="banner-manage-item__info">
                  <h4>{banner.title || "Untitled banner"}</h4>
                </div>

                <button
                  type="button"
                  className="manage-inline-icon"
                  onClick={() => openSingleEdit(banner)}
                  title="Edit banner"
                >
                  ✎
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>

      <Modal
        open={singleEditOpen}
        title="Edit Banner"
        onClose={() => setSingleEditOpen(false)}
        width="600px"
      >
        <form className="form-grid" onSubmit={handleUpdateBanner}>
          <div className="upload-size-note">
            Recommended banner size:
            <strong> 1600 × 500 px</strong> or
            <strong> 1920 × 600 px</strong>
            <br />
            Wide ratio images are clearer in the homepage banner area.
          </div>

          {selectedBanner?.image ? (
            <div className="preview-box">
              <img
                src={getMediaUrl(selectedBanner.image)}
                alt={selectedBanner.title || "Banner preview"}
              />
            </div>
          ) : null}

          <label className="form-field">
            <span>Banner title</span>
            <input
              type="text"
              value={editForm.title}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, title: e.target.value }))
              }
              placeholder="Enter banner title"
            />
          </label>

          <label className="form-field">
            <span>Change image</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditForm((prev) => ({
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
              onClick={() => setSingleEditOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn">
              Update Banner
            </button>
          </div>
        </form>
      </Modal>
    </section>
  );
}