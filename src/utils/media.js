

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

























// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "https://zindalearnbackend.onrender.com";

// export function getMediaUrl(path) {
//   if (!path) return "";

//   const value = String(path);

//   if (
//     value.startsWith("http://") ||
//     value.startsWith("https://") ||
//     value.startsWith("data:image/")
//   ) {
//     return value;
//   }

//   if (value.startsWith("/9j/")) {
//     return `data:image/jpeg;base64,${value}`;
//   }

//   if (value.startsWith("iVBOR")) {
//     return `data:image/png;base64,${value}`;
//   }

//   if (value.startsWith("R0lGOD")) {
//     return `data:image/gif;base64,${value}`;
//   }

//   const cleanPath = value.startsWith("/") ? value : `/${value}`;
//   return `${API_BASE_URL}${cleanPath}`;
// }

















































// const API_BASE_URL =
//   import.meta.env.VITE_API_URL || "https://zindalearnbackend.onrender.com";

// function isProbablyBase64Image(value) {
//   const clean = String(value || "").trim();

//   if (!clean) return false;

//   // jpeg base64 normally starts like this
//   if (clean.startsWith("/9j/")) return true;
//   if (clean.startsWith("9j/")) return true;

//   // png base64 normally starts like this
//   if (clean.startsWith("iVBOR")) return true;

//   // gif base64 normally starts like this
//   if (clean.startsWith("R0lGOD")) return true;

//   // webp base64 sometimes starts like this
//   if (clean.startsWith("UklGR")) return true;

//   return false;
// }

// function getBase64Mime(value) {
//   const clean = String(value || "").trim();

//   if (clean.startsWith("/9j/") || clean.startsWith("9j/")) {
//     return "image/jpeg";
//   }

//   if (clean.startsWith("iVBOR")) {
//     return "image/png";
//   }

//   if (clean.startsWith("R0lGOD")) {
//     return "image/gif";
//   }

//   if (clean.startsWith("UklGR")) {
//     return "image/webp";
//   }

//   return "image/jpeg";
// }

// export function getMediaUrl(path) {
//   if (!path) return "";

//   let value = String(path).trim();

//   if (!value) return "";

//   if (
//     value.startsWith("data:image/") ||
//     value.startsWith("blob:") ||
//     value.startsWith("http://") ||
//     value.startsWith("https://")
//   ) {
//     return value;
//   }

//   // sometimes data:image prefix broken aayi save aakum
//   if (value.startsWith("dataimage/")) {
//     value = value.replace("dataimage/", "data:image/");
//     return value;
//   }

//   // raw base64 image aanenkil URL aakkaruth
//   if (isProbablyBase64Image(value)) {
//     return `data:${getBase64Mime(value)};base64,${value}`;
//   }

//   const cleanPath = value.startsWith("/") ? value : `/${value}`;
//   return `${API_BASE_URL.replace(/\/$/, "")}${cleanPath}`;
// }


































const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://zindalearnbackend.onrender.com";

function cleanImageValue(path) {
  return String(path || "")
    .trim()
    .replace(/\s/g, "");
}

function isProbablyBase64Image(value) {
  const clean = cleanImageValue(value);

  if (!clean) return false;

  if (clean.startsWith("/9j/")) return true;
  if (clean.startsWith("9j/")) return true;

  if (clean.startsWith("iVBOR")) return true;

  if (clean.startsWith("R0lGOD")) return true;

  if (clean.startsWith("UklGR")) return true;

  return false;
}

function getBase64Mime(value) {
  const clean = cleanImageValue(value);

  if (clean.startsWith("/9j/") || clean.startsWith("9j/")) {
    return "image/jpeg";
  }

  if (clean.startsWith("iVBOR")) {
    return "image/png";
  }

  if (clean.startsWith("R0lGOD")) {
    return "image/gif";
  }

  if (clean.startsWith("UklGR")) {
    return "image/webp";
  }

  return "image/jpeg";
}

export function getMediaUrl(path) {
  if (!path) return "";

  let value = String(path || "").trim();

  if (!value) return "";

  if (
    value === "null" ||
    value === "undefined" ||
    value === "false" ||
    value === "NaN"
  ) {
    return "";
  }

  if (
    value.startsWith("data:image/") ||
    value.startsWith("blob:") ||
    value.startsWith("http://") ||
    value.startsWith("https://")
  ) {
    return value;
  }

  if (value.startsWith("dataimage/")) {
    return value.replace("dataimage/", "data:image/");
  }

  if (isProbablyBase64Image(value)) {
    const cleanBase64 = cleanImageValue(value);

    return `data:${getBase64Mime(
      cleanBase64
    )};base64,${cleanBase64}`;
  }

  const cleanPath = value.startsWith("/")
    ? value
    : `/${value}`;

  return `${API_BASE_URL.replace(
    /\/$/,
    ""
  )}${cleanPath}`;
}