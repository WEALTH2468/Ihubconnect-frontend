import { ButtonBase } from '@mui/material';
import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch } from 'react-redux';
import { deleteRole } from 'app/store/roleSlice';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';

export default function TableOptions({ info, editTo, deleteFn }) {
    const dispatch = useDispatch();

    const handleDelete = (id) => {
        dispatch(deleteFn(id));
    };

    return (
        <div className="flex flex-row gap-8 w-full h-full py-8">
            <ButtonBase
                className="flex flex-row items-center justify-center border border-gray-600 px-8 py-4 rounded-md h-auto gap-4 text-[1.3rem] decoration-none cursor-pointer"
                component={NavLinkAdapter}
                to={editTo}
                sx={{
                    border: '1px solid black',
                }}
            >
                <SettingsIcon
                    sx={{
                        height: 20,
                        width: 20,
                        color: '#808080',
                    }}
                />
                Edit
            </ButtonBase>
            <ButtonBase
                className="flex flex-row items-center justify-center border border-gray-400 px-8 py-4 rounded-md h-auto gap-6"
                sx={{
                    border: '1px solid black',
                }}
                onClick={() => handleDelete(info.row.original._id)}
            >
                <DeleteIcon
                    sx={{
                        height: 20,
                        width: 20,
                        color: '#808080',
                    }}
                />
                Delete
            </ButtonBase>
        </div>
    );
}
