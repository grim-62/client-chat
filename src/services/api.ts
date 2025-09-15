import axios, { AxiosError, AxiosInstance } from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
console.log('API Base URL:', baseURL);

const api: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// request interceptor – attach token
api.interceptors.request.use((config) => {
  console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
  const token = sessionStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// response interceptor – auto-refresh on 401 & return JSON
api.interceptors.response.use(
  (res) => {
    console.log('API Response:', res.status, res.config.url, res.data);
    // 👇 Always return only JSON data
    return res;
  },
  async (error: AxiosError & { config?: any }) => {
    const originalConfig = error?.config;

    if (error.response?.status === 401 && originalConfig && !originalConfig._retry) {
      originalConfig._retry = true;
      try {
        const token = localStorage.getItem("refresh_token");
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          { refreshToken: token },
          { withCredentials: true }
        );

        return api.request(originalConfig);
      } catch (refreshError) {
        console.error(refreshError)
      }
    }

    return Promise.reject(error);
  }
);

export { api };
