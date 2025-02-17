/* eslint-disable react/no-unstable-nested-components */
import _ from '@lodash';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import { Avatar, Button, ListItemIcon, MenuItem, Paper } from '@mui/material';
import Typography from '@mui/material/Typography';
import { useEffect, useMemo } from 'react';

import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import DataTable from 'app/shared-components/DataTable';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useDispatch } from 'react-redux';
import StageView from './StageView';
import { removeQuotes } from '../../store/quotesSlice';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';
import { getLogo } from 'src/app/main/settings/users/store/settingsSlice';

export default function QuotesTable({ quotes }) {
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
        accessorKey: 'quoteNo',
        header: 'Quote No',
        Cell: ({ row }) => {
          return <Typography>{row.original.quoteNo}</Typography>;
        },
      },
      {
        accessorKey: 'title',
        header: 'Title',
        Cell: ({ row }) => {
          return (
            <Typography
              component={NavLinkAdapter}
              to={`/crm/quotes/${row.original._id}`}
              className="underline"
            >
              {row.original.title}
            </Typography>
          );
        },
      },
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
              src={addBackendProtocol(row.original.customer?.customerPhoto)}
              alt="Samuel.jpg"
            >
              {row.original.customer?.name.slice(0, 1).toUpperCase()}
            </Avatar>
          </div>
        ),
      },
      {
        accessorKey: 'customer',
        header: 'Customer',
        Cell: ({ row }) => (
          <Typography
            component={NavLinkAdapter}
            to={`/crm/customers/${row.original.customer?._id}`}
            className="underline"
          >
            {row.original.customer?.name}
          </Typography>
        ),
      },
      {
        accessorKey: 'total',
        header: 'Total',
        Cell: ({ row }) => (
          <Typography>
            {row.original.currency?.name}
            {new Intl.NumberFormat('en-US', {
              style: 'decimal',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(row.original.total)}
          </Typography>
        ),
      },
      {
        accessorKey: 'date',
        header: 'Date',
        Cell: ({ row }) => (
          <Typography>
            {new Date(row.original.quoteDate).toDateString()}
          </Typography>
        ),
      },
      {
        accessorKey: 'prepared',
        header: 'Prepared',
        Cell: ({ row }) => (
          <StageView stageStatus={row.original.stage[0].value} />
        ),
      },
      {
        accessorKey: 'reviewed',
        header: 'Reviewed',
        Cell: ({ row }) => (
          <StageView stageStatus={row.original.stage[1].value} />
        ),
      },
      {
        accessorKey: 'approved',
        header: 'Approved',
        Cell: ({ row }) => (
          <StageView stageStatus={row.original.stage[1].value} row={row} />
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        Cell: ({ row }) => <Typography>{row.original.status}</Typography>,
      },
    ],
    []
  );

  useEffect(() => {
    dispatch(getLogo());
  }, []);

  return (
    <Paper
      className="flex flex-col flex-auto shadow-1 rounded-t-16 overflow-hidden rounded-b-0 w-full h-full"
      elevation={0}
    >
      <DataTable
        data={quotes}
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
          <MenuItem key={1} onClick={() => {}}>
            <ListItemIcon>
              <FuseSvgIcon>heroicons-outline:pencil</FuseSvgIcon>
            </ListItemIcon>
            Edit
          </MenuItem>,
          <MenuItem
            key={0}
            onClick={() => {
              dispatch(removeQuotes([row.original._id])).then((action) => {
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
                  removeQuotes(selectedRows.map((row) => row.original._id))
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
                        message: 'Quotes Deleted Successfully',
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
