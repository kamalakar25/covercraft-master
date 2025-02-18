import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
} from "@mui/material";
import { motion } from "framer-motion";
import {

 X as CloseIcon,
  MenuIcon,
  ShoppingCart,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://covercraft-backend.onrender.com/api";

function Header(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { logout, currentUser } = useAuth(); // Get user from AuthContext
  const navigate = useNavigate();

  // Fetch cart items count from backend
  const fetchCartCount = async () => {
    if (!currentUser) return; // Ensure user is logged in

    try {
      const response = await axios.get(
        `${API_BASE_URL}/cart/${currentUser.id}`
      );
      const cartItems = response.data.items || [];
      const itemCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
      ); // Sum all item quantities
      setCartItemCount(itemCount);
    } catch (error) {
      console.error("Error fetching cart count:", error);
    }
  };

  useEffect(() => {
    fetchCartCount();

    // Poll every 10 seconds to update the cart count
    const interval = setInterval(fetchCartCount, 10000);

    return () => clearInterval(interval);
  }, [currentUser]); // Re-run when user changes

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <motion.div>
        <AppBar
          sx={{
            background: "rgba(37, 38, 64, 0.9)",
            transition: "all 0.3s ease",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ py: 1, justifyContent: "space-between" }}>
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    flexGrow: 1,
                    fontWeight: "bold",
                    background: "linear-gradient(45deg, #7B68EE, #FF69B4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/")}
                >
                  CoverCraft
                </Typography>
              </motion.div>

              {/* Right Menu */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                {/* Cart Icon */}
                <IconButton
                  color="inherit"
                  component={Link}
                  to="/cart"
                  sx={{ display: props.customStyles }}
                >
                  <Badge badgeContent={cartItemCount} color="secondary">
                    <ShoppingCart />
                  </Badge>
                </IconButton>

                {/* Logout Button */}
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleLogout}
                  sx={{ display: { xs: "none", md: "inline-flex" } }}
                >
                  Logout
                </Button>

                {/* Mobile Menu Button */}
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                  <IconButton
                    color="inherit"
                    onClick={() => setDrawerOpen(true)}
                  >
                    <MenuIcon />
                  </IconButton>
                </Box>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </motion.div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: 350,
            background: "rgba(37, 38, 64, 0.98)",
            backdropFilter: "blur(10px)",
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: "white" }}>
              Menu
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => setDrawerOpen(false)}
              style={{ width: "80px" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <List>
            <ListItem button onClick={handleLogout}>
              <ListItemText primary="Logout" sx={{ color: "white" }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

export default Header;
