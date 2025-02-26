import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';

export const updateLogo = createAsyncThunk(
    "settings/updateLogo",
    async ({formData, dispatch}, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`/settings/logo`, formData)
            dispatch(
                showMessage({
                    message: 'Logo updated Successfully',
                    variant: 'success',
                })
            );
            return response.data;
        } catch (error) {
            dispatch(
                showMessage({
                    message: 'Action Failed',
                    variant: 'error',
                })
            );
            return rejectWithValue(error.message)
            
        }
    }
)

export const getLogo = createAsyncThunk(
    "settings/getLogo",
    async (_, { rejectWithValue }) => { // Added an underscore (_) to indicate no parameters are expected
        try {
            const response = await axios.get(`/settings/logo`)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message)
        }
    }
)






const initialState = {
    logo: null,
   
    error: null, // Add error state to handle errors centrally
    loading: false // Add loading state to handle loading states centrally
};

const settingsSlice = createSlice({
    name: 'usersApp/settings',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(updateLogo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateLogo.fulfilled, (state, action) => {
                state.loading = false;
                state.logo = action.payload;

            })
            .addCase(updateLogo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getLogo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLogo.fulfilled, (state, action) => {
                state.loading = false;
                state.logo = action.payload;

            })
            .addCase(getLogo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
           

    }
});
export const selectLogo = (state) => state?.logo?.logo;
export default settingsSlice.reducer;