import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history'; // Assuming you have history configured properly
import UserModel from '../model/UserModel';
import { showMessage } from 'app/store/fuse/messageSlice';

// Async thunk to fetch user
export const getUser = createAsyncThunk(
    'usersApp/user/getUser',
    async ({ id, route }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/ihub/users/${id}`);
            return response.data;
        } catch (error) {
            if (route) {
                history.push({ pathname: `/profile` });
            }
            // Redirect to settings page on error
            history.push({ pathname: `/settings` });
            // Return rejected promise with error value
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to add new user
export const addUser = createAsyncThunk(
    'usersApp/user/addUser',
    async (user, { rejectWithValue }) => {
        try {
            const response = await axios.post('/ihub/addUser', user);
            return response.data;
        } catch (error) {
            // Return rejected promise with error value
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to remove user
export const removeUser = createAsyncThunk(
    'usersApp/user/removeUser',
    async (id, { dispatch }, { rejectWithValue }) => {
        try {
            await axios.delete(`/ihub/delete/${id}`);
            dispatch(
                showMessage({
                    message: 'User Deleted Successfully',
                    variant: 'success',
                })
            );
        } catch (error) {
            // Return rejected promise with error value
            dispatch(
                showMessage({
                    message: 'Failed to delete user',
                    variant: 'error',
                })
            );
            return rejectWithValue(error.message);
        }
    }
);

export const updateUser = createAsyncThunk(
    'usersApp/user/updateUser',
    async ({ id, user }, { dispatch, rejectWithValue }) => {
        
        try {
            const response = await axios.patch(`/ihub/update/${id}`, user);
            dispatch(
                showMessage({
                    message: 'User Updated Successfully',
                    variant: 'success',
                })
            );
            return response.data;
        } catch (error) {}
    }
);

const initialState = {
    user: null,
    error: null, // Add error state to handle errors centrally
    loading: false, // Add loading state to handle loading states centrally
};

const userSlice = createSlice({
    name: 'usersApp/user',
    initialState,
    reducers: {
        resetUser: (state) => {
            state.user = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(removeUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = null; // Reset user after deletion
            })
            .addCase(removeUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.user = action.payload.updatedUser;
            });
    },
});

export const { resetUser } = userSlice.actions;

export default userSlice.reducer;
