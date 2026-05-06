

import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";

function getErrorMessage(error, fallback = "Failed to fetch banners") {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export default function StudentBannerSection() {
  const { showAlert } = useAlert();

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  async function fetchBanners() {
    try {
      setLoading(true);

      const { data } = await api.get("/banner/all");
      const bannerList = data?.banners || [];

      setBanners(bannerList);

      if (currentIndex >= bannerList.length) {
        setCurrentIndex(0);
      }
    } catch (error) {
      showAlert(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }

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

  return (
    <section className="student-banner-section">
      <div className="student-banner-head">
        <h2>Welcome Back</h2>
        <p>Choose your learning path</p>
      </div>

      <div className="student-banner-wrapper">
        {loading ? (
          <div className="student-state-card">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="student-state-card">No banners found.</div>
        ) : (
          <div className="student-banner-carousel">
            <div className="student-banner-card">
              <img
                src={getMediaUrl(currentBanner?.image)}
                alt={currentBanner?.title || "Banner"}
              />

              {currentBanner?.title ? (
                <div className="student-banner-title">
                  {currentBanner.title}
                </div>
              ) : null}
            </div>

            <div className="student-banner-dots">
              {banners.map((banner, index) => (
                <button
                  key={banner._id}
                  type="button"
                  className={`student-banner-dot ${
                    currentIndex === index ? "student-banner-dot--active" : ""
                  }`}
                  onClick={() => setCurrentIndex(index)}
                  aria-label={`Go to banner ${index + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}