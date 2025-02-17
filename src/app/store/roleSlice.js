import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';

export const addRole = createAsyncThunk('roles/addRole', async (roleData) => {
    const response = await axios.post('/roles', roleData);
    const data = await response.data;
    return data;
});

export const updateRole = createAsyncThunk(
    'roles/updateRole',
    async (roleData) => {
        await axios.patch(`/roles/${roleData._id}`, roleData);
        return roleData;
    }
);

export const deleteRole = createAsyncThunk(
    'roles/deleteRole',
    async (roleId) => {
        console.log('roleId: ', roleId);
        await axios.delete(`/roles/${roleId}`);
        return roleId;
    }
);

export const getRoles = createAsyncThunk('roles/getRoles', async () => {
    const response = await axios.get('/roles');
    const data = await response.data;
    return data;
});


const roleAdapter = createEntityAdapter({
    selectId: (role) => role._id,
});

const roleSlice = createSlice({
    name: 'roles',
    initialState: roleAdapter.getInitialState({
        searchText: '',
    }),
    reducers: {
        setRoleSearchText: {
            reducer: (state, action) => {
                state.searchText = action.payload;
            },
            prepare: (event) => ({ payload: event.target.value || '' }),
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addRole.fulfilled, (state, action) => {
            roleAdapter.addOne(state, action.payload.role);
        });
        builder.addCase(updateRole.fulfilled, roleAdapter.upsertOne);
        builder.addCase(deleteRole.fulfilled, roleAdapter.removeOne);
        builder.addCase(getRoles.fulfilled, roleAdapter.setAll);
    },
});

const roleSelector = roleAdapter.getSelectors((state) => state.roles);
export const { setRoleSearchText } = roleSlice.actions;

export const selectRoles = (state) => {
    return roleSelector.selectAll(state);
};

export const selectRoleSearchText = (state) => state.roles.searchText;

export const selectRoleById = (state, roleId) => {
    return roleSelector.selectById(state, roleId);
};

export default roleSlice.reducer;
