import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Select,
  MenuItem,
  Button,
  useMediaQuery,
  useTheme,
  Box,
} from "@mui/material";
import { motion } from "framer-motion";

function OrderManagement({ orders, setOrders }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleStatusChange = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.orderId === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

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
    <TableContainer component={Paper}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Order Management
      </Typography>
      {isMobile ? (
        <Box sx={{ p: 2 }}>
          {orders.map((order) => (
            <motion.div
              key={order.orderId}
              variants={rowAnimation}
              initial="hidden"
              animate="show"
            >
              <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1">
                  Order ID: {order.orderId}
                </Typography>
                <Typography variant="body2">
                  Date: {new Date(order.orderDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2">
                  Customer: {`${order.firstName} ${order.lastName}`}
                </Typography>
                <Typography variant="body2">
                  Product: {order.product.name}
                </Typography>
                <Typography variant="body2">
                  Price: ₹{order.product.price}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.orderId, e.target.value)
                    }
                    fullWidth
                    size="small"
                  >
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                  </Select>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  sx={{ mt: 1 }}
                  onClick={() =>
                    handleStatusChange(order.orderId, order.status)
                  }
                >
                  Update
                </Button>
              </Paper>
            </motion.div>
          ))}
        </Box>
      ) : (
        <motion.div variants={tableAnimation} initial="hidden" animate="show">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>Order Date</TableCell>
                <TableCell>Customer Name</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <motion.tr key={order.orderId} variants={rowAnimation}>
                  <TableCell>{order.orderId}</TableCell>
                  <TableCell>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{`${order.firstName} ${order.lastName}`}</TableCell>
                  <TableCell>{order.product.name}</TableCell>
                  <TableCell>₹{order.product.price}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.orderId, e.target.value)
                      }
                      size="small"
                    >
                      <MenuItem value="Processing">Processing</MenuItem>
                      <MenuItem value="Shipped">Shipped</MenuItem>
                      <MenuItem value="Delivered">Delivered</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() =>
                        handleStatusChange(order.orderId, order.status)
                      }
                    >
                      Update
                    </Button>
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

export default OrderManagement;
