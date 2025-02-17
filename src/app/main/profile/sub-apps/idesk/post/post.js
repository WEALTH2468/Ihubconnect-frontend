import React from "react";
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
import Comment from "./comment/comment";

//redux
import {
  selectPost,
  getPost,
  updatePost,
  deletePost,
  postLike,
  postDislike,
} from "../store/postSlice";
import { selectUser } from "app/store/userSlice";
import { getPosts, SelectPosts } from "../store/postSlice";
import { useDispatch, useSelector } from "react-redux";

function post({ post }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const handleChangeLike = (ids) => {
    dispatch(postLike(JSON.stringify(ids)));
  };

  const handleChangeDislike = (ids) => {
    dispatch(postDislike(JSON.stringify(ids)));
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Card>
      <CardContent className="px-32">
        <Typography component="p" className="mb-16">
          {post.text}
        </Typography>

        {post.picture && (
          <div className=" rounded-8 overflow-hidden">
            <img
              className="w-full h-200 object-contain"
              src={post.picture}
              alt="article"
            />
          </div>
        )}
      </CardContent>

      <CardActions disableSpacing className="px-32">
        <Button
          aria-label="Add to favorites"
          onClick={() =>
            handleChangeLike({ userId: user._id, postId: post._id })
          }
        >
          <FuseSvgIcon size={16} color="action">
            heroicons-outline:heart
          </FuseSvgIcon>
          <Typography className="mx-4">Like</Typography>
          <Typography>({post.likeCount})</Typography>
        </Button>
        <Button
          aria-label="Share"
          onClick={() =>
            handleChangeDislike({ userId: user._id, postId: post._id })
          }
        >
          <FuseSvgIcon size={16} color="action">
            heroicons-outline:thumb-down
          </FuseSvgIcon>
          <Typography className="mx-4">Dislike</Typography>
          <Typography>({post.dislikeCount})</Typography>
        </Button>
      </CardActions>

      <Comment post={post} />
    </Card>
  );
}

export default post;
