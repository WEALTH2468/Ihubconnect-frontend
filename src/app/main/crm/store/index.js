import { combineReducers } from '@reduxjs/toolkit';
import customers from './customersSlice';
import quotes from './quotesSlice';
import items from './itemsSlice';
import category from './categorySlice';

const reducer = combineReducers({
  customers,
  quotes,
  items,
  category,
});

export default reducer;
