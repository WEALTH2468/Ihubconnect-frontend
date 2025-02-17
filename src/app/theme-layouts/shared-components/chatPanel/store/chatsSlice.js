import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  current,
} from '@reduxjs/toolkit';

import axios from 'axios';
import { update } from 'lodash';
import ContactSidebar from 'src/app/main/chat/sidebars/contact/ContactSidebar';

export const getPanelChats = createAsyncThunk(
  'chatPanel/chats/getPanelChats',
  async (params) => {
    const response = await axios.get('/chat/', { params });
    const data = await response.data;
    return data;
  }
);

const chatsAdapter = createEntityAdapter({ selectId: (entity) => entity._id });

export const { selectAll: selectPanelChats, selectById: selectChatById } =
  chatsAdapter.getSelectors((state) => state.chatPanel.chats);

const chatsSlice = createSlice({
  name: 'chatPanel/chats',
  initialState: chatsAdapter.getInitialState(),
  reducers: {
    clearCount: (state, { payload }) => {
      const chats = current(state);
      const chat = chats.entities[payload];
      chatsAdapter.updateOne(state, {
        id: payload,
        changes: {
          ...chat,
          unreadCount: 0
        }
      });
    },
    addPanelChat: (state, { payload }) => {
      const newChatId = payload._id;
      state.ids.unshift(newChatId);
      state.entities[newChatId] = payload;
    },
    addPanelChatAndCount: (state, { payload }) => {
      const newChatId = payload._id;
      state.ids.unshift(newChatId);
      state.entities[newChatId] = { ...payload, unreadCount: 1 };
    },
    updatePanelChat: (state, { payload }) => {
      const chats = current(state);
      const chat = chats.entities[payload.chatId];
      chatsAdapter.updateOne(state, {
        id: payload.chatId,
        changes: {
          ...chat,
          lastMessage: payload.content,
          lastMessageAt: payload.createdAt,
          unreadCount: 0
        }
      });
    },
    updatePanelChatAndCount: (state, { payload }) => {
      const chats = current(state);
      const chat = chats.entities[payload.chatId];
      chatsAdapter.updateOne(state, {
        id: payload.chatId,
        changes: {
          ...chat,
          lastMessage: payload.content,
          lastMessageAt: payload.createdAt,
          unreadCount: chat.unreadCount + 1,
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPanelChats.fulfilled, chatsAdapter.setAll);
  },
});

export const { updatePanelChat, updatePanelChatAndCount, addPanelChatAndCount, addPanelChat, clearCount} =
  chatsSlice.actions;

export default chatsSlice.reducer;
