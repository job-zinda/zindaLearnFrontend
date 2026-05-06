

const SERVER_URL = "http://localhost:5000";

export function getMediaUrl(filePath) {
  if (!filePath) return "";

  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }

  return `${SERVER_URL}/${String(filePath).replace(/^\/+/, "")}`;
}