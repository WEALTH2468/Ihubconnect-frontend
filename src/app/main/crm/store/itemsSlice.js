import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';

export const getItem = createAsyncThunk(
  'crmApp/items/getItem',
  async (itemId) => {
    const response = await axios.get(`/api/ecommerce/items/${itemId}`);
    const data = await response.data;

    return data === undefined ? null : data;
  }
);

export const addItem = createAsyncThunk(
  'crmApp/items/addItem',
  async (itemData, { dispatch, getState }) => {
    const response = await axios.post(`items/`, itemData);

    const data = await response.data;

    return data;
  }
);

export const updateItem = createAsyncThunk(
  'crmApp/items/updateItem',
  async (formData, { dispatch, getState }) => {
    const response = await axios.patch(`items/${formData._id}`, formData);
    const data = await response.data;
    return data;
  }
);

export const getItems = createAsyncThunk('crmApp/items/getItems', async () => {
  const response = await axios.get('items/');
  const data = await response.data;

  return data;
});

export const removeItems = createAsyncThunk(
  'crmApp/items/removeItems',
  async (itemIds, { dispatch, getState }) => {
    await axios.delete('items/', { data: itemIds });

    return itemIds;
  }
);

const itemsAdapter = createEntityAdapter({
  selectId: (item) => item._id,
});

export const { selectAll: selectItems } = itemsAdapter.getSelectors(
  (state) => state.crmApp.items
);

const itemsSlice = createSlice({
  name: 'crmApp/items',
  initialState: itemsAdapter.getInitialState({
    error: null,
    loadingFetch: true,
    isFetched: false,
  }),
  extraReducers: (builder) => {
    builder
      .addCase(addItem.fulfilled, (state, action) => {
        itemsAdapter.addOne(state, action.payload.item);
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        itemsAdapter.updateOne(state, {
          id: action.payload.updatedItem._id,
          changes: action.payload.updatedItem,
        });
      })
      .addCase(removeItems.fulfilled, (state, action) => {
        itemsAdapter.removeMany(state, action.payload);
      })

      .addCase(getItems.pending, (state) => {
        state.loadingFetch = true;
        state.isFetched = true;
      })
      .addCase(getItems.rejected, (state, action) => {
        state.error = action.payload;
        state.loadingFetch = false;
      })
      .addCase(getItems.fulfilled, (state, action) => {
        itemsAdapter.setAll(state, action.payload);
        state.loadingFetch = false;
      });
  },
});

export const itemSelector = itemsAdapter.getSelectors(
  (state) => state.crmApp.items
);

export const selectItemById = (state, id) => {
  return itemSelector.selectById(state, id);
};

export const selectLoadingFetch = ({ crmApp }) => crmApp.items.loadingFetch;

export const selectIsFetched = ({ crmApp }) => crmApp.items.isFetched;

export default itemsSlice.reducer;
