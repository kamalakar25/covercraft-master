import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "https://covercraft-backend.onrender.com/api";

function ProductShowcase({ category }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/products`);
      setProducts(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch products. Please try again later.");
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (event, product) => {
    event.stopPropagation();

    try {
      const userEmail = localStorage.getItem("userEmail"); // Get email from localStorage or auth system

      if (!userEmail) {
        toast.error("User not logged in!");
        return;
      }

      // Fetch userId using email
      const userResponse = await axios.get(
        `${API_BASE_URL}/users/getUserId/${userEmail}`
      );
      const userId = userResponse.data.userId;

      if (!userId) {
        toast.error("User ID not found!");
        return;
      }

      // Add to cart
      await axios.post(`${API_BASE_URL}/cart/add`, {
        userId,
        productId: product._id,
        quantity: 1,
      });

      toast.success(`${product.name} added to cart!`, {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } catch (error) {
      toast.error("Failed to add item to cart");
    }
  };

  const getGridSize = () => {
    if (isMobile) return 6;
    if (isTablet) return 4;
    return 3;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      id="productshowcase"
      sx={{
        py: 4,
        px: 2,
        maxWidth: "1200px",
        margin: "0 auto",
        bgcolor: "background.default",
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <ToastContainer />
      <Typography
        variant="h3"
        component="h2"
        gutterBottom
        textAlign="center"
        sx={{ color: "primary.main", mb: 4, fontWeight: "bold" }}
      >
        {category} Products
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{ display: "flex", justifyContent: "center" }}
      >
        {products.map((product, index) => (
          <Grid item xs={6} sm={4} md={getGridSize()} key={product._id}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                onClick={() => handleCardClick(product._id)}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 3,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 4,
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: 8,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: "100%",
                    height: 150,
                    objectFit: "contain",
                    backgroundColor: "white",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.03)",
                    },
                  }}
                  image={
                    product.image.startsWith("http")
                      ? product.image
                      : `/assets/images/${product.image}.jpg`
                  }
                  alt={product.name}
                />

                <CardContent
                  sx={{
                    flexGrow: 1,
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    p: 2,
                    boxShadow: 4,
                    borderRadius: "12px",
                    bgcolor: "background.paper",
                  }}
                >
                  <Typography
                    gutterBottom
                    variant="h6"
                    component="div"
                    sx={{
                      color: "text.primary",
                      fontWeight: "bold",
                      mb: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: { xs: "1rem", sm: "1.2rem" },
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8rem",
                        fontWeight: "500",
                        color: "#888",
                        background: "linear-gradient(45deg, #f3ec78, #af4261)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        padding: "0.2em 0.4em",
                        borderRadius: "4px",
                      }}
                    >
                      {product.model}
                    </span>
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: { sm: "space-between" },
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "1rem", sm: "1.2rem" },
                      }}
                    >
                      ₹{parseFloat(product.price).toFixed(2)}
                    </Typography>
                    {product.discountPrice > 0 && (
                      <Typography
                        variant="body2"
                        color="error"
                        sx={{
                          fontWeight: "bold",
                          textDecoration: "line-through",
                          mx: { xs: 0, sm: 1 },
                          mt: { xs: 0.5, sm: 0 },
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        }}
                      >
                        ₹{parseFloat(product.discountPrice).toFixed(2)}
                      </Typography>
                    )}
                    {product.discountPrice > 0 && (
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 0,
                          color: "text.secondary",
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.8rem",
                            lg: "0.9rem",
                          },
                        }}
                      >
                        Save ₹
                        {parseFloat(
                          product.discountPrice - product.price
                        ).toFixed(0)}
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant="contained"
                    onClick={(e) => handleAddToCart(e, product)}
                    sx={{
                      mt: 2,
                      bgcolor: "secondary.main",
                      color: "secondary.contrastText",
                      fontSize: { xs: "0.5rem", sm: "1rem" },
                      py: { xs: 1, sm: 1.5 },
                      width: { xs: "100%", sm: "auto" },
                      boxShadow: 3,
                      "&:hover": {
                        bgcolor: "secondary.dark",
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default ProductShowcase;
