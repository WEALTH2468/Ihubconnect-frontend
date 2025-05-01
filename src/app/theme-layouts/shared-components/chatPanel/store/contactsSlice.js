import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import axios from 'axios';
import { closeChatPanel } from './stateSlice';

export const getPanelContacts = createAsyncThunk(
  'chatPanel/contacts/getContacts',
  async (params) => {
    const response = await axios.get('/chat/contacts', { params });
    return response.data;
  }
);

const contactsAdapter = createEntityAdapter({
  selectId: (entity) => entity._id,
});

export const {
  selectAll: selectPanelContacts,
  selectById: selectPanelContactById,
} = contactsAdapter.getSelectors((state) => state.chatPanel.contacts);

const contactsSlice = createSlice({
  name: 'chatPanel/contacts',
  initialState: contactsAdapter.getInitialState({
    selectedPanelContactId: null,        // legacy single selection
    openPanelContactIds: [],             // currently opened panels
    disabledPanelContactIds: [],         // temporarily disabled (but still present)
    onlineUsers: {},
  }),
  reducers: {
    setSelectedContactId: (state, action) => {
      state.selectedPanelContactId = action.payload;
    },
    removeSelectedContactId: (state) => {
      state.selectedPanelContactId = null;
    },

    openChatPanelById: (state, action) => {
      const ids = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      const newList = [...state.openPanelContactIds];

      ids.forEach((id) => {
        if (!newList.includes(id)) {
          if (newList.length >= 3) {
            newList.shift(); // remove oldest
          }
          newList.push(id);
        }

        // Enable if it was disabled
        state.disabledPanelContactIds = state.disabledPanelContactIds.filter(
          (disabledId) => disabledId !== id
        );
      });

      state.openPanelContactIds = newList;
    },

    closeChatPanelById: (state, action) => {
      const id = action.payload;
      state.openPanelContactIds = state.openPanelContactIds.filter(
        (openId) => openId !== id
      );
      state.disabledPanelContactIds = state.disabledPanelContactIds.filter(
        (disabledId) => disabledId !== id
      );
    },

    // ✅ Temporarily disable without removing
    disableChatPanelById: (state, action) => {
      const id = action.payload;
      if (
        state.openPanelContactIds.includes(id) &&
        !state.disabledPanelContactIds.includes(id)
      ) {
        state.disabledPanelContactIds.push(id);
      }
    },

    // ✅ Re-enable (treat like open again)
    enableChatPanelById: (state, action) => {
      const id = action.payload;
      state.disabledPanelContactIds = state.disabledPanelContactIds.filter(
        (disabledId) => disabledId !== id
      );
    },

    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getPanelContacts.fulfilled, contactsAdapter.setAll);
    builder.addCase(closeChatPanel, (state) => {
      state.selectedPanelContactId = null;
      state.openPanelContactIds = [];
      state.disabledPanelContactIds = [];
    });
  },
});

export const {
  setOnlineUsers,
  setSelectedContactId,
  removeSelectedContactId,
  openChatPanelById,
  closeChatPanelById,
  disableChatPanelById,
  enableChatPanelById,
} = contactsSlice.actions;

// Selectors
export const selectSelectedPanelContactId = ({ chatPanel }) =>
  chatPanel.contacts.selectedPanelContactId;

export const selectOpenPanelContactIds = ({ chatPanel }) =>
  chatPanel.contacts.openPanelContactIds;

export const selectDisabledPanelContactIds = ({ chatPanel }) =>
  chatPanel.contacts.disabledPanelContactIds;

export const selectActivePanelContactIds = ({ chatPanel }) =>
  chatPanel.contacts.openPanelContactIds.filter(
    (id) => !chatPanel.contacts.disabledPanelContactIds.includes(id)
  );

export const selectOnlineUsers = ({ chatPanel }) =>
  chatPanel.contacts.onlineUsers;

export default contactsSlice.reducer;
