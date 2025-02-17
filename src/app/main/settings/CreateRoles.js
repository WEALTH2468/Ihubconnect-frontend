import React from 'react';
import * as yup from 'yup';
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Input,
    Paper,
    TextField,
    Typography,
    createFilterOptions,
    lighten,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
    addRole,
    deleteRole,
    selectRoleSearchText,
    selectRoles,
    setRoleSearchText,
    updateRole,
} from 'app/store/roleSlice';
import { useDispatch, useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { setOpenDialog } from '../tasks/store/groupSlice';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import RoleTable from './RoleTable';

const permissions = [
    'create',
    'update',
    'delete',
    'delete_user',
    'update_user',
    'create_user',
    'assign_role',
    'modify_permission',
    'modify_document',
    'create_own',
    'update_own',
    'delete_own',
    'modify_shared_document',
];

export default function () {
    const roles = useSelector((state) => selectRoles(state));
    const dispatch = useDispatch();
    const schema = yup.object().shape({
        name: yup.string().required('Name is required'),
        description: yup.string().required('Description is required'),
    });

    const searchText = useSelector((state) => selectRoleSearchText(state));

    return (
        <div className="p-32">
            <Box
                className="p-16 w-full rounded-16 mb-24 border"
                sx={{
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'light'
                            ? lighten(theme.palette.background.default, 0.4)
                            : lighten(theme.palette.background.default, 0.02),
                }}
            >
                <div className="flex flex-col w-full sm:w-auto sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center justify-end space-x-8">
                    <Paper
                        component={motion.div}
                        initial={{ y: -20, opacity: 0 }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            transition: { delay: 0.2 },
                        }}
                        className="flex items-center w-full sm:max-w-256 space-x-8 px-16 rounded-full border-1 shadow-0"
                    >
                        <FuseSvgIcon color="disabled">
                            heroicons-solid:search
                        </FuseSvgIcon>

                        <Input
                            placeholder="Search roles"
                            className="flex flex-1"
                            disableUnderline
                            fullWidth
                            value={searchText}
                            inputProps={{
                                'aria-label': 'Search',
                            }}
                            onChange={(ev) => dispatch(setRoleSearchText(ev))}
                        />
                    </Paper>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: { delay: 0.2 },
                        }}
                    >
                        <Button
                            className=""
                            component={NavLinkAdapter}
                            to="roles/new"
                            variant="contained"
                            color="secondary"
                            startIcon={
                                <FuseSvgIcon>
                                    heroicons-outline:plus
                                </FuseSvgIcon>
                            }
                        >
                            Add
                        </Button>
                    </motion.div>
                </div>
            </Box>

            <RoleTable />
        </div>
    );
}
