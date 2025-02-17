import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';

export const getCustomer = createAsyncThunk(
  'crmApp/customer/getCustomer',
  async (customerId) => {
    const response = await axios.get(`/api/ecommerce/customers/${customerId}`);
    const data = await response.data;

    return data === undefined ? null : data;
  }
);

export const addCustomer = createAsyncThunk(
  'crmApp/customer/addCustomer',
  async (customerData, { dispatch, getState }) => {
    const response = await axios.post(`customers/`, customerData);

    const data = await response.data;

    return data;
  }
);

export const updateCustomer = createAsyncThunk(
  'crmApp/customer/updateCustomer',
  async ({ formData, id }, { dispatch, getState }) => {
    const response = await axios.patch(`customers/${id}`, formData);
    const data = await response.data;
    return data;
  }
);

export const getCustomers = createAsyncThunk(
  'crmApp/customers/getCustomers',
  async () => {
    const response = await axios.get('customers');
    const data = await response.data;

    return data;
  }
);

export const removeCustomers = createAsyncThunk(
  'crmApp/customers/removeCustomers',
  async (customerIds, { dispatch, getState }) => {
    await axios.delete('customers/', { data: customerIds });

    return customerIds;
  }
);

export const removeContacts = createAsyncThunk(
  'crmApp/customers/removeContacts',
  async ({ contactIds, customerId }) => {
    const response = await axios.delete(`customers/contacts/${customerId}`, {
      data: contactIds,
    });
    const data = await response.data;
    return data;
  }
);

const customersAdapter = createEntityAdapter({
  selectId: (customer) => customer._id,
});

export const { selectAll: selectCustomers } = customersAdapter.getSelectors(
  (state) => state.crmApp.customers
);

const customersSlice = createSlice({
  name: 'crmApp/customers',
  initialState: customersAdapter.getInitialState({
    // searchText: '',
    error: null,
    loadingFetch: true,
    isFetched: false,
  }),
  // reducers: {
  //   setCustomersSearchText: {
  //     reducer: (state, action) => {
  //       state.searchText = action.payload;
  //     },
  //     prepare: (event) => ({ payload: event.target.value || '' }),
  //   },
  // },
  extraReducers: (builder) => {
    builder
      .addCase(addCustomer.fulfilled, (state, action) => {
        customersAdapter.addOne(state, action.payload.customer);
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        customersAdapter.updateOne(state, {
          id: action.payload.updatedCustomer._id,
          changes: action.payload.updatedCustomer,
        });
      })
      .addCase(removeCustomers.fulfilled, (state, action) => {
        customersAdapter.removeMany(state, action.payload);
      })
      .addCase(removeContacts.fulfilled, (state, action) => {
        customersAdapter.updateOne(state, {
          id: action.payload.updatedCustomer._id,
          changes: action.payload.updatedCustomer,
        });
      })
      .addCase(getCustomers.pending, (state) => {
        state.loadingFetch = true;
        state.isFetched = true;
      })
      .addCase(getCustomers.rejected, (state, action) => {
        state.error = action.payload;
        state.loadingFetch = false;
      })
      .addCase(getCustomers.fulfilled, (state, action) => {
        customersAdapter.setAll(state, action.payload);
        state.loadingFetch = false;
      });
  },
});

export const { setCustomersSearchText } = customersSlice.actions;

export const selectCustomersSearchText = ({ crmApp }) =>
  crmApp.customers.searchText;

export const customerSelector = customersAdapter.getSelectors(
  (state) => state.crmApp.customers
);

export const selectCustomerById = (state, id) => {
  return customerSelector.selectById(state, id);
};

export const selectLoadingFetch = ({ crmApp }) => crmApp.customers.loadingFetch;

export const selectIsFetched = ({ crmApp }) => crmApp.customers.isFetched;

export default customersSlice.reducer;
