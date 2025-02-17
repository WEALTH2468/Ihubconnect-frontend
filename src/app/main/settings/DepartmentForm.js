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
import useDepartmentFormManagement from './useDepartmentFormManagement';
import {
    deleteDepartment,
    selectDepartmentById,
    selectDepartments,
} from 'app/store/settingsSlice';
import { useDispatch, useSelector } from 'react-redux';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';

function createDepartmentForm({
    control,
    isValid,
    handleSubmit,
    onSubmit,
    errors,
}) {
    const departments = useSelector((state) => selectDepartments(state));
    const dispatch = useDispatch();

    return (
        <div className="w-[80%] mx-auto mt-64">
            <div className="flex justify-between items-center pb-32">
                <motion.div
                    className="flex flex-col items-center sm:items-start min-w-0"
                    initial={{ x: -20 }}
                    animate={{ x: 0, transition: { delay: 0.3 } }}
                >
                    <Typography className="text-16 sm:text-20 truncate font-semibold">
                        Manage Departments and Units
                    </Typography>
                    <Typography variant="caption" className="font-medium">
                        Create new department
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
                            label="Department Name"
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
                            label="Department Description"
                            {...field}
                            variant="outlined"
                            error={!!errors?.description}
                            helperText={errors?.description?.message}
                            required
                            fullWidth
                        />
                    )}
                />
            </div>
        </div>
    );
}
export default function DepartmentForm() {
    // get params from id
    const routeParams = useParams();

    if (routeParams.id === 'new') {
        const { control, isValid, handleSubmit, onSubmit, errors } =
            useDepartmentFormManagement();
        return createDepartmentForm({
            control,
            isValid,
            handleSubmit,
            onSubmit,
            errors,
        });
    } else {
        const department = useSelector((state) =>
            selectDepartmentById(state, routeParams.id)
        );
        const { control, isValid, handleSubmit, onSubmit, errors } =
            useDepartmentFormManagement(department);
        return createDepartmentForm({
            control,
            isValid,
            handleSubmit,
            onSubmit,
            errors,
        });
    }
}
