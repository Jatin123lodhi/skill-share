import { create } from "zustand";
import { fetchData } from "../api/axios";
import { API_ENDPOINT } from "../model/constants/api";
import { extractErrorMessage } from "../utils/errorHandler";

interface User {
  id?: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Action
  register: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    data?: unknown;
    message?: string;
    error?: string;
  }>;
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean;
    data?: unknown;
    message?: string;
  }>;
  // logout: () => void;
  // setUser: (user: User | null) => void;
  // setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  register: async (email: string, password: string) => {
    set({ isLoading: true, error: null });

    try {
      const payload = {
        email,
        password,
      };

      const response = await fetchData({
        method: "post",
        url: API_ENDPOINT.register,
        payload,
      });

      set({
        user: response.user,
        isAuthenticated: true,
        error: null,
      });

      return {
        success: true,
        data: response,
        message: response.message || "Registration successful!",
      };
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error)

      set({
        error: errorMessage,
        user: null,
        isAuthenticated: false,
      });
      return {
        success: false,
        error: errorMessage,
      };
    }finally{
      set({isLoading: false})
    }
  },

  login: async (email: string, password: string) => {
    try {
      set({ isLoading: true });
      const payload = {
        email,
        password,
      };
      const response = await fetchData({
        method: "post",
        url: API_ENDPOINT.login,
        payload,
      });

      set({
        isAuthenticated: true,
        error: null,
        user: response?.user,
      });

      // store the token in local storage
      const token = response?.token;
      localStorage.setItem("token", token);

      return {
        success: true,
        message: response.message || "Login successful!",
      };
    } catch (error: unknown) {
      const errorMessage = extractErrorMessage(error);
      set({
        error: errorMessage,
        user: null,
        isAuthenticated: false
      })
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      set({ isLoading: false });
    }
  },
}));
