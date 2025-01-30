import React, { useEffect, useState, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  TextField,
  Button,
  Typography,
  Link,
  Box,
  InputAdornment,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AuthLayout from "./AuthLayout";
import { motion } from "framer-motion";

const AUTO_LOGOUT_TIME = 60 * 1000; // 1 minute in milliseconds

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { login, logout, user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true); // New state for auth check
  const logoutTimerRef = useRef(null);

  useEffect(() => {
    // Check localStorage for existing user on component mount
    const savedUser = localStorage.getItem("user");
    if (savedUser && !user) {
      const userData = JSON.parse(savedUser);
      login(userData);
    }

    setIsCheckingAuth(false); // Auth check complete

    if (user) {
      resetLogoutTimer();
      window.addEventListener("mousemove", resetLogoutTimer);
      window.addEventListener("keydown", resetLogoutTimer);
      window.addEventListener("click", resetLogoutTimer);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        window.removeEventListener("mousemove", resetLogoutTimer);
        window.removeEventListener("keydown", resetLogoutTimer);
        window.removeEventListener("click", resetLogoutTimer);
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        clearTimeout(logoutTimerRef.current);
      };
    }
  }, [user, login]);

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      resetLogoutTimer();
    }
  };

  const resetLogoutTimer = () => {
    if (logoutTimerRef.current) {
      clearTimeout(logoutTimerRef.current);
    }
    logoutTimerRef.current = setTimeout(() => {
      handleLogout();
    }, AUTO_LOGOUT_TIME);
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    navigate("/login");
    alert("You have been logged out due to inactivity.");
  };

  const onSubmit = async (data) => {
    try {
      const userData = { email: data.email, name: data.email.split("@")[0] };

      // Handle login
      await login(userData);

      // Persist the user to localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // Navigate based on user role
      if (userData.email === "admin@example.com") {
        navigate("/admin"); // Redirect to the admin page if it's the admin user
      } else {
        navigate("/"); // Regular users go to the home page
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const formAnimation = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Show a loading state while checking authentication
  if (isCheckingAuth) {
    return <Typography align="center">Checking authentication...</Typography>;
  }

  // Redirect to home if user is already logged in
  if (user) {
    navigate("/");
    return null;
  }

  return (
    <AuthLayout>
      <motion.div initial="hidden" animate="visible" variants={formAnimation}>
        <Typography component="h1" variant="h4" gutterBottom align="center">
          Log In
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{
            mt: 1,
            width: "100%",
            maxWidth: "400px",
            mx: "auto",
          }}
        >
          <Controller
            name="email"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                autoComplete="email"
                autoFocus
                error={!!errors.email}
                helperText={errors.email?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                error={!!errors.password}
                helperText={errors.password?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              height: 56,
              borderRadius: 2,
              fontSize: "1rem",
              textTransform: "none",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              },
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </Button>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: isMobile ? "column" : "row",
              alignItems: "center",
              mt: 2,
            }}
          >
            <Link href="#" variant="body2" sx={{ mb: isMobile ? 1 : 0 }}>
              Forgot password?
            </Link>
            <Link href="/signup" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Box>
      </motion.div>
    </AuthLayout>
  );
};

export default Login;
