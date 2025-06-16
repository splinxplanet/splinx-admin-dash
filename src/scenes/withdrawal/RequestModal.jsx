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

const RequestModal = ({
  open,
  onClose,
  recordData,
  handleApprove,
  handleDecline,
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
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    mb={1}
                    color={"#ffb554"}
                  >
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
                      label={`Status: ${recordData.status}`}
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
                {/* request Date */}
                <Grid item xs={12} sm={6}mkey="requestDate">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Request Date:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {moment(recordData.createdAt).format("MMMM Do YYYY")}
                    </Typography>
                  </Box>
                </Grid>

                {/* Event cost */}
                <Grid item xs={12} sm={6} key="eventCost">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Event Cost:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      ${recordData.eventCost}
                    </Typography>
                  </Box>
                </Grid>

                {/* requested amount */}
                <Grid item xs={12} sm={6} key="amount">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Requested Amount:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>${recordData.amount}</Typography>
                  </Box>
                </Grid>

                {/* Event const contributed */}
                <Grid item xs={12} sm={6} key="totalPaidByMembers">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Total Amount Paid by Members:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      ${recordData.totalPaidByMembers}
                    </Typography>
                  </Box>
                </Grid>

                {/* payment account name */}
                <Grid item xs={12} sm={6} key="accountName">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Account Name:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.accountName || "N/A"}
                    </Typography>
                  </Box>
                </Grid>

                {/* payment account number */}
                <Grid item xs={12} sm={6} key="accountNumber">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Account Number:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.accountNumber || "N/A"}
                    </Typography>
                  </Box>
                </Grid>

                {/*bank name */}
                <Grid item xs={12} sm={6} key="bankName">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Bank Name:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.bankName}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6} key="holdDate">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Event Date:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData?.holdDate ? moment(recordData.holdDate).format("MMMM Do YYYY") : "N/A"}
                    </Typography>
                  </Box>
                </Grid>

              </Grid>
              {/* Buttons (Full Width) */}
              <Grid item xs={12} mt={4} display="flex" justifyContent="center">
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
                    handleApprove(recordData);
                    onClose();
                  }}
                  aria-label="Approve"
                  sx={{ ml: 2, color: colors.greenAccent[600] }}
                >
                  <EditIcon />
                </IconButton>

                <IconButton
                  onClick={() => {
                    handleDecline(recordData);
                    onClose();
                  }}
                  aria-label="Decline"
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

export default RequestModal;
