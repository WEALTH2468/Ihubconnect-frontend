import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogContent, DialogContentText } from '@mui/material';
import ContactForm from '../main/idesk/sub-apps/profile/contact/ContactForm';

export function MainProfileDialog({ title }) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(true);
  };

  return (
    <Dialog onClose={handleClose} open={open} fullWidth={300}>
      <DialogTitle className="text-center text-red">{title}</DialogTitle>
      <DialogContent>
        <ContactForm />
      </DialogContent>
    </Dialog>
  );
}

export function useUpdateProfileDialog() {
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return { open, handleClickOpen, handleClose };
}
