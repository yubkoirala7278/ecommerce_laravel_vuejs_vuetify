import axios from "axios";

// Base configuration
axios.defaults.baseURL = "http://localhost:8000"; // Ensure this matches your backend
axios.defaults.withCredentials = true; // For cookies and CSRF

// Request interceptor to add CSRF token
axios.interceptors.request.use(
  (config) => {
    try {
      const cookies = document.cookie.split('; ');
      const tokenRow = cookies.find((row) => row.startsWith('XSRF-TOKEN='));
      if (tokenRow) {
        const token = decodeURIComponent(tokenRow.split('=')[1]);
        config.headers['X-XSRF-TOKEN'] = token;
      }
      return config;
    } catch (error) {
      console.error("Error setting CSRF token:", error);
      return config; // Proceed anyway to avoid breaking requests
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axios;