import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const logoutTimerRef = useRef(null);

  // Function to handle user login
  const login = async (userData) => {
    setUser(userData);
    resetAutoLogoutTimer();
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
      logoutTimerRef.current = null;
    }
  };

  // Reset auto-logout timer
  const resetAutoLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    logoutTimerRef.current = setTimeout(() => {
      logout();
      alert("You have been logged out due to inactivity.");
    }, 60 * 1000); // 1 minute
  };

  // Function to handle user activity
  const handleUserActivity = () => {
    if (user) {
      resetAutoLogoutTimer();
    }
  };

  // Add event listeners for user activity
  useEffect(() => {
    if (user) {
      resetAutoLogoutTimer();

      // Events that reset the timer
      const events = ["mousemove", "keydown", "scroll", "click"];
      events.forEach((event) =>
        window.addEventListener(event, handleUserActivity)
      );

      // Listen for visibility change (e.g., when the user switches tabs)
      document.addEventListener("visibilitychange", handleUserActivity);

      // Cleanup listeners on unmount
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
  }, [user]);

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
