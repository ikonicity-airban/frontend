import axios from "axios";
import Cookies from "js-cookie";

const baseURL =
  (import.meta as any).env.VITE_API_BASE_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true, // Enable sending cookies
});

// Request interceptor to add the auth token to the request header
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and refresh tokens if needed
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 (Unauthorized) and we haven't already tried to refresh the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Try to refresh the token (replace with your actual refresh token logic)
      try {
        const refreshToken = Cookies.get("refreshToken");
        if (!refreshToken) {
          // Redirect to login if no refresh token is available
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const refreshResponse = await axios.post(
          `${baseURL}/auth/refresh`,
          {
            refreshToken: refreshToken,
          },
          { withCredentials: true }
        );

        const { token } = refreshResponse.data;
        Cookies.set("authToken", token);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, redirect to login
        Cookies.remove("authToken");
        Cookies.remove("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
