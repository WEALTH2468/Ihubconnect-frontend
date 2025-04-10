import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import FuseUtils from '@fuse/utils/FuseUtils';
import { userLoggedOut } from 'app/store/userSlice';
import { updateUser } from './userSlice';

export const getUsers = createAsyncThunk(
  'userApp/users/getUsers',
  async (id, { getState }) => {
    const response = await axios.get(`/ihub/users/${id}`);
    const data = await response.data;
    return { data };
  }
);

const usersAdapter = createEntityAdapter({
  selectId: (user) => user._id,
});

export const selectSearchText = ({ usersApp }) => usersApp.users.searchText;

export const { selectAll: selectUsers, selectById: selectUsersById } =
  usersAdapter.getSelectors((state) => state.usersApp.users);

export const selectFilteredUsers = createSelector(
  [selectUsers, selectSearchText],
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

const usersSlice = createSlice({
  name: 'usersApps/users',
  initialState: usersAdapter.getInitialState({
    searchText: '',
  }),
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
      .addCase(getUsers.fulfilled, (state, action) => {
        const { data, routeParams } = action.payload;
        usersAdapter.setAll(state, data);
        state.searchText = '';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        usersAdapter.updateOne(state, {
          id: action.payload.updatedUser?._id,
          changes: action.payload.updatedUser,
        });
      });
    // [userLoggedOut]: (state, action) => {
    //     const { data, routeParams } = action.payload;
    //     usersAdapter.removeAll(state)
    //     state.searchText = '';
    // },
  },
});

export const { setUsersSearchText } = usersSlice.actions;
// export const selectAllUsers = ({ usersApp }) => usersApp.users;

export const selectAllUsers = usersAdapter.getSelectors(
  (state) => state.usersApp.users
);
export default usersSlice.reducer;
