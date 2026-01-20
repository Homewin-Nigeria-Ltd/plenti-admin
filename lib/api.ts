import axios from "axios";

const api = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios Intercept api request
api.interceptors.request.use((config) => {
  // The token is automatically sent via HTTP-only cookie through the proxy
  return config;
});

// Axios Intercept api response
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    // Handle 401 errors (unauthorized) - token might be expired
    if (err.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;
