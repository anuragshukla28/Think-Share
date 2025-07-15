import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

// Axios instance with credentials
const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // needed for cookies (refreshToken)
});

// ⛳ GET ACCESS TOKEN from localStorage
const getAccessToken = () => localStorage.getItem("accessToken");

// Register user
export const registerUser = async (formData) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/register`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("❌ Register API error:", error.response?.data);
    throw error; // No need to wrap
  }
};


// Login user
export const loginUser = async (credentials) => {
  const response = await axiosInstance.post("/auth/login", credentials);
  return response.data;
};

// Refresh token
export const refreshAccessToken = async () => {
  const response = await axiosInstance.post("/auth/refresh-token");
  return response.data;
};


// ✅ Modified logout
export const logoutUser = async () => {
  let accessToken = localStorage.getItem("accessToken");

  try {
    const response = await axiosInstance.post("/auth/logout", null, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (err) {
    // If token expired, refresh it and retry
    if (err?.response?.data?.message === "jwt expired") {
      const refresh = await refreshAccessToken();
      localStorage.setItem("accessToken", refresh?.accessToken);

      const retryResponse = await axiosInstance.post("/auth/logout", null, {
        headers: {
          Authorization: `Bearer ${refresh.accessToken}`,
        },
      });
      return retryResponse.data;
    } else {
      throw err;
    }
  }
};
// Update profile
export const updateProfile = async (data) => {
  const response = await axiosInstance.put("/auth/profile", data);
  return response.data;
};

// Update avatar
export const updateAvatar = async (avatarFile) => {
  const formData = new FormData();
  formData.append("avatar", avatarFile);

  const response = await axiosInstance.post("/auth/update-avatar", formData);
  return response.data;
};
