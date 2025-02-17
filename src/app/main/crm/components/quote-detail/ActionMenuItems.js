import { MenuItem, ListItemIcon } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { showMessage } from 'app/store/fuse/messageSlice';
import { removeCustomers } from '../../store/customersSlice';

const renderRowActionMenuItems =
  (dispatch) =>
  ({ closeMenu, row, table }) =>
    [
      <MenuItem
        key={1}
        onClick={() => {
          // Edit action code
          closeMenu();
          table.resetRowSelection();
        }}
      >
        <ListItemIcon>
          <FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
        </ListItemIcon>
        Edit
      </MenuItem>,
      <MenuItem
        key={0}
        onClick={() => {
          dispatch(removeCustomers([row.original._id])).then((action) => {
            if (action.error) {
              dispatch(
                showMessage({
                  message: 'An Error Occured During Deleting',
                  variant: 'error',
                })
              );
            } else {
              dispatch(
                showMessage({
                  message: 'Customers Deleted Successfully',
                  variant: 'success',
                })
              );
            }
          });
          closeMenu();
          table.resetRowSelection();
        }}
      >
        <ListItemIcon>
          <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
        </ListItemIcon>
        Delete
      </MenuItem>,
    ];

export default renderRowActionMenuItems;
