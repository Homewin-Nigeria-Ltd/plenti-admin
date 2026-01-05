import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios Intercept api request
api.interceptors.request.use((config) => {
  return config;
});

// Axios Intercept api response
// api.interceptors.response.use(
//   (res) => res,
//   async (err) => {}
// );

export default api;
