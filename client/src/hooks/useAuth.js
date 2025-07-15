import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  logout,
  refreshToken,
  register,
  updateUserAvatar,
  updateUserProfile,
} from "../features/auth/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth) || {};
  const { user, accessToken, loading, error } = auth;

  useEffect(() => {
    if (!accessToken && localStorage.getItem("user")) {
      dispatch(refreshToken());
    }
  }, [accessToken, dispatch]);

  return {
    user,
    accessToken,
    loading,
    error,
    login: (data) => dispatch(login(data)),
    register: (data) => dispatch(register(data)),
    logout: async () => await dispatch(logout()).unwrap(),
    refreshToken: () => dispatch(refreshToken()),
    updateAvatar: (file) => dispatch(updateUserAvatar(file)),
    updateProfile: (data) => dispatch(updateUserProfile(data)),
  };
};
