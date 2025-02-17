import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { DialogContent, DialogContentText } from '@mui/material';

export function AnnouncementDialog({ title, description, buttonText, handleClick }) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(true);
  };
  const handleConfirm = () => {
    handleClick();
};

  return (
    <Dialog onClose={handleClose} open={open} fullWidth={300}>
      <DialogTitle className="text-center text-black">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
        <div className="flex justify-end items-center gap-4 pt-12">
          <Button onClick={handleConfirm} color="secondary" variant="contained">
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}