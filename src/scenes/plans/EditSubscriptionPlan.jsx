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
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import AuthContext from "../../context/AuthContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const EditSubscriptionPlan = ({ planData, handleCancel }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    planName: "",
    title: "",
    amount: "",
    description: "",
    interval: "",
    isActive: false,
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Pre-fill the form with the existing plan data
    if (planData) {
      setFormData({
        planName: planData.planName,
        title: planData.title,
        amount: planData.amount,
        description: planData.description,
        interval: planData.interval,
        isActive: planData.isActive,
      });
    }
  }, [planData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const updatedPlanData = {
        planName: formData.planName,
        title: formData.title,
        amount: parseFloat(formData.amount),
        description: formData.description,
        interval: formData.interval,
        isActive: formData.isActive,
        isRecurring: formData.isRecurring,
      };

      const response = await fetch(
        `${apiUrl}/subscription-plan/edit/${planData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedPlanData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to update subscription plan.");
      }

      // Success SweetAlert
      Swal.fire({
        title: "Success!",
        text: `Subscription plan "${formData.planName}" updated successfully!`,
        icon: "success",
        confirmButtonColor: colors.greenAccent[600],
      }).then(() => {
        handleCancel();
      });
    } catch (error) {
      console.error("Error updating subscription plan:", error);

      // Error SweetAlert
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        confirmButtonColor: colors.greenAccent[600],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box m="20px">
      <Grid
        item
        xs={12}
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Typography
          variant="h2"
          fontWeight="600"
          color={colors.greenAccent[500]}
        >
          Edit Subscription Plan: {formData.planName}
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
        Fill in the form below to edit the subscription plan details.
      </Typography>

      {error && (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ interval: 0.5 }}
      >
        <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Plan Name */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Plan Name"
                  name="planName"
                  value={formData.planName}
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

              {/* title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Title"
                  name="title"
                  value={formData.title}
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

              {/* amount */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
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

              {/* Duration */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Interval (in month)"
                  name="interval"
                  type="text"
                  value={formData.interval}
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

              {/* Is Active */}
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel sx={{ color: "#fff" }}>Status</InputLabel>
                  <Select
                    name="isActive"
                    value={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.value === true,
                      }))
                    }
                    label="Status"
                    sx={{
                      color: "#fff",
                      ".MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffb554",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#ffb554",
                      },
                    }}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Description */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  multiline
                  rows={3}
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
            </Grid>

            <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={isLoading}
                sx={{
                  backgroundColor: colors.greenAccent[600],
                  "&:hover": {
                    backgroundColor: colors.greenAccent[700],
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  "Update Subscription Plan"
                )}
              </Button>
            </Box>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default EditSubscriptionPlan;
