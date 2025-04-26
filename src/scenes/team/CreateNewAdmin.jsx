import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  AlertTitle,
  IconButton,
  InputAdornment,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme"; // Adjust this import as necessary
import AuthContext from "../../context/AuthContext";
import { motion } from 'framer-motion'
import Swal from "sweetalert2";


const CreateNewAdmin = ({ handleCancel }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
    phoneNumber: "",
    userName: "",
    address: "",
    city: "",
    country: "",
    profileImage: "",
    nextOfKin: {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
    },
    role: "", // Role field for the selector
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("nextOfKin.")) {
      const kinField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        nextOfKin: { ...prev.nextOfKin, [kinField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const clearForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      emailAddress: "",
      password: "",
      phoneNumber: "",
      userName: "",
      address: "",
      city: "",
      country: "",
      profileImage: "",
      nextOfKin: {
        fullName: "",
        phoneNumber: "",
        email: "",
        address: "",
      },
      role: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation (you can add more complex validation as needed)
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.emailAddress ||
      !formData.password ||
      !formData.phoneNumber ||
      !formData.userName ||
      !formData.address ||
      !formData.city ||
      !formData.country ||
      !formData.profileImage ||
      !formData.nextOfKin.fullName ||
      !formData.nextOfKin.phoneNumber ||
      !formData.nextOfKin.email ||
      !formData.nextOfKin.address ||
      !formData.role
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Email validation (add more robust validation if needed)
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailAddress)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${apiUrl}/admin/admin-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred. Please try again.");
        throw new Error("An error occurred while creating the admin.");
      }

      clearForm();
      setSuccess(`${formData.firstName} ${formData.lastName} has been added successfully! Click Cancel to close form.`);

      // Move success message clear after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);

      setLoading(false);

      // Display success message popup
       Swal.fire(
         `Success!`,
         `${formData.firstName} ${formData.lastName} has been added successfully!`,
         "success"
      );
      setError("");
    } catch (error) {
      console.error("Error creating new admin:", error);
      setError("An error occurred. Please try again.");
      setLoading(false);
      Swal.fire(`Error!`, `An error occurred. Please try again.`, "error");
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <Box m="20px">
      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography variant="h2" fontWeight="600" color={colors.greenAccent[500]}>
          Create New Admin
        </Typography>
        <Button
          variant="outlined"
          onClick={handleCancel}
          sx={{
            mb: 2,
            color: colors.grey[100],
            borderColor: colors.grey[400],
            "&:hover": {
              borderColor: colors.grey[500],
            },
          }}
        >
          Cancel
        </Button>
      </Grid>

      <Typography variant="body1" color={colors.grey[100]}>
        Fill in the form below to create a new admin.
      </Typography>

      {/* Display success or error messages */}
      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <AlertTitle>Success</AlertTitle>
          {success}
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{
                    input: {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{
                    input: {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email Address"
                  name="emailAddress"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{
                    input: {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  InputProps={{
                    style: { color: "#fff" },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    input: {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{
                    input: {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="User Name"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{
                    input: {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{
                    input: {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{
                    input: {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{
                    input: {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined" required>
                  <InputLabel>Role</InputLabel>
                  <Select
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    sx={{
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffb554", // Default border color
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffb554", // Hover border color
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffb554", // Focused border color
                      },
                    }}
                  >
                    <MenuItem value="superadmin">Superadmin</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </Select>
                </FormControl>


              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Profile Image Url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{
                    input: {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" color={colors.grey[100]}>
                  Next of Kin
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Full Name"
                  name="nextOfKin.fullName"
                  value={formData.nextOfKin.fullName}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{
                    input: {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Phone Number"
                  name="nextOfKin.phoneNumber"
                  value={formData.nextOfKin.phoneNumber}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{
                    input: {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Email"
                  name="nextOfKin.email"
                  value={formData.nextOfKin.email}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{
                    input: {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Address"
                  name="nextOfKin.address"
                  value={formData.nextOfKin.address}
                  onChange={handleChange}
                  required
                  InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{
                    input: {
                      color: "#fff",
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&:hover fieldset": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                />
              </Grid>

              <Grid container justifyContent="center" alignItems="center">
                <Grid item md={4}> {/* Adjust size as needed */}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: colors.greenAccent[600],
                      color: "white",
                      fontSize: "16px",
                      fontWeight: "bold",
                      padding: "12px",
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: colors.greenAccent[700],
                        transform: "scale(1.02)",
                        transition: "transform 0.2s ease-in-out",
                      },
                      mt: 2,
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : "Create Admin"}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default CreateNewAdmin;
