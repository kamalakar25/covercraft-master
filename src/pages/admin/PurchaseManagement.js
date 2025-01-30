import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { getData, saveData, generateId } from "../../utils/dataManager";

const PurchaseManagement = () => {
  const [purchases, setPurchases] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newPurchase, setNewPurchase] = useState({
    productName: "",
    price: 0,
    discount: 0,
    finalPrice: 0,
    userId: "",
  });

  useEffect(() => {
    setPurchases(getData("purchases"));
  }, []);

  const handleAddPurchase = () => {
    const updatedPurchases = [
      ...purchases,
      { ...newPurchase, id: generateId(), createdAt: new Date().toISOString() },
    ];
    saveData("purchases", updatedPurchases);
    setPurchases(updatedPurchases);
    setIsAddDialogOpen(false);
    setNewPurchase({
      productName: "",
      price: 0,
      discount: 0,
      finalPrice: 0,
      userId: "",
    });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Purchase Management
      </Typography>
      <Button
        variant="contained"
        onClick={() => setIsAddDialogOpen(true)}
        sx={{ mb: 2 }}
      >
        Add Purchase
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Discount</TableCell>
              <TableCell align="right">Final Price</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{purchase.productName}</TableCell>
                <TableCell align="right">{purchase.price}</TableCell>
                <TableCell align="right">{purchase.discount}</TableCell>
                <TableCell align="right">{purchase.finalPrice}</TableCell>
                <TableCell>{purchase.userId}</TableCell>
                <TableCell>
                  {new Date(purchase.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Add New Purchase</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Product Name"
            fullWidth
            value={newPurchase.productName}
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, productName: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Price"
            type="number"
            fullWidth
            value={newPurchase.price}
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, price: Number(e.target.value) })
            }
          />
          <TextField
            margin="dense"
            label="Discount"
            type="number"
            fullWidth
            value={newPurchase.discount}
            onChange={(e) =>
              setNewPurchase({
                ...newPurchase,
                discount: Number(e.target.value),
              })
            }
          />
          <TextField
            margin="dense"
            label="Final Price"
            type="number"
            fullWidth
            value={newPurchase.finalPrice}
            onChange={(e) =>
              setNewPurchase({
                ...newPurchase,
                finalPrice: Number(e.target.value),
              })
            }
          />
          <TextField
            margin="dense"
            label="User ID"
            fullWidth
            value={newPurchase.userId}
            onChange={(e) =>
              setNewPurchase({ ...newPurchase, userId: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddPurchase}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PurchaseManagement;
