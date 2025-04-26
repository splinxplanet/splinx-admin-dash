import React from "react";
import {
  Modal,
  Box,
  Typography,
  Divider,
  Grid,
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
import formatDate from "../../utils/dataConverter";

const EmailViewModal = ({ 
  open,
  onClose,
  emailSelected,
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
    width: 550,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh",
    overflowY: "auto",
  };

  // Helper to format date
  const formattedDate = emailSelected
    ? formatDate(emailSelected.sentAt)
    : "";

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {emailSelected && (
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

              {/* Email Subject */}
              <Typography variant="h6" color={colors.grey[100]} mb={2}>
                {emailSelected.subject}
              </Typography>
              <Divider />

              {/* Email Details */}
              <Grid container spacing={2} rowSpacing={1} mt={2}>
                {/* Sent By */}
                <Grid item xs={12}>
                  <Typography variant="body2" color={colors.grey[100]}>
                    <strong>Sent by:</strong> {emailSelected.createdBy}
                  </Typography>
                </Grid>

                {/* Recipients */}
                <Grid item xs={12}>
                  <Typography variant="body2" color={colors.grey[100]}>
                    <strong>Recipients:</strong>
                  </Typography>
                  {emailSelected.recipients.map((recipient, index) => (
                    <Chip
                      key={index}
                      label={recipient}
                      variant="outlined"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                </Grid>

                {/* Sent At */}
                <Grid item xs={12}>
                  <Typography variant="body2" color={colors.grey[100]}>
                    <strong>Sent At:</strong> {formattedDate}
                  </Typography>
                </Grid>

                {/* Status */}
                <Grid item xs={12}>
                  <Typography variant="body2" color={colors.grey[100]}>
                    <strong>Status:</strong> {emailSelected.status}
                  </Typography>
                </Grid>

                {/* Email Content (HTML) */}
                <Grid item xs={12}>
                  <Typography variant="body2" color={colors.grey[100]}>
                    <strong>Message:</strong>
                  </Typography>
                  <Box
                    dangerouslySetInnerHTML={{ __html: emailSelected.html }}
                    sx={{
                      padding: 2,
                      border: `1px solid ${colors.grey[300]}`,
                      borderRadius: "8px",
                      mt: 1,
                    }}
                  />
                </Grid>
              </Grid>

              {/* Action Buttons */}
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
            </Box>
          </motion.div>
        )}
      </Box>
    </Modal>
  );
};

export default EmailViewModal;
