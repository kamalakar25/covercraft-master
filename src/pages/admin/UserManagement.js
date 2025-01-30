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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    email: "",
    password: "",
    isAdmin: false,
  });

  useEffect(() => {
    setUsers(getData("users"));
  }, []);

  const handleAddUser = () => {
    const updatedUsers = [...users, { ...newUser, id: generateId() }];
    saveData("users", updatedUsers);
    setUsers(updatedUsers);
    setIsAddDialogOpen(false);
    setNewUser({ email: "", password: "", isAdmin: false });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Button
        variant="contained"
        onClick={() => setIsAddDialogOpen(true)}
        sx={{ mb: 2 }}
      >
        Add User
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Admin</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={isAddDialogOpen} onClose={() => setIsAddDialogOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Is Admin"
            select
            fullWidth
            value={newUser.isAdmin}
            onChange={(e) =>
              setNewUser({ ...newUser, isAdmin: e.target.value === "true" })
            }
            SelectProps={{
              native: true,
            }}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddUser}>Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserManagement;
