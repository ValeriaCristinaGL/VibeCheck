import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "./config";

export const http = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

// Interceptor de request: anexa token, se existir
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de response: trata erros globalmente
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Ex.: redireciona para login ou dispara logout
    }
    return Promise.reject(err);
  }
);
