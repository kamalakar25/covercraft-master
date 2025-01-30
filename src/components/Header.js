// Header.js
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
  Paper,
  Toolbar,
  Typography,
  Badge,
} from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  DoorClosedIcon as CloseIcon,
  MenuIcon,
  ShoppingCart,
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Header(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // const menuItems = [
  //   {
  //     name: "Shop",
  //     submenu: ["New Arrivals", "Best Sellers", "Collections", "Customized"],
  //   },
  //   { name: "Devices", submenu: ["iPhone", "Samsung",] },
  //   { name: "About" },
  //   { name: "Contact" },
  // ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItemCount(cart.reduce((total, item) => total + item.quantity, 0));
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleSubmenuClick = (submenuItem) => {
    // Navigate to a page with filtered products
    navigate(`/category/${submenuItem.replace(/\s+/g, "-").toLowerCase()}`);
  };

  return (
    <>
      <motion.div
        // initial={{ y: -100 }}
        // animate={{ y: 0 }}
        // transition={{ type: "spring", stiffness: 120 }}
      >
        <AppBar
          // position="fixed"
          sx={{
            background: "rgba(37, 38, 64, 0.9)",
            // backdropFilter: isScrolled ? "blur(10px)" : "none",
            // boxShadow: isScrolled ? "0 4px 30px rgba(0, 0, 0, 0.1)" : "none",
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
                  }}
                  onClick={() => {
                    navigate("/");
                  }}
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
                  sx={{ display: "flex", alignItems: "center" }}
                  style={{display: props.customStyles,}}
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
                  sx={{
                    display: { xs: "none", md: "inline-flex" },
                  }}
                >
                  Logout
                </Button>

                {/* Mobile Menu Button */}
                <Box sx={{ display: { xs: "block", md: "none" } }}>
                  <IconButton
                    color="inherit"
                    onClick={toggleDrawer(true)}
                    sx={{ ml: 1 }}
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
        onClose={toggleDrawer(false)}
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
              onClick={toggleDrawer(false)}
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
