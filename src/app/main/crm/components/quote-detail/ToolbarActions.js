import { Button } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { showMessage } from 'app/store/fuse/messageSlice';
import { removeCustomers } from '../../store/customersSlice';

const renderTopToolbarCustomActions = (dispatch) =>
  function ({ table }) {
    const { rowSelection } = table.getState();

    if (Object.keys(rowSelection).length === 0) {
      return null;
    }

    return (
      <Button
        variant="contained"
        size="small"
        onClick={() => {
          const selectedRows = table.getSelectedRowModel().rows;
          dispatch(
            removeCustomers(selectedRows.map((row) => row.original._id))
          ).then((action) => {
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
          table.resetRowSelection();
        }}
        className="flex shrink min-w-40 ltr:mr-8 rtl:ml-8"
      >
        <FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
        <span className="hidden sm:flex mx-8">Delete selected items</span>
      </Button>
    );
  };

export default renderTopToolbarCustomActions;
