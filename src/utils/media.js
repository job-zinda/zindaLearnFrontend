

// const SERVER_URL = "http://localhost:5000";

// export function getMediaUrl(filePath) {
//   if (!filePath) return "";

//   if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
//     return filePath;
//   }

//   return `${SERVER_URL}/${String(filePath).replace(/^\/+/, "")}`;
// }






















const SERVER_URL =
  import.meta.env.VITE_API_ORIGIN ||
  "https://zindalearn-backend.onrender.com";

export const getMediaUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${SERVER_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
};