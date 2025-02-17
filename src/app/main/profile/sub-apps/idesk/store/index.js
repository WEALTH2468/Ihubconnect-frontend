import { combineReducers } from "@reduxjs/toolkit";
import posts from "./postSlice";
import comments from "./commentSlice";

const reducer = combineReducers({
   posts,
   comments,
  });
  
  export default reducer;