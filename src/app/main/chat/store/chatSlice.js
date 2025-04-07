import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export const getChat = createAsyncThunk(
  'chatApp/chat/getChat',
  async (contactId, { dispatch, getState }) => {
    const response = await axios.get(`/chat/messages/${contactId}`);
    const data = await response.data;
    return data;
  }
);

export const sendMessage = createAsyncThunk(
  'chatApp/chat/sendMessage',
  async (
    {
      messageText,
      chatId,
      contactId,
      subject,
      avatar,
      link,
      images,
      documents,
    },
    { dispatch, getState }
  ) => {
    try {
      const formData = new FormData();

      // Append text fields
      formData.append('messageText', messageText);
      formData.append('subject', subject);
      formData.append('avatar', avatar);
      formData.append('link', link);

      // Append image files
      if (images && images.length > 0) {
        images.forEach((image) => {
          formData.append('picture', image); // Match the `multer` field name
        });
      }

      // Append document files
      if (documents && documents.length > 0) {
        documents.forEach((document) => {
          formData.append('document', document); // Match the `multer` field name
        });
      }

      // Send FormData in a POST request
      const { data } = await axios.post(`/chat/send/${contactId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
);


export const deleteMessage = createAsyncThunk(
  'chatApp/chat/deleteMessage',
  async (chatId, { dispatch, getState }) => {
    const response = await axios.delete(`/chat/${chatId}`);
    const data = await response.data;
    return data;
  }
);

export const editMessage = createAsyncThunk(
  'chatApp/chat/editMessage',
  async ({ messageId, newText }, { dispatch, getState }) => {
    const { data } = await axios.patch(`/chat/messages/${messageId}`, {
      text: newText,
    });
    return data;
  }
);

const chatSlice = createSlice({
  name: 'chatApp/chat',
  initialState: [],
  reducers: {
    removeChat: (state, action) => action.payload,
    
    addMessage: (state, action) => {
      const tempMessage = action.payload;

      // Prevent duplicate temp messages
      return state.some((msg) => msg._id === tempMessage._id)
        ? state
        : [...state, tempMessage];
    },

    updateMessage: (state, action) => {
      const { tempId, realMessage, status } = action.payload;
      const index = state.findIndex((msg) => msg._id === tempId);

      if (index !== -1) {
        if (realMessage) {
          state[index] = realMessage; // Replace temp message with real one
        } else if (status) {
          state[index].status = status; // Mark message as failed
        }
      }
    },
  },


  extraReducers: (builder) => {
    builder.addCase(getChat.fulfilled, (state, action) => action.payload,) 
    // builder.addCase(sendMessage.fulfilled, (state, { payload }) => {
    //   return payload.chat ? [...state, payload.message] : [...state, payload]
    //  }) 
  },
});


export const selectChat = ({ chatApp }) => chatApp.chat;

export const { removeChat, addMessage, updateMessage  } = chatSlice.actions;

export default chatSlice.reducer;