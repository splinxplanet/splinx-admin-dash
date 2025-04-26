import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { tokens } from "../../theme";
import EmailIcon from "@mui/icons-material/Email";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import Header from "../../components/Header";
import GeographyChart from "../../components/GeographyChart";
import BarChart from "../../components/BarChart";
import StatBox from "../../components/StatBox";
import ProgressCircle from "../../components/ProgressCircle";

const Dashboard = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  // const navigate = useNavigate(); // Initialize useNavigate

  // fetch dashboard stat
  const [dashboardStat, setDashboardStat] = useState({});
  useEffect(() => {
    fetch(`${apiUrl}/admin/stat`)
      .then((response) => response.json())
      .then((data) => setDashboardStat(data))
      .catch((error) =>
        console.error("Error fetching dashboard stat: ", error)
      );
  }, [apiUrl]);

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header
          title="Splinx Planet"
          subtitle="Welcome to your Splinx Planet dashboard"
          breadcrumbs={[{ label: "Dashboard", link: "/dashboard" }]}
          sideButtons={<Box display="flex" />}
        />
      </Box>

      {/* GRID & CHARTS */}
      <Box
        display="grid"
        gridTemplateColumns={isMobile ? "repeat(1, 1fr)" : "repeat(12, 1fr)"} // Adjust for mobile view
        gridAutoRows="140px"
        gap="20px"
      >
        {/* ROW 1 */}
        <Box
          gridColumn={isMobile ? "span 1" : "span 3"}
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardStat?.totalEmails || 0}
            subtitle="Emails Sent"
            progress="0.75"
            // increase="+14%"
            icon={
              <EmailIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* app users card */}
        <Box
          gridColumn={isMobile ? "span 1" : "span 3"} // Stack on mobile
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardStat?.totalUsers || 0}
            subtitle="App Users"
            progress="0.70"
            // increase="+21%"
            icon={
              <PointOfSaleIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* Ads Client Card */}
        <Box
          gridColumn={isMobile ? "span 1" : "span 3"} // Stack on mobile
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardStat?.totalAdverts || 0}
            subtitle="Advert Clients"
            progress="0.30"
            // increase="+5%"
            icon={
              <PersonAddIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* events created card */}
        <Box
          gridColumn={isMobile ? "span 1" : "span 3"} // Stack on mobile
          backgroundColor={colors.primary[400]}
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <StatBox
            title={dashboardStat?.totalEvents || 0}
            subtitle="Events Created"
            progress="0.80"
            icon={
              <TrafficIcon
                sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
              />
            }
          />
        </Box>

        {/* ROW 3 */}
        <Box
          gridColumn={isMobile ? "span 1" : "span 4"} // Adjust for mobile view
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          p="30px"
        >
          <Typography variant="h5" fontWeight="600">
            Ads Revenue
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mt="25px"
          >
            <ProgressCircle size="125" />
            <Typography
              variant="h5"
              color={colors.greenAccent[500]}
              sx={{ mt: "15px" }}
            >
              $48,352 revenue generated
            </Typography>
            <Typography>Splinx In-app Advertisement </Typography>
          </Box>
        </Box>
        <Box
          gridColumn={isMobile ? "span 1" : "span 4"} // Adjust for mobile view
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ padding: "30px 30px 0 30px" }}
          >
            Traffic Overview
          </Typography>
          <Box height="250px" mt="-20px">
            <BarChart isDashboard={true} />
          </Box>
        </Box>
        <Box
          gridColumn={isMobile ? "span 1" : "span 4"} // Adjust for mobile view
          gridRow="span 2"
          backgroundColor={colors.primary[400]}
          padding="30px"
        >
          <Typography
            variant="h5"
            fontWeight="600"
            sx={{ marginBottom: "15px" }}
          >
            Geography Based Traffic
          </Typography>
          <Box height="200px">
            <GeographyChart isDashboard={true} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
