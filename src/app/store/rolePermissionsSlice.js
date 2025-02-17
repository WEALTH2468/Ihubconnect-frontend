import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';

export const getRolePermissions = createAsyncThunk(
    'roles/getRolePermissions',
    async (roleId) => {
        const response = await axios.get(`/permissions/role/${roleId}`);
        const data = await response.data;
        return data;
    }
);

const rolePermissionsAdapter = createEntityAdapter({
    selectId: (permission) => permission._id,
});

const rolePermissionsSlice = createSlice({
    name: 'rolePermissions',
    initialState: rolePermissionsAdapter.getInitialState({
        
    }),
    extraReducers: (builder) => {
        builder.addCase(getRolePermissions.fulfilled, rolePermissionsAdapter.setAll);
    },
});

const rolePermissionsSelector = rolePermissionsAdapter.getSelectors((state) => state.rolePermissions);

export const selectRolePermissions = (state) => {
    return rolePermissionsSelector.selectAll(state);
};


export default rolePermissionsSlice.reducer;
