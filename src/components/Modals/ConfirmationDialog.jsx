import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const ConfirmationDialog = ({ open, onClose, onConfirm, admin }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>Warning</DialogTitle>
    <DialogContent>
      <DialogContentText>
        Are you sure you want to delete {admin?.firstName} {admin?.lastName}?
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="primary">
        Delete
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationDialog;