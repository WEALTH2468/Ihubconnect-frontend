import { selectRoles } from 'app/store/roleSlice';
import { useSelector } from 'react-redux';
import { memo, useEffect, useMemo, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { unitTableColumns } from './constants';
import { selectUnits } from 'app/store/settingsSlice';

const getCommonPinningStyles = (column) => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
        isPinned === 'left' && column.getIsLastColumn('left');
    const isFirstRightPinnedColumn =
        isPinned === 'right' && column.getIsFirstColumn('right');

    return {
        boxShadow: isLastLeftPinnedColumn
            ? '-2px 0 2px -2px gray inset'
            : isFirstRightPinnedColumn
            ? '2px 0 2px -2px gray inset'
            : undefined,
        left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
        right:
            isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
        position: isPinned ? 'sticky' : 'relative',
        width: column.getSize(),
        zIndex: isPinned ? 1 : 0,
    };
};

function UnitTable() {
    const [data, setData] = useState([]);
    const units = useSelector((state) => selectUnits(state));

    useEffect(() => {
        setData([...units]);
    }, [units]);

    const columns = useMemo(() => [...unitTableColumns], []);

    const table = useReactTable({
        data,
        columns,
        initialState: {
            columnPinning: {
                right: ['actions'],
            },
        },
        defaultColumn: {
            minSize: 60,
            maxSize: 800,
        },
        getCoreRowModel: getCoreRowModel(),
        debugTable: false,
        enableColumnPinning: true,
        debugHeaders: false,
        debugColumns: false,
    });

    return (
        <div className="overflow-x-scroll relative w-full">
            {data && data.length > 0 && (
                <>
                    <table
                        className="w-full"
                        // style={{
                        //     width: table.getTotalSize(),
                        // }}
                    >
                        <thead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            key={header.id}
                                            className={`border text-[1.3rem] border-gray-50 py-8 px-8 text-left ${
                                                header.column.id ===
                                                    'actions' && 'bg-white'
                                            }`}
                                            style={{
                                                ...getCommonPinningStyles(
                                                    header.column
                                                ),
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? mull
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td
                                            key={cell.id}
                                            className={`text-left px-12 border border-gray-50 h-[32px] ${
                                                cell.column.id === 'actions' &&
                                                'bg-white'
                                            }`}
                                            style={{
                                                ...getCommonPinningStyles(
                                                    cell.column
                                                ),
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
}

export default memo(UnitTable);
