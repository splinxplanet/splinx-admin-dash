import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import AuthContext from "../../context/AuthContext";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

const CreatePlan = ({ handleCancel }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    planName: "",
    title: "",
    interval: "",
    amount: "",
    description: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData({
      planName: "",
      title: "",
      interval: "",
      amount: "",
      description: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation (you can add more complex validation as needed)
    if (
      !formData.planName ||
      !formData.title ||
      !formData.interval ||
      !formData.amount ||
      !formData.description
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const planData = {
        planName: formData.planName,
        title: formData.title,
        interval: formData.interval,
        amount: parseFloat(formData.amount),
        description: formData.description,
        type: formData.interval,
        price: `$${formData.amount}/${formData.interval}`,
        period: formData.interval,
        isRecurring: true,
      };
  
      const response = await fetch(`${apiUrl}/subscription-plan/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred. Please try again.");
        throw new Error("An error occurred while creating the plan.");
      }

      clearForm();
      setSuccess(
        `${formData.planName} has been added successfully! Click Cancel to close form.`
      );

      // Move success message clear after 3 seconds
      setTimeout(() => {
        setSuccess("");
      }, 3000);

      setLoading(false);

      // Display success message popup
      Swal.fire(
        `Success!`,
        `${formData.planName} has been added successfully!`,
        "success"
      );
      setError("");
    } catch (error) {
      console.error("Error creating new admin:", error.message);
      setError("An error occurred. Please try again.");
      setLoading(false);
      Swal.fire(`Error!`, `An error occurred. Please try again.`, "error");
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
          Create New Subscription Plan
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
        Fill in the form below to create a new plan.
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Interval"
                  name="interval"
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

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Amount"
                  type="text"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
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
                  label="Description"
                  name="description"
                  value={formData.description}
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
                <Grid item md={4}>
                  {" "}
                  {/* Adjust size as needed */}
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
                    {loading ? <CircularProgress size={24} /> : "Create Plan"}
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

export default CreatePlan;
