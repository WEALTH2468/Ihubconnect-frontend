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
import Comment from './comment/comment';

//redux
import {
  selectPost,
  getPost,
  updatePost,
  deletePost,
  postLike,
  postDislike,
} from '../store/postSlice';
import { selectUser } from 'app/store/userSlice';
import { getPosts, SelectPosts } from '../store/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { selectPanelContacts } from 'app/theme-layouts/shared-components/chatPanel/store/contactsSlice';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';
import { parseTextAsLinkIfURL } from '../utils';
import useEmit from 'src/app/websocket/emit';
import { useTheme } from '@mui/material/styles';



function post({ post }) {
  const {emitRefreshPost, emitEmailAndNotification} = useEmit()
  const receivers = useSelector(selectPanelContacts);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const theme = useTheme();

  const secondaryColor = theme.palette.secondary.main;

  const handleChangeLike = (ids) => {
    
    // Check if the user has already liked the post
    if (!post.likes[user._id]) {
      dispatch(postLike(JSON.stringify(ids))).then(({ payload }) => {
        emitEmailAndNotification({
          senderId: user._id,
          receivers,
          image: user.avatar,
          description: `<p><strong>${
            user.displayName
          }</strong> liked a post on idesk. Click on <a href="${
            process.env.REACT_APP_BASE_FRONTEND
          }/idesk">${post.text.slice(0, 15)}</a>... to see</p>`,
          read: true,
          link: '/idesk',
          subject: 'idesk',
          useRouter: true,
        });
        emitRefreshPost({ action: 'addLike', payload });
      });
    }
  };

  const handleChangeDislike = (ids) => {
    // Check if the user has already disliked the post
    if (!post.dislikes[user._id]) {
      dispatch(postDislike(JSON.stringify(ids))).then(({ payload }) => {
        emitEmailAndNotification({
          senderId: user._id,
          receivers,
          image: user.avatar,
          description: `<p><strong>${
            user.displayName
          }</strong> disliked a post on idesk. Click on <a href="${
            process.env.REACT_APP_BASE_FRONTEND
          }/idesk">${post.text.slice(0, 15)}</a>... to see</p>`,
          read: true,
          link: '/idesk',
          subject: 'idesk',
          useRouter: true,
        });
        emitRefreshPost({ action: 'addDislike', payload });
      });
    }
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };


  return (
    <Card className="w-[450px]">
      <CardContent className="px-[35px]">
        <Typography
          component="p"
          className="mb-16 max-w-sm break-words overflow-hidden"
        >
          {parseTextAsLinkIfURL(post.text)}
        </Typography>

        {post.picture && (
          <div className=" rounded-8 overflow-hidden">
            <img
              className="w-full h-200 object-contain"
              src={addBackendProtocol(post.picture)}
              alt="article"
            />
          </div>
        )}
      </CardContent>

     <CardActions disableSpacing className="px-32" style={{ gap: '1rem' }}>
      {/* Like */}
      <Button
        aria-label="Add to favorites"
        onClick={() =>
          handleChangeLike({ userId: user._id, postId: post._id })
        }
        className="p-2"
      >
        <div
          style={{
            padding: 8,
            borderRadius: '50%',
            backgroundColor: post.likes?.[user._id] ? secondaryColor : 'transparent',
            color: post.likes?.[user._id] ? '#fff' : 'inherit',
          }}
        >
          <FuseSvgIcon size={16}>
            heroicons-outline:thumb-up
          </FuseSvgIcon>
        </div>
        <Typography style={{ marginLeft: 8 }}>{Object.keys(post.likes || {}).length}</Typography>
      </Button>

      {/* Dislike */}
      <Button
        aria-label="Dislike"
        onClick={() =>
          handleChangeDislike({ userId: user._id, postId: post._id })
        }
        className="p-2"
      >
        <div
          style={{
            padding: 8,
            borderRadius: '50%',
            backgroundColor: post.dislikes?.[user._id] ? secondaryColor : 'transparent',
            color: post.dislikes?.[user._id] ? '#fff' : 'inherit',
          }}
        >
          <FuseSvgIcon size={16}>
            heroicons-outline:thumb-down
          </FuseSvgIcon>
        </div>
        <Typography style={{ marginLeft: 8 }}>{Object.keys(post.dislikes || {}).length}</Typography>
      </Button>

      {/* Comment */}
      <Button
        aria-label="Comment"
        onClick={() => handleOpenComments(post._id)}
        className="p-2"
      >
        <div
          style={{
            padding: 8,
            borderRadius: '50%',
            backgroundColor: post.comments?.some(comment => comment.userId === user._id)
              ? secondaryColor
              : 'transparent',
            color: post.comments?.some(comment => comment.userId === user._id)
              ? '#fff'
              : 'inherit',
          }}
        >
          <FuseSvgIcon size={16}>
            heroicons-outline:chat-alt
          </FuseSvgIcon>
        </div>
        <Typography style={{ marginLeft: 8 }}>{post.comments?.length || 0}</Typography>
      </Button>
    </CardActions>
      <Comment post={post} />
    </Card>
  );
}

export default post;
