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
import { selectUser } from "app/store/userSlice";
import TimeAgo from "app/configs/TimeAgo";

//redux
import {
  selectPost,
  getPost,
  updatePost,
  deletePost,
  postLike,
} from "../../store/postSlice";
import { getPosts, SelectPosts } from "../../store/postSlice";
import { addComment, deleteComment } from "../../store/commentSlice";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
// import { emitNotification, emitRefreshPost } from "src/app/websocket/socket";
 

const schema = yup.object().shape({
  message: yup
    .string()
    .required("Please type a short message before posting !"),
});

function comment({ post }) {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const _default = {
    message: "",
  };

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      mode: "onChange",
      defaultValues: _default,
      resolver: yupResolver(schema),
    }
  );

  const { isValid, dirtyFields, errors } = formState;

  const onSubmit = (data) => {
    const payload = {
      userId: user._id,
      postId: post._id,
      text: data.message,
    };
    dispatch(addComment(payload)).then( data => {
      const item = {
        senderId: user._id,
        receiverId: post.userId,
        image: user.avatar,
        description: `<strong>${user.displayName}</strong> commentted on your post`,
        read: true,
        link: "/idesk",
        useRouter: true
      }  
      // emitNotification(item)
      // emitRefreshPost()

    });
    reset();
  };

  const handleDelete = (commentId) => {
    dispatch(deleteComment(commentId)).then( data => {
      // emitRefreshPost()

    });;
  };

  const [showAllComments, setShowAllComments] = useState(false);
  const [slice, setSlice] = useState(-3);

  const handleToggleComments = () => {
    setShowAllComments((prev) => !prev);
  };

  useEffect(() => {
    showAllComments ? setSlice(0) : setSlice(-3);
  }, [showAllComments]);

  return (
    <Box
      className="card-footer flex flex-col px-32 py-24 border-t-1"
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "light"
            ? lighten(theme.palette.background.default, 0.4)
            : lighten(theme.palette.background.default, 0.02),
      }}
    >
      {post.comments && post.comments.length > 0 && (
        <div className="">
          <div className="flex items-center">
            <Typography>{post.comments.length} comments</Typography>
            <FuseSvgIcon size={16} className="mx-4" color="action">
              heroicons-outline:chevron-down
            </FuseSvgIcon>
          </div>

          <List>
            {post.comments
              .slice(slice)
              .reverse()
              .map((comment) => (
                <div key={comment._id}>
                  <ListItem className="px-0 -mx-8">
                    <Avatar
                      alt={comment.user.name}
                      src={comment.user.avatar}
                      className="mx-8"
                    />
                    <ListItemText
                      className="px-4"
                      primary={
                        <div className="flex items-center space-x-8">
                          <Typography
                            className="font-normal"
                            color="secondary"
                            paragraph={false}
                          >
                            {comment.user.name}
                          </Typography>
                          <Typography variant="caption">
                            {<TimeAgo date={comment.time} />}
                          </Typography>
                        </div>
                      }
                      secondary={comment.text}
                    />
                  </ListItem>
                  <div className="flex items-center mx-52 mb-8">
                    {/* <Button
                      endIcon={
                        <FuseSvgIcon size={14}>
                          heroicons-outline:reply
                        </FuseSvgIcon>
                      }
                    >
                      Reply
                    </Button> */}
                    {user._id === comment.userId && (
                      <Button
                        className="ml-auto text-red"
                        endIcon={
                          <FuseSvgIcon size={14}>
                            heroicons-outline:trash
                          </FuseSvgIcon>
                        }
                        onClick={() => {
                          handleDelete(comment._id);
                        }}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            {post.comments.length > - slice && (
              <Button onClick={handleToggleComments}>
                {showAllComments ? "Show Less" : `View ${post.comments.length + slice} more comments`}
              </Button>
            )}
          </List>
        </div>
      )}

      <div className="flex flex-auto -mx-4">
        <Avatar className="mx-4" src={user.avatar} />
        <div className="flex flex-col flex-1 mx-4 items-end">
          <Paper className="w-full mb-16 shadow-0 border-1  overflow-hidden">
            <Controller
              control={control}
              name="message"
              render={({ field }) => (
                <TextField
                  className="p-12 w-full"
                  {...field}
                  label=""
                  placeholder="post your comment here"
                  id="message"
                  error={!!errors?.message?.message}
                  helperText={errors?.message?.message}
                  fullWidth
                  multiline
                  minRows={1}
                  variant="outlined"
                  inputProps={{
                    maxLength: 100,
                  }}
                />
              )}
            />
          </Paper>
          <div>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              aria-label="post"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              onClick={handleSubmit(onSubmit)}
            >
              Post comment
            </Button>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default comment;
