import React from 'react';
import { useParams } from 'react-router-dom';
import { Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import {
    Autocomplete,
    Button,
    Checkbox,
    TextField,
    Typography,
} from '@mui/material';
import useUnitFormManagement from './useUnitFormManagement';
import {
    selectDepartmentById,
    selectDepartments,
    selectUnitById,
} from 'app/store/settingsSlice';
import { useSelector } from 'react-redux';

function createUnitForm({
    control,
    isValid,
    handleSubmit,
    onSubmit,
    errors,
    departments,
    department,
}) {
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
                        Create new unit
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
                    name="department"
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            multiple={false}
                            id="department"
                            className="mt-32"
                            options={departments}
                            disableCloseOnSelect={false}
                            getOptionLabel={(option) => option?.name}
                            renderOption={(_props, option, { selected }) => (
                                <li {..._props}>{option?.name}</li>
                            )}
                            value={department ?? value}
                            onChange={(event, newValue) => {
                                onChange(newValue);
                            }}
                            fullWidth
                            renderInput={(params) => (
                                <TextField
                                    size="small"
                                    {...params}
                                    label="Departments"
                                    placeholder="Departments"
                                />
                            )}
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="unit"
                    render={({ field }) => (
                        <TextField
                            id=""
                            size="small"
                            className="mt-32"
                            label="Unit Name"
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
export default function UnitForm() {
    // get params from id
    const routeParams = useParams();
    const departments = useSelector((state) => selectDepartments(state));
    const unit = useSelector((state) => selectUnitById(state, routeParams.id));
    if (routeParams.id === 'new') {
        const { control, isValid, handleSubmit, onSubmit, errors } =
            useUnitFormManagement();
        return createUnitForm({
            control,
            isValid,
            handleSubmit,
            onSubmit,
            errors,
            departments,
        });
    } else {
        const department = useSelector((state) =>
            selectDepartmentById(state, unit.departmentId)
        );
        const { control, isValid, handleSubmit, onSubmit, errors } =
            useUnitFormManagement({ department: department, ...unit });
        return createUnitForm({
            control,
            isValid,
            handleSubmit,
            onSubmit,
            errors,
            departments,
            department,
        });
    }
}
