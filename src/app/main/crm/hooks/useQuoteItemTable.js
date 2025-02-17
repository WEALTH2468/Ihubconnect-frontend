import { FormControlLabel, FormGroup, Menu } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  createColumnHelper,
} from '@tanstack/react-table';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import Switch from '@mui/material/Switch';

import {
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import { arrayMove, useSortable } from '@dnd-kit/sortable';
import RowActions from '../components/quote-detail/quote-detail-items/RowActions';
import { selectItems } from '../store/itemsSlice';
import {
  CheckboxCell,
  EditCell,
  SelectCell,
} from '../components/quote-detail/quote-detail-items/cell';
import { setHasUpdatedTable, updateQuote } from '../store/quotesSlice';

/* utils */
function RowDragHandleCell({ rowId }) {
  const { attributes, listeners } = useSortable({
    id: rowId,
  });
  return (
    // Alternatively, you could set these attributes on the rows themselves
    <button
      {...attributes}
      {...listeners}
      type="submit"
      className="px-12 py-12 cursor-grab"
    >
      🟰
    </button>
  );
}

export default function useQuoteItemTable(quote) {
  const dispatch = useDispatch();

  /* States */
  const [data, setData] = useState(quote.items || []);
  const [filtering, setFiltering] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({
    serviceName: false,
    createdAt: false,
  });
  const [tempData, setTempData] = useState([]);
  const [columnPinning, setColumnPinning] = useState({
    right: ['actions'],
    left: ['drag-handle'],
  });

  /* redux selectors */
  const items = useSelector(selectItems);

  const columnHelper = createColumnHelper();
  /* columns definitions*/
  const finalColumns = useMemo(() => {
    return [
      {
        id: 'drag-handle',
        header: 'Move',
        cell: ({ row }) => <RowDragHandleCell rowId={row.id} />,
        size: 60,
      },
      {
        accessorKey: 'bold',
        header: 'Bold',
        size: 70,
        cell: ({ getValue, row, column }) => (
          <CheckboxCell row={row} column={column} value={getValue()} />
        ),
      },

      {
        accessorKey: 'service',
        header: 'Service',
        size: 200,
        cell: ({ getValue, row, column }) => (
          <SelectCell
            items={items}
            row={row}
            column={column}
            value={getValue()}
          />
        ),
      },

      {
        accessorKey: 'serviceName',
        header: 'ServiceName',
      },

      {
        accessorKey: 'description',
        header: 'Description',
        size: 200,
        cell: ({ getValue, row, column }) => (
          <EditCell
            value={getValue()}
            row={row}
            column={column}
            type="text"
            maxLength={250}
          />
        ),
      },
      {
        accessorKey: 'range',
        header: 'Range',
        size: 200,
        cell: ({ getValue, row, column }) => (
          <EditCell
            value={getValue()}
            row={row}
            column={column}
            type="text"
            maxLength={30}
          />
        ),
      },
      {
        accessorKey: 'standard',
        header: 'Standard',
        size: 200,
        cell: ({ getValue, row, column }) => (
          <EditCell
            value={getValue()}
            row={row}
            column={column}
            type="text"
            maxLength={30}
          />
        ),
      },
      {
        accessorKey: 'duration',
        header: 'Duration',
        size: 200,
        cell: ({ getValue, row, column }) => (
          <EditCell
            value={getValue()}
            row={row}
            column={column}
            type="text"
            maxLength={30}
          />
        ),
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        size: 100,
        cell: ({ getValue, row, column }) => (
          <EditCell
            value={getValue()}
            row={row}
            column={column}
            type="number"
          />
        ),
      },
      {
        accessorKey: 'price',
        header: 'Price',
        size: 100,
        cell: ({ getValue, row, column }) => (
          <EditCell
            value={getValue()}
            row={row}
            column={column}
            type="number"
          />
        ),
      },
      {
        accessorKey: 'total',
        header: 'Total',
        size: 100,
        cell: ({ getValue }) => (
          <p className="px-12 py-8">
            {quote.currency.name}
            {getValue()?.toLocaleString()}
          </p>
        ),
      },
      {
        accessorKey: 'createdAt',
        cell: ({ getValue }) => <p>{getValue()}</p>,
      },
      columnHelper.accessor('actions', {
        header: 'Actions',
        enablePinning: true,
        size: 100,
        cell: ({ row, table }) => {
          return (
            <RowActions
              row={row}
              deleteHandler={table.options.meta?.deleteRow}
              addHandler={table.options.meta?.addRow}
            />
          );
        },
      }),
    ];
  }, [items, quote]);

  const dataIds = useMemo(() => data?.map(({ _id }) => _id), [data]);

  /* table instance */
  const table = useReactTable({
    columns: finalColumns,
    data,
    getRowId: (row) => row._id,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnPinningChange: setColumnPinning,
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    state: {
      columnPinning,
      globalFilter: filtering,
      columnVisibility,
    },

    filterFns: {
      itemFilter: (rows, columnIds, filterValue) => {
        // return the filtered rows
      },
    },

    meta: {
      addRow: (value) => {
        const item = items.find((i) => i._id === value.service);
        const newData = {
          bold: value.bold,
          service: value.service,
          serviceName: item.name,
          description: value.description,
          range: value.range,
          standard: value.standard,
          quantity: Number(value.quantity),
          createdAt: new Date().getTime(),
        };
        const updatedItems = [...quote.items, newData];

        dispatch(updateQuote({ _id: quote._id, items: updatedItems })).then(
          (action) => {
            if (!action.error) {
              dispatch(
                showMessage({
                  message: 'Items Added successfully',
                  variant: 'success',
                })
              );
            } else {
              dispatch(
                showMessage({
                  message: 'An Error Occurred during Item Creation',
                  variant: 'error',
                })
              );
            }
          }
        );
      },
      deleteRow: (row) => {
        if (row.original._id) {
          // Existing item, remove from quote
          const updatedItems = quote.items.filter(
            (item) => item._id !== row.original._id
          );
          dispatch(updateQuote({ _id: quote._id, items: updatedItems })).then(
            (action) => {
              if (!action.error) {
                dispatch(
                  showMessage({
                    message: 'Item deleted successfully',
                    variant: 'success',
                  })
                );
              } else {
                dispatch(
                  showMessage({
                    message: 'An error occurred during item deletion',
                    variant: 'error',
                  })
                );
              }
            }
          );
        } else {
          // Temporary item, remove from tempData
          setTempData((prev) =>
            prev.filter((item) => item.index !== row.original.index)
          );
        }
      },
      addEmptyRow: () => {
        const newData = {
          bold: false,
          service: '',
          serviceName: '',
          description: '',
          range: '',
          standard: '',
          index: data.length,
          quantity: 1,
        };

        setTempData((prev) => [...prev, newData]);
      },
    },

    onColumnFiltersChange: setFiltering,
    onColumnVisibilityChange: setColumnVisibility,
  });

  function handleDragEnd(e) {
    const { active, over } = e;
    if (active && over && active.id !== over.id) {
      setData((prev) => {
        const oldIndex = dataIds.indexOf(active.id);

        const newIndex = dataIds.indexOf(over.id);
        const newOrder = arrayMove(prev, oldIndex, newIndex);
        return newOrder;
      });
      dispatch(setHasUpdatedTable(true));
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {})
  );

  useEffect(() => {
    if (quote?.items) {
      setData([...quote.items, ...tempData]);
    }
  }, [quote.items, tempData]);

  return { table, sensors, handleDragEnd, filtering, setFiltering, dataIds };
}
