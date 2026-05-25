

// const SERVER_URL = "http://localhost:5000";

// export function getMediaUrl(filePath) {
//   if (!filePath) return "";

//   if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
//     return filePath;
//   }

//   return `${SERVER_URL}/${String(filePath).replace(/^\/+/, "")}`;
// }





















// const SERVER_URL =
//   import.meta.env.VITE_API_ORIGIN ||
//   "https://zindalearn-backend.onrender.com";

// export const getMediaUrl = (path) => {
//   if (!path) return "";
//   if (path.startsWith("http")) return path;
//   return `${SERVER_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
// };

























const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://zindalearnbackend.onrender.com";

export function getMediaUrl(path) {
  if (!path) return "";

  const value = String(path);

  if (
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("data:image/")
  ) {
    return value;
  }

  if (value.startsWith("/9j/")) {
    return `data:image/jpeg;base64,${value}`;
  }

  if (value.startsWith("iVBOR")) {
    return `data:image/png;base64,${value}`;
  }

  if (value.startsWith("R0lGOD")) {
    return `data:image/gif;base64,${value}`;
  }

  const cleanPath = value.startsWith("/") ? value : `/${value}`;
  return `${API_BASE_URL}${cleanPath}`;
}