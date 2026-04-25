import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { login as loginAction, logout as logoutAction } from "../context/userSlice";
import { authService } from "../services";
import { handleApiError, showErrorToast, logError } from "../utils/errorHandler";
import { COOKIE_CONFIG } from "../constants";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

/**
 * Custom hook for authentication operations
 * Provides login, register, logout functionality
 */

export const useAuth = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Register a new user
   */
  const register = useCallback(async (userData, navigate) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.register(userData);
      
      if (response?.status === 201) {
        toast.success("Registration successful! Please check your email.");
        navigate("/accounts/check/inbox");
      }
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);
      showErrorToast(err, toast);
      logError(err, "useAuth.register");
      throw errorData;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Login user
   */
  const login = useCallback(async (credentials, navigate) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      
      if (response?.status === 200) {
        const { data, accessToken } = response.data;
        
        dispatch(loginAction(data));
        Cookies.set(COOKIE_CONFIG.ACCESS_TOKEN, accessToken, COOKIE_CONFIG.OPTIONS);
        
        toast.success(response.data.message || "Login successful");
        navigate("/");
      }
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);
      showErrorToast(err, toast);
      logError(err, "useAuth.login");
      throw errorData;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  /**
   * Logout user
   */
  const logout = useCallback((navigate) => {
    dispatch(logoutAction());
    Cookies.set(COOKIE_CONFIG.ACCESS_TOKEN);
    toast.success("Logged out successfully");
    navigate("/accounts/login");
  }, [dispatch]);

  /**
   * Check username availability
   */
  const checkUsername = useCallback(async (username) => {
    try {
      const response = await authService.checkUsername(username);
      return response?.status === 200;
    } catch (err) {
      logError(err, "useAuth.checkUsername");
      return false;
    }
  }, []);

  /**
   * Request password reset
   */
  const forgotPassword = useCallback(async (usernameOrEmail, navigate) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.forgotPassword(usernameOrEmail);
      
      if (response?.status === 200) {
        toast.success("Password reset link sent to your email");
        navigate("/accounts/login");
      }
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);
      showErrorToast(err, toast);
      logError(err, "useAuth.forgotPassword");
      throw errorData;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Reset password
   */
  const resetPassword = useCallback(async (token, password, navigate) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.resetPassword(token, password);
      
      if (response?.status === 200) {
        toast.success("Password reset successful");
        navigate("/accounts/login");
      }
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);
      showErrorToast(err, toast);
      logError(err, "useAuth.resetPassword");
      throw errorData;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    register,
    login,
    logout,
    checkUsername,
    forgotPassword,
    resetPassword,
  };
};
