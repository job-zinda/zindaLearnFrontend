// import React, { useEffect, useMemo, useState } from "react";
// import api from "../api/axios";
// import { useAlert } from "../context/AlertContext";
// import { getMediaUrl } from "../utils/media";
// import "./TutorBannerSection.css";

// function getErrorMessage(error, fallback = "Failed to fetch banners") {
//   return (
//     error?.response?.data?.msg ||
//     error?.response?.data?.error ||
//     error?.message ||
//     fallback
//   );
// }

// export default function TutorBannerSection() {
//   const { showAlert } = useAlert();

//   const [banners, setBanners] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   async function fetchBanners() {
//     try {
//       setLoading(true);

//       const { data } = await api.get("/banner/all");
//       const bannerList = data?.banners || [];

//       setBanners(bannerList);

//       if (currentIndex >= bannerList.length) {
//         setCurrentIndex(0);
//       }
//     } catch (error) {
//       showAlert(getErrorMessage(error), "error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchBanners();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     if (banners.length <= 1) return;

//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % banners.length);
//     }, 3500);

//     return () => clearInterval(interval);
//   }, [banners]);

//   const currentBanner = useMemo(() => {
//     if (!banners.length) return null;
//     return banners[currentIndex] || banners[0];
//   }, [banners, currentIndex]);

//   return (
//     <section className="tutor-banner-section">
//       <div className="tutor-banner-head">
//         <h2>Welcome Back</h2>
//         <p>Explore your teaching path</p>
//       </div>

//       <div className="tutor-banner-wrapper">
//         {loading ? (
//           <div className="tutor-state-card">Loading banners...</div>
//         ) : banners.length === 0 ? (
//           <div className="tutor-state-card">No banners found.</div>
//         ) : (
//           <div className="tutor-banner-carousel">
//             <div className="tutor-banner-card">
//               <img
//                 src={getMediaUrl(currentBanner?.image)}
//                 alt={currentBanner?.title || "Banner"}
//               />

//               {currentBanner?.title ? (
//                 <div className="tutor-banner-title">
//                   {currentBanner.title}
//                 </div>
//               ) : null}
//             </div>

//             <div className="tutor-banner-dots">
//               {banners.map((banner, index) => (
//                 <button
//                   key={banner._id}
//                   type="button"
//                   className={`tutor-banner-dot ${
//                     currentIndex === index ? "tutor-banner-dot--active" : ""
//                   }`}
//                   onClick={() => setCurrentIndex(index)}
//                   aria-label={`Go to banner ${index + 1}`}
//                 />
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }








































import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import { getMediaUrl } from "../utils/media";
import "./TutorBannerSection.css";

function getErrorMessage(error, fallback = "Failed to fetch banners") {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export default function TutorBannerSection() {
  const { showAlert } = useAlert();

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let alive = true;

    async function fetchBanners() {
      try {
        setLoading(true);

        const { data } = await api.get("/banner/all");
        const bannerList = data?.banners || [];

        if (!alive) return;

        setBanners(bannerList);
        setCurrentIndex(0);
      } catch (error) {
        if (!alive) return;
        showAlert(getErrorMessage(error), "error");
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    }

    fetchBanners();

    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return undefined;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [banners.length]);

  const currentBanner = useMemo(() => {
    if (!banners.length) return null;
    return banners[currentIndex] || banners[0];
  }, [banners, currentIndex]);

  return (
    <section className="tutor-banner-section">
      <div className="tutor-banner-head">
        <h2>Welcome Back</h2>
        <p>Choose your teaching path</p>
      </div>

      <div className="tutor-banner-wrapper">
        {loading ? (
          <div className="tutor-state-card">Loading banners...</div>
        ) : banners.length === 0 ? (
          <div className="tutor-state-card">No banners found.</div>
        ) : (
          <div className="tutor-banner-carousel">
            <div className="tutor-banner-card">
              <img
                src={getMediaUrl(currentBanner?.image)}
                alt={currentBanner?.title || "Banner"}
              />

              {currentBanner?.title ? (
                <div className="tutor-banner-title">{currentBanner.title}</div>
              ) : null}
            </div>

            <div className="tutor-banner-dots">
              {banners.map((banner, index) => (
                <button
                  key={banner._id || index}
                  type="button"
                  className={`tutor-banner-dot ${
                    currentIndex === index ? "tutor-banner-dot--active" : ""
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