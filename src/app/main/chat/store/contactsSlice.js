import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getContacts = createAsyncThunk('chatApp/contacts/getContacts', async (params) => {
  const response = await axios.get('/chat/contacts', { params });
  const data = await response.data;
  return data;
});

const contactsAdapter = createEntityAdapter({ selectId: (entity) => entity._id });

export const { selectAll: selectContacts, selectById: selectContactById} =
  contactsAdapter.getSelectors((state) => state.chatApp.contacts);

const contactsSlice = createSlice({
  name: 'chatApp/contacts',
  initialState: contactsAdapter.getInitialState({
    selectedContactId: null,
  }),
  reducers: {
    setSelectedContactId: (state, action) => {
      state.selectedContactId = action.payload;
    },
    removeSelectedContactId: (state, action) => {
      state.selectedContactId = null;
    },
    updateStatus: (state, { payload }) => {
      contactsAdapter.updateOne(state, {
          id: payload.userId,
          changes: {
              status:payload.status
          },
      });
  }
  },
  extraReducers: (builder) => {
    builder.addCase(getContacts.fulfilled, contactsAdapter.setAll)
  },
});

export const selectSelectedContactId = ({ chatApp }) =>
  chatApp.contacts.selectedContactId;

export const { updateStatus, setSelectedContactId, removeSelectedContactId } = contactsSlice.actions

export default contactsSlice.reducer;
