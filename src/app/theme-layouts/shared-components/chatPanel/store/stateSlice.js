import { createSlice } from '@reduxjs/toolkit';

const stateSlice = createSlice({
  name: 'chatPanel/state',
  initialState: {
    openPanelContactIds: [],
  },
  reducers: {
    openChatPanel: (state, action) => {
      const contactId = action.payload;
      if (!state.openPanelContactIds.includes(contactId)) {
        if (state.openPanelContactIds.length < 2) {
          state.openPanelContactIds.push(contactId);
        } else {
          // Replace the first one if more than 2 (optional logic)
          state.openPanelContactIds[0] = state.openPanelContactIds[1];
          state.openPanelContactIds[1] = contactId;
        }
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
        state.openPanelContactIds = state.openPanelContactIds.filter(
          (id) => id !== contactId
        );
      } else {
        if (state.openPanelContactIds.length < 2) {
          state.openPanelContactIds.push(contactId);
        }
      }
    },
    closeAllChatPanels: (state) => {
      state.openPanelContactIds = [];
    },
  },
});

export const {
  openChatPanel,
  closeChatPanel,
  toggleChatPanel,
  closeAllChatPanels,
} = stateSlice.actions;

export const selectOpenPanelContactIds = ({ chatPanel }) =>
  chatPanel.state.openPanelContactIds;

export const selectChatPanelState = ({ chatPanel }) =>
  chatPanel.state.openPanelContactIds.length > 0;

export default stateSlice.reducer;
