const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://ml-diagnostics-dashboard.onrender.com";

export default API_BASE_URL;