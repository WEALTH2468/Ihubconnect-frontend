import { createAsyncThunk, createSlice,createEntityAdapter} from "@reduxjs/toolkit";
import axios from 'axios';
import history from '@history';
import { showMessage } from "app/store/fuse/messageSlice";
// import { emitRefreshPost } from "src/app/websocket/socket";



export const getPosts = createAsyncThunk(
    'ideskApp/posts/getPosts',
    async(_, {dispatch})=>{
        const response = await axios.get('/posts');
        const data = await response.data;

        return data;

    }
); 

const postsAdapter = createEntityAdapter({selectId: (entity) => entity._id});

export const SelectPosts = postsAdapter.getSelectors(
    state => state.IdeskApp.posts
);

const postSlice = createSlice({
    name:'ideskApp/posts',
    initialState: postsAdapter.getInitialState({loading:false}),
    reducers: {
        setPosts: postsAdapter.setAll,
        addPost: postsAdapter.addOne,
        deletePost: postsAdapter.removeOne,
        updatePost: postsAdapter.updateOne,
    },
    extraReducers:{
        [getPosts.pending]:(state)=>{
            state.loading = true;
        },
        [getPosts.fulfilled]:(state, action)=>{
            const data = action.payload;
            postsAdapter.setAll(state,data);
        },
        [getPosts.rejected]:(state)=>{
            state.loading = false;
        },
    },
    
});


export const addPost = createAsyncThunk(
    "IdeskApp/posts/addPost",
    async (postData,{dispatch, getState})=>{
        
        // const { WebSocket:{ socket:{ connection } } } = getState()

        const response = await axios.post('/posts', postData);
        const data = await response.data;
        // emitRefreshPost()

        return data;
    }
);

export const updatePost = createAsyncThunk(
    'IdeskApp/posts/updatePost',
    async({id,formData},{dispatch,getState})=>{
        // const { WebSocket:{ socket:{ connection } } } = getState()

        const response = await axios.patch(`/posts/${id}`, formData);

        const { message } = await response.data;

        // emitRefreshPost()
 
         dispatch(showMessage({ message }));
 
         return
    }
);

export const deletePost = createAsyncThunk(
    'IdeskApp/posts/deletePost',
    async(id,{dispatch,getState})=>{

        // const { WebSocket:{ socket:{ connection } } } = getState()

        const response = await axios.delete(`/posts/${id}`);
        

       const { message } = await response.data;

    //    emitRefreshPost()

        dispatch(showMessage({ message }));


        return
    }
);

export const postLike = createAsyncThunk(
    'IdeskApp/posts/like',
    async(ids, {dispatch,getState}) => {
        // const { WebSocket:{ socket:{ connection } } } = getState()

            await axios.patch(`/posts/${ids}/like`);
            // emitRefreshPost();

           return
        
    }
);
export const postDislike = createAsyncThunk(
    'IdeskApp/posts/dislike',
    async(ids, {dispatch, getState}) => {
        // const { WebSocket:{ socket:{ connection } } } = getState()

            await axios.patch(`/posts/${ids}/dislike`);
            // emitRefreshPost();

           return
        
    }
);

export default postSlice.reducer;