/* eslint-disable react/no-unstable-nested-components */
import _ from '@lodash';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { Button, ListItemIcon, MenuItem, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { useMemo } from 'react';

import FuseLoading from '@fuse/core/FuseLoading';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from 'app/shared-components/DataTable';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';
import { removeItems } from '../../store/itemsSlice';

export default function ItemsTable({ items, loading }) {
  const dispatch = useDispatch();
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
        Cell: ({ row }) => (
          <Typography
            component={NavLinkAdapter}
            to={`/crm/items/${row.original._id}/edit`}
            className="underline"
          >
            {row.original.name}
          </Typography>
        ),
      },

      {
        accessorKey: 'type',
        header: 'Type',
        Cell: ({ row }) => {
          return <Typography>{row.original.type}</Typography>;
        },
      },
      {
        accessorKey: 'description',
        header: 'Description',
        Cell: ({ row }) => {
          return <Typography>{row.original.description}</Typography>;
        },
      },
      {
        accessorKey: 'price',
        header: 'Price',
        Cell: ({ row }) => (
          <Typography>
            NGN{' '}
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(row.original.price)}
          </Typography>
        ),
      },
    ],
    []
  );

  if (loading) {
    return <FuseLoading />;
  }

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="flex flex-1 items-center justify-center h-full"
      >
        <Typography color="text.secondary" variant="h5">
          There are no items!
        </Typography>
      </motion.div>
    );
  }

  return (
    <Paper
      className="flex flex-col flex-auto shadow-3 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
      elevation={0}
    >
      <DataTable
        data={items}
        columns={columns}
        renderRowActionMenuItems={({ closeMenu, row, table }) => [
          <MenuItem
            key={1}
            component={NavLinkAdapter}
            to={`/crm/items/${row.original._id}/edit`}
          >
            <ListItemIcon>
              <FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
            </ListItemIcon>
            Edit
          </MenuItem>,
          <MenuItem
            key={0}
            onClick={() => {
              dispatch(removeItems([row.original._id])).then((action) => {
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
                      message: 'Items Deleted Successfully',
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
                  removeItems(selectedRows.map((row) => row.original._id))
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
                        message: 'Items Deleted Successfully',
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
        }}
      />
    </Paper>
  );
}
