import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, CreditCard, LocalShipping, ErrorOutline } from "@mui/icons-material"
import {
  Button,
  CardContent,
  TextField,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Stepper,
  Step,
  StepLabel,
  Box,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import { useNavigate } from "react-router-dom"

// Enhanced dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#BB86FC",
    },
    secondary: {
      main: "#03DAC6",
    },
    background: {
      default: "#121212",
      paper: "#1E1E1E",
    },
    error: {
      main: "#CF6679",
    },
    success: {
      main: "#03DAC6",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": {
              borderColor: "#BB86FC",
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
})

// Animation variants
const pageVariants = {
  initial: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
  }),
  animate: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  },
  exit: (direction) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.8,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 20,
    },
  }),
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
}

export default function MultiStepCheckoutForm({ product, onClose }) {
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "",
    cardType: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const navigate = useNavigate()

  // Validation patterns
  const patterns = {
    name: /^[a-zA-Z\s]{2,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[6-9]\d{9}$/,
    zipCode: /^[\d]{6}$/,
    cardNumber: /^[\d]{16}$/,
    cardExpiry: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
    cardCvc: /^[\d]{3,4}$/,
  }

  // Error messages
  const errorMessages = {
    name: "Name should contain only letters and spaces (2-50 characters)",
    email: "Please enter a valid email address",
    phone: "Phone number must be 10 digits and start with 6, 7, 8, or 9",
    address: "Address is required (minimum 10 characters)",
    city: "City is required",
    state: "State is required",
    zipCode: "ZIP code must be 6 digits",
    cardNumber: "Card number must be 16 digits",
    cardExpiry: "Invalid expiry date (MM/YY)",
    cardCvc: "CVC must be 3 or 4 digits",
  }

  const validateField = (name, value) => {
    if (!value) return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`
    if (patterns[name] && !patterns[name].test(value.replace(/\s/g, ""))) {
      return errorMessages[name]
    }
    if (name === "address" && value.length < 10) return errorMessages.address
    if (name === "cardExpiry") {
      const [month, year] = value.split("/")
      const expiryDate = new Date(2000 + Number.parseInt(year), Number.parseInt(month) - 1)
      if (expiryDate <= new Date()) {
        return "Expiry date must be in the future"
      }
    }
    return ""
  }

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field])
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const validateStep = (stepNumber) => {
    const newErrors = {}
    let isValid = true

    if (stepNumber === 1) {
      ;["name", "email", "phone", "address", "city", "state", "zipCode"].forEach((field) => {
        const error = validateField(field, formData[field])
        if (error) {
          newErrors[field] = error
          isValid = false
        }
      })
    }

    if (stepNumber === 2) {
      if (!formData.paymentMethod) {
        newErrors.paymentMethod = "Please select a payment method"
        isValid = false
      }
    }

    if (stepNumber === 3 && formData.paymentMethod === "card") {
      if (!formData.cardType) {
        newErrors.cardType = "Please select a card type"
        isValid = false
      }
    }

    if (stepNumber === 4 && formData.paymentMethod === "card") {
      ;["cardNumber", "cardExpiry", "cardCvc"].forEach((field) => {
        const error = validateField(field, formData[field])
        if (error) {
          newErrors[field] = error
          isValid = false
        }
      })
    }

    setErrors(newErrors)
    return isValid
  }

  const handleNext = () => {
    if (step === 1 && !validateStep(1)) return
    if (step === 2 && !validateStep(2)) return
    if (step === 3 && formData.paymentMethod === "card" && !validateStep(3)) return
    if (step === 4 && formData.paymentMethod === "card" && !validateStep(4)) return

    setDirection(1)
    setStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setDirection(-1)
    setStep((prev) => prev - 1)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    let formattedValue = value

    // Format specific fields
    switch (name) {
      case "cardNumber":
        formattedValue = value
          .replace(/\s/g, "")
          .replace(/(\d{4})/g, "$1 ")
          .trim()
        break
      case "cardExpiry":
        formattedValue = value
          .replace(/\D/g, "")
          .replace(/(\d{2})(\d)/, "$1/$2")
          .slice(0, 5)
        break
      case "phone":
        formattedValue = value.replace(/\D/g, "").slice(0, 10)
        break
      case "zipCode":
        formattedValue = value.replace(/\D/g, "").slice(0, 6)
        break
      default:
        break
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))

    if (touched[name]) {
      const error = validateField(name, formattedValue)
      setErrors((prev) => ({ ...prev, [name]: error }))
    }
  }

const clearLocalStorage = () => {
  localStorage.removeItem("cart");
  onClose();
  navigate("/"); // Navigate to the homepage
};


  const renderCardTypeSelection = () => (
    <motion.div variants={fadeInUp}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Typography variant="h5" gutterBottom style={{ color: "white" }}>
          Select Card Type
        </Typography>
        <FormControl component="fieldset" error={!!errors.cardType}>
          <RadioGroup name="cardType" value={formData.cardType} onChange={handleInputChange}>
            {["Visa", "MasterCard", "American Express", "Discover"].map((type) => (
              <motion.div key={type} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Paper
                  sx={{
                    mb: 2,
                    p: { xs: 2, sm: 3 },
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <FormControlLabel
                    value={type}
                    control={<Radio />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CreditCard />
                        <Typography>{type}</Typography>
                      </Box>
                    }
                  />
                </Paper>
              </motion.div>
            ))}
          </RadioGroup>
          {errors.cardType && (
            <Typography variant="caption" color="error">
              {errors.cardType}
            </Typography>
          )}
        </FormControl>
      </Box>
    </motion.div>
  )

  return (
    <ThemeProvider theme={darkTheme}>
      <CardContent
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          minHeight: { xs: "100vh", sm: "auto" },
          maxHeight: { xs: "100vh", sm: "none" },
          overflowY: "scroll",
          scrollbarWidth: "thin",
          scrollbarColor: "cyan black",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "cyan",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "deepskyblue",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "black",
          },
          backgroundColor: "black",
        }}
      >
        <Stepper
          activeStep={step - 1}
          sx={{
            mb: 4,
            display: { xs: "none", sm: "flex" },
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderRadius: "8px",
            padding: 2,
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
          }}
        >
          <Step>
            <StepLabel
              sx={{
                color: "white",
                "& .MuiStepIcon-root": {
                  color: step > 0 ? "cyan" : "gray",
                },
                "& .MuiStepIcon-text": {
                  fill: "black",
                },
                "& .MuiStepLabel-label": {
                  color: step > 0 ? "cyan" : "gray",
                },
              }}
            >
              Details
            </StepLabel>
          </Step>
          <Step>
            <StepLabel
              sx={{
                color: "white",
                "& .MuiStepIcon-root": {
                  color: step > 1 ? "cyan" : "gray",
                },
                "& .MuiStepIcon-text": {
                  fill: "black",
                },
                "& .MuiStepLabel-label": {
                  color: step > 1 ? "cyan" : "gray",
                },
              }}
            >
              Payment
            </StepLabel>
          </Step>
          <Step>
            <StepLabel
              sx={{
                color: "white",
                "& .MuiStepIcon-root": {
                  color: step > 2 ? "cyan" : "gray",
                },
                "& .MuiStepIcon-text": {
                  fill: "black",
                },
                "& .MuiStepLabel-label": {
                  color: step > 2 ? "cyan" : "gray",
                },
              }}
            >
              Confirm
            </StepLabel>
          </Step>
        </Stepper>

        {/* Mobile Step Indicator */}
        <Box
          sx={{
            display: { xs: "flex", sm: "none" },
            justifyContent: "center",
            alignItems: "center",
            mb: 3,
            padding: 2,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
            color: "white",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Step {step} of {formData.paymentMethod === "card" ? "5" : "4"}
          </Typography>
        </Box>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: "relative" }}
          >
            {step === 1 && (
              <motion.div variants={fadeInUp}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: { xs: 2, sm: 3 },
                  }}
                >
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ color: "white" }}
                  >
                    Personal Details
                  </Typography>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("name")}
                    error={!!errors.name}
                    helperText={errors.name}
                    size={isMobile ? "small" : "medium"}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("email")}
                    error={!!errors.email}
                    helperText={errors.email}
                    size={isMobile ? "small" : "medium"}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("phone")}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    size={isMobile ? "small" : "medium"}
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    multiline
                    rows={3}
                    value={formData.address}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("address")}
                    error={!!errors.address}
                    helperText={errors.address}
                    size={isMobile ? "small" : "medium"}
                  />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <TextField
                      fullWidth
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("city")}
                      error={!!errors.city}
                      helperText={errors.city}
                      size={isMobile ? "small" : "medium"}
                    />
                    <TextField
                      fullWidth
                      label="State"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("state")}
                      error={!!errors.state}
                      helperText={errors.state}
                      size={isMobile ? "small" : "medium"}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    label="ZIP Code"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("zipCode")}
                    error={!!errors.zipCode}
                    helperText={errors.zipCode}
                    size={isMobile ? "small" : "medium"}
                  />
                </Box>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div variants={fadeInUp}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ color: "white" }}
                  >
                    Payment Method
                  </Typography>
                  <FormControl
                    component="fieldset"
                    error={!!errors.paymentMethod}
                  >
                    <RadioGroup
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={(e) => {
                        handleInputChange(e);
                        setErrors((prev) => ({ ...prev, paymentMethod: "" }));
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Paper
                          sx={{
                            mb: 2,
                            p: { xs: 2, sm: 3 },
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor: "action.hover",
                            },
                            border: errors.paymentMethod ? "1px solid" : "none",
                            borderColor: errors.paymentMethod
                              ? "error.main"
                              : "transparent",
                          }}
                        >
                          <FormControlLabel
                            value="cod"
                            control={<Radio />}
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <LocalShipping />
                                <Box>
                                  <Typography>Cash on Delivery</Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Pay when you receive
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </Paper>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Paper
                          sx={{
                            p: { xs: 2, sm: 3 },
                            transition: "all 0.3s ease",
                            "&:hover": {
                              bgcolor: "action.hover",
                            },
                            border: errors.paymentMethod ? "1px solid" : "none",
                            borderColor: errors.paymentMethod
                              ? "error.main"
                              : "transparent",
                          }}
                        >
                          <FormControlLabel
                            value="card"
                            control={<Radio />}
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <CreditCard />
                                <Box>
                                  <Typography>Credit/Debit Card</Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    Secure online payment
                                  </Typography>
                                </Box>
                              </Box>
                            }
                          />
                        </Paper>
                      </motion.div>
                    </RadioGroup>
                    {errors.paymentMethod && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Box
                          sx={{
                            mt: 2,
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: "error.main",
                          }}
                        >
                          <ErrorOutline fontSize="small" />
                          <Typography variant="caption" color="error">
                            {errors.paymentMethod}
                          </Typography>
                        </Box>
                      </motion.div>
                    )}
                  </FormControl>
                </Box>
              </motion.div>
            )}

            {step === 3 &&
              formData.paymentMethod === "card" &&
              renderCardTypeSelection()}

            {step === 4 && formData.paymentMethod === "card" && (
              <motion.div variants={fadeInUp}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ color: "white" }}
                  >
                    Card Details
                  </Typography>
                  <TextField
                    fullWidth
                    label="Card Number"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur("cardNumber")}
                    error={!!errors.cardNumber}
                    helperText={errors.cardNumber}
                    inputProps={{ maxLength: 19 }}
                    size={isMobile ? "small" : "medium"}
                  />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                      gap: 2,
                    }}
                  >
                    <TextField
                      label="Expiry Date"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("cardExpiry")}
                      error={!!errors.cardExpiry}
                      helperText={errors.cardExpiry}
                      placeholder="MM/YY"
                      inputProps={{ maxLength: 5 }}
                      size={isMobile ? "small" : "medium"}
                    />
                    <TextField
                      label="CVC"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("cardCvc")}
                      error={!!errors.cardCvc}
                      helperText={errors.cardCvc}
                      type="password"
                      inputProps={{ maxLength: 4 }}
                      size={isMobile ? "small" : "medium"}
                    />
                  </Box>
                </Box>
              </motion.div>
            )}

            {((step === 3 && formData.paymentMethod === "cod") ||
              (step === 5 && formData.paymentMethod === "card")) && (
              <motion.div variants={fadeInUp}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ color: "white" }}
                  >
                    Confirm Order
                  </Typography>
                  <Paper sx={{ p: { xs: 2, sm: 3 } }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Delivery Address:
                    </Typography>
                    <Typography color="text.secondary" paragraph>
                      {formData.name}
                      <br />
                      {formData.address}
                      <br />
                      {formData.city}, {formData.state} {formData.zipCode}
                      <br />
                      Phone: {formData.phone}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      Payment Method:
                    </Typography>
                    <Typography color="text.secondary">
                      {formData.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : `${formData.cardType} Card`}
                    </Typography>
                  </Paper>
                </Box>
              </motion.div>
            )}

            {((step === 4 && formData.paymentMethod === "cod") ||
              (step === 6 && formData.paymentMethod === "card")) && (
              <motion.div variants={fadeInUp}>
                <Box sx={{ textAlign: "center" }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                    }}
                  >
                    <Box
                      sx={{
                        width: { xs: 60, sm: 80 },
                        height: { xs: 60, sm: 80 },
                        borderRadius: "50%",
                        bgcolor: "success.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto",
                        mb: 3,
                      }}
                    >
                      <Check sx={{ fontSize: { xs: 30, sm: 40 } }} />
                    </Box>
                  </motion.div>
                  <Typography
                    variant="h5"
                    gutterBottom
                    style={{ color: "white" }}
                  >
                    Order Confirmed!
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    Thank you for your purchase
                  </Typography>
                  <Paper
                    sx={{
                      p: { xs: 2, sm: 3 },
                      mt: 3,
                      background:
                        "linear-gradient(145deg, rgba(187, 134, 252, 0.1), rgba(3, 218, 198, 0.1))",
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      Order Summary
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography>{product.name}</Typography>
                      <Typography>₹{product.price}</Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography>Shipping</Typography>
                      <Typography>₹{product.shipping}</Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Typography variant="subtitle1">Total</Typography>
                      <Typography variant="subtitle1" color="primary">
                        ₹{(Number(product.price) + product.shipping).toFixed(2)}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </motion.div>
            )}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 4,
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              {step > 1 &&
                step < (formData.paymentMethod === "card" ? 6 : 4) && (
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                    fullWidth={isMobile}
                  >
                    Back
                  </Button>
                )}
              {step === 1 && (
                <Button
                  variant="outlined"
                  onClick={onClose}
                  fullWidth={isMobile}
                >
                  Cancel
                </Button>
              )}
              {step < (formData.paymentMethod === "card" ? 5 : 3) && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  fullWidth={isMobile}
                  sx={{
                    background:
                      "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #9965f4 30%, #02b3a9 90%)",
                    },
                  }}
                >
                  Next
                </Button>
              )}
              {((step === 3 && formData.paymentMethod === "cod") ||
                (step === 5 && formData.paymentMethod === "card")) && (
                <Button
                  variant="contained"
                  onClick={handleNext}
                  fullWidth={isMobile}
                  sx={{
                    background:
                      "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #9965f4 30%, #02b3a9 90%)",
                    },
                  }}
                >
                  Place Order
                </Button>
              )}
              {((step === 4 && formData.paymentMethod === "cod") ||
                (step === 6 && formData.paymentMethod === "card")) && (
                <Button
                  variant="contained"
                  onClick={clearLocalStorage}
                  fullWidth={isMobile}
                  sx={{
                    background:
                      "linear-gradient(45deg, #BB86FC 30%, #03DAC6 90%)",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #9965f4 30%, #02b3a9 90%)",
                    },
                  }}
                >
                  Close
                </Button>
              )}
            </Box>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </ThemeProvider>
  );
}

