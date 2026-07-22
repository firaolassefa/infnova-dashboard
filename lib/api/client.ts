import axios from "axios";
import { useAuthStore } from "@/lib/store/authStore";

const apiClient = axios.create({
  baseURL: "https://infnova-intern.vercel.app/api",
  timeout: 15000,
});

// Inject auth token on every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally - clear token and redirect to login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearToken();
      if (typeof window !== "undefined") {
        sessionStorage.setItem("session_expired", "1");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
