import axios from "axios";

// Create an axios instance using the environment variable
const API = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api/v1",
    withCredentials: true, // Required for sending/receiving cookies (JWT) across origins
});

// Optional: Add a response interceptor to handle global errors (like 401 Unauthorized)
API.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default API;