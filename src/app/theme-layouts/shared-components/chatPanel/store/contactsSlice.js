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
    selectedPanelContactId: null, // legacy single selection
    openPanelContactIds: [], // new multi-panel support
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
          if (newList.length >= 2) {
            newList.shift(); // remove first (oldest)
          }
          newList.push(id);
        }
      });

      state.openPanelContactIds = newList;
    },
    closeChatPanelById: (state, action) => {
      state.openPanelContactIds = state.openPanelContactIds.filter(
        (id) => id !== action.payload
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
    });
  },
});

export const {
  setOnlineUsers,
  setSelectedContactId,
  removeSelectedContactId,
  openChatPanelById,
  closeChatPanelById,
} = contactsSlice.actions;

// Old selector — still usable
export const selectSelectedPanelContactId = ({ chatPanel }) =>
  chatPanel.contacts.selectedPanelContactId;

// ✅ New selectors
export const selectOpenPanelContactIds = ({ chatPanel }) =>
  chatPanel.contacts.openPanelContactIds;

export const selectOnlineUsers = ({ chatPanel }) =>
  chatPanel.contacts.onlineUsers;

export default contactsSlice.reducer;



