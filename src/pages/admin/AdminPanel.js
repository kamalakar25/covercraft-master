import LogoutIcon from '@mui/icons-material/Logout';
import {
  Box,
  Button,
  Container,
  Paper,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../contexts/AuthContext';
import AdminProfile from './AdminProfile';
import OrderHistory from './OrderHistory';
import OrderManagement from './OrderManagement';
import ProductManagement from './ProductManagement';

function AdminPanel() {
  const [value, setValue] = useState(0);
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallScreen = useMediaQuery('(max-width: 480px)');

  const API_BASE_URL = process.env.REACT_APP_API_URL || "https://covercraft-backend.onrender.com/api";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/orders`);
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to fetch orders');
      }
    };

    fetchOrders();
    const intervalId = setInterval(fetchOrders, 30000); // Fetch every 30 seconds
    return () => clearInterval(intervalId);
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!user || user.role !== 'admin') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', padding: '20px' }}
      >
        <Typography variant='h6' color='error'>
          🚫 Access Denied. Admin privileges required.
        </Typography>
      </motion.div>
    );
  }

  const tabContent = [
    <AdminProfile key='profile' />,
    <OrderHistory key='history' orders={orders} />,
    <OrderManagement key='management' orders={orders} setOrders={setOrders} />,
    <ProductManagement key='products' />,
  ];

  return (
    <>
      {/* Viewport Meta Tag */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Container
          maxWidth='md'
          sx={{
            mt: isSmallScreen ? 6 : isMobile ? 8 : 10,
            mb: isSmallScreen ? 1 : isMobile ? 2 : 4,
            px: isSmallScreen ? 1 : isMobile ? 2 : 3,
          }}
        >
          {/* Admin Panel Header */}
          <Paper
            elevation={3}
            sx={{
              p: isSmallScreen ? 2 : isMobile ? 2.5 : 3,
              mb: 3,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: isSmallScreen ? 'column' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: isSmallScreen ? 1 : 3,
                textAlign: 'center',
              }}
            >
              <Typography
                variant={isSmallScreen ? 'h6' : isMobile ? 'h5' : 'h4'}
                component='h1'
                gutterBottom
              >
                Admin Panel
              </Typography>

              {/* Logout Button */}
              <Button
                variant='contained'
                color='error'
                onClick={logout}
                startIcon={<LogoutIcon />}
                sx={{
                  fontSize: isSmallScreen ? '0.7rem' : isMobile ? '0.75rem' : '0.875rem',
                  fontWeight: 'bold',
                  py: isSmallScreen ? 0.5 : 1,
                  px: isSmallScreen ? 1.5 : 2,
                  position: isSmallScreen ? 'relative' : 'absolute',
                  top: isSmallScreen ? 'auto' : 20,
                  right: isSmallScreen ? 'auto' : 10,
                  width: isSmallScreen ? '100%' : 'auto',
                }}
              >
                Logout
              </Button>
            </Box>

            {/* Tabs Section */}
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='admin panel tabs'
              variant='scrollable'
              scrollButtons='auto'
              centered={!isMobile}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 3,
                background: 'white',
                marginTop: isSmallScreen ? 2 : isMobile ? 3 : 4,
                '& .MuiTabs-indicator': {
                  backgroundColor: '#6C63FF',
                },
                '& .MuiTab-root': {
                  fontSize: isSmallScreen ? '0.7rem' : isMobile ? '0.75rem' : '1rem',
                  fontWeight: 'bold',
                  color: '#495057',
                  minWidth: '80px',
                  padding: isSmallScreen ? '6px' : '12px',
                  '&.Mui-selected': {
                    color: '#6C63FF',
                  },
                },
              }}
            >
              <Tab label='👤 Profile' />
              <Tab label='📦 Orders' />
              <Tab label='⚙️ Management' />
              <Tab label='🛍️ Products' />
            </Tabs>
          </Paper>

          {/* Tab Content with Animation */}
          <Box sx={{ mt: 2, px: isSmallScreen ? 1 : isMobile ? 2 : 3 }}>
            <AnimatePresence mode='wait'>
              <motion.div
                key={value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {tabContent[value]}
              </motion.div>
            </AnimatePresence>
          </Box>
        </Container>
      </motion.div>
    </>
  );
}

export default AdminPanel;
