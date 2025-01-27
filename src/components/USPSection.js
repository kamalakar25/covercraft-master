import React from "react";
import { Grid, Typography, Box } from "@mui/material";
import {
  Favorite,
  LocalShipping,
  Brush
} from "@mui/icons-material";
import { motion } from "framer-motion";

const uspItems = [
  {
    icon: <Favorite sx={{ fontSize: 48, color: "secondary.main" }} />,
    title: "Eco-Friendly",
    description: "Sustainable materials for a greener future",
  },
  {
    icon: <LocalShipping sx={{ fontSize: 48, color: "secondary.main" }} />,
    title: "Free Shipping",
    description: "On all orders over ₹50",
  },
  {
    icon: <Brush sx={{ fontSize: 48, color: "secondary.main" }} />,
    title: "Customizable",
    description: "Design your perfect cover",
  },
//   {
//     icon: <SupportAgent sx={{ fontSize: 48, color: "secondary.main" }} />,
//     title: "24/7 Support",
//     description: "We're here to help you anytime, anywhere.",
//   },
];


function USPSection() {
  return (
    <Box
      sx={{
        py: 8,
        bgcolor: "background.paper",
      }}
    >
      <Grid container spacing={4}>
        {uspItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                {item.icon}
                <Typography
                  variant="h5"
                  component="h3"
                  gutterBottom
                  sx={{ mt: 2, color: "primary.main" }}
                >
                  {item.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default USPSection;
