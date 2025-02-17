/* eslint-disable react/no-unstable-nested-components */
import _ from '@lodash';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { Avatar, Button, ListItemIcon, MenuItem, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from 'app/shared-components/DataTable';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';
import { removeCustomers } from '../../store/customersSlice';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';

export default function CustomersTable({ customers, loading }) {
  const dispatch = useDispatch();
  const columns = useMemo(
    () => [
      {
        accessorKey: 'code',
        header: 'Code',
        Cell: ({ row }) => {
          return <Typography>coy-04-24-100</Typography>;
        },
      },

      {
        accessorKey: 'type',
        header: 'Type',
        Cell: ({ row }) => {
          return <Typography>{row.original.type}</Typography>;
        },
      },
      // {
      //   accessorKey: 'category',
      //   header: 'Category',
      //   Cell: ({ row }) => {
      //     return <Typography>{row.original.category}</Typography>;
      //   },
      // },
      {
        accessorFn: (row) => row.image,
        id: 'image',
        header: '',
        enableColumnFilter: false,
        enableColumnDragging: false,
        size: 64,
        enableSorting: false,
        Cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Avatar
              sx={{
                backgroundColor: 'background.default',
                color: 'text.secondary',
              }}
              className="w-32 h-32 text-24 font-bold"
              src={addBackendProtocol(row.original.customerPhoto)}
              alt="Samuel.jpg"
            >
              {row.original.name.slice(0, 1).toUpperCase()}
            </Avatar>
          </div>
        ),
      },
      {
        accessorKey: 'name',
        header: 'Name',
        Cell: ({ row }) => (
          <Typography
            component={NavLinkAdapter}
            to={`/crm/customers/${row.original._id}`}
            className="underline"
          >
            {row.original.name}
          </Typography>
        ),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        Cell: ({ row }) => <Typography>{row.original.name}</Typography>,
      },
      {
        accessorKey: 'phoneNumber',
        header: 'Phone Number',
        Cell: ({ row }) => <Typography>{row.original.phoneNumber}</Typography>,
      },
      {
        accessorKey: 'address',
        header: 'Address',
        Cell: ({ row }) => <Typography>{row.original.address}</Typography>,
      },
      {
        accessorKey: 'city',
        header: 'City',
        Cell: ({ row }) => <Typography>{row.original.city}</Typography>,
      },
      {
        accessorKey: 'country',
        header: 'Country',
        Cell: ({ row }) => <Typography>{row.original.country}</Typography>,
      },
    ],
    []
  );

  if (loading) {
    return <FuseLoading />;
  }

  if (customers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no customers!
        </Typography>
      </motion.div>
    );
  }

  return (
    <Paper
      className="flex flex-col flex-auto  overflow-hidden rounded-b-0 w-full h-full"
      elevation={0}
    >
      <DataTable
        data={customers}
        columns={columns}
        renderRowActionMenuItems={({ closeMenu, row, table }) => [
          <MenuItem
            key={0}
            component={NavLinkAdapter}
            to={`/crm/customers/${row.original._id}`}
            onClick={() => {
              closeMenu();
              table.resetRowSelection();
            }}
          >
            <ListItemIcon>
              <FuseSvgIcon size={20}>heroicons-outline:eye</FuseSvgIcon>
            </ListItemIcon>
            View
          </MenuItem>,
          <MenuItem
            key={1}
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
              <FuseSvgIcon size={20}>heroicons-outline:pencil</FuseSvgIcon>
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
              <FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
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
              <FuseSvgIcon size={20}>heroicons-outline:trash</FuseSvgIcon>
              <span className="hidden sm:flex mx-8">Delete selected items</span>
            </Button>
          );
        }}
      />
    </Paper>
  );
}

