import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress } from '@mui/material';

const OtpVerify = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleOtpChange = (value, index) => {
        if (/^\d$/.test(value) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Automatically focus the next input field
            if (value !== '' && index < 3) {
                document.getElementById(`otp-input-${index + 1}`).focus();
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        const otpValue = otp.join('');
        if (otpValue.length < 4) {
            setErrorMessage('Please enter all 4 digits.');
            setIsLoading(false);
            return;
        }

        // Simulate an API call to verify the OTP
        try {
            const response = await new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 2000));

            if (!response.ok) {
                throw new Error('Invalid OTP');
            }

            setSuccessMessage('OTP Verified successfully!');
        } catch (err) {
            setErrorMessage(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                textAlign: 'center',
                padding: '0 16px',
            }}
        >
            <Box
                sx={{
                    maxWidth: 500, // Increase the max width
                    width: '100%',
                    mx: 'auto',
                    mt: 5,
                    p: 6, // Increase padding
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? '#282C34' : '#fff',
                    borderRadius: '8px',
                    boxShadow: 3,
                }}
            >
                <Typography variant="h4" gutterBottom>
                    OTP Verification
                </Typography>

                {successMessage && <Typography color="success" gutterBottom>{successMessage}</Typography>}
                {errorMessage && <Typography color="error" gutterBottom>{errorMessage}</Typography>}

                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                        {otp.map((digit, index) => (
                            <TextField
                                key={index}
                                id={`otp-input-${index}`}
                                value={digit}
                                onChange={(e) => handleOtpChange(e.target.value, index)}
                                inputProps={{ maxLength: 1, style: { textAlign: 'center' } }}
                                sx={{ width: '60px' }} // Style to make the input boxes smaller
                                required
                            />
                        ))}
                    </Box>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        fullWidth
                        variant="contained"
                        sx={{
                            backgroundColor: 'orange',
                            color: 'white',
                            fontSize: '16px',
                            '&:hover': {
                                backgroundColor: 'darkorange',
                            },
                        }}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Verify OTP'}
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default OtpVerify;