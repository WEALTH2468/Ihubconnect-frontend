import React from 'react';
import { useParams } from 'react-router-dom';
import useRoleFormManagement from './useRoleFormManagement';
import { Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
    Autocomplete,
    Button,
    Checkbox,
    TextField,
    Typography,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectRoleById } from 'app/store/roleSlice';

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

function CreateRoleForm({ control, isValid, handleSubmit, onSubmit, errors }) {
    return (
        <div className="w-[80%] mx-auto mt-64">
            <div className="flex justify-between items-center pb-32">
                <motion.div
                    className="flex flex-col items-center sm:items-start min-w-0"
                    initial={{ x: -20 }}
                    animate={{ x: 0, transition: { delay: 0.3 } }}
                >
                    <Typography className="text-16 sm:text-20 truncate font-semibold">
                        Manage Roles
                    </Typography>
                    <Typography variant="caption" className="font-medium">
                        Create new role
                    </Typography>
                </motion.div>
                <div className="flex gap-8 items-center">
                    <motion.div
                        className="flex"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{
                            opacity: 1,
                            x: 0,
                            transition: { delay: 0.3 },
                        }}
                    >
                        <Button
                            className="whitespace-nowrap mx-4"
                            variant="contained"
                            color="secondary"
                            disabled={!isValid}
                            onClick={handleSubmit(onSubmit({}))}
                        >
                            Save
                        </Button>
                    </motion.div>
                </div>
            </div>
            <div>
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <TextField
                            id=""
                            size="small"
                            className="mt-32"
                            label="Role Name"
                            {...field}
                            variant="outlined"
                            error={!!errors?.title}
                            helperText={errors?.title?.message}
                            required
                            fullWidth
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="description"
                    render={({ field }) => (
                        <TextField
                            id=""
                            size="small"
                            className="mt-32"
                            label="Role Description"
                            {...field}
                            variant="outlined"
                            error={!!errors?.description}
                            helperText={errors?.description?.message}
                            required
                            fullWidth
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="permissions"
                    render={({ field: { onChange, value } }) => {
                        return (
                            <Autocomplete
                                multiple
                                id="permissions"
                                className="mt-32"
                                options={permissions}
                                disableCloseOnSelect
                                getOptionLabel={(option) => option}
                                renderOption={(
                                    _props,
                                    option,
                                    { selected }
                                ) => (
                                    <li {..._props}>
                                        <Checkbox
                                            style={{ marginRight: 8 }}
                                            checked={selected}
                                        />
                                        {option}
                                    </li>
                                )}
                                value={value || []}
                                onChange={(event, newValue) => {
                                    onChange(newValue);
                                }}
                                fullWidth
                                renderInput={(params) => (
                                    <TextField
                                        size="small"
                                        {...params}
                                        label="Permissions"
                                        placeholder="Role Permissions"
                                    />
                                )}
                            />
                        );
                    }}
                />
            </div>
        </div>
    );
}
export default function RoleForm() {
    // get params from id
    const routeParams = useParams();

    if (routeParams.id === 'new') {
        const { control, isValid, handleSubmit, onSubmit, errors } =
            useRoleFormManagement();
        return CreateRoleForm({
            control,
            isValid,
            handleSubmit,
            onSubmit,
            errors,
        });
    } else {
        const role = useSelector((state) =>
            selectRoleById(state, routeParams.id)
        );
        const { control, isValid, handleSubmit, onSubmit, errors } =
            useRoleFormManagement(role);
        return CreateRoleForm({
            control,
            isValid,
            handleSubmit,
            onSubmit,
            errors,
        });
    }
}
