import React, { useState } from 'react';
import Swal from 'sweetalert2';  // Import SweetAlert
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Modal,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import '../../index.css';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const AddModal = ({ open, onClose, onSubmit, title }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
    profileImage: '',
    userName: '',
    address: '',
    city: '',
    country: '',
    role: '',
    password: '',
    confirmPassword: '',
    nextOfKin: {
      fullName: '',
      phoneNumber: '',
      email: '',
      address: '',
    },
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      await onSubmit(formData);

      // Trigger SweetAlert on success
      Swal.fire({
        title: 'Full name has been added successfully!',
        text: 'Do you want to add another admin?',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.isConfirmed) {
          // Keep the modal open for adding another admin
          setFormData({
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNumber: '',
            profileImage: '',
            userName: '',
            address: '',
            city: '',
            country: '',
            role: '',
            password: '',
            confirmPassword: '',
            nextOfKin: {
              fullName: '',
              phoneNumber: '',
              email: '',
              address: '',
            },
          });
        } else {
          // Close modal if user doesn't want to add another admin
          onClose();
        }
      });
    } catch (error) {
      console.error('Error creating item:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const steps = [
    {
      label: 'Basic Information',
      description: 'Enter the admin user\'s basic details.',
      content: (
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
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Grid item xs={12}>
              {/* Role Dropdown */}
              <FormControl fullWidth variant="outlined" required sx={{ mt: 2 }}>
                <InputLabel id="role-label" sx={{ color: colors.grey[100] }}>
                  Role
                </InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                  sx={{
                    '.MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.grey[400],
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.grey[500],
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: colors.greenAccent[700],
                    },
                    '.MuiSvgIcon-root': {
                      color: colors.grey[400],
                    },
                  }}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="superadmin">Super Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>

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
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Contact Information',
      description: 'Enter the admin user\'s contact details.',
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="User Name"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Profile Image"
              name="profileImage"
              value={formData.profileImage}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>
      ),
    },
    {
      label: 'Next of Kin',
      description: 'Provide emergency contact information.',
      content: (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              variant="outlined"
              label="Full Name"
              name="nextOfKin.fullName"
              value={formData.nextOfKin.fullName}
              onChange={handleChange}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              name="nextOfKin.email"
              value={formData.nextOfKin.email}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
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
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Address"
              name="nextOfKin.address"
              value={formData.nextOfKin.address}
              onChange={handleChange}
              required
              sx={{ mt: 2 }}
            />
          </Grid>
        </Grid>
      ),
    },
  ];


  return (
    <Modal open={open} onClose={onClose}>
      <Box className="add-modal" bgcolor={colors.primary[400]}>
        <Typography variant="h4" fontWeight="bold" mb={1} color={colors.grey[100]}>
          {title}
        </Typography>

        <Typography variant="body1" mb={2} color={colors.grey[100]}>
          Fill in the form below to create a new admin user.
        </Typography>

        {error && (
          <Typography variant="body1" color="error" mb={2}>
            {error}
          </Typography>
        )}

        <Paper elevation={3} sx={{ padding: 3, marginTop: 2, bgcolor: colors.primary[400] }}>
          <form onSubmit={handleSubmit}>
            <Stepper activeStep={activeStep} orientation="vertical">
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel>{step.label}</StepLabel>
                  <StepContent>
                    <Typography>{step.description}</Typography>
                    {step.content}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      {index > 0 && (
                        <Button onClick={handleBack} sx={{ mr: 2 }}>
                          Back
                        </Button>
                      )}

                      <Button
                        type={index === steps.length - 1 ? 'submit' : 'button'}
                        onClick={index === steps.length - 1 ? handleSubmit : handleNext}
                        disabled={loading}
                        variant="contained"
                        sx={{ backgroundColor: colors.greenAccent[600], color: 'white' }}
                      >
                        {index === steps.length - 1 ? 'Create' : 'Next'}
                      </Button>
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
          </form>
        </Paper>

        
      </Box>
    </Modal>
  );
};

export default AddModal;