import React from "react";
import {
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import { motion } from "framer-motion";

const benefits = [
  "Advanced Shock Absorption",
  "Antimicrobial Surface",
  "Wireless Charging Compatible",
  "Precision-Cut Design",
  "Lifetime Warranty",
];

function BenefitsSection() {
  return (
    <Box sx={{ py: 8, bgcolor: "background.paper" }}>
      <Typography
        variant="h2"
        component="h2"
        gutterBottom
        textAlign="center"
        sx={{ color: "primary.main", mb: 6 }}
      >
        Unmatched Features
      </Typography>
      <List sx={{ maxWidth: 600, margin: "0 auto" }}>
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <ListItem>
              <ListItemIcon>
                <Check sx={{ color: "secondary.main" }} />
              </ListItemIcon>
              <ListItemText
                primary={benefit}
                sx={{
                  "& .MuiListItemText-primary": {
                    color: "text.primary",
                    fontSize: "1.2rem",
                  },
                }}
              />
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Box>
  );
}

export default BenefitsSection;
