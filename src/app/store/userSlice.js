/* eslint import/no-extraneous-dependencies: off */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import history from '@history';
import _ from '@lodash';
import { setInitialSettings } from 'app/store/fuse/settingsSlice';
import { showMessage } from 'app/store/fuse/messageSlice';
import settingsConfig from 'app/configs/settingsConfig';
import jwtService from '../auth/services/jwtService';
import { getUsers } from '../main/settings/users/store/usersSlice';
import { getLogo } from '../main/settings/users/store/settingsSlice';
import { getDepartments, getUnits } from '../store/settingsSlice';
import { getRoles } from '../store/roleSlice';
import { updateUser } from '../main/settings/users/store/userSlice';
import axios from 'axios';
import { getContacts } from '../main/chat/store/contactsSlice';

export const getUser = createAsyncThunk(
  'user/getUser',
  async (id, { dispatch, getState }) => {
    const response = await axios.get(`/ihub/users/${id}`);
    return response.data;
  }
);

export const getBirthdayUsers = createAsyncThunk(
  'user/getBirthdayUsers',
  async () => {
    const response = await axios.get('/ihub/users/birthdays');
    return response.data; // { todayBirthdays: [...], upcomingBirthdays: [...], pastBirthdays: [...] }
  }
);

export const setUser = createAsyncThunk(
  'user/setUser',
  async (user, { dispatch, getState }) => {
    /*
    You can redirect the logged-in user to a specific route depending on his role
    */
    dispatch(getUsers());
    dispatch(getDepartments());
    dispatch(getUnits());
    dispatch(getRoles());
    dispatch(getLogo());
    dispatch(getContacts());

    if (user.loginRedirectUrl) {
      settingsConfig.loginRedirectUrl = user.loginRedirectUrl; // for example 'apps/academy'
    }

    return user;
  }
);

export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('/ihub/forgetpassword', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `/ihub/reset-password/${formData.token}`,
        formData
      );
      console.log('response: ', response);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateUserSettings = createAsyncThunk(
  'user/updateSettings',
  async (settings, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = _.merge({}, user, { data: { settings } });

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const updateUserShortcuts = createAsyncThunk(
  'user/updateShortucts',
  async (shortcuts, { dispatch, getState }) => {
    const { user } = getState();
    const newUser = {
      ...user,
      data: {
        ...user.data,
        shortcuts,
      },
    };

    dispatch(updateUserData(newUser));

    return newUser;
  }
);

export const logoutUser = () => async (dispatch, getState) => {
  const { user } = getState();
  if (!user.role || user.role.length === 0) {
    // is guest
    return null;
  }

  history.push({
    pathname: '/',
  });
  dispatch(setInitialSettings());

  return dispatch(userLoggedOut());
};

export const getRandomUserAvatars = createAsyncThunk(
  'user/getRandomUserAvatars',
  async () => {
    try {
      const response = await axios.get('/ihub/getRandomUserAvatars');
      return response.data.avatars || [];
    } catch (error) {
      console.error("Error fetching avatars:", error);
      throw error; // Ensures error is properly caught in `extraReducers`
    }
  }
);

export const updateUserData = (data) => async (dispatch, getState) => {
  // if (!user.role || user.role.length === 0) {
  //   // is guest
  //   return;
  // }
  jwtService
    .updateUserData(data)
    .then((user) => {
      const { updatedUser, message } = user.data;

      if (updatedUser.newPassword) {
        return dispatch(userLoggedOut());
      }

      dispatch(setUser(updatedUser));

      dispatch(showMessage({ variant: 'success', message }));

      history.push({
        pathname: '/',
      });
    })
    .catch((error) => {
      console.log(error);
      dispatch(showMessage({ message: error.response.data[0].message }));
    });
};


const initialState = {
  role: [],
  displayName: 'John Doe',
  photoURL: 'assets/images/avatars/brian-hughes.jpg',
  email: 'johndoe@withinpixels.com',
  shortcuts: ['apps.calendar', 'apps.mailbox', 'apps.contacts', 'apps.tasks'],
  isLoading: false,
  socket: null,
  randomUserAvatars: [],
  todayBirthdays: [],
  upcomingBirthdays: [],
  pastBirthdays: [],
};


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLoggedOut: (state, action) => initialState,
  },
  extraReducers: {
    [updateUserSettings.fulfilled]: (state, action) => action.payload,
    [updateUserShortcuts.fulfilled]: (state, action) => action.payload,
    [setUser.fulfilled]: (state, action) => action.payload,
    [getUser.fulfilled]: (state, action) => action.payload,
    [forgotPassword.fulfilled]: (state, action) => action.payload,
    [forgotPassword.rejected]: (state, action) => {
      state.error = action.payload?.message || 'Failed to reset password';
  },

  [getBirthdayUsers.fulfilled]: (state, action) => {
    state.todayBirthdays = action.payload.todayBirthdays;
    state.upcomingBirthdays = action.payload.upcomingBirthdays;
    state.pastBirthdays = action.payload.pastBirthdays;
  },
  
    [resetPassword.fulfilled]: (state, action) => action.payload,
    [updateUserData.pending]: (state, action) => {
      console.log('pending');
      state.user.isLoading = true;
    },
    [getRandomUserAvatars.fulfilled]: (state, action) => {
      state.randomUserAvatars = action.payload;
    },
    [updateUserData.fulfilled]: (state, action) => {
      console.log('fulfilled');
      console.log({ state });
      state.user.isLoading = false;
    },
  },
});

export const selectIsLoading = (state) => state.user.isLoading;

export const { userLoggedOut } = userSlice.actions;

export const selectUser = ({ user }) => user;

export const selectUserShortcuts = ({ user }) => user.data.shortcuts;

export default userSlice.reducer;
