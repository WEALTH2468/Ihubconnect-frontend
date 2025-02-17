import { createColumnHelper } from '@tanstack/react-table';
import TableActions from './TableActions';
import { deleteRole } from 'app/store/roleSlice';
import { deleteDepartment, deleteUnit } from 'app/store/settingsSlice';

const columnHelper = createColumnHelper();

export const roleTableColumns = [
    columnHelper.accessor('name', {
        cell: (info) => info.getValue(),
        header: () => <span>Role Name</span>,
        footer: (info) => info.column.id,
        enableResizing: false,
        size: 400,
    }),
    columnHelper.accessor('description', {
        cell: (info) => info.getValue(),
        header: () => <span>Role Description</span>,
        footer: (info) => info.column.id,
        enableResizing: false,
        size: 400,
    }),
    columnHelper.accessor('permissions', {
        cell: (info) => info.getValue(),
        header: () => <span>Role Permissions</span>,
        footer: (info) => info.column.id,
        enableResizing: false,
        size: 300,
    }),
    columnHelper.accessor('isActive', {
        cell: (info) => info.getValue(),
        header: () => <span>Is Active</span>,
        footer: (info) => info.column.id,
        enableResizing: false,
        size: 200,
    }),
    columnHelper.accessor('actions', {
        cell: (info) => (
            <TableActions
                info={info}
                editTo={`roles/${info.row.original._id}`}
                deleteFn={deleteRole}
            />
        ),
        header: () => <span className="text-center">Actions</span>,
        footer: (info) => info.column.id,
        enableResizing: false,
        size: 150,
    }),
];

export const departmentTableColumns = [
    columnHelper.accessor('name', {
        cell: (info) => info.getValue(),
        header: () => <span>Department</span>,
        footer: (info) => info.column.id,
        enableResizing: false,
        size: 400,
    }),
    columnHelper.accessor('units', {
        cell: (info) => info.getValue(),
        header: () => <span>Units</span>,
        footer: (info) => info.column.id,
        enableResizing: false,
        size: 400,
    }),

    columnHelper.accessor('actions', {
        cell: (info) => (
            <TableActions
                info={info}
                editTo={`departments/${info.row.original._id}/department`}
                deleteFn={deleteDepartment}
            />
        ),
        header: () => <span className="text-center">Actions</span>,
        footer: (info) => info.column.id,
        enableResizing: false,
        size: 150,
    }),
];

export const unitTableColumns = [
    columnHelper.accessor('name', {
        cell: (info) => info.getValue(),
        header: () => <span>Unit</span>,
        footer: (info) => info.column.id,
        enableResizing: false,
        size: 400,
    }),

    columnHelper.accessor('actions', {
        cell: (info) => (
            <TableActions
                info={info}
                editTo={`departments/${info.row.original._id}/unit`}
                deleteFn={deleteUnit}
            />
        ),
        header: () => <span className="text-center">Actions</span>,
        footer: (info) => info.column.id,
        enableResizing: false,
        size: 150,
    }),
];
