import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
    current,
} from '@reduxjs/toolkit';
import axios from 'axios';

export const addDepartment = createAsyncThunk(
    'settings/addDepartment',
    async (departmentData) => {
        const response = await axios.post('/departments', departmentData);
        const data = await response.data;
        return data;
    }
);

export const updateDepartment = createAsyncThunk(
    'settings/updateDepartment',
    async (departmentData) => {
        await axios.patch(`/departments/${departmentData._id}`, departmentData);
        return departmentData;
    }
);

export const deleteDepartment = createAsyncThunk(
    'settings/deleteDepartment',
    async (departmentId) => {
        console.log('departmentId: ', departmentId);
        await axios.delete(`/departments/${departmentId}`);
        return departmentId;
    }
);

export const getDepartments = createAsyncThunk(
    'settings/getDepartments',
    async () => {
        try {
            const response = await axios.get('/departments');
            const data = await response.data;
            return data;
        } catch (error) {
            dispatch(
                showMessage({
                    message: 'Failed to Get Department',
                    variant: 'error',
                })
            );
            rejectWithValue(error.message);
        }
    }
);

export const addUnit = createAsyncThunk(
    'settings/addUnit',
    async (unitData) => {
        console.log(unitData);
        const response = await axios.post('/units', unitData);
        const data = await response.data;
        return data;
    }
);

export const updateUnit = createAsyncThunk(
    'settings/updateUnit',
    async (unitData) => {
        await axios.patch(`/units/${unitData._id}`, unitData);
        return unitData;
    }
);

export const deleteUnit = createAsyncThunk(
    'settings/deleteUnit',
    async (unitId) => {
        await axios.delete(`/units/${unitId}`);
        return unitId;
    }
);

export const getUnits = createAsyncThunk('settings/getUnits', async () => {
    try {
        const response = await axios.get('/units');
        const data = await response.data;
        return data;
    } catch (error) {
        dispatch(
            showMessage({
                message: 'Failed to Get Department',
                variant: 'error',
            })
        );
        rejectWithValue(error.message);
    }
});

const departmentAdapter = createEntityAdapter({
    selectId: (department) => department._id,
});

const unitAdapter = createEntityAdapter({
    selectId: (unit) => unit._id,
});

const initialState = {
    departments: departmentAdapter.getInitialState(),
    units: unitAdapter.getInitialState(),
};

const settingSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDepartments.fulfilled, (state, action) => {
                departmentAdapter.setAll(state.departments, action.payload);
            })
            .addCase(addDepartment.fulfilled, (state, action) => {
                departmentAdapter.addOne(
                    state.departments,
                    action.payload.department
                );
            })
            .addCase(updateDepartment.fulfilled, (state, action) => {
                departmentAdapter.upsertOne(state.departments, action.payload);
            })
            .addCase(deleteDepartment.fulfilled, (state, action) => {
                departmentAdapter.removeOne(state.departments, action.payload);
            })
            .addCase(getUnits.fulfilled, (state, action) => {
                unitAdapter.setAll(state.units, action.payload);
            })
            .addCase(addUnit.fulfilled, (state, action) => {
                unitAdapter.addOne(state.units, action.payload.unit);
            })
            .addCase(updateUnit.fulfilled, (state, action) => {
                unitAdapter.upsertOne(state.units, action.payload);
            })
            .addCase(deleteUnit.fulfilled, (state, action) => {
                unitAdapter.removeOne(state.units, action.payload);
            });
    },
});

const departmentSelector = departmentAdapter.getSelectors((state) => {
    return state.settings.departments;
});

const unitSelector = unitAdapter.getSelectors((state) => {
    return state.settings.units;
});

export const selectDepartments = (state) => {
    return departmentSelector.selectAll(state);
};

export const selectUnits = (state) => {
    return unitSelector.selectAll(state);
};

export const selectDepartmentById = (state, departmentId) => {
    return departmentSelector.selectById(state, departmentId);
};

export const selectUnitById = (state, unitId) => {
    return unitSelector.selectById(state, unitId);
};

export default settingSlice.reducer;
