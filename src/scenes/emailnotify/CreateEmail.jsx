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
  CircularProgress,
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
  ListItemIcon,
  FormControlLabel,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import AuthContext from "../../context/AuthContext";
import useFetchData from "../../hooks/useFetchData";
import { motion } from "framer-motion";
import ReactQuill from "react-quill"; // Rich Text Editor
import "react-quill/dist/quill.snow.css"; // Quill editor styles
import Swal from "sweetalert2";

const CreateEmail = ({ handleCancel }) => {
  const {
    data: customerData,
    isLoading,
    error,
    refetch,
  } = useFetchData("/user/get-all-users");
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token, user } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Form state
  const [formData, setFormData] = useState({
    recipients: [],
    subject: "",
    message: "",
  });
  const [selectAll, setSelectAll] = useState(false);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [manualEmail, setManualEmail] = useState("");

  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle change for subject, recipients, and message
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle message input (Rich Text Editor)
  const handleMessageChange = (content) => {
    setFormData((prev) => ({ ...prev, message: content }));
  };

  // Handle select all recipients
  const handleSelectAll = () => {
    if (selectAll) {
      setFormData((prev) => ({ ...prev, recipients: [] }));
    } else {
      const allRecipients = customerData.map(
        (customer) => `${customer.emailAddress}`
      );
      setFormData((prev) => ({ ...prev, recipients: allRecipients }));
    }
    setSelectAll(!selectAll);
  };

  // Handle individual recipient selection
  const handleRecipientChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prev) => ({
      ...prev,
      recipients: typeof value === "string" ? value.split(",") : value,
    }));
  };

  // Handle manual email input
  const handleManualEmailAdd = () => {
    if (isValidEmail(manualEmail)) {
      setFormData((prev) => ({
        ...prev,
        recipients: [...prev.recipients, manualEmail],
      }));
      setManualEmail(""); // Clear the input after adding
    } else {
      setFormError("Please enter a valid email address.");
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.recipients.length || !formData.subject || !formData.message) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        createdBy: `${user.firstName} ${user.lastName}`,
        subject: formData.subject,
        recipients: formData.recipients,
        html: formData.message,
      };
      const response = await fetch(`${apiUrl}/email-notification/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setFormError(
          errorData.message || "An error occurred. Please try again."
        );
        throw new Error("An error occurred.");
      }

      clearForm();
      setSuccess(
        `Email sent successfully to ${formData.recipients.length} recipients.`
      );
      setLoading(false);
      setFormError("");

      // Display success message popup
      Swal.fire(
        `Success!`,
        `Email sent successfully to ${formData.recipients.length} recipients.`,
        "success"
      );
    } catch (error) {
      console.error("Error sending email:", error);
      setFormError("An error occurred. Please try again.");
      setLoading(false);
      Swal.fire(
        `Error!`,
        `Email not sent to ${formData.recipients.length} recipients. Try again!`,
        "error"
      );
    }
  };

  // Clear form
  const clearForm = () => {
    setFormData({
      recipients: [],
      subject: "",
      message: "",
    });
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
          Create and Send Email
        </Typography>
        <Button
          variant="outlined" 
          onClick={handleCancel}
          sx={{ color: colors.greenAccent[500] }}
          >
          Cancel
        </Button>
      </Grid>

      <Typography variant="body1" color={colors.grey[100]}>
        Fill in the form below to create and send.
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          <AlertTitle>Success</AlertTitle>
          {success}
        </Alert>
      )}
      {formError && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {formError}
        </Alert>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Paper elevation={3} sx={{ padding: 3, marginTop: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Recipients */}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Select Recipients</InputLabel>
                    <Select
                      multiple
                      value={formData.recipients}
                      onChange={handleRecipientChange}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            maxHeight: 200,
                            width: 250,
                          },
                        },
                      }}
                    >
                      {customerData.map((customer) => (
                        <MenuItem key={customer.email} value={customer.emailAddress}>
                          <ListItemIcon>
                            <Checkbox
                              checked={formData.recipients.includes(customer.emailAddress)}
                              color="secondary"           
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${customer.firstName} ${customer.lastName}`}
                            secondary={customer.email}
                          />
                        </MenuItem>
                      ))}
                    </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox checked={selectAll} onChange={handleSelectAll} color="secondary" />
                  }
                  label="Select All"
                />
              </Grid>

              {/* Recipient Count */}
              <Grid item xs={12}>
                <Typography variant="body2" color={colors.grey[100]}>
                  Recipients Added: {formData.recipients.length}
                </Typography>
              </Grid>

              {/* Manual Email Input */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Add Recipient Email"
                  variant="outlined"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  onBlur={handleManualEmailAdd} // Optionally trigger adding email on blur
                />
              </Grid>

              {/* Subject */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="subject"
                  label="Subject"
                  variant="outlined"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </Grid>

              {/* Message (Rich Text Editor) */}
              <Grid item xs={12}>
                <Typography variant="body1">Message</Typography>
                <ReactQuill
                  theme="snow"
                  value={formData.message}
                  onChange={handleMessageChange}
                  style={{ height: 200 }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    color: "white",
                    fontWeight: "bold",
                    padding: "10px 0",
                    fontSize: "18px",
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Send Email"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default CreateEmail;
