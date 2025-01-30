import { createContext, useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Add this import for navigation

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const logoutTimerRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  const defaultAdmin = {
    email: "admin@example.com", // Default admin email
    password: "admin123", // Default admin password
    role: "admin", // Default admin role
  };

const login = async (userData) => {
  // Check if the email and password match the default admin credentials
  if (
    userData.email === defaultAdmin.email &&
    userData.password === defaultAdmin.password
  ) {
    const userWithRole = {
      ...userData,
      role: defaultAdmin.role, // Set role to admin
    };

    setUser(userWithRole);
    localStorage.setItem("user", JSON.stringify(userWithRole));
    resetAutoLogoutTimer();

    // Redirect to the admin page
    navigate("/admin"); // Redirect to the admin page
    return; // Exit early if it's the admin login
  }

  // For all other users
  const userWithRole = {
    ...userData,
    role: userData.email.includes("admin") ? "admin" : "user",
  };

  setUser(userWithRole);
  localStorage.setItem("user", JSON.stringify(userWithRole));
  resetAutoLogoutTimer();

  // If it's a regular user, redirect to home or other page
  if (userWithRole.role === "user") {
    navigate("/"); // Redirect to home page for regular users
  }
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  const resetAutoLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    logoutTimerRef.current = setTimeout(() => {
      logout();
      alert("You have been logged out due to inactivity.");
    }, 60 * 1000); // 1 minute
  };

  const handleUserActivity = () => {
    if (user) {
      resetAutoLogoutTimer();
    }
  };

  useEffect(() => {
    if (user) {
      resetAutoLogoutTimer();

      const events = ["mousemove", "keydown", "scroll", "click"];
      events.forEach((event) =>
        window.addEventListener(event, handleUserActivity)
      );

      document.addEventListener("visibilitychange", handleUserActivity);

      return () => {
        events.forEach((event) =>
          window.removeEventListener(event, handleUserActivity)
        );
        document.removeEventListener("visibilitychange", handleUserActivity);
        if (logoutTimerRef.current) {
          clearTimeout(logoutTimerRef.current);
        }
      };
    }
  }, [user, handleUserActivity]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
