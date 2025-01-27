import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import React from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import AuthenticatedRoute from './components/AuthenticatedRoute';
import Login from './components/Login';
import ProductDetail from './components/ProductDetail';
import Signup from './components/Signup';
import { AuthProvider } from './contexts/AuthContext';
import MobileCoverLandingPage from './MobileCoverLandingPage';
import theme from './theme';
import CartPage from './components/CartPage';
import CategoryPage from './components/CategoryPage';



function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Protect the root route */}
            <Route
              path="/"
              element={
                <AuthenticatedRoute>
                  <MobileCoverLandingPage />
                </AuthenticatedRoute>
              }
            />
            <Route
              path="/product/:productId"
              element={
                <AuthenticatedRoute>
                  <ProductDetail />
                </AuthenticatedRoute>
              }
            />


<Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/cart" element={<CartPage />} />
            {/* Redirect any unmatched routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
