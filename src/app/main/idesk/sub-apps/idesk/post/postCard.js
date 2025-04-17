import React, { Component } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import showMessage from "@fuse/core/FuseMessage";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { lighten } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";

// Component
import Post from "./post";
import EditPost from "./editPost";
import TimeAgo from "app/configs/TimeAgo";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "app/store/userSlice";
import {
  selectPost,
  getPosts,
  updatePost,
  deletePost,
  postLike,
} from "../store/postSlice";
import addBackendProtocol from "app/theme-layouts/shared-components/addBackendProtocol";
import useEmit from "src/app/websocket/emit";
import { useAbility } from "@casl/react";
import { AbilityContext } from "src/app/AbilityContext";
import { subject } from '@casl/ability';

function postCard({ post }) {
  const {emitRefreshPost} = useEmit()
  const [edit, setEdit] = useState(false);
  const ability = useAbility(AbilityContext);
  const user = useSelector(selectUser);

  const canUpdatePost = ability.can("update", subject('Post', {userId: post.userId})) 

  const canDeletePost = ability.can("delete", subject('Post', {userId: post.userId}))
  
  // select from redux store
  const dispatch = useDispatch();
  
  // Menu State
  const [moreMenuEl, setMoreMenuEl] = useState(null);

  // Menu toggle functions
  function handleMoreMenuClick(event) {
    setMoreMenuEl(event.target);
  }
  function handleMoreMenuClose() {
    setMoreMenuEl(null);
  }

  const onDelete = (id) => {
    dispatch(deletePost(id)).then( ({payload}) => {
      emitRefreshPost({action:"deletePost", payload})
    });
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };
  return (
    <>
      <Card component={motion.div} variants={item} className="mb-32">
        <CardHeader
          className="px-32 pt-24"
          avatar={<Avatar aria-label="Recipe" src={addBackendProtocol(post.user?.avatar)} />}
          action={
            <div>
              {(canDeletePost || canUpdatePost) && (
                <IconButton
                aria-controls="main-more-menu"
                  aria-haspopup="true"
                  onClick={handleMoreMenuClick}
                  size="large"
                >
                  <FuseSvgIcon>heroicons-outline:dots-vertical</FuseSvgIcon>
                </IconButton>
              )}
              <Menu
                id="main-more-menu"
                anchorEl={moreMenuEl}
                open={Boolean(moreMenuEl)}
                onClose={handleMoreMenuClose}
              >
                <MenuItem
                  onClick={() => {
                    handleMoreMenuClose();
                    setEdit(true);
                  }}
                >
                  <FuseSvgIcon size={16}>
                    heroicons-outline:pencil-alt
                  </FuseSvgIcon>
                  Edit
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    handleMoreMenuClose();
                    onDelete(post._id);
                  }}
                >
                  <FuseSvgIcon size={16}>heroicons-outline:trash</FuseSvgIcon>
                  Delete
                </MenuItem>
              </Menu>
            </div>
          }
          title={
            <span className="flex items-center space-x-8">
              <Typography
                className="font-bold"
                color="secondary.main"
                paragraph={false}
              >
                {post.user?.name}
              </Typography>
              <span>shared an article with you</span>
            </span>
          }
          subheader={<TimeAgo date={post.time} />}
        />
        {edit ? (
          <EditPost setEdit={setEdit} post={post} />
        ) : (
          <Post post={post} />
        )}
      </Card>
    </>
  );
}

export default postCard;
