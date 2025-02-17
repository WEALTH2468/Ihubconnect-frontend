import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { getLogo } from '../../settings/users/store/settingsSlice';

export const getQuote = createAsyncThunk(
  'crmApp/quote/getQuote',
  async (quoteId) => {
    const response = await axios.get(`/api/ecommerce/quotes/${quoteId}`);
    const data = await response.data;

    return data === undefined ? null : data;
  }
);

export const addQuote = createAsyncThunk(
  'crmApp/quote/addQuote',
  async (quoteData, { dispatch, getState }) => {
    const response = await axios.post(`quotes/`, quoteData);

    const data = await response.data;

    return data;
  }
);

export const updateQuote = createAsyncThunk(
  'crmApp/quote/updateQuote',
  async (formData, { dispatch, getState }) => {
    const response = await axios.patch(`quotes/${formData._id}`, formData);
    const data = await response.data;
    return data;
  }
);

export const removeQuotes = createAsyncThunk(
  'crmApp/quote/removeQuotes',
  async (quoteIds, { dispatch, getState }) => {
    await axios.delete('quotes/', { data: quoteIds });

    return quoteIds;
  }
);

export const getQuotes = createAsyncThunk(
  'crmApp/quotes/getQuotes',
  async () => {
    const response = await axios.get('quotes');
    const data = await response.data;

    return data;
  }
);

export const getUsers = createAsyncThunk('crmApp/quotes/getUsers', async () => {
  const response = await axios.get(`/ihub/users/${id}`);
  const data = await response.data;
  return data;
});

const quotesAdapter = createEntityAdapter({
  selectId: (group) => group._id,
});

export const { selectAll: selectQuotes } = quotesAdapter.getSelectors(
  (state) => state.crmApp.quotes
);

const quotesSlice = createSlice({
  name: 'crmApp/quotes',
  initialState: quotesAdapter.getInitialState({
    hasUpdatedTerms: false,
    error: null,
    loadingFetch: true,
    isFetched: false,
    hasUpdatedTable: false,
    logo: null,
    users: [],
  }),
  reducers: {
    setHasUpdatedTerms: (state, action) => {
      state.hasUpdatedTerms = action.payload;
    },
    setHasUpdatedTable: (state, action) => {
      state.hasUpdatedTable = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addQuote.fulfilled, (state, action) => {
        quotesAdapter.addOne(state, action.payload.quote);
      })
      .addCase(getLogo.fulfilled, (state, action) => {
        state.logo = action.payload;
      })
      .addCase(removeQuotes.fulfilled, (state, action) => {
        quotesAdapter.removeMany(state, action.payload);
      })
      .addCase(updateQuote.fulfilled, (state, action) => {
        quotesAdapter.updateOne(state, {
          id: action.payload.updatedQuote._id,
          changes: action.payload.updatedQuote,
        });
      })

      .addCase(getQuotes.pending, (state) => {
        state.loadingFetch = true;
        state.isFetched = true;
      })
      .addCase(getQuotes.rejected, (state, action) => {
        state.error = action.payload;
        state.loadingFetch = false;
      })
      .addCase(getQuotes.fulfilled, (state, action) => {
        quotesAdapter.setAll(state, action.payload);
        state.loadingFetch = false;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  },
});

export const quoteSelector = quotesAdapter.getSelectors(
  (state) => state.crmApp.quotes
);

export const { setHasUpdatedTerms, setHasUpdatedTable } = quotesSlice.actions;

export const selectQuoteById = (state, id) => {
  return quoteSelector.selectById(state, id);
};

export const selectUsers = ({ crmApp }) => crmApp.quotes.users;
export const selectLoadingFetch = ({ crmApp }) => crmApp.quotes.loadingFetch;

export const selectIsFetched = ({ crmApp }) => crmApp.quotes.isFetched;

export const selectHasUpdatedTerms = ({ crmApp }) =>
  crmApp.quotes.hasUpdatedTerms;

export const selectHasUpdatedTable = ({ crmApp }) =>
  crmApp.quotes.hasUpdatedTable;

export default quotesSlice.reducer;
