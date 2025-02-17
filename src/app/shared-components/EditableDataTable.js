import { Box, IconButton, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import {
  MaterialReactTable,
  createRow,
  useMaterialReactTable,
} from 'material-react-table';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import DataTableTopToolbar from './DataTableTopToolbar';
import { updateQuote } from '../main/crm/store/quotesSlice';
import tableIcons from './tableIcons';

export default function EditableDataTable(props) {
  const dispatch = useDispatch();
  const {
    columns,
    items,
    quote,
    saveNewData,
    setIsCreating,
    isCreating,
    setIsEditing,
    ...rest
  } = props;
  const [data, setData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  console.log({ isCreating });

  useEffect(() => {
    setData(() =>
      quote.items.map((quoteItem) => {
        const item = items.find((i) => i._id === quoteItem.itemId);
        return {
          ...item,
          ...quoteItem,
          total: item.price * quoteItem.quantity,
        };
      })
    );
  }, [quote, items]);

  const handleCreateData = async ({ values, table }) => {
    // const newValidationErrors = validateUser(values);
    // if (Object.values(newValidationErrors).some((error) => error)) {
    //   setValidationErrors(newValidationErrors);
    //   return;
    // }
    // setValidationErrors({});
    saveNewData(values);
    table.setCreatingRow(null); // exit creating mode
    setIsCreating(false);
  };

  const handleItemDelete = (id) => {
    const filteredItems = data.filter((item) => item._id !== id);
    dispatch(
      updateQuote({
        ...quote,
        items: filteredItems,
      })
    ).then((action) => {
      if (action.error) {
        dispatch(
          showMessage({
            message: 'An Error Occured During while Deleting a Quote Item',
            variant: 'error',
          })
        );
      } else {
        dispatch(
          showMessage({
            message: 'Quote Item Deleted Successfully',
            variant: 'success',
          })
        );
      }
    });
  };

  const defaults = useMemo(
    () =>
      _.defaults(rest, {
        initialState: {
          density: 'comfortable',
          showColumnFilters: false,
          showGlobalFilter: true,
          columnPinning: {
            left: ['mrt-row-expand', 'mrt-row-select'],
            right: ['mrt-row-actions'],
          },
          pagination: {
            pageSize: 15,
          },
          enableFullScreenToggle: false,
        },
        enableFullScreenToggle: false,
        enableColumnFilterModes: true,
        enableColumnOrdering: true,
        enableGrouping: true,
        enableColumnPinning: true,
        enableFacetedValues: true,
        enableRowActions: true,
        enableRowSelection: true,
        muiBottomToolbarProps: {
          className: 'flex items-center min-h-56 h-56',
        },
        muiTablePaperProps: {
          elevation: 0,
          square: true,
          className: 'flex flex-col flex-auto h-full',
        },
        muiTableContainerProps: {
          className: 'flex-auto',
        },
        enableStickyHeader: true,
        enableStickyFooter: true,
        paginationDisplayMode: 'pages',
        positionToolbarAlertBanner: 'top',
        muiPaginationProps: {
          color: 'secondary',
          rowsPerPageOptions: [10, 20, 30],
          shape: 'rounded',
          variant: 'outlined',
          showRowsPerPage: false,
        },
        muiSearchTextFieldProps: {
          placeholder: 'Search',
          sx: { minWidth: '300px' },
          variant: 'outlined',
          size: 'small',
        },
        muiFilterTextFieldProps: {
          variant: 'outlined',
          size: 'small',
          sx: {
            '& .MuiInputBase-root': {
              padding: '0px 8px',
              height: '32px!important',
              minHeight: '32px!important',
            },
          },
        },
        muiSelectAllCheckboxProps: {
          className: 'w-48',
        },
        muiSelectCheckboxProps: {
          className: 'w-48',
        },
        muiTableBodyRowProps: ({ row, table }) => {
          const { density } = table.getState();
          if (density === 'compact') {
            return {
              sx: {
                opacity: 1,
                boxShadow: 'none',
                height: row.getIsPinned() ? `${37}px` : undefined,
                outline: '0.5px solid #d6d6d6',
              },
            };
          }
          return {
            sx: {
              opacity: 1,
              boxShadow: 'none',
              // // Set a fixed height for pinned rows
              height: row.getIsPinned()
                ? `${density === 'comfortable' ? 53 : 69}px`
                : undefined,
              outline: '0.5px solid #d6d6d6',
            },
          };
        },
        muiTableHeadCellProps: ({ column }) => ({
          sx: {
            '& .Mui-TableHeadCell-Content-Labels': {
              flex: 1,
              justifyContent: 'space-between',
            },
            '& .Mui-TableHeadCell-Content-Actions': {},
            '& .MuiFormHelperText-root': {
              textAlign: 'center',
              marginX: 0,
              color: (theme) => theme.palette.text.disabled,
              fontSize: 11,
            },
            backgroundColor: (theme) =>
              column.getIsPinned() ? theme.palette.background.paper : 'inherit',
          },
        }),
        mrtTheme: (theme) => ({
          baseBackgroundColor: theme.palette.background.paper,
          menuBackgroundColor: theme.palette.background.paper,
          pinnedRowBackgroundColor: theme.palette.background.paper,
          pinnedColumnBackgroundColor: theme.palette.background.paper,
        }),
        renderTopToolbar: (_props) => <DataTableTopToolbar {..._props} />,
        icons: tableIcons,
      }),
    [rest]
  );

  const table = useMaterialReactTable({
    columns,
    data,
    ...defaults,
    createDisplayMode: 'row', // ('modal', and 'custom' are also available)
    editDisplayMode: 'cell', // ('modal', 'row', 'table', and 'custom' are also available)
    enableCellActions: true,
    enableClickToCopy: 'context-menu',
    enableColumnPinning: true,
    enableEditing: true,
    // eslint-disable-next-line no-shadow
    muiTableBodyCellProps: ({ cell, column, table }) => ({
      onClick: () => {
        table.setEditingCell(cell);
        setIsEditing(!isCreating);
        queueMicrotask(() => {
          const textField = table.refs.tableHeadCellRefs.current[column.id];
          console.log({ textField }, table.refs);
          if (textField) {
            textField.focus();
            textField.select?.();
          }
        });
      },
    }),
    enableRowActions: true,
    positionCreatingRow: 'bottom',
    getRowId: (row) => row.id,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateData,
    renderRowActions: ({ row }) => (
      <Box sx={{ display: 'flex', gap: '1rem' }}>
        <Tooltip title="Delete">
          <IconButton
            onClick={() => {
              handleItemDelete(row.original._id);
            }}
          >
            <FuseSvgIcon>heroicons-outline:trash</FuseSvgIcon>
          </IconButton>
        </Tooltip>
      </Box>
    ),
    // eslint-disable-next-line no-shadow
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        variant="contained"
        color="secondary"
        size="small"
        onClick={() => {
          table.setCreatingRow(
            createRow(table, {
              sno: 0,
              total: 0.0,
              price: 0.0,
              quantity: 0,
            })
          );
          setIsCreating(true);
        }}
      >
        Create new item
      </Button>
    ),
  });

  return <MaterialReactTable table={table} />;
}
