import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useThemeMediaQuery } from '@fuse/hooks';
import {
  Button,
  ListItemIcon,
  MenuItem,
  Paper,
  Typography,
} from '@mui/material';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseLoading from '@fuse/core/FuseLoading';
import { useParams } from 'react-router-dom';
import DataTable from 'app/shared-components/DataTable';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { removeContacts } from '../../store/customersSlice';
import { showMessage } from 'app/store/fuse/messageSlice';

export default function ContactTab({ customer, id, setRightSidebarOpen }) {
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const routeParams = useParams();

  const columns = useMemo(
    () => [
      {
        accessorKey: 'sno',
        header: 'SNo',
        Cell: ({ row }) => {
          return <Typography>{Number(row.id) + 1}</Typography>;
        },
      },

      {
        accessorKey: 'name',
        header: 'Name',
        Cell: ({ row }) => {
          return <Typography>{row.original.name}</Typography>;
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        Cell: ({ row }) => {
          return <Typography>{row.original.email}</Typography>;
        },
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
        Cell: ({ row }) => {
          return <Typography>{row.original.phoneNumber}</Typography>;
        },
      },
      {
        accessorKey: 'city',
        header: 'City',
        Cell: ({ row }) => {
          return <Typography>{row.original.city}</Typography>;
        },
      },
      {
        accessorKey: 'country',
        header: 'Country',
        Cell: ({ row }) => {
          return <Typography>{row.original.country}</Typography>;
        },
      },
    ],
    []
  );

  if (!id) {
    return <FuseLoading />;
  }
  return (
    <div>
      <div className="flex flex-1 items-center justify-end space-x-8">
        <Button
          className=""
          variant="contained"
          color="secondary"
          component={NavLinkAdapter}
          to={`/crm/customers/${id}/contact/new`}
          size={isMobile ? 'small' : 'medium'}
          onClick={() => {
            if (routeParams.id) {
              setRightSidebarOpen(Boolean(routeParams.id));
            }
          }}
        >
          <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
          <span className="mx-4 sm:mx-8">Add</span>
        </Button>
      </div>
      <Paper
        className="flex flex-col flex-auto shadow-1 mt-12 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
        elevation={0}
      >
        <DataTable
          data={customer.contacts}
          columns={columns}
          renderRowActionMenuItems={({ closeMenu, row, table }) => [
            <MenuItem
              key={0}
              component={NavLinkAdapter}
              to={`/crm/customers/${row.original.customer?._id}`}
              onClick={() => {
                closeMenu();
                // table.resetRowSelection();
              }}
            >
              <ListItemIcon>
                <FuseSvgIcon>heroicons-outline:eye</FuseSvgIcon>
              </ListItemIcon>
              View
            </MenuItem>,
            <MenuItem
              key={0}
              onClick={() => {
                dispatch(
                  removeContacts({
                    customerId: customer._id,
                    contactIds: [row.original._id],
                  })
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
                        message: 'Contact Deleted Successfully',
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
          ]}
          renderTopToolbarCustomActions={({ table }) => {
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
                    removeContacts({
                      customerId: customer._id,
                      contactIds: selectedRows.map((row) => row.original._id),
                    })
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
                          message: 'Contacts Deleted Successfully',
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
                <span className="hidden sm:flex mx-8">
                  Delete selected items
                </span>
              </Button>
            );
          }}
        />
      </Paper>
    </div>
  );
}
