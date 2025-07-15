// src/services/articleService.js
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8001/api/v1";

const axiosInstance = axios.create({
  baseURL: `${API_BASE}/article`,
  withCredentials: true,
});

export const createArticle = async (formData) => {
  const token = localStorage.getItem("accessToken"); // or wherever you store it

  return await axios.post(`${API_BASE}/article/create`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`, // ✅ Include access token
    },
  });
};

export const getAllArticles = () => {
  return axiosInstance.get("/all");
};

export const getArticleById = (id) => {
  return axiosInstance.get(`/${id}`);
};

export const getArticlesByUser = (userId) => {
  return axiosInstance.get(`/user/${userId}`);
};

export const updateArticle = async (id, data) => {
  const token = localStorage.getItem("accessToken");

  const res = await axios.put(`${API_BASE}/article/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; // ✅ Ensure you're returning .data not the full res
};
export const deleteArticle = (id) => {
  const token = localStorage.getItem("accessToken");
  return axios.delete(`${API_BASE}/article/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
// Like Article
export const likeArticle = (id) => {
  const token = localStorage.getItem("accessToken");
  return axios.post(`${API_BASE}/article/${id}/like`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Comment Article

export const commentArticle = (id, text) => {
  const token = localStorage.getItem("accessToken");
  return axios.post(`${API_BASE}/article/${id}/comment`, { text }, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getArticleBySlug = async (slug) => {
  return await axiosInstance.get(`/slug/${slug}`);
};
