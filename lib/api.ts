import axios from "axios";

const api = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Axios Intercept api request
api.interceptors.request.use((config) => {
  return config;
});

// Axios Intercept api response
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  },
);

export default api;
