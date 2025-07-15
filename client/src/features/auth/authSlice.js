import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAvatar,
  updateProfile,
} from "../../services/authService.js";

// ------------------- Async Thunks -------------------
export const register = createAsyncThunk(
  "auth/register",
  async (userData, thunkAPI) => {
    try {
      return await registerUser(userData);
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Registration failed"
      );
    }
  }
);
export const login = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    return await loginUser(credentials);
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
  }
});

export const refreshToken = createAsyncThunk("auth/refresh", async (_, thunkAPI) => {
  try {
    return await refreshAccessToken();
  } catch (err) {
    return thunkAPI.rejectWithValue("Refresh token expired");
  }
});

export const logout = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    return await logoutUser();
  } catch (err) {
    return thunkAPI.rejectWithValue("Logout failed");
  }
});

export const updateUserProfile = createAsyncThunk("auth/updateProfile", async (data, thunkAPI) => {
  try {
    return await updateProfile(data);
  } catch (err) {
    return thunkAPI.rejectWithValue("Update failed");
  }
});

export const updateUserAvatar = createAsyncThunk("auth/updateAvatar", async (file, thunkAPI) => {
  try {
    return await updateAvatar(file);
  } catch (err) {
    return thunkAPI.rejectWithValue("Avatar update failed");
  }
});

// ------------------- Initial State -------------------
const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  accessToken: localStorage.getItem("accessToken") || null,
  loading: false,
  error: null,
};
// ------------------- Auth Slice -------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        console.log("✅ Login success:", action.payload);
        state.loading = false;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        localStorage.setItem("user", JSON.stringify(action.payload.data.user));
        localStorage.setItem("accessToken", action.payload.data.accessToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log("✅ Login success:", action.payload);
        state.loading = false;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        localStorage.setItem("user", JSON.stringify(action.payload.data.user));
        localStorage.setItem("accessToken", action.payload.data.accessToken);
      })
      
      
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      })
      // Update Profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })

      // Update Avatar
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.user.avatar = action.payload.avatar;
      });
  },
});

export const { setAuth } = authSlice.actions;
export default authSlice.reducer;
