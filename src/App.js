import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./contexts/AuthContext";
import theme from "./theme";
import Login from "./components/Login";
import Signup from "./components/Signup";
import MobileCoverLandingPage from "./MobileCoverLandingPage";
import ProductDetail from "./components/ProductDetail";
import CartPage from "./components/CartPage";
import CategoryPage from "./components/CategoryPage";
import AdminPanel from "./components/AdminPanel";
import AuthenticatedRoute from "./components/AuthenticatedRoute";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
          <Route
            path="/admin"
            element={
              <AuthenticatedRoute>
                <AdminPanel />
              </AuthenticatedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
