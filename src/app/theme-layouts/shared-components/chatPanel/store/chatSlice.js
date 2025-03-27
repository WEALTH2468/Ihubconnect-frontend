import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { closeChatPanel } from './stateSlice';

export const getPanelChat = createAsyncThunk(
  'chatPanel/chat/getPanelChat',
  async (contactId, { dispatch, getState }) => {
    const response = await axios.get(`/chat/messages/${contactId}`);
    const data = await response.data;
    return data;
  }
);

export const isRead = createAsyncThunk(
  'chatPanel/chat/isRead',
  async (contactId, { dispatch, getState }) => {
    const response = await axios.patch(`/chat/isRead/${contactId}`);
    const data = await response.data;
    return data;
  }
);

export const sendPanelMessage = createAsyncThunk(
  'chatPanel/chat/sendMessage',
  async ({ messageText, chatId, contactId, subject, avatar, link }, { dispatch, getState }) => {
    const { data } = await axios.post(`/chat/send/${contactId}`, {
      messageText,
      subject,
      avatar,
      link,
    });
    return data;
  }
);

const chatSlice = createSlice({
  name: 'chatPanel/chat',
  initialState: [],
  
  reducers: {
    removeChat: () => [],
    
    addPanelMessage: (state, action) => {
      const tempMessage = action.payload;

      // Prevent duplicate temp messages
      return state.some((msg) => msg._id === tempMessage._id)
        ? state
        : [...state, tempMessage];
    },
    

    updatePanelMessage: (state, action) => {
      const { tempId, realMessage, status } = action.payload;
      const index = state.findIndex((msg) => msg._id === tempId);

      if (index !== -1) {
        if (realMessage) {
          state[index] = realMessage; // Replace temp message with real one
        } else if (status) {
          state[index].status = status; // Mark message as failed
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getPanelChat.fulfilled, (state, action) => action.payload);
    
    // builder.addCase(sendPanelMessage.fulfilled, (state, { payload }) => {
    //   return payload.chat ? [...state, payload.message] : [...state, payload];
    // });

    builder.addCase(closeChatPanel, () => []);
  },
});

export const { removeChat, addPanelMessage, updatePanelMessage } = chatSlice.actions;

export const selectPanelChat = ({ chatPanel }) => chatPanel.chat;

export default chatSlice.reducer;
