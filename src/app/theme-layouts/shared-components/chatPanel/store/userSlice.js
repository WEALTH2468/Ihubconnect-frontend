import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getPanelUserData = createAsyncThunk('chatPanel/user/getUserData', async () => {
  const response = await axios.get('/api/chat/user');

  const data = await response.data;

  return data;
});

export const updatePanelUserData = createAsyncThunk('chatPanel/user/updateUserData', async (newData) => {
  const response = await axios.post('/api/chat/user', newData);

  const data = await response.data;

  return data;
});

const userSlice = createSlice({
  name: 'chatPanel/user',
  initialState: null,
  extraReducers: {
    [getPanelUserData.fulfilled]: (state, action) => action.payload,
    [updatePanelUserData.fulfilled]: (state, action) => action.payload,
  },
});

export const { updateUserChatList } = userSlice.actions;

export const selectUser = ({ chatPanel }) => chatPanel.user;

export default userSlice.reducer;
