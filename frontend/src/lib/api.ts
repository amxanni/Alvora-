const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5001/api";

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
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return response.json();
};

export const api = {
  auth: {
    register: async (
      email: string,
      password: string,
      fullName: string,
      faculty: string
    ) => {
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
  groups: {
    getAll: async () => {
      return apiRequest("/groups");
    },
    getById: async (id: string) => {
      return apiRequest(`/groups/${id}`);
    },
    create: async (
      name: string,
      description: string,
      faculty: string,
      year: number,
      course?: string
    ) => {
      return apiRequest("/groups", {
        method: "POST",
        body: JSON.stringify({ name, description, faculty, year, course }),
      });
    },
    delete: async (id: string) => {
      return apiRequest(`/groups/${id}`, {
        method: "DELETE",
      });
    },
    join: async (id: string) => {
      return apiRequest(`/groups/${id}/join`, {
        method: "POST",
      });
    },
    leave: async (id: string) => {
      return apiRequest(`/groups/${id}/leave`, {
        method: "POST",
      });
    },
  },
  profiles: {
    getMe: async () => {
      return apiRequest("/profiles/me");
    },
    getAll: async () => {
      return apiRequest("/profiles");
    },
  },
};
