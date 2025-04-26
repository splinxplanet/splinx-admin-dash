/* eslint-disable import/no-unresolved */
import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Avatar,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";


const ForgotPassword = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    const requestHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Recovery Request</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              padding: 0;
              margin: 0;
            }
            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #ffffff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              font-size: 24px;
              color: #333;
            }
            p {
              font-size: 16px;
              line-height: 1.5;
              color: #555;
            }

            .footer {
              margin-top: 30px;
              font-size: 14px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Password Recovery Request</h1>
            <p>Hello,</p>
            <p>Splinx Planet admin has requested password change</p>
            <h4>Admin Request Details</h4>
            <p>Username: {{userName}}</p>
            <p>Email: {{email}}</p>
            
            <p>If you didn't recognize this admin, please ignore this email.</p>
            <div class="footer">
              <p>Thanks,<br>The Splinx Planet Team</p>
            </div>
          </div>
        </body>
        </html>
        `;

    const subject = `Admin Password Recovery Request`;
    const reEmail = "splinxplanent@gmail.com";
    const apiUrl = process.env.REACT_APP_API_URL;

    try {
      const response = await fetch(`${apiUrl}/email/send-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: reEmail,
          subject,
          html: requestHtml
        }),
      });

      console.log(response)

      if (response.ok) {
        // Show success message
        setError("Password recovery request sent successfully. Redirecting to login page...");
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
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
          Password Recovery
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
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          InputLabelProps={{ style: { color: "#262a31" } }}
          sx={{
            input: {
              color: "#262a31",
              backgroundColor: email ? "transparent" : "inherit", // No background when filled
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
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={userName}
          type="text"
          onChange={(e) => setUserName(e.target.value)}
          InputLabelProps={{ style: { color: "#262a31" } }}
          sx={{
            input: {
              color: "#262a31",
              backgroundColor: userName ? "transparent" : "inherit", // No background when filled
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
            backgroundColor: "#e6a34b", // Darker shade of #ffb554
            color: "white",
            "&:hover": {
              backgroundColor: "#ffb554",
            },
            "&:disabled": {
              backgroundColor: "#e6a34b",
              opacity: 0.7,
            },
          }}
        >
          {isLoading ? <CircularProgress size={24} /> : "Submit"}
        </Button>

        {/* Forgot Password Link */}
        <Box mt={2}>
          <Typography align="center" variant="p" fontWeight="notmal" color="#262a31">
            Remember your password? &nbsp;
          </Typography>
          <Link href="/login" underline="hover" fontWeight="bold" color="#ffb554">
            Login
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default ForgotPassword;
