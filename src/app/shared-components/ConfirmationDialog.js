import React, { createContext, useContext, useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
const ConfirmationDialogContext = createContext();

function ConfirmationDialog({ type, actionHandler, open, onClose, children }) {
  const contextValue = { type, actionHandler };

  // Separate out Header and Description components from other children
  const header = React.Children.toArray(children).find(
    (child) => child.type === Header
  );
  const description = React.Children.toArray(children).find(
    (child) => child.type === Description
  );

  return (
    <ConfirmationDialogContext.Provider value={contextValue}>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="confirmation-dialog-title"
      >
        <DialogTitle id="confirmation-dialog-title" className='font-bold'>
          {header ? React.cloneElement(header) : null}
        </DialogTitle>
        <DialogContent>
          {description ? React.cloneElement(description) : null}
        </DialogContent>
        <DialogActions className="py-16 px-12">
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={actionHandler}
            className="whitespace-nowrap mx-4"
            variant="contained"
            color={type === 'delete' || type === 'move' ? 'error' : 'secondary'}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </ConfirmationDialogContext.Provider>
  );
}

// Header component with access to dialog context
function Header({ children }) {
  return <>{children}</>;
}

// Description component
function Description({ children }) {
  return (
    <Typography className="leading-5" variant="p">
      {children}
    </Typography>
  );
}

// Export components for direct import without prefixing
export { ConfirmationDialog, Header, Description };
