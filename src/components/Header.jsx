import React from "react";
import { Typography, Box, useTheme, Breadcrumbs, Link } from "@mui/material";
import { tokens } from "../theme";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

const Header = ({ title, subtitle, breadcrumbs = [] }) => { // Set default breadcrumbs to []
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
      {/* Breadcrumbs */}
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs.map((crumb, index) => (
          <Link
            key={index}
            underline="hover"
            color={colors.grey[100]}
            href={crumb.link} 
          >
            {crumb.label}
          </Link>
        ))}
      </Breadcrumbs>

      {/* H2 Title */}
      <Typography
        variant="h2"
        color={colors.grey[100]}
        fontWeight="bold"
        sx={{ m: "0 0 5px 0" }}
      >
        {title}
      </Typography>

      {/* Subtitle */}
      <Typography variant="h5" color={colors.greenAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;