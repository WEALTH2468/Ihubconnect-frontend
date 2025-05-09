import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import showMessage from '@fuse/core/FuseMessage';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { selectUser } from 'app/store/userSlice';
import TimeAgo from 'app/configs/TimeAgo';
import RecursiveComment from '../comment/recursiveComment'

//redux
import {
  selectPost,
  getPost,
  updatePost,
  deletePost,
  postLike,
} from '../../store/postSlice';
import { getPosts, SelectPosts } from '../../store/postSlice';
import { addComment, deleteComment } from '../../store/commentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { nanoid } from '@reduxjs/toolkit';
import { selectPanelContacts } from 'app/theme-layouts/shared-components/chatPanel/store/contactsSlice';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';
import { parseTextAsLinkIfURL } from '../../utils';
import useEmit from 'src/app/websocket/emit';

const schema = yup.object().shape({
  message: yup
    .string()
    .required('Please type a short message before posting !'),
});

function comment({ post }) {
  const { emitRefreshPost, emitEmailAndNotification } = useEmit()
  const receivers = useSelector(selectPanelContacts)

  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const _default = {
    message: '',
  };

  const { control, watch, reset, handleSubmit, formState, getValues } =
    useForm({
      mode: 'onChange',
      defaultValues: _default,
      resolver: yupResolver(schema),
    });

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = (data) => {
    const comment = {
      userId: user._id,
      postId: post._id,
      text: data.message,
    };
    dispatch(addComment(comment)).then(({ payload }) => {
      emitEmailAndNotification({
        senderId: user._id,
        receivers,
        image: user.avatar,
        description: `<p><strong>${user.displayName
          }</strong> made an interesting comment on idesk click on <a href="${process.env.REACT_APP_BASE_FRONTEND
          }/idesk">${payload.text.slice(0, 15)}</a>... to see</p>`,
        read: true,
        link: '/idesk',
        subject: "idesk",
        useRouter: true,
      });
      emitRefreshPost({ action: "addComment", payload });

    });
    reset();
  };

  const handleDelete = (commentId) => {
    dispatch(deleteComment(commentId)).then(({ payload }) => {
      emitRefreshPost({ action: "deleteComment", payload });
    });
  };

  const [showAllComments, setShowAllComments] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const handleToggleComments = () => {
    setShowAllComments((prev) => !prev);
  };

  const handleReply = (commentId) => {
    setReplyingTo((prev) => (prev === commentId ? null : commentId)); // Toggle reply box
  };

  const onReplySubmit = (parentId, replyText) => {
    const reply = {
      userId: user._id,
      postId: post._id,
      text: replyText,
      parentId, // Indicate that this is a reply to a specific comment
    };

    dispatch(addComment(reply)).then(({ payload }) => {
      emitRefreshPost({ action: "addComment", payload });
    });

    setReplyingTo(null); // Close the reply box
    setReplyText("");
  };

  const topLevelComments = [...post.comments]
    .filter((comment) => comment.parentId === null)
    .reverse(); // Reverse once here

  const commentsToDisplay = showAllComments
    ? topLevelComments
    : topLevelComments.slice(0, 3); // Take the first 3 from reversed order

  return (
    <Box
      className="card-footer flex flex-col px-32 py-24 border-t-1"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? lighten(theme.palette.background.default, 0.4)
            : lighten(theme.palette.background.default, 0.02),
      }}
    >
      {topLevelComments.length > 0 && (
        <div className="">

          <List>
            {commentsToDisplay
              .map((comment) => (
                <RecursiveComment
                  key={comment._id}
                  comment={comment}
                  allComments={post.comments}
                  onReplySubmit={onReplySubmit}
                  replyingTo={replyingTo}
                  handleReply={handleReply}
                  replyText={replyText}
                  setReplyText={setReplyText}
                  user={user}
                  handleDelete={handleDelete}
                />
              ))}
          </List>
          {/* Toggle Button */}
          {topLevelComments.length > 3 && (
            <Button onClick={handleToggleComments}>
              {showAllComments
                ? 'Show Less'
                : `View ${topLevelComments.length - 3} more comments`}
            </Button>
          )}

        </div>
      )}

      <div className="flex items-center gap-8 mx-4 my-2">
  {/* Avatar */}
  <Avatar
    src={addBackendProtocol(user.avatar)}
    sx={{ width: 30, height: 30 }}
  />

  {/* Input and Button */}
  <div className="flex flex-1 items-center gap-4">
    <Paper
      elevation={0}
      className="flex-1 overflow-hidden w-full rounded-0 ml-2"
      sx={{ boxShadow: 'none' }}
    >
      <Controller
        control={control}
        name="message"
        render={({ field }) => (
          <TextField
            {...field}
            placeholder="Comment here"
            error={!!errors?.message?.message}
            helperText={errors?.message?.message}
            fullWidth
            multiline
            maxRows={3}
            variant="outlined"
            inputProps={{ maxLength: 100 }}
            sx={{ p: 0, m: 0 }}
          />
        )}
      />
    </Paper>

    <Button
      variant="contained"
      color="secondary"
      size="small"
      aria-label="post"
      disabled={_.isEmpty(dirtyFields) || !isValid}
      onClick={handleSubmit(onSubmit)}
    >
      Comment
    </Button>
  </div>
</div>

    </Box>
  );
}

export default comment;
