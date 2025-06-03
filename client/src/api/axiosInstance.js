// added to handle the difference in calls to api with container vs not
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});
// Interceptor: catches 401s and tries to refresh the token
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the access token using refresh cookie
        await instance.post("/auth/refresh", {}, { withCredentials: true });
        return instance(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error("Token refresh failed. Redirecting to login.");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
export default instance;
