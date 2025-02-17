import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';

import axios from 'axios';

export const getCategory = createAsyncThunk(
  'crmApp/category/getCategory',
  async (categoryId) => {
    const response = await axios.get(`/category/${categoryId}`);
    const data = await response.data;
    return data;
  }
);

export const getCategories = createAsyncThunk(
  'crmApp/category/getCategories',
  async () => {
    const response = await axios.get('category');
    const data = await response.data;
    return data;
  }
);

export const addCategory = createAsyncThunk(
  'crmApp/category/addCategory',
  async (categoryData) => {
    const response = await axios.post('/category', categoryData);
    const data = await response.data;
    return data;
  }
);

export const updateCategory = createAsyncThunk(
  'crmApp/category/updateCategory',
  async (categoryData) => {
    const response = await axios.patch(
      `/category/${categoryData._id}`,
      categoryData
    );

    const data = await response.data;
    return data;
  }
);

export const deleteCategory = createAsyncThunk(
  'crmApp/category/deleteCategory',
  async (categoryIds) => {
    await axios.delete('category/', { data: categoryIds });

    return categoryIds;
  }
);

const categoryAdapter = createEntityAdapter({
  selectId: (category) => category._id,
});

const categorySlice = createSlice({
  name: 'crmApp/category',
  initialState: categoryAdapter.getInitialState({
    error: null,
    loadingFetch: true,
  }),
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addCategory.fulfilled, (state, action) => {
        categoryAdapter.addOne(state, action.payload.category);
      })
      .addCase(getCategories.pending, (state, action) => {
        state.loadingFetch = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        categoryAdapter.setAll(state, action.payload);
        state.loadingFetch = false;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.loadingFetch = false;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        categoryAdapter.updateOne(state, {
          id: action.payload.updatedCategory._id,
          changes: action.payload.updatedCategory,
        });
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        categoryAdapter.removeMany(state, action.payload);
      });
  },
});

export const categorySelector = categoryAdapter.getSelectors(
  (state) => state.crmApp.category
);

export const selectCategoryById = (state, id) => {
  return categorySelector.selectById(state, id);
};

export const selectCategories = (state) => {
  return state.crmApp.category;
};

export const selectLoadingFetch = ({ crmApp }) => crmApp.category.loadingFetch;

export default categorySlice.reducer;
