import { selectRoles } from 'app/store/roleSlice';
import { useSelector } from 'react-redux';
import { memo, useEffect, useMemo, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { roleTableColumns } from './constants';

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

const renderContent = (cell) => {
    if (cell.column.id === 'permissions') {
        const permissions = cell.renderValue();
        return (
            <div className="flex flex-row items-center justify-start gap-8">
                {permissions.map((permission) => (
                    <div className="bg-[#cbcbcb] px-8 py-1 border rounded-xl flex items-center justify-center">
                        <p className="text-[1.3rem]">{permission}</p>
                    </div>
                ))}
            </div>
        );
    } else if (cell.column.id === 'isActive') {
        const isActive = cell.renderValue();
        return (
            <div>
                <p className="text-[1.3rem]">
                    {isActive ? 'Active' : 'Inactive'}
                </p>
            </div>
        );
    } else if (cell.column.id !== 'actions') {
        return (
            <div>
                <p className="text-[1.3rem]">{cell.renderValue()}</p>
            </div>
        );
    } else {
        return flexRender(cell.column.columnDef.cell, cell.getContext());
    }
};

function RoleTable() {
    const [data, setData] = useState([]);
    const roles = useSelector((state) => selectRoles(state));

    useEffect(() => {
        setData([...roles]);
    }, [roles]);

    const columns = useMemo(() => [...roleTableColumns], []);

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
        <div className="overflow-x-scroll relative">
            <table
                className=""
                style={{
                    width: table.getTotalSize(),
                }}
            >
                <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                                <th
                                    key={header.id}
                                    className={`border text-[1.3rem] border-gray-50 py-8 px-8 text-left ${
                                        header.column.id === 'actions' &&
                                        'bg-white'
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
                                              header.column.columnDef.header,
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
                                        ...getCommonPinningStyles(cell.column),
                                    }}
                                >
                                    {renderContent(cell)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default memo(RoleTable);
