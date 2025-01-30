import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

function OrderHistory({ orders }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tableAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const rowAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <TableContainer
      component={Paper}
      sx={{
        p: 2,
        borderRadius: 3,
        overflowX: "auto", // Enables horizontal scrolling on mobile
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          fontWeight: "bold",
          mb: 2,
          color: "#6C63FF",
        }}
      >
        📦 Order History
      </Typography>

      {isMobile ? (
        <Box sx={{ p: 1 }}>
          {orders.map((order, index) => (
            <motion.div
              key={order.orderId}
              variants={rowAnimation}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  mb: 2,
                  borderRadius: 3,
                  background: "linear-gradient(135deg, #f8f9fa, #e9ecef)",
                  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.15)",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                  🆔 Order ID: {order.orderId}
                </Typography>
                <Typography variant="body2">
                  📅 Date: {new Date(order.orderDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  👤 Customer: {`${order.firstName} ${order.lastName}`}
                </Typography>
                <Typography variant="body2">
                  🎁 Product: {order.product.name}
                </Typography>
                <Typography variant="body2">
                  💰 Price: ₹{order.product.price}
                </Typography>
                <Typography variant="body2">
                  📌 Status:{" "}
                  <span
                    style={{
                      color: order.status === "Delivered" ? "green" : "red",
                      fontWeight: "bold",
                    }}
                  >
                    {order.status}
                  </span>
                </Typography>
              </Paper>
            </motion.div>
          ))}
        </Box>
      ) : (
        <motion.div variants={tableAnimation} initial="hidden" animate="show">
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#6C63FF" }}>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Order ID
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Order Date
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Customer Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Product
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Price
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order, index) => (
                <motion.tr
                  key={order.orderId}
                  variants={rowAnimation}
                  initial="hidden"
                  animate="show"
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  as={TableRow} // Use `as={TableRow}` to avoid errors
                >
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
                  <TableCell>{order.product.name}</TableCell>
                  <TableCell>₹{order.product.price}</TableCell>
                  <TableCell>
                    <span
                      style={{
                        color: order.status === "Delivered" ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      )}
    </TableContainer>
  );
}

export default OrderHistory;
