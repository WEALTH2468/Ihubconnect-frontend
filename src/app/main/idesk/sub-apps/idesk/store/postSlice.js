import {
    createAsyncThunk,
    createSlice,
    current,
    createEntityAdapter,
} from '@reduxjs/toolkit';
import axios from 'axios';
import history from '@history';
import { showMessage } from 'app/store/fuse/messageSlice';

export const getPosts = createAsyncThunk(
    'ideskApp/posts/getPosts',
    async (count, { dispatch }) => {
        const response = await axios.get(`/posts?count=${count}`);
        const data = await response.data;

        return data;
    }
);

const postsAdapter = createEntityAdapter({ selectId: (entity) => entity._id });

export const SelectPosts = postsAdapter.getSelectors(
    (state) => state.IdeskApp.posts
);

const postSlice = createSlice({
    name: 'ideskApp/posts',
    initialState: postsAdapter.getInitialState({ loading: false }),
    reducers: {
        setPostsToStore: postsAdapter.addMany,
        addPostToStore: (state, {payload}) => {
            postsAdapter.setAll(state, [payload, ...Object.values(state.entities)])
        },
        deletePostFromStore: postsAdapter.removeOne,
        updatePostToStore: postsAdapter.updateOne,
        addLikeToStore: postsAdapter.updateOne,
        addDislikeToStore: postsAdapter.updateOne,
        addCommentToStore: (state, { payload }) => {
            postsAdapter.updateOne(state, {
                id: payload.postId,
                changes: {
                    comments: [
                        ...current(state).entities[payload.postId].comments,
                        payload,
                    ],
                },
            });
        },
        deleteCommentFromStore: (state, { payload }) => {
            postsAdapter.updateOne(state, {
                id: payload.postId,
                changes: {
                    comments: [
                        ...current(state).entities[
                            payload.postId
                        ].comments.filter(
                            (comment) => comment._id !== payload._id
                        ),
                    ],
                },
            });
        },
    },
    extraReducers: {
        [getPosts.pending]: (state) => {
            state.loading = true;
        },
        [getPosts.fulfilled]: (state, action) => {
            const data = action.payload;
            postsAdapter.addMany(state, data);
        },
        [getPosts.rejected]: (state) => {
            state.loading = false;
        },
    },
});

export const addPost = createAsyncThunk(
    'IdeskApp/posts/addPost',
    async (postData, { dispatch, getState }) => {
        const response = await axios.post('/posts', postData);
        const data = await response.data;
        return data;
    }
);

export const updatePost = createAsyncThunk(
    'IdeskApp/posts/updatePost',
    async ({ id, formData }, { dispatch, getState }) => {
        const response = await axios.patch(`/posts/${id}`, formData);
        const { updatedPost, message } = await response.data;
        dispatch(showMessage({ message }));

        return updatedPost;
    }
);

export const deletePost = createAsyncThunk(
    'IdeskApp/posts/deletePost',
    async (id, { dispatch, getState }) => {
        const response = await axios.delete(`/posts/${id}`);
        const { deletedPost, message } = await response.data;
        dispatch(showMessage({ message }));

        return deletedPost;
    }
);

export const postLike = createAsyncThunk(
    'IdeskApp/posts/like',
    async (ids, { dispatch, getState }) => {
        const response = await axios.patch(`/posts/${ids}/like`);
        const { like, message } = await response.data;

        return like;
    }
);
export const postDislike = createAsyncThunk(
    'IdeskApp/posts/dislike',
    async (ids, { dispatch, getState }) => {
        const response = await axios.patch(`/posts/${ids}/dislike`);
        const { dislike, message } = await response.data;

        return dislike;
    }
);

export const {
    setPosts,
    addPostToStore,
    updatePostToStore,
    deletePostFromStore,
    addLikeToStore,
    addDislikeToStore,
    addCommentToStore,
    deleteCommentFromStore,
} = postSlice.actions;

export default postSlice.reducer;
