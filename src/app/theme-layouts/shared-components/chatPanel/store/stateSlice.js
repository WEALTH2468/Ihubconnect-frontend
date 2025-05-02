import { createSlice } from '@reduxjs/toolkit';

const MAX_OPEN_PANELS = 3; // 👈 easy to change in future if you want 4, 5, etc

const stateSlice = createSlice({
  name: 'chatPanel/state',
  initialState: {
    openPanelContactIds: [],
  },
  reducers: {
    openChatPanel: (state, action) => {
      const contactId = action.payload;
      if (!state.openPanelContactIds.includes(contactId)) {
        if (state.openPanelContactIds.length >= MAX_OPEN_PANELS) {
          state.openPanelContactIds.shift(); // Remove the oldest one
        }
        state.openPanelContactIds.push(contactId);
      }
    },
    closeChatPanel: (state, action) => {
      const contactId = action.payload;
      state.openPanelContactIds = state.openPanelContactIds.filter(
        (id) => id !== contactId
      );
    },
    toggleChatPanel: (state, action) => {
      const contactId = action.payload;
      if (state.openPanelContactIds.includes(contactId)) {
        // Close it if already open
        state.openPanelContactIds = state.openPanelContactIds.filter(
          (id) => id !== contactId
        );
      } else {
        // Open it
        if (state.openPanelContactIds.length >= MAX_OPEN_PANELS) {
          state.openPanelContactIds.shift();
        }
        state.openPanelContactIds.push(contactId);
      }
    },
    closeAllChatPanels: (state) => {
      state.openPanelContactIds = [];
    },
  },
});

// Actions
export const {
  openChatPanel,
  closeChatPanel,
  toggleChatPanel,
  closeAllChatPanels,
} = stateSlice.actions;

// Selectors
export const selectOpenPanelContactIds = ({ chatPanel }) =>
  chatPanel.state.openPanelContactIds;

export const selectChatPanelState = ({ chatPanel }) =>
  chatPanel.state.openPanelContactIds.length > 0;

export default stateSlice.reducer;
