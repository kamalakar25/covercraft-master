import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";
import AdminProfile from "./AdminProfile";
import OrderHistory from "./OrderHistory";
import OrderManagement from "./OrderManagement";

function AdminPanel() {
  const [value, setValue] = useState(0);
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchOrders = () => {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(storedOrders);
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!user || user.role !== "admin") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: "center", padding: "20px" }}
      >
        <Typography variant="h6" color="error">
          🚫 Access Denied. Admin privileges required.
        </Typography>
      </motion.div>
    );
  }

  const tabContent = [
    <AdminProfile key="profile" />,
    <OrderHistory key="history" orders={orders} />,
    <OrderManagement key="management" orders={orders} setOrders={setOrders} />,
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <Container
        maxWidth="md"
        sx={{
          mt: isMobile ? 8 : 10,
          mb: isMobile ? 2 : 4,
          px: isMobile ? 1 : 3, // Adjust padding for smaller screens
        }}
      >
        {/* Admin Panel Header */}
        <Paper
          elevation={3}
          sx={{
            p: isMobile ? 2 : 3,
            mb: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            textAlign: "center",
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="h1"
            gutterBottom
          >
            🛠️ Admin Panel
          </Typography>

          {/* Tabs Section */}
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="admin panel tabs"
            variant="scrollable"
            scrollButtons="auto"
            centered={!isMobile}
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#6C63FF",
              },
              "& .MuiTab-root": {
                fontSize: isMobile ? "0.75rem" : "1rem", // Adjust font size
                fontWeight: "bold",
                color: "#495057",
                minWidth: "90px", // Prevent overflow
                "&.Mui-selected": {
                  color: "#6C63FF",
                },
              },
            }}
          >
            <Tab label="👤 Profile" />
            <Tab label="📦 Orders" />
            <Tab label="⚙️ Management" />
          </Tabs>
        </Paper>

        {/* Tab Content with Animation */}
        <Box sx={{ mt: 2, px: isMobile ? 1 : 3 }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {tabContent[value]}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Container>
    </motion.div>
  );
}

export default AdminPanel;
