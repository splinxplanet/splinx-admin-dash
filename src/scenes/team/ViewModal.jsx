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
import { motion } from 'framer-motion';

const ViewModal = ({
  open,
  onClose,
  recordData,
  fields,
  handleEdit,
  handleDelete,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const toSentenceCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 550,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh", // Ensure the modal is limited in height
    overflowY: "auto", // Enable vertical scrolling when content exceeds max height
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {recordData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} // Start slightly smaller
            animate={{ opacity: 1, scale: 1 }}    // Animate to full size
            exit={{ opacity: 0, scale: 0.95 }}    // Exit animation
            transition={{ duration: 0.3, ease: "easeInOut" }} // Smoother transition
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

              {/* Personal Information Section */}
              <Grid container spacing={2} alignItems="center" mb={3}>
                {/* Profile Image */}
                <Grid item xs={12} textAlign="center" mb={0}>
                  <Avatar
                    alt="Profile"
                    src={recordData.profileImage}
                    sx={{
                      width: 150,
                      height: 150,
                      margin: "auto",
                      border: `5px solid ${colors.greenAccent[500]}`,
                    }}
                  />
                </Grid>

                {/* Name and Role */}
                <Grid item xs={12} textAlign="center">
                  <Typography
                    variant="h3"
                    fontWeight="bold"
                    color={"#d66748"}
                    mt={0}
                    mb={1}
                  >
                    {toSentenceCase(recordData.firstName)}{" "}
                    {toSentenceCase(recordData.lastName)}
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={2}>
                    <Chip
                      label={toSentenceCase(recordData.role)}
                      color="primary"
                      size="medium"
                      sx={{
                        fontWeight: "bold",
                        fontSize: 16,
                        padding: "15px 15px 15px 15px",
                        marginRight: "10px",
                      }}
                    />
                    <Chip
                      label={recordData.staffId}
                      size="medium"
                      sx={{
                        fontWeight: "bold",
                        backgroundColor: colors.greenAccent[500],
                        color: colors.grey[100],
                        fontSize: 16,
                        padding: "15px 15px 15px 15px",
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Contact Information Section */}
              <Typography variant="h6" color={colors.grey[100]}>
                Contact Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2} rowSpacing={1}>
                {fields
                  .filter(
                    (field) =>
                      !field.nestedFields &&
                      field.name !== "profileImage" &&
                      field.name !== "staffId" &&
                      field.name !== "firstName" &&
                      field.name !== "lastName" &&
                      field.name !== "role"
                  )
                  .map((field) => (
                    <Grid item xs={12} sm={6} key={field.name}> {/* 2-column layout */}
                      <Box display="flex" alignItems="center" mb={1}> {/* Reduced margin */}
                        <Typography sx={{ fontWeight: 'bold', color: colors.greenAccent[500] }}>{field.label}:</Typography>
                        <Typography sx={{ ml: 1 }}>{recordData[field.name]}</Typography>
                      </Box>
                    </Grid>
                  ))}
              </Grid>

              {/* Next of Kin Section (Double Column) */}
              <Typography variant="h6" color={colors.grey[100]} mt={3}>
                Next of Kin
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2} rowSpacing={1}>
                {recordData.nextOfKin &&
                  fields
                    .find((f) => f.name === "nextOfKin")
                    .nestedFields.map((nestedField) => (
                      <Grid item xs={12} sm={6} key={nestedField.name}> {/* 2-column layout */}
                        <Box display="flex" alignItems="center" mb={1}> {/* Reduced margin */}
                          <Typography sx={{ fontWeight: 'bold', color: colors.greenAccent[500] }}>{nestedField.label}:</Typography>
                          <Typography sx={{ ml: 1 }}>{recordData.nextOfKin[nestedField.name]}</Typography>
                        </Box>
                      </Grid>
                    ))}
              </Grid>

              {/* Buttons (Full Width) */}
              <Grid item xs={12} mt={4} display="flex" justifyContent="center">

                {/* Buttons (Full Width) */}
                <Grid item xs={12} mt={4} display="flex" justifyContent="center">
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: colors.greenAccent[600],
                      color: colors.grey[100],
                      "&:hover": { backgroundColor: colors.greenAccent[700] },
                    }}
                    onClick={onClose}
                  >
                    Return to Dashboard
                  </Button>

                  <IconButton
                    onClick={() => {
                      onClose();
                      handleEdit();
                    }}
                    aria-label="edit"
                    sx={{ ml: 2, color: colors.greenAccent[600] }}
                  >
                    <EditIcon />
                  </IconButton>

                  <IconButton
                    onClick={() => {
                      onClose();
                      handleDelete();
                    }}
                    aria-label="delete"
                    sx={{ ml: 2, color: "red" }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          </motion.div>
        )}
      </Box>
    </Modal>
  );
};

export default ViewModal;