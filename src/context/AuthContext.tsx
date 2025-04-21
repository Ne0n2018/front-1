"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import api from "@/apiClient";
import { Doctor, Role } from "@/type";
import axios from "axios";

interface AuthContextType {
  user: Doctor | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    email: string,
    password: string,
    name: string,
    role: Role
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true); // Добавляем состояние загрузки

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/auth/me")
        .then((response) => {
          console.log("Fetched user from /auth/me:", response.data);
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch user:", error);
          localStorage.removeItem("token");
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { accessToken, user } = response.data;
      console.log("Login response:", { accessToken, user });
      localStorage.setItem("token", accessToken);
      setUser(user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error:", error.message);
        console.error("Response:", error.response?.data);
        throw new Error(error.response?.data?.message || "Login failed");
      } else {
        console.error("Unexpected error:", error);
        throw new Error("Login failed");
      }
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: Role
  ) => {
    try {
      const response = await api.post("/auth/register", {
        email,
        password,
        name,
        role,
      });
      const { accessToken, user } = response.data;
      console.log("Register response:", { accessToken, user });
      localStorage.setItem("token", accessToken);
      setUser(user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.message);
        console.error("Response:", error.response?.data);
        throw new Error(error.response?.data?.message || "Registration failed");
      } else {
        console.error("Unexpected error:", error);
        throw new Error("Registration failed");
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}