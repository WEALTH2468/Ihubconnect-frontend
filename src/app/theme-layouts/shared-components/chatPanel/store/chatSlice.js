import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { closeChatPanel } from './stateSlice';

export const getPanelChat = createAsyncThunk(
  'chatPanel/chat/getPanelChat',
  async (contactId, { dispatch, getState }) => {
    const response = await axios.get(`/chat/messages/${contactId}`);
    const data = await response.data;
    return { contactId, messages: data };
  }
);

export const isRead = createAsyncThunk(
  'chatPanel/chat/isRead',
  async (contactId, { dispatch, getState }) => {
    const response = await axios.patch(`/chat/isRead/${contactId}`);
    return response.data;
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
    return { contactId, message: data };
  }
);

const chatSlice = createSlice({
  name: 'chatPanel/chat',
  initialState: {},

  reducers: {
    removeChat: (state, action) => {
      if (action.payload) {
        // remove specific chat
        delete state[action.payload];
      } else {
        // if no id, clear all
        return {};
      }
    },

    addPanelMessage: (state, action) => {
      const { contactId, tempMessage } = action.payload;

      if (!state[contactId]) {
        state[contactId] = [];
      }

      // Prevent duplicate temp messages
      const exists = state[contactId]?.some((msg) => msg?._id === tempMessage?._id);
      if (!exists) {
        state[contactId]?.push(tempMessage);
      }
    },

    updatePanelMessage: (state, action) => {
      const { contactId, tempId, realMessage, status } = action.payload;

      if (!state[contactId]) return;

      const index = state[contactId].findIndex((msg) => msg._id === tempId);

      if (index !== -1) {
        if (realMessage) {
          state[contactId][index] = realMessage; // Replace temp message
        } else if (status) {
          state[contactId][index].status = status; // Just update status
        }
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(getPanelChat.fulfilled, (state, action) => {
      const { contactId, messages } = action.payload;
      state[contactId] = messages;
    });

    builder.addCase(closeChatPanel, (state, action) => {
      if (action.payload) {
        // Close specific panel
        delete state[action.payload];
      } else {
        // No payload, close all
        return {};
      }
    });
  },
});

export const { removeChat, addPanelMessage, updatePanelMessage } = chatSlice.actions;

export const selectPanelChat = ({ chatPanel }, contactId) =>
  chatPanel.chat[contactId] || [];

export default chatSlice.reducer;
