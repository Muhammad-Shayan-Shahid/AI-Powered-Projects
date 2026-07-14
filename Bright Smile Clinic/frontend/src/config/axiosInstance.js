import axios from "axios";
import { API_BASE_URL } from "./env";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Normalizes errors from our backend's shape (express-validator errors,
// or a generic { error } from errorHandler.middleware.js) into one
// consistent message, so every feature's catch block can just read
// err.message without caring which endpoint failed.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const validationMsg = error?.response?.data?.errors?.[0]?.msg;
    const genericMsg = error?.response?.data?.error;
    const message =
      validationMsg ||
      genericMsg ||
      "Something went wrong. Please try again.";
    return Promise.reject({ message, status: error?.response?.status });
  }
);

export default axiosInstance;
