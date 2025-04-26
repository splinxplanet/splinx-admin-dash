import React, { useState, useContext } from "react";
import {
    Box,
    InputAdornment,
    Typography,
    TextField,
    Button,
    Grid,
    Paper,
    CircularProgress,
    Alert,
    AlertTitle,
    FormControlLabel,
    Checkbox,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import AuthContext from "../../context/AuthContext";
import { motion } from 'framer-motion';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';





const CreateNewEvent = ({ handleCancel }) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { token, user } = useContext(AuthContext);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [formData, setFormData] = useState({
        eventCreator: user._id,
        eventName: "",
        eventDescription: "",
        eventImage: "",
        eventDate: dayjs(),
        eventTime: dayjs(),
        eventLocation: "",
        eventUserRules: "",
        eventCost: "",
        eventCategory: "",
        eventHashtag: "",
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // handle submit new event
    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/event/`, {
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
                throw new Error("An error occurred while creating the event.");
            }

            setFormData({
                eventCreator: "",
                eventName: "",
                eventDescription: "",
                eventImage: "",
                eventDate: dayjs(),
                eventTime: dayjs(),
                eventLocation: "",
                eventUserRules: "",
                eventCost: "",
                eventCategory: "",
                eventHashtag: "",
            });

            Swal.fire({
                title: 'Success!',
                text: `${formData.eventName} has been created successfully!`,
                icon: 'success',
                confirmButtonColor: colors.greenAccent[600],
            });

        } catch (error) {
            console.error("Error creating event:", error);
            setError("An error occurred. Please try again.");
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
                            Create New Event
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
                    Fill in the form below to create a new event.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Event Name"
                                name="eventName"
                                value={formData.eventName}
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

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Event Description"
                                name="eventDescription"
                                value={formData.eventDescription}
                                onChange={handleChange}
                                required
                                multiline
                                rows={4}
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
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Event Banner URL"
                                name="eventImage"
                                value={formData.eventImage}
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
                                    label="Event Date"
                                    value={formData.eventDate}
                                    onChange={(newDate) => setFormData({ ...formData, eventDate: newDate })}
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
                                {formData.eventTime && formData.eventTime.isValid() && (
                                    <TimePicker
                                        label="Event Time"
                                        value={formData.eventTime}
                                        onChange={(newTime) =>
                                            setFormData({ ...formData, eventTime: newTime })
                                        }
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
                                )}
                            </LocalizationProvider>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Event Location"
                                name="eventLocation"
                                value={formData.eventLocation}
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
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Event Cost"
                                name="eventCost"
                                type="number"
                                value={formData.eventCost}
                                onChange={handleChange}
                                InputLabelProps={{ style: { color: "#fff" } }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            $
                                        </InputAdornment>
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

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Event Category"
                                name="eventCategory"
                                value={formData.eventCategory}
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

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Event Hashtag"
                                name="eventHashtag"
                                value={formData.eventHashtag}
                                onChange={handleChange}
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

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Event User Rules"
                                name="eventUserRules"
                                value={formData.eventUserRules}
                                onChange={handleChange}
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

                        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
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
                                    "Create Event"
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </motion.div>
    );
};

export default CreateNewEvent;