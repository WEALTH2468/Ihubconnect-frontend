import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { showMessage } from 'app/store/fuse/messageSlice';
import FuseUtils from '@fuse/utils';

export const getAllUsers = createAsyncThunk(
  'userApp/settings/getAllUsers',
  async (_, { getState }) => {
    const response = await axios.get('/ihub/users/all');
    const data = await response.data;
    return { data };
  }
);

export const updateLogo = createAsyncThunk(
  'settings/updateLogo',
  async ({ formData, dispatch }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/settings/company`, formData);
      dispatch(
        showMessage({
          message: 'Company info updated Successfully',
          variant: 'success',
        })
      );
      return response.data;
    } catch (error) {
      dispatch(
        showMessage({
          message: 'Action Failed',
          variant: 'error',
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const getLogo = createAsyncThunk(
  'settings/getLogo',
  async (_, { rejectWithValue }) => {
    // Added an underscore (_) to indicate no parameters are expected
    try {
      const response = await axios.get(`/settings/company`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const selectSearchText = ({ usersApp }) => usersApp.settings.searchText;

const settingsAdapter = createEntityAdapter({
  selectId: (user) => user._id,
});
export const { selectAll: selectAllUsers, selectById: selectUsersById } =
  settingsAdapter.getSelectors((state) => state.usersApp.settings);

const initialState = {
  searchText: '',
  company: null,
  error: null, // Add error state to handle errors centrally
  loading: false, // Add loading state to handle loading states centrally
};

const settingsSlice = createSlice({
  name: 'usersApp/settings',
  initialState: settingsAdapter.getInitialState(initialState),
  reducers: {
    setUsersSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: event.target.value || '' }),
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLogo.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(updateLogo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getLogo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLogo.fulfilled, (state, action) => {
        state.loading = false;
        state.company = action.payload;
      })
      .addCase(getLogo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        const { data, routeParams } = action.payload;
        settingsAdapter.setAll(state, data);
        state.searchText = '';
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export const { setUsersSearchText } = settingsSlice.actions;

export const selectFilteredUsers = createSelector(
  [selectAllUsers, selectSearchText],
  (users, searchText) => {
    if (searchText.length === 0) {
      return users;
    }
    return FuseUtils.filterArrayByString(users, searchText);
  }
);

export const selectGroupedFilteredUsers = createSelector(
  [selectFilteredUsers],
  (users) => {
    return users
      .sort((a, b) =>
        (a.firstName || a.displayName)?.localeCompare(
          b.firstName || b.displayName,
          'es',
          { sensitivity: 'base' }
        )
      )
      .reduce((r, e) => {
        // get first letter of displayName of current element
        const group = e.firstName ? e.firstName[0] : e.displayName[0];
        // if there is no property in accumulator with this letter create it
        if (!r[group]) r[group] = { group, children: [e] };
        // if there is push current element to children array for that letter
        else r[group].children.push(e);
        // return accumulator
        return r;
      }, {});
  }
);

export const selectCompanyProfile = (state) => state.companyProfile.company;
export default settingsSlice.reducer;
