import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { updatePanelStatus } from 'app/theme-layouts/shared-components/chatPanel/store/contactsSlice';
import axios from 'axios';

export const getUserData = createAsyncThunk(
  'chatApp/user/getUserData',
  async (id) => {
    const response = await axios.get(`ihub/users/${id}`);

    const data = await response.data;

    return data;
  }
);

export const updateUserData = createAsyncThunk(
  'chatApp/user/updateUserData',
  async ({ id, newData }) => {
    const response = await axios.patch(`ihub/update/${id}`, newData);

    const data = await response.data;

    return data;
  }
);

const userSlice = createSlice({
  name: 'chatApp/user',
  initialState: {},
  reducers:{
    updateChatProfile: (state, {payload}) => ({...state, payload}),
  },
  extraReducers: {
    [getUserData.fulfilled]: (state, action) => action.payload,
    [updateUserData.fulfilled]: (state, action) => action.payload,
  },
});

export const selectUser = ({ chatApp }) => chatApp.user;
export const {updateChatProfile} = userSlice.actions

export default userSlice.reducer;
