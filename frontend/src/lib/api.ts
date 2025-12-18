const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5001/api";

const getAuthToken = () => {
  return localStorage.getItem("auth_token");
};

const setAuthToken = (token: string) => {
  localStorage.setItem("auth_token", token);
};

const clearAuthToken = () => {
  localStorage.removeItem("auth_token");
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};

export const api = {
  auth: {
    register: async (email: string, password: string, fullName: string, faculty: string) => {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, fullName, faculty }),
      });
      if (data.session?.access_token) {
        setAuthToken(data.session.access_token);
      }
      return data;
    },
    login: async (email: string, password: string) => {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data.session?.access_token) {
        setAuthToken(data.session.access_token);
      }
      return data;
    },
    logout: async () => {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
      clearAuthToken();
    },
    getSession: async () => {
      return apiRequest("/auth/session");
    },
  },
};

