import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor: reject non-JSON or HTML error pages so callers
// always receive a consistent error shape and never a raw string in res.data.
api.interceptors.response.use(
  (response) => {
    // Ensure top-level GET list responses are arrays even if a proxy
    // or middleware wraps the payload unexpectedly.
    const contentType = response.headers["content-type"] || "";
    if (
      typeof response.data === "string" &&
      response.config?.url?.startsWith("/tasks") &&
      !response.config?.url?.match(/\/tasks\/\d+/)
    ) {
      // If the server returned a string instead of JSON for a list endpoint,
      // treat it as an error so the UI can fall back gracefully.
      return Promise.reject(
        new Error("Unexpected non-JSON response from tasks endpoint")
      );
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const ct = error.response.headers["content-type"] || "";
      if (ct.includes("text/html") || typeof error.response.data === "string") {
        error.response.data = {
          detail: "Server returned an HTML error page. Please try again later.",
        };
      }
    } else if (error.request) {
      error.message = error.message || "Network error — no response from server.";
    }
    return Promise.reject(error);
  }
);

export default api;
