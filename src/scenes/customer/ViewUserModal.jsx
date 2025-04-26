import React from 'react';
import { 
  Modal, Box, Typography, Divider, Grid, Avatar, Button, IconButton, Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion } from 'framer-motion';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';

const ViewUserModal = ({
  open,
  onClose,
  recordData,
  fields,
  handleEdit,
  handleDelete,
  handleExtend,
  handleStopPlan,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
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
            <Box sx={{ position: 'relative' }}>
              {/* Close Button */}
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              {/* User Information Section */}
              <Grid container spacing={2} alignItems="center" mb={3}>
                {/* Profile Image */}
                <Grid item xs={12} textAlign="center" mb={0}>
                  <Avatar
                    alt="Profile"
                    src={recordData.profileImg}
                    sx={{
                      width: 150,
                      height: 150,
                      margin: "auto",
                      border: `5px solid ${colors.greenAccent[500]}`,
                    }}
                  />
                </Grid>

                {/* Name and Email */}
                <Grid item xs={12} textAlign="center">
                  <Typography variant="h3" fontWeight="bold" color={"#ffb554"} mt={0} mb={1}>
                    {recordData.firstName} {recordData.lastName}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    <strong>Email Address:</strong> {recordData.emailAddress}
                  </Typography>

                  {/* Subscription Status Chip */}
                  <Chip
                    label={recordData.isSubscriber ? "Subscribed" : "Free"}
                    sx={{
                      mt: 1,
                      backgroundColor: recordData.isSubscriber
                        ? colors.greenAccent[500]
                        : colors.grey[600],
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                </Grid>
              </Grid>

              {/* Subscription Details Section */}
              <Typography variant="h6" color={colors.grey[100]}>
                Subscription Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2} rowSpacing={1}>
                {/* Phone Number */}
                <Grid item xs={12} sm={6} key="phoneNumber">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}
                    >
                      Phone Number:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.phoneNumber || 'None'}
                    </Typography>
                  </Box>
                </Grid>
  {/* Home Address */}
                <Grid item xs={12} sm={6} key="homeAddress">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}
                    >
                      Home Address:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.homeAddress || 'None'}
                    </Typography>
                  </Box>
                </Grid>
                {/* Location (City, Country) */}
                <Grid item xs={12} sm={6} key="location"> 
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: 'bold', color: colors.greenAccent[500] }}>Location:</Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.city}, {recordData.country} 
                    </Typography>
                  </Box>
                </Grid>

              

                {/* Subscription Status */}
                <Grid item xs={12} sm={6} key="isSubscriber">
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}
                    >
                      Subscription Status:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.isSubscriber ? "Subscribed" : "Free"}
                    </Typography>
                  </Box>
                </Grid>

                {/* Subscription Plan (Full Row) */}
                <Grid item xs={12} key="subscriptionPlan"> 
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: colors.greenAccent[500],
                      }}
                    >
                      Subscription Plan:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {recordData.subscriptionPlan|| 'None'
                      }
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
                    "&:hover": { backgroundColor: colors.greenAccent[700] },
                  }}
                  onClick={onClose}
                >
                  Return to Dashboard
                </Button>

                {/* Extend Button */}
                <IconButton
                  onClick={() => {
                    handleExtend(recordData); 
                    onClose();
                  }}
                  aria-label="extend"
                  sx={{ ml: 2, color: colors.greenAccent[600] }}
                >
                  <CheckCircleOutlineIcon />
                </IconButton>

                {/* Stop Plan Button */}
                <IconButton
                  onClick={() => {
                    handleStopPlan(recordData); 
                    onClose();
                  }}
                  aria-label="pause"
                  sx={{ ml: 2, color: colors.grey[400] }}
                >
                  <PauseCircleOutlineIcon /> 
                </IconButton>

                {/* Delete Button */}
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

export default ViewUserModal;