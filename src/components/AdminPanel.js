import { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab, Paper, Container } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import Header from "./Header";
import AdminProfile from "./AdminProfile";
import OrderHistory from "./OrderHistory";
import OrderManagement from "./OrderManagement";

function AdminPanel() {
  const [value, setValue] = useState(0);
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from localStorage
    const fetchOrders = () => {
      const storedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
      setOrders(storedOrders);
    };

    fetchOrders();

    // Set up an interval to check for new orders every 5 seconds
    const intervalId = setInterval(fetchOrders, 5000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!user || user.role !== "admin") {
    return <Typography>Access Denied. Admin privileges required.</Typography>;
  }

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Admin Panel
          </Typography>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="admin panel tabs"
          >
            <Tab label="Profile" />
            <Tab label="Order History" />
            <Tab label="Order Management" />
          </Tabs>
        </Paper>
        <Box sx={{ mt: 2 }}>
          {value === 0 && <AdminProfile />}
          {value === 1 && <OrderHistory orders={orders} />}
          {value === 2 && (
            <OrderManagement orders={orders} setOrders={setOrders} />
          )}
        </Box>
      </Container>
    </>
  );
}

export default AdminPanel;
