import { ArrowBack, Favorite, ShoppingCart } from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Paper,
  Rating,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import MultiStepCheckoutForm from "./multi-step-checkout-form";
import { products } from "./product";

function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isXsScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isLargeScreen = useMediaQuery("(min-width:2000px)");

  const product = products.find(
    (prod) => prod.id === Number.parseInt(productId)
  );
  const [isFavorite, setIsFavorite] = useState(false);
  const [openCheckout, setOpenCheckout] = useState(false);

  const addToCart = () => {
    // Retrieve existing cart items from localStorage
    const existingCartItems = JSON.parse(localStorage.getItem("cart") || "[]");

    // Check if product already exists in cart
    const existingProductIndex = existingCartItems.findIndex(
      (item) => item.id === product.id
    );

    if (existingProductIndex > -1) {
      // If product exists, increment quantity
      existingCartItems[existingProductIndex].quantity += 1;
    } else {
      // If product doesn't exist, add new product with quantity 1
      existingCartItems.push({
        ...product,
        quantity: 1,
      });
    }

    // Save updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCartItems));

    // Navigate to cart page
    navigate("/cart");
  };

  if (!product) {
    return (
      <Typography variant="h5" color="error" textAlign="center">
        Product not found.
      </Typography>
    );
  }

  return (
    <>
      <Header />

      <Container
        maxWidth={false}
        sx={{
          maxWidth: isLargeScreen ? "1800px" : "lg",
          px: { xs: 2, sm: 3, md: 4, lg: 6 },
        }}
        style={{
          minHeight: "100vh",
          alignContent: "center",
        }}
      >
        <Box
          component={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          sx={{
            py: { xs: 2, sm: 3, md: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%", mb: "2" }} className="mt-5" >
            <IconButton onClick={() => navigate(-1)} color="primary">
              <ArrowBack />
            </IconButton>
          </Box>

          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            justifyContent="center"
          >
            {/* Left Column - Image */}
            <Grid item xs={12} md={6} lg={5}>
              <Paper
                elevation={6}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  overflow: "hidden",
                  bgcolor: "background.paper",
                  position: "relative",
                }}
              >
                {/* 
                <IconButton
                  onClick={() => setIsFavorite(!isFavorite)}
                  sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    bgcolor: 'background.paper',
                    '&:hover': { bgcolor: 'background.default' },
                  }}
                >
                  <Favorite color={isFavorite ? 'error' : 'action'} />
                </IconButton>
                 */}
                <Box
                  component={motion.img}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  src={product.image}
                  alt={product.name}
                  sx={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    maxHeight: { xs: 300, sm: 400, md: 500 },
                  }}
                />
              </Paper>
            </Grid>

            {/* Right Column - Product Details */}
            <Grid item xs={12} md={6} lg={5}>
              <Box>
                <Typography
                  variant="h3"
                  component="h1"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    fontSize: { xs: "1.75rem", sm: "1.75rem", md: "1.75rem" },
                    background:
                      "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {product.model}
                  {/* <span
                    style={{
                      color: "#888",
                      background: "linear-gradient(45deg, #f3ec78, #af4261)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      padding: "0.2em 0.4em",
                      borderRadius: "4px",
                    }}
                  >
                    {product.model}
                  </span> */}
                </Typography>

                <Box
                  sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Rating value={4.5} readOnly precision={0.5} />
                  <Typography variant="body2" color="text.secondary">
                    (124 reviews)
                  </Typography>
                </Box>

                <Chip
                  label="In Stock"
                  color="success"
                  size="small"
                  sx={{ mb: 3 }}
                />

                <Typography
                  variant="h4"
                  color="primary"
                  sx={{
                    mb: 3,
                    fontWeight: 600,
                    fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  }}
                >
                  ₹{product.price || "Price not available"}
                </Typography>

                <Divider sx={{ my: 3 }} />

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 4, lineHeight: 1.8 }}
                >
                  {product.name || "No description available"}
                </Typography>

                <Box sx={{ display: "flex", gap: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<ShoppingCart />}
                    sx={{
                      flex: 2,
                      py: 1.5,
                      borderRadius: 2,
                      boxShadow: "0 4px 6px rgba(187, 134, 252, 0.25)",
                    }}
                    onClick={addToCart}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{
                      flex: 1,
                      py: 1.5,
                      borderRadius: 2,
                    }}
                    onClick={() => {
                      // Open checkout dialog
                      setOpenCheckout(true);
                    }}
                  >
                    Buy Now
                  </Button>
                </Box>

                {/* Product Features/Highlights */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Product Highlights
                  </Typography>
                  <Grid container spacing={2}>
                    {[
                      "Premium Quality",
                      "Easy to Apply",
                      "Bubble Free",
                      "Perfect Fit",
                    ].map((feature, index) => (
                      <Grid item xs={6} sm={3} key={index}>
                        <Paper
                          elevation={1}
                          sx={{
                            p: 2,
                            textAlign: "center",
                            bgcolor: "background.paper",
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="body2">{feature}</Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Checkout Dialog */}
        <Dialog
          open={openCheckout}
          onClose={() => setOpenCheckout(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              width: isXsScreen ? "100%" : "auto",
              m: isXsScreen ? 0 : 2,
              maxHeight: isXsScreen ? "100%" : "calc(100% - 64px)",
            },
          }}
        >
          <MultiStepCheckoutForm
            product={{
              name: product.name,
              price: product.price,
              shipping: 9.99, // You can make this dynamic if needed
            }}
            onClose={() => setOpenCheckout(false)}
          />
        </Dialog>
      </Container>
    </>
  );
}

export default ProductDetail;
