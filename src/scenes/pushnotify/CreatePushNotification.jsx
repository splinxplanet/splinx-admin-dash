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
import useFetchData from "../../hooks/useFetchData";
import { motion } from "framer-motion";
import "react-quill/dist/quill.snow.css"; // Quill editor styles
import Swal from "sweetalert2";

const CreatePushNotification = ({ handleCancel }) => {
  const {
    data: customerData,
    isLoading,
    error,
    refetch,
  } = useFetchData("/user/get-all-users");
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    message: "",
  });

  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle change for title, recipients, and message
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle message input (Rich Text Editor)
  const handleMessageChange = (content) => {
    setFormData((prev) => ({ ...prev, message: content }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if ( !formData.title || !formData.message) {
      setFormError("Please fill in all required fields.");
      return;
    }

    setLoading(true);

    try {
      const recipients = [];
      // add user id to recipients array
      customerData.map((customer) => recipients.push(customer._id));

      const submitData = {
        title: formData.title,
        type: "system",
        userIds: recipients,
        message: formData.message,
      };

      const response = await fetch(
        `${apiUrl}/notification/send-multiple`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submitData),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        setFormError(
          errorData.message || "An error occurred. Please try again."
        );
        throw new Error("An error occurred.");
      }

      clearForm();
      setSuccess(
        `In-app notification sent successfully `
      );
      setLoading(false);
      setFormError("");
      Swal.fire(
        `Success!`,
        `${formData.title} notification sent successfully!`,
        "success"
      );
    } catch (error) {
      setFormError("An error occurred. Please try again.");
        setLoading(false);
        Swal.fire(
          `Error!`,
          `Sending ${formData.title} notification failed. Try again!`,
          "error"
        );
    }
  };

  // Clear form
  const clearForm = () => {
    setFormData({
      title: "",
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
          Create and Send Push Notification
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
              {/* Title */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="title"
                  label="Title"
                  variant="outlined"
                  value={formData.title}
                  onChange={handleChange}
                />
              </Grid>

              {/* Message */}
              <Grid item xs={12}>
                <TextField
                  name="message"
                  label="Message"
                  multiline
                  rows={8} 
                  fullWidth
                  variant="outlined"
                  value={formData.message}
                  onChange={handleChange}
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
                  {loading ? <CircularProgress size={24} /> : "Send Now"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default CreatePushNotification;
