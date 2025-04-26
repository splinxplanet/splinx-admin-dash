import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import AuthContext from "../../context/AuthContext";
import { motion } from 'framer-motion';
import Swal from 'sweetalert2';

const EditAdmin = ({ adminData, handleCancel }) => {
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
    profileImage: "",
    userName: "",
    address: "",
    city: "",
    country: "",
    nextOfKin: {
      fullName: "",
      phoneNumber: "",
      email: "",
      address: "",
    },
    role: "",
    staffId: "",
  });
  const [error, setError] = useState(null);
  // const [successMsg, setSuccessMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); 

  useEffect(() => {
    // Pre-fill the form with the existing admin data
    if (adminData) {
      // set the form fields with the existing admin data
      setFormData({
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        emailAddress: adminData.emailAddress,
        password: null,
        phoneNumber: adminData.phoneNumber,
        profileImage: adminData.profileImage,
        userName: adminData.userName,
        address: adminData.address,
        city: adminData.city,
        country: adminData.country,
        nextOfKin: {
          fullName: adminData.nextOfKin.fullName,
          phoneNumber: adminData.nextOfKin.phoneNumber,
          email: adminData.nextOfKin.email,
          address: adminData.nextOfKin.address,
        },
        role: adminData.role,
        staffId: adminData.staffId,
      });
    }
  }, [adminData]);

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

  const handleSubmit = async (e) => {

    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Implement API call to update admin information
    try {
      const newAdminData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.emailAddress,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
        userName: formData.userName,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        nextOfKin: {
          fullName: formData.nextOfKin.fullName,
          phoneNumber: formData.nextOfKin.phoneNumber,
          email: formData.nextOfKin.email,
          address: formData.nextOfKin.address,
        },
        role: formData.role,
        staffId: formData.staffId,
      };
      const response = await fetch(
        `${apiUrl}/admin/admin-update/${adminData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newAdminData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update admin data.");
      }
      // Success SweetAlert
      Swal.fire({
        title: 'Success!',
        text: `${formData.firstName} ${formData.lastName} updated successfully!`, // Template literal for name
        icon: 'success',
        confirmButtonColor: colors.greenAccent[600],
      }).then(() => {
        handleCancel();
      });

    } catch (error) {
      console.error('Error updating admin:', error);

      // Error SweetAlert
      Swal.fire({
        title: 'Error!',
        text: 'An error occurred. Please try again.',
        icon: 'error',
        confirmButtonColor: colors.greenAccent[600],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Box m="20px">
     <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h2" fontWeight="600" color={colors.greenAccent[500]}>
          Edit {formData.firstName} {formData.lastName}
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
Fill in the form below to edit the admin details. 
</Typography>
      {
    error && (
      <Typography variant="body1" color="error">
        {error}
      </Typography>
    )
  }

  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* First Name */}
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

          {/* Last Name */}
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

          {/* Email Address */}
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

          {/* Password (Optional - for updates) */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Password (Optional)"
              type={showPassword ? "text" : "password"} // Use showPassword state here
                name="password"
                value={formData.password}
                onChange={handleChange}
                InputProps={{
                  style: { color: "#fff" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={handleTogglePasswordVisibility} // Call the toggle function
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

          {/* Phone Number */}
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

          {/* Username */}
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

          {/* Address */}
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

          {/* City */}
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

          {/* Country */}
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

          {/* Next of Kin */}
          <Grid item xs={12}>
            <Typography variant="h6" color={colors.grey[100]}>
              Next of Kin
            </Typography>
          </Grid>
          {/* Next of Kin - Full Name */}
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

          {/* Next of Kin - Phone Number */}
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

          {/* Next of Kin - Email */}
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

          {/* Next of Kin - Address */}
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

          {/* Submit Button (Centered) */}
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
                {isLoading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Update Admin"
                )}
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </form>
    </Paper>
  </motion.div>
    </Box >
  );
};

export default EditAdmin;