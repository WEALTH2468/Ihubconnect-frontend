import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getTags = createAsyncThunk(
  'usersApp/tags/getTags',
  async (params, { getState }) => {
    const response = await axios.get('/api/contacts/tags');

    const data = await response.data;
    return data;
  }
);

const tagsAdapter = createEntityAdapter({});

export const { selectAll: selectTags, selectById: selectTagsById } = tagsAdapter.getSelectors(
  (state) => state.usersApp.tags
);

const tagsSlice = createSlice({
  name: 'usersApp/tags',
  initialState: tagsAdapter.getInitialState([]),
  reducers: {},
  extraReducers: {
    [getTags.fulfilled]: tagsAdapter.setAll,
  },
});

export default tagsSlice.reducer;
