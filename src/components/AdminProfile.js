import { Box, Typography, Paper, Avatar } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

function AdminProfile() {
  const { user } = useAuth();

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <Avatar sx={{ width: 100, height: 100, mr: 3 }}>{user.name[0]}</Avatar>
        <Box>
          <Typography variant="h5">{user.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user.email}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body1">Role: Admin</Typography>
    </Paper>
  );
}

export default AdminProfile;
