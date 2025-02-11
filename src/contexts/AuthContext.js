// src/contexts/AuthContext.js
import React, { createContext, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const API_URL = process.env.REACT_APP_API_URL || "https://covercraft-backend.onrender.com/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const inactivityTimeoutRef = useRef(null);
  const loginTimeoutRef = useRef(null);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { user, token } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userEmail", user.email);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      setLastActivity(Date.now());

      // Set login timeout
      loginTimeoutRef.current = setTimeout(() => {
        logout();
        navigate("/login");
      }, 60000); // 1 minute

      resetInactivityTimeout();
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Login failed");
    }
  };

  const signup = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, userData);

      const { user, token } = response.data;

      // Store token in localStorage
      localStorage.setItem("token", token);

      // Set axios default header for future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
      return user;
    } catch (error) {
      throw new Error(error.response?.data?.error || "Signup failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear token and user data
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
      setUser(null);
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
      if (loginTimeoutRef.current) {
        clearTimeout(loginTimeoutRef.current);
      }
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/auth/me`);
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    } finally {
      setLoading(false);
    }
  };

  const resetInactivityTimeout = () => {
    if (inactivityTimeoutRef.current) {
      clearTimeout(inactivityTimeoutRef.current);
    }
    if (user) {
      inactivityTimeoutRef.current = setTimeout(() => {
        logout();
        navigate("/login");
      }, 60000); // 1 minute
    }
  };

  React.useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      resetInactivityTimeout();
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      resetInactivityTimeout();
    }
    return () => {
      if (inactivityTimeoutRef.current) {
        clearTimeout(inactivityTimeoutRef.current);
      }
    };
  }, [user, lastActivity]);

  return (
    <AuthContext.Provider
      value={{ user, login, logout, signup, loading, resetInactivityTimeout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
