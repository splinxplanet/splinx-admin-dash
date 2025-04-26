import React from 'react';
import {
  Modal,
  Box,
  IconButton,
  Typography,
  Divider,
  Grid,
  Chip,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { tokens } from "../../theme";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { motion } from "framer-motion";
import moment from "moment";

const ViewPromoModal = ({ open, onClose, promoData, handleEdit, handleDelete }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    maxHeight: "90vh",
    overflowY: "auto",
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {promoData && (
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

              <Grid container spacing={2} alignItems="center" mb={3}>
                <Grid item xs={12} textAlign="center">
                  <Typography variant="h3" fontWeight="bold" mb={1} color={"#ffb554"}>
                    {promoData.promoName}
                  </Typography>
                </Grid>
              </Grid>

              {/* Promo Details Section */}
              <Typography variant="h6" color={colors.grey[100]}>
                Promo Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2} rowSpacing={1}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      Promo Code:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>{promoData.promoCode}</Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      Discount:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {promoData.discountPercent}% 
                    </Typography>
                  </Box>
                </Grid>

                {/* Date Created */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      Date Created:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {moment(promoData.dateCreated).format('MMMM Do YYYY')}
                    </Typography>
                  </Box>
                </Grid>

                {/* Start Date */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      Start Date:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {moment(promoData.startDate).format('MMMM Do YYYY')} 
                    </Typography>
                  </Box>
                </Grid>

                {/* End Date */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      End Date:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {moment(promoData.endDate).format('MMMM Do YYYY')} 
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      Status:
                    </Typography>
                    <Chip 
                      label={promoData.status.charAt(0).toUpperCase() + promoData.status.slice(1)} // Sentence case
                      color={
                        promoData.status === 'active' ? 'success' : 
                        promoData.status === 'paused' ? 'warning' :
                        promoData.status === 'expired' ? 'error' : 'default' 
                      }
                      sx={{ ml: 1 }} // Add some spacing
                    />
                  </Box>
                </Grid>
              </Grid>

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
                {/* Edit Button */}
                <IconButton 
                  onClick={() => { handleEdit(promoData); onClose(); }} 
                  aria-label="edit" 
                  sx={{ ml: 2, color: colors.greenAccent[600] }}
                >
                  <EditIcon />
                </IconButton>

                {/* Delete Button */}
                <IconButton 
                  onClick={() => { handleDelete(promoData._id); onClose(); }} 
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

export default ViewPromoModal;