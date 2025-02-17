import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

import axios from 'axios';

export const getChats = createAsyncThunk('chatApp/chats/getChats', async (params) => {
  const response = await axios.get('/chat/', { params });
  const data = await response.data;

  return data;
});

const chatsAdapter = createEntityAdapter({ selectId: (entity) => entity._id });

export const { selectAll: selectChats, selectById: selectChatById } = chatsAdapter.getSelectors(
  (state) => state.chatApp.chats
);

const chatsSlice = createSlice({
  name: 'chatApp/chats',
  initialState: chatsAdapter.getInitialState(),
  extraReducers: {
    [getChats.fulfilled]: chatsAdapter.setAll,
  },
});

export default chatsSlice.reducer;
