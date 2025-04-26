import React from 'react';
import {
  Modal, Box, Typography, Divider, Grid, Avatar, Button, IconButton, Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../../theme';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ViewModal = ({ open, onClose, recordData, fields }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {recordData && (
          <Box sx={{ position: 'relative' }}>
            {/* Close Button */}
            <IconButton
              aria-label="close"
              onClick={onClose}
              sx={{ position: 'absolute', top: 8, right: 8 }}
            >
              <CloseIcon />
            </IconButton>

            <Grid container spacing={2} alignItems="center">
              {/* Profile Image */}
              <Grid item xs={12} textAlign="center" mb={2}>
                <Avatar
                  alt="Profile"
                  src={recordData.profileImage}
                  sx={{ width: 150, height: 150, margin: 'auto' }}
                />
              </Grid>

              {/* Name and Role */}
              <Grid item xs={12} textAlign="center">
                <Typography variant="h4" fontWeight="bold" mb={1}>
                  {recordData.firstName} {recordData.lastName}
                </Typography>
                <Chip
                  label={recordData.role}
                  color="primary"
                  size="medium"
                  sx={{ fontWeight: 'bold' }}
                />
                <Chip
                  label={recordData.staffId}
                  size="small"
                  sx={{ fontWeight: 'bold', backgroundColor: colors.greenAccent[500], color: colors.grey[100] }}
                />
              </Grid>

              {/* Standard Fields (2-Column Layout) */}
              {fields
                .filter((field) => !field.nestedFields && field.name !== 'profileImage')
                .map((field) => (
                  <Grid item xs={6} key={field.name}>
                    <Typography sx={{ mt: 1 }}>
                      <strong>{field.label}:</strong> {recordData[field.name]}
                    </Typography>
                  </Grid>
                ))}

              {/* Next of Kin Section */}
              {recordData.nextOfKin && (
                <Grid item xs={12} mt={3}>
                  <Typography variant="h6" color={colors.greenAccent[500]}>
                    Next of Kin
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  {fields // Use 'fields' instead of assuming 'teamViewFields'
                    .find((f) => f.name === 'nextOfKin')
                    .nestedFields.map((nestedField) => (
                      <Typography key={nestedField.name} sx={{ mt: 1 }}>
                        <strong>{nestedField.label}:</strong> {recordData.nextOfKin[nestedField.name]}
                      </Typography>
                    ))}
                </Grid>
              )}

              {/* Buttons (Full Width) */}
              <Grid item xs={12} mt={4} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    color: colors.grey[100],
                    '&:hover': { backgroundColor: colors.greenAccent[700] }
                  }}
                  onClick={onClose}
                >
                  Return to Dashboard
                </Button>

                <IconButton aria-label="edit" sx={{ ml: 2, color: colors.greenAccent[600] }}>
                  <EditIcon />
                </IconButton>

                <IconButton aria-label="delete" sx={{ ml: 2, color: 'red' }}>
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default ViewModal;