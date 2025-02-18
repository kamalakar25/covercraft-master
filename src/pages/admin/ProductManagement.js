import {
  Add as AddIcon,
  Clear as ClearIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React, { useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://covercraft-backend.onrender.com/api";

const ProductManagement = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [formData, setFormData] = useState({
    name: '',
    model: '',
    image: '',
    description: '',
    price: '',
    discountPrice: '',
    category: '',
    inStock: true,
    rating: 4.5,
    reviews: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStockToggle = (e) => {
    setFormData((prev) => ({
      ...prev,
      inStock: e.target.checked,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      model: '',
      image: '',
      description: '',
      price: '',
      discountPrice: '',
      category: '',
      inStock: true,
      rating: 4.5,
      reviews: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/add-products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([formData]),
      });

      if (!response.ok) {
        throw new Error('Failed to add product');
      }

      setSnackbar({
        open: true,
        message: 'Product added successfully!',
        severity: 'success',
      });
      resetForm();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth='lg' sx={{ py: { xs: 2, sm: 3, md: 4 } }}>
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          borderRadius: 2,
          background: theme.palette.background.paper,
        }}
      >
        <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
          <Typography
            variant={isMobile ? 'h5' : 'h4'}
            component='h1'
            gutterBottom
            sx={{
              fontWeight: 'bold',
              textAlign: 'center',
              color: theme.palette.primary.main,
            }}
          >
            Product Management
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Basic Information Section */}
            <Grid item xs={12}>
              <Typography
                variant='h6'
                sx={{
                  mb: 2,
                  fontSize: { xs: '1rem', sm: '1.25rem' },
                }}
              >
                Basic Information
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Product Name'
                name='name'
                value={formData.name}
                onChange={handleInputChange}
                required
                size={isMobile ? 'small' : 'medium'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Brand & Model'
                name='model'
                value={formData.model}
                onChange={handleInputChange}
                required
                size={isMobile ? 'small' : 'medium'}
              />
            </Grid>

            {/* Pricing Section */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Display Price'
                name='price'
                type='number'
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="Ex: 899"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>₹</InputAdornment>
                  ),
                }}
                size={isMobile ? 'small' : 'medium'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Strike off Price'
                name='discountPrice'
                type='number'
                placeholder="Ex: 1199"
                value={formData.discountPrice}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position='start'>₹</InputAdornment>
                  ),
                }}
                size={isMobile ? 'small' : 'medium'}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                required
                size={isMobile ? 'small' : 'medium'}
              >
                <InputLabel
                  sx={{ color: '#000', '&.Mui-focused': { color: '#6C63FF' } }}
                >
                  Category
                </InputLabel>
                <Select
                  name='category'
                  value={formData.category}
                  onChange={handleInputChange}
                  displayEmpty
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, // Removes border
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    }, // No border on hover
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    }, // No border when focused
                    backgroundColor: '#fff', // Ensures good contrast
                  }}
                >
                  {/* Available Categories */}
                  <MenuItem value='Mobile'>📱 Mobile</MenuItem>
                  <MenuItem value='Tablet'>📟 Tablet</MenuItem>

                  {/* Unavailable Categories with Strikethrough */}
                  <MenuItem
                    value='Laptop'
                    disabled
                    sx={{ textDecoration: 'line-through', color: 'gray' }}
                  >
                    💻 Laptop (Out of Stock)
                  </MenuItem>
                  <MenuItem
                    value='Smartwatch'
                    disabled
                    sx={{ textDecoration: 'line-through', color: 'gray' }}
                  >
                    ⌚ Smartwatch (Coming Soon)
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label='Image URL'
                name='image'
                value={formData.image}
                onChange={handleInputChange}
                required
                InputProps={{
                  endAdornment: formData.image && (
                    <InputAdornment position='end'>
                      <IconButton
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, image: '' }))
                        }
                        edge='end'
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                  startAdornment: (
                    <InputAdornment position='start'>
                      <ImageIcon />
                    </InputAdornment>
                  ),
                }}
                size={isMobile ? 'small' : 'medium'}
              />
            </Grid>

            {/* Description Section */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label='Description'
                name='description'
                value={formData.description}
                onChange={handleInputChange}
                required
                multiline
                rows={4}
                size={isMobile ? 'small' : 'medium'}
              />
            </Grid>

            {/* Stock Status Section */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.inStock}
                    onChange={handleStockToggle}
                    color='primary'
                  />
                }
                label='In Stock'
              />
            </Grid>

            {/* Action Buttons */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexDirection: isMobile ? 'column' : 'row',
                  justifyContent: 'flex-end',
                  mt: 2,
                }}
              >
                <Button
                  variant='outlined'
                  onClick={resetForm}
                  disabled={loading}
                  fullWidth={isMobile}
                  sx={{ minWidth: { sm: '120px' } }}
                >
                  Reset
                </Button>
                <Button
                  type='submit'
                  variant='contained'
                  disabled={loading}
                  fullWidth={isMobile}
                  sx={{ minWidth: { sm: '120px' } }}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <AddIcon />
                  }
                >
                  {loading ? 'Adding...' : 'Add Product'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>

        {/* Preview Section */}
        {/* {formData.image && (
          <Box
            sx={{
              mt: 4,
              p: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Image Preview
            </Typography>
            <Box
              component="img"
              src={formData.image}
              alt="Product preview"
              sx={{
                maxWidth: "100%",
                maxHeight: "200px",
                objectFit: "contain",
                display: "block",
                margin: "0 auto",
              }}
              onError={(e) => {
                e.target.src = "placeholder-image-url";
                e.target.alt = "Image load failed";
              }}
            />
          </Box>
        )} */}
      </Paper>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductManagement;
