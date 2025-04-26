import React, { useState, useContext } from 'react';
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
    MenuItem,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import AuthContext from "../../context/AuthContext";
import { motion } from 'framer-motion';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

const CreatePromoCode = ({ handleCancel, onSubmit, updatePromoList }) => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const { token } = useContext(AuthContext);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const [formData, setFormData] = useState({
        promoCode: "",
        promoName: "",
        discountPercent: 0,
        startDate: dayjs(),
        endDate: dayjs(),
        status: "active",
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`${apiUrl}/promo/create`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'An error occurred. Please try again.');
                throw new Error('An error occurred while creating the promo code.');
            }

            const newPromoCode = await response.json();

            setFormData({
                promoCode: "",
                promoName: "",
                discountPercent: 0,
                startDate: dayjs(),
                endDate: dayjs(),
                status: "active",
            });

            Swal.fire({
                title: 'Success!',
                text: `${newPromoCode.data.promoCode} has been created successfully!`,
                icon: 'success',
                confirmButtonColor: colors.greenAccent[600],
            }).then(() => {
            });
            updatePromoList(newPromoCode.data);
        } catch (error) {
            console.error('Error creating promo code:', error);
            setError('An error occurred. Please try again.');
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
                            Create New Promo Code
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
                    Fill in the form below to create a new promo code. Click Cancel to go back.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        <AlertTitle>Error</AlertTitle>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                variant="outlined"
                                label="Promo Code"
                                name="promoCode"
                                value={formData.promoCode}
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
                                label="Promo Name"
                                name="promoName"
                                value={formData.promoName}
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
                                label="Discount Percent"
                                name="discountPercent"
                                type="number"
                                value={formData.discountPercent}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ style: { color: "#fff" } }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
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

                        {/* Start Date */}
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

                        {/* End Date */}
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

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                variant="outlined"
                                label="Status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                required
                                InputLabelProps={{ style: { color: "#fff" } }}
                                SelectProps={{
                                    sx: {
                                        input: { color: "#fff" },
                                        "& .MuiOutlinedInput-notchedOutline": { // Target the notchedOutline class
                                            borderColor: "#ffb554",
                                            "&:hover": {
                                                borderColor: "#ffb554",
                                            },
                                            "&.Mui-focused": {
                                                borderColor: "#ffb554",
                                            },
                                        },
                                    },
                                }}
                            >
                                <MenuItem value="active">Active</MenuItem>
                                <MenuItem value="expired">Expired</MenuItem>
                                <MenuItem value="paused">Paused</MenuItem>
                            </TextField>
                        </Grid>


                        {/* Submit Button */}
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
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress color="inherit" size={24} />
                                ) : (
                                    'Create Promo Code'
                                )}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </motion.div>
    );
};

export default CreatePromoCode;