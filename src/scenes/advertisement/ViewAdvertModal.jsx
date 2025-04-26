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

const ViewAdvertModal = ({
  open,
  onClose,
  recordData,
  handleEdit,
  handleDelete,
  handlePauseToggle,
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
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{ position: "absolute", top: 8, right: 8 }}
              >
                <CloseIcon />
              </IconButton>

              {/* Advert Information Section */}
              <Grid container spacing={2} alignItems="center" mb={3}>
                <Grid item xs={12} textAlign="center">
                  <Avatar
                    alt="Advert Banner"
                    src={recordData.adsImage}
                    sx={{
                      width: 150,
                      height: 150,
                      margin: "auto",
                      border: `5px solid ${colors.greenAccent[500]}`,
                    }}
                  />
                </Grid>
                <Grid item xs={12} textAlign="center">
                  <Typography variant="h3" fontWeight="bold" mb={1} color={"#ffb554"}>
                    {recordData.businessName}
                  </Typography>
                  <Box display="flex" justifyContent="center" gap={2}>
                    <Chip
                      label={recordData.adsStatus.charAt(0).toUpperCase() + recordData.adsStatus.slice(1)} 
                      color={recordData.adsStatus === "active" ? "success" : "error"} 
                      size="medium"
                      sx={{ fontWeight: "bold", fontSize: 16 }}
                    />
                  </Box>
                </Grid>
              </Grid>

              {/* Business Information Section */}
              <Typography variant="h6" color={colors.grey[100]} sx={{ mb: 1 }}>
                Business Information
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={2} rowSpacing={1}>
                {/* Business Name */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      Name:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>{recordData.businessName}</Typography>
                  </Box>
                </Grid>

                {/* Business Phone */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      Phone:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>{recordData.businessPhone}</Typography>
                  </Box>
                </Grid>

                {/* Business Address */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      Address:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>{recordData.businessAddress}</Typography>
                  </Box>
                </Grid>

                {/* Ads Text (Full Row) */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      Ads Text:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>{recordData.adsText}</Typography>
                  </Box>
                </Grid>
              </Grid>

              {/* Advert Information Section */}
              <Typography variant="h6" color={colors.grey[100]} sx={{ mb: 1, mt: 2 }}>
                Advert Information
              </Typography>
              <Divider sx={{ my: 1 }} />
              <Grid container spacing={2} rowSpacing={1}>
                {/* Start Date */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      Start Date:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {moment(recordData.startDate).format("MMMM Do YYYY")}
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
                      {moment(recordData.endDate).format("MMMM Do YYYY")}
                    </Typography>
                  </Box>
                </Grid>

                {/* Advert Position */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      Position:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>{recordData.adsPosition}</Typography>
                  </Box>
                </Grid>

                {/* Created By */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      Created By:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>{recordData.createdBy}</Typography>
                  </Box>
                </Grid>

                {/* Created Date */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      Created Date:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>
                      {moment(recordData.createdDate).format("MMMM Do YYYY")}
                    </Typography>
                  </Box>
                </Grid>

                {/* Ads Cost */}
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Typography sx={{ fontWeight: "bold", color: colors.greenAccent[500] }}>
                      Cost:
                    </Typography>
                    <Typography sx={{ ml: 1 }}>${recordData.adsCost.toLocaleString()}</Typography>
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
                    handleEdit(recordData);
                    onClose();
                  }}
                  aria-label="edit"
                  sx={{ ml: 2, color: colors.greenAccent[600] }}
                >
                  <EditIcon />
                </IconButton>
                {/* Pause/Unpause Button */}
                {/* <IconButton
                  onClick={async () => {
                    // Confirmation dialog using SweetAlert
                    const result = await Swal.fire({
                      title: `Are you sure you want to ${recordData.adsStatus === 'pause' ? 'reactivate' : 'pause'} this advert?`,
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: `Yes, ${recordData.adsStatus === 'pause' ? 'reactivate' : 'pause'} it!`
                    });

                    if (result.isConfirmed) {
                      handlePauseToggle(recordData);
                      onClose(); 
                    }
                  }}
                  aria-label="pause/unpause"
                  sx={{ ml: 2, color: recordData.adsStatus === 'pause' ? 'green' : 'orange'  }} // Conditional color
                >
                  {recordData.adsStatus === 'pause' ? <PlayCircleOutlineIcon /> : <PauseCircleOutlineIcon />} 
                </IconButton> */}
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

export default ViewAdvertModal;