import React, { useState, useEffect } from "react";
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
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import CloseIcon from "@mui/icons-material/Close";
import { motion } from "framer-motion";

const EventCostSplitModal = ({ open, handleClose, event }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedMembers, setSelectedMembers] = useState({});
  const [splitPercentages, setSplitPercentages] = useState({});

  useEffect(() => {
    // Initialize the selected members state
    const initialMembers = {};
    const initialPercentages = {};
    event?.eventMembers.forEach((member) => {
      initialMembers[member.id] = false;
      initialPercentages[member.id] = 0;
    });
    setSelectedMembers(initialMembers);
    setSplitPercentages(initialPercentages);
  }, [event]);

  const handleMemberSelect = (member) => {
    setSelectedMembers((prev) => ({
      ...prev,
      [member.id]: !prev[member.id],
    }));
  };

  const calculateSplitAmount = () => {
    const selectedCount = Object.values(selectedMembers).filter(
      (isSelected) => isSelected
    ).length;
    if (selectedCount === 0) return 0;
    return (event.eventCost / selectedCount).toFixed(2);
  };

  const handleSubmitSplit = async () => {
    const membersSelected = Object.keys(selectedMembers).filter(
      (memberId) => selectedMembers[memberId]
    );

    if (membersSelected.length === 0) {
      alert("Please select at least one member to split the cost.");
      return;
    }

    const splitAmount = calculateSplitAmount();

    try {
      const response = await fetch(`/split-cost/${event._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          membersSelected,
          splitAmount,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("Event cost split successfully");
        handleClose();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error splitting cost:", error);
      alert("Error splitting cost");
    }
  };

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
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        {event && (
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
                onClick={handleClose}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              {/* Event Information */}
              <Grid container spacing={2} alignItems="center" mb={3}>
                <Grid item xs={12} textAlign="center">
                  <Avatar
                    alt="Event Banner"
                    src={event.eventImage}
                    sx={{
                      width: 150,
                      height: 150,
                      margin: "auto",
                      border: `5px solid ${colors.greenAccent[500]}`,
                    }}
                  />
                </Grid>

                <Grid item xs={12} textAlign="center">
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    mb={1}
                    color={"#ffb554"}
                  >
                    {event.eventName}
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={2}>
                    <Chip
                      label={event.eventCategory}
                      color="primary"
                      size="medium"
                      sx={{ fontWeight: "bold", fontSize: 16 }}
                    />
                    <Chip
                      label={`$${event.eventCost.toLocaleString()}`}
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

              {/* Event Details */}
              <Typography variant="h6" color={colors.grey[100]}>
                Event Cost Splitting
              </Typography>
              <Divider sx={{ my: 2 }} />

              {/* Members Selection */}
              {/* show no member join this event message if no member join the event */}
              {event?.eventMembers?.length === 0 ? (
                <Typography variant="body1" mb={2}>
                  No member has joined this event yet.
                </Typography>
              ) : (
                <Typography variant="body1" mb={2}>
                  Select members to split the event cost:
                </Typography>
              )}

              <List>
                {event?.eventMembers?.map((member) => (
                  <ListItem
                    key={member.id}
                    secondaryAction={
                      <Checkbox
                        edge="end"
                        onChange={() => handleMemberSelect(member)}
                        checked={selectedMembers[member.id] || false}
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar src={member.avatar} />
                    </ListItemAvatar>
                    <ListItemText primary={member.name} />
                  </ListItem>
                ))}
              </List>

              {/* Split Amount */}
              <Box mt={2} mb={2} display="flex">
                <Typography variant="h6" color={colors.greenAccent[500]}>
                  Split Amount Per Member:
                </Typography>
                <Typography variant="h6" ml={6}>
                  ${calculateSplitAmount()}
                </Typography>
              </Box>

              {/* Actions */}
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
                  onClick={handleSubmitSplit}
                  disabled={Object.values(selectedMembers).every(
                    (isSelected) => !isSelected
                  )}
                >
                  Split Cost
                </Button>
              </Grid>
            </Box>
          </motion.div>
        )}
      </Box>
    </Modal>
  );
};

export default EventCostSplitModal;
