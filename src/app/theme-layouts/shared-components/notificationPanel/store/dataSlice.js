import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { userLoggedOut } from 'app/store/userSlice';
import axios from 'axios';

export const getNotifications = createAsyncThunk('notificationPanel/getData', async (receiverId) => {
  const response = await axios.get(`/notifications/${receiverId}`);
  const data = await response.data;

  return data;
});

export const dismissAll = createAsyncThunk('notificationPanel/dismissAll', async (receiverId) => {
  const response = await axios.delete(`/notifications/dismissAll/${receiverId}`);
  await response.data;

  return true;
});

export const dismissItem = createAsyncThunk('notificationPanel/dismissItem', async (id) => {
  const response = await axios.delete(`/notifications/dismissItem/${id}`);
  await response.data;

  return id;
});

export const addNotification = createAsyncThunk(
  'notificationPanel/addNotification',
  async (item) => {
    const response = await axios.post(`/notifications`, item);
    const data = await response.data;

    return data;
  }
);

const notificationsAdapter = createEntityAdapter({selectId: (entity) => entity._id});

const initialState = notificationsAdapter.upsertMany(notificationsAdapter.getInitialState(), []);

export const { selectAll: selectNotifications, selectById: selectNotificationsById } =
  notificationsAdapter.getSelectors((state) => state.notificationPanel.data);

const dataSlice = createSlice({
  name: 'notificationPanel/data',
  initialState,
  reducers: {},
  extraReducers: {
    [dismissItem.fulfilled]: (state, action) =>
      notificationsAdapter.removeOne(state, action.payload),
    [dismissAll.fulfilled]: (state, action) => notificationsAdapter.removeAll(state),
    [getNotifications.fulfilled]: (state, action) =>
      notificationsAdapter.addMany(state, action.payload),
    [addNotification.fulfilled]: (state, action) =>
      notificationsAdapter.addOne(state, action.payload),
    [userLoggedOut]: (state, action) => notificationsAdapter.removeAll(state),
  },
});

export default dataSlice.reducer;
