import React, { useState, useContext } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Avatar,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import AuthContext from "../../context/AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import loginAdmin from "../../api/adminApi";
import { motion } from 'framer-motion'

const Login = () => {
  const { setUser, setToken } = useContext(AuthContext);
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await loginAdmin(email, password);

      if (data.success) {
        setToken(data.token);
        setUser(data.admin);
        navigate("/dashboard");
      } else {
        setError(data.message || "Invalid username or password.");
      }
    } catch (err) {
      console.error("Login API Error:", err);
      if (err.response) {
        console.log("Error Response Data:", err.response.data);
        console.log("Error Response Status:", err.response.status);
        console.log("Error Response Headers:", err.response.headers);
      } else if (err.request) {
        console.log("Error Request:", err.request);
      } else {
        console.log("Error Message:", err.message);
      }
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        width: "100vw",
        backgroundColor: theme.palette.primary.main,
        position: "relative",
      }}
    >
      <motion.div // Wrap the Paper component with motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: theme.spacing(4),
            borderRadius: "16px",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.25)",
            backgroundColor: "white",
            width: 500,
            maxWidth: "90%",
          }}
        >
          <Avatar
            sx={{
              m: 1,
              bgcolor: "secondary.main",
              width: 56,
              height: 56,
            }}
          >
            <img
              src={`${process.env.PUBLIC_URL}/splinxfav.ico`}
              alt="Logo"
              style={{ width: "40px", height: "40px" }}
            />
          </Avatar>
          <Typography align="center" variant="h2" fontWeight="bold" color="#262a31">
            Splinx Planet
          </Typography>
          <Typography align="center" variant="h5" fontWeight="normal" mb={4} color="#ffb554">
            Administrator Login
          </Typography>

          {error && (
            <Typography variant="body2" color="error" mb={2}>
              {error}
            </Typography>
          )}

          <TextField
            label="Email Address"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: "#262a31" } }}
            sx={{
              input: {
                color: "#262a31",
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
              // Target the input base for conditional background color
              "& .MuiInputBase-input": {
                backgroundColor: email ? "transparent" : "#fff", // Transparent when email has text
              },
            }}
          />



          <TextField
            label="Password"
            variant="outlined"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: "#262a31" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    aria-label="toggle password visibility"
                    sx={{ color: "gray" }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              input: {
                color: "gray",
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={isLoading}
            sx={{
              mt: 3,
              fontSize: 16,
              py: 1.5,
              borderRadius: "8px",
              backgroundColor: email ? "transparent" : "#ffb554", // Change to transparent when email has text
              color: email ? "#ffb554" : "#ffffff", // Adjust text color based on the state
              border: "1px solid #ffb554", // Add border to make the button visible
              "&:hover": {
                backgroundColor: email ? "rgba(255, 181, 84, 0.1)" : "#ffb554", // Slightly visible on hover
              },
              "&:disabled": {
                backgroundColor: "#e6a34b",
                opacity: 0.7,
              },

            }}
          >
            {isLoading ? <CircularProgress size={24} /> : "LOGIN"}
          </Button>
          <Box mt={2}>
            <Link href="/forgot-password" underline="hover" color="primary">
              Forgot Password?
            </Link>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
};

export default Login;