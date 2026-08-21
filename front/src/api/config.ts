const fallbackApiBaseUrl = "/api";

const normalizeBaseUrl = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return fallbackApiBaseUrl;
  return trimmed.replace(/\/+$/, "");
};

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
export const API_TIMEOUT = Number(import.meta.env.VITE_API_TIMEOUT || 10000);

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
