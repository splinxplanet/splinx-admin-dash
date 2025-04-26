import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  AlertTitle,
  InputAdornment,
  MenuItem,
  Select,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import AuthContext from "../../context/AuthContext";
import { motion } from "framer-motion";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
// import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

const EditAdvert = ({ advertData, handleCancel, onSubmit }) => {
  // const navigate = useNavigate();
  const apiUrl = process.env.REACT_APP_API_URL;
  const { token } = useContext(AuthContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [formData, setFormData] = useState({
    businessName: "",
    businessAddress: "",
    businessPhone: "",
    adsText: "",
    adsImage: "",
    startDate: dayjs(),
    endDate: dayjs(),
    adsStatus: "active",
    adsPosition: "homeTop",
    createdBy: "",
    adsCost: 0,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (advertData) {
      // Convert date strings to dayjs objects
      const formattedData = {
        ...advertData,
        startDate: dayjs(advertData.startDate),
        endDate: dayjs(advertData.endDate),
      };
      setFormData(formattedData);
    }
  }, [advertData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/advert/${advertData._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "An error occurred. Please try again.");
        throw new Error("An error occurred while updating the advert.");
      }

      Swal.fire({
        title: "Success!",
        text: `${formData.businessName} has been updated successfully!`,
        icon: "success",
        confirmButtonColor: colors.greenAccent[600],
      }).then(() => {
        onSubmit(formData);
      });
    } catch (error) {
      console.error("Error updating advert:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        confirmButtonColor: colors.greenAccent[600],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box m="20px" component={Paper} elevation={3} sx={{ padding: 3 }}>
        <Grid container spacing={2} alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="h2" fontWeight="600" color={colors.greenAccent[500]}>
              {`Edit ${formData.businessName}'s Advert`}
            </Typography>
          </Grid>

          <Grid item>
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
        </Grid>

        <Typography variant="body1" color={colors.grey[100]} sx={{ mb: 2 }}>
          Edit the advert details below. Click Cancel to go back.
        </Typography>
        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Business Name (Full Row) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
                InputLabelProps={{ style: { color: "#fff" } }}
                sx={{
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffb554" },
                    "&:hover fieldset": { borderColor: "#ffb554" },
                    "&.Mui-focused fieldset": { borderColor: "#ffb554" },
                  },
                }}
              />
            </Grid>

            {/* Business Address (Full Row) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Business Address"
                name="businessAddress"
                value={formData.businessAddress}
                onChange={handleChange}
                required
                InputLabelProps={{ style: { color: "#fff" } }}
                sx={{
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffb554" },
                    "&:hover fieldset": { borderColor: "#ffb554" },
                    "&.Mui-focused fieldset": { borderColor: "#ffb554" },
                  },
                }}
              />
            </Grid>

            {/* Business Phone (Full Row) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                label="Business Phone"
                name="businessPhone"
                value={formData.businessPhone}
                onChange={handleChange}
                required
                InputLabelProps={{ style: { color: "#fff" } }}
                sx={{
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffb554" },
                    "&:hover fieldset": { borderColor: "#ffb554" },
                    "&.Mui-focused fieldset": { borderColor: "#ffb554" },
                  },
                }}
              />
            </Grid>

            {/* Ads Text (Full Row) */}
            {/* Ads Text (Full Row) */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4} // Number of rows for the textarea
                label="Ads Text"
                name="adsText"
                value={formData.adsText}
                onChange={handleChange}
                required
                InputLabelProps={{ style: { color: "#fff" } }}
                sx={{
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffb554" },
                    "&:hover fieldset": { borderColor: "#ffb554" },
                    "&.Mui-focused fieldset": { borderColor: "#ffb554" },
                  },
                }}
              />
            </Grid>

            {/* Ads Image and Dates (Two Columns) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Ads Image URL"
                name="adsImage"
                value={formData.adsImage}
                onChange={handleChange}
                required
                InputLabelProps={{ style: { color: "#fff" } }}
                sx={{
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffb554" },
                    "&:hover fieldset": { borderColor: "#ffb554" },
                    "&.Mui-focused fieldset": { borderColor: "#ffb554" },
                  },
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(newDate) => setFormData({ ...formData, startDate: newDate })}
                  required
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      InputLabelProps: { style: { color: "#fff" } },
                      sx: {
                        input: { color: "#fff" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#ffb554",
                            borderWidth: "1px",
                            "&:hover": { borderColor: "#ffb554" },
                            "&.Mui-focused": { borderColor: "#ffb554" },
                          },
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>


            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(newDate) => setFormData({ ...formData, endDate: newDate })}
                  required
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true,
                      InputLabelProps: { style: { color: "#fff" } },
                      sx: {
                        input: { color: "#fff" },
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: "#ffb554" },
                          "&:hover fieldset": { borderColor: "#ffb554" },
                          "&.Mui-focused fieldset": { borderColor: "#ffb554" },
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </Grid>

            {/* Advert Cost and Position (Two Columns) */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Advert Cost"
                name="adsCost"
                type="number"
                value={formData.adsCost}
                onChange={handleChange}
                InputLabelProps={{ style: { color: "#fff" } }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">₦</InputAdornment>
                  ),
                }}
                sx={{
                  input: { color: "#fff" },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ffb554" },
                    "&:hover fieldset": { borderColor: "#ffb554" },
                    "&.Mui-focused fieldset": { borderColor: "#ffb554" },
                  },
                }}
              />
            </Grid>

            {/* Advert Position (Full Row) */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" required>
                <InputLabel id="adsPosition-label" sx={{ color: "#fff" }}>
                  Advert Position
                </InputLabel>
                <Select
                  labelId="adsPosition-label"
                  id="adsPosition"
                  name="adsPosition"
                  value={formData.adsPosition}
                  onChange={handleChange}
                  label="Advert Position"
                  sx={{
                    input: { color: "#fff" },
                    "& .MuiOutlinedInput-notchedOutline": { // Target the correct class
                      borderColor: "#ffb554",
                      "&:hover": {
                        borderColor: "#ffb554",
                      },
                      "&.Mui-focused": {
                        borderColor: "#ffb554",
                      },
                    },
                  }}
                >
                  <MenuItem value="homeTop">Home Top</MenuItem>
                  <MenuItem value="eventsCard">Events Card</MenuItem>
                  <MenuItem value="footer">Footer</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Created By (Disabled and Populated) */}
            <Grid item xs={12} sm={6}>
              <Typography
                variant="subtitle1"
                sx={{
                  color: "#fff",
                  border: "1px solid #ffb554", // Add the border
                  padding: "14px 16px", // Add padding to match TextField
                  borderRadius: "4px" // Add rounded corners
                }}
              >
                Created By: {formData.createdBy}
              </Typography>
            </Grid>
            {/* Submit Button (Centered) */}
            <Grid
              item
              xs={12}
              sx={{ display: "flex", justifyContent: "center", mt: 3 }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: colors.greenAccent[600],
                  color: "white",
                  fontSize: "16px",
                  fontWeight: "bold",
                  padding: "12px 24px",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: colors.greenAccent[700],
                  },
                }}
                startIcon={!loading && <CalendarTodayOutlinedIcon />}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={24} />
                ) : (
                  "Update Advert"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </motion.div>
  );
};

export default EditAdvert;