import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  Paper,
  Container,
  IconButton,
  Dialog,
} from "@mui/material";
import { DeleteOutline, ShoppingCart, Add, Remove } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MultiStepCheckoutForm from "./multi-step-checkout-form.js";

function CartPage() {
  const [cart, setCart] = useState([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCart(storedCart);
  }, []);

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const updateQuantity = (productId, change) => {
    const updatedCart = cart.map((item) => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const getTotalPrice = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const handleProceedToBuy = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 3, mt: 4, bgcolor: "background.paper" }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: "primary.main" }}
        >
          Your Cart
        </Typography>
        {cart.length === 0 ? (
          <Typography variant="body1" sx={{ mt: 2, color: "text.secondary" }}>
            Your cart is empty
          </Typography>
        ) : (
          <Box>
            <List>
              {cart.map((item) => (
                <React.Fragment key={item.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar
                        alt={item.name}
                        src={item.image}
                        variant="square"
                        sx={{ width: 80, height: 80, mr: 2 }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.model}
                      secondary={
                        <React.Fragment>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            ₹{parseFloat(item.price).toFixed(2)}
                          </Typography>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: 1,
                            }}
                          >
                            <IconButton
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Remove />
                            </IconButton>
                            <Typography sx={{ mx: 1 }}>
                              {item.quantity}
                            </Typography>
                            <IconButton
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Add />
                            </IconButton>
                          </Box>
                        </React.Fragment>
                      }
                    />
                    <Button
                      startIcon={<DeleteOutline />}
                      onClick={() => removeFromCart(item.id)}
                      color="error"
                    >
                      Remove
                    </Button>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
            </List>
            <Box sx={{ mt: 3, textAlign: "right" }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Total: ₹{getTotalPrice()}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                startIcon={<ShoppingCart />}
                onClick={handleProceedToBuy}
                size="large"
              >
                Proceed to Buy
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Checkout Dialog */}
      <Dialog
        open={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <MultiStepCheckoutForm
          product={{
            price: getTotalPrice(),
            shipping: 50,
          }}
          onClose={() => setIsCheckoutOpen(false)}
        />
      </Dialog>
    </Container>
  );
}

export default CartPage;
