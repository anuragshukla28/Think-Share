import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllArticles,
  likeArticle,
  commentArticle
} from "../../services/articleService.js";

export const fetchAllArticles = createAsyncThunk(
  "article/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllArticles();
      return res.data?.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch articles");
    }
  }
);

// ✅ Like Article
export const likeArticleThunk = createAsyncThunk(
  "article/like",
  async (id, { rejectWithValue }) => {
    try {
      const res = await likeArticle(id);
      return { id, likes: res.data.data };
    } catch (err) {
      return rejectWithValue("Failed to like/unlike article");
    }
  }
);

// ✅ Comment Article
export const commentArticleThunk = createAsyncThunk(
  "article/comment",
  async ({ id, text }, { rejectWithValue }) => {
    try {
      const res = await commentArticle(id, text);
      return { id, comments: res.data.data };
    } catch (err) {
      return rejectWithValue("Failed to comment on article");
    }
  }
);

const initialState = {
  articles: [],
  loading: false,
  error: null,
};

const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    setArticles: (state, action) => {
      state.articles = action.payload;
      state.loading = false;
    },
    addArticle: (state, action) => {
      state.articles.unshift(action.payload);
    },
    updateArticle: (state, action) => {
      const index = state.articles.findIndex(
        (article) => article._id === action.payload._id
      );
      if (index !== -1) state.articles[index] = action.payload;
    },
    deleteArticle: (state, action) => {
      state.articles = state.articles.filter(
        (article) => article._id !== action.payload
      );
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
      })
      .addCase(fetchAllArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Like Article
      .addCase(likeArticleThunk.fulfilled, (state, action) => {
        const index = state.articles.findIndex((a) => a._id === action.payload.id);
        if (index !== -1) {
          state.articles[index].likes = action.payload.likes;
        }
      })

      // ✅ Comment Article
      .addCase(commentArticleThunk.fulfilled, (state, action) => {
        const index = state.articles.findIndex((a) => a._id === action.payload.id);
        if (index !== -1) {
          state.articles[index].comments = action.payload.comments;
        }
      });
  },
});

export const {
  setArticles,
  addArticle,
  updateArticle,
  deleteArticle,
  setLoading,
  setError,
} = articleSlice.actions;

export default articleSlice.reducer;
