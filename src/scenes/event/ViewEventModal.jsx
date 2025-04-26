import React from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Grid,
  Avatar,
  Button,
  IconButton,
  Chip,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import moment from "moment";

const ViewEventModal = ({
  open,
  onClose,
  recordData,
  fields,
  handleEdit,
  handleDelete,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh",
    overflowY: "auto",
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {recordData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Box sx={{ position: "relative" }}>
              {/* Close Button */}
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              {/* Event Information Section */}
              <Grid container spacing={2} alignItems="center" mb={3}>
                <Grid item xs={12} textAlign="center">
                  <Avatar
                    alt="Event Banner"
                    src={recordData.eventImage}
                    sx={{
                      width: 150,
                      height: 150,
                      margin: "auto",
                      border: `5px solid ${colors.greenAccent[500]}`,
                    }}
                  />
                </Grid>

                {/* Name, Category, and Budget */}
                <Grid item xs={12} textAlign="center">
                  <Typography variant="h3" fontWeight="bold" mb={1} color={"#ffb554"}>
                    {recordData.eventName}
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={2}>
                    <Chip
                      label={recordData.eventCategory}
                      color="primary"
                      size="medium"
                      sx={{ fontWeight: "bold", fontSize: 16 }}
                    />
                    <Chip
                      label={`₦${recordData.eventCost}`}
                      size="medium"
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: colors.greenAccent[500],
                        color: colors.grey[100],
                        fontSize: 16,
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Event Details Section */}
              <Typography variant="h6" color={colors.grey[100]}>
                Event Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2} rowSpacing={1}>
                {/* Event Date */}
                <Grid item xs={12} sm={6} key="eventDate">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Date:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {moment(recordData.eventDate).format("MMMM Do YYYY")}
                    </Typography>
                  </Box>
                </Grid>

                {/* Event Time */}
                <Grid item xs={12} sm={6} key="eventTime">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Time:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.eventTime}
                    </Typography>
                  </Box>
                </Grid>

                {/* Event Location */}
                <Grid item xs={12} sm={6} key="eventLocation">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Location:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.eventLocation}
                    </Typography>
                  </Box>
                </Grid>

                {/* Event Description */}
                <Grid item xs={12} sm={6} key="eventDescription">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Description:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.eventDescription}
                    </Typography>
                  </Box>
                </Grid>

                {/* Event User Rules */}
                <Grid item xs={12} sm={6} key="eventUserRules">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Rules:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.eventUserRules}
                    </Typography>
                  </Box>
                </Grid>

                {/* Event Cost Split Status */}
                <Grid item xs={12} sm={6} key="isEventCostSplitted">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Cost Split:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.isEventCostSplitted ? "Yes" : "No"}
                    </Typography>
                  </Box>
                </Grid>

                {/* Total Paid by Members */}
                <Grid item xs={12} sm={6} key="totalPaidByMembers">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Total Paid:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      ${recordData.totalPaidByMembers}
                    </Typography>
                  </Box>
                </Grid>

                {/* Event Hashtag */}
                <Grid item xs={12} sm={6} key="eventHashtag">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Hashtag:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.eventHashtag || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                
              </Grid>
              {/* Buttons (Full Width) */}
              <Grid
                item
                xs={12}
                mt={4}
                display="flex"
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    color: colors.grey[100],
                    "&:hover": {
                      backgroundColor: colors.greenAccent[700],
                    },
                  }}
                  onClick={onClose}
                >
                  Return to Dashboard
                </Button>
                <IconButton
                  onClick={() => {
                    handleEdit(recordData);
                    onClose();
                  }}
                  aria-label="edit"
                  sx={{ ml: 2, color: colors.greenAccent[600] }}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  onClick={() => {
                    handleDelete(recordData);
                    onClose();
                  }}
                  aria-label="delete"
                  sx={{ ml: 2, color: "red" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Box>
          </motion.div>
        )}
      </Box>
    </Modal>
  );
};

export default ViewEventModal;