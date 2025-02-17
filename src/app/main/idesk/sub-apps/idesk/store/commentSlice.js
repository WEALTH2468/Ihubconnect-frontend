import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { showMessage } from "app/store/fuse/messageSlice";
import axios from 'axios';

export const addComment = createAsyncThunk(
    "IdeskApp/comments/addComment",
    async (comment, {dispatch,getState})=>{
        const response = await axios.post('/comments', comment);
        const {newComment, message}= await response.data;
        dispatch(showMessage({ message }));
        return newComment;
    }
);


export const selectComment = ({ IdeskApp }) => IdeskApp.comment;

const commentSlice = createSlice({
    name:'IdeskApp/comments',
    initialState:null,
    reducers:{
        resetComment: () => null,
    },
    extraReducers:{
       
       
    }
});

export const deleteComment = createAsyncThunk(
    'IdeskApp/comments/deleteComment',
    async(id,{dispatch,getState})=>{
        const response = await axios.delete(`/comments/${id}`);
       const { deletedComment, message } = await response.data;
        dispatch(showMessage({ message }));

        return deletedComment;
    }
);

export const {resetComment} = commentSlice.actions;

export default commentSlice.reducer;