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

// Redux
import { useDispatch, useSelector } from "react-redux";
import {
  selectPost,
  getPosts,
  updatePost,
  deletePost,
} from "../store/postSlice";
import useEmit from "src/app/websocket/emit";

const schema = yup.object().shape({
  text: yup.string().required("Please type a short message before posting!"),
  picture: yup.string(),
});

function editPost({ setEdit, post }) {
  const {emitRefreshPost} = useEmit()
  const dispatch = useDispatch();

  const [pictureFile, setPictureFile] = useState();

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      mode: "onChange",
      resolver: yupResolver(schema),
    }
  );

  const { isValid, dirtyFields, errors } = formState;

  // RESETTING FORM DATA WITH POST DATA

  useEffect(() => {
    reset({ text: post.text, picture: post.picture });
  }, [post, reset]);

  // UPDATE FUNCTIONS

  const handleCancel = () => {
    setEdit(false);
    reset();
  };

  const onSubmit = (data) => {

    const payload = {
      picture: post.picture,
      text: data.text,
    };
    const formData = new FormData();

    formData.append("picture", pictureFile);
    formData.append("post", JSON.stringify(payload));

    dispatch(updatePost({id:post._id, formData})).then( ({payload}) => {
      emitRefreshPost({action:"updatePost", payload})
    });
    reset();
    handleCancel();
  };

  return (
    <>
      <div>
        <Controller
          control={control}
          name="text"
          render={({ field }) => (
            <TextField
              className="p-24 w-full"
              {...field}
              label=""
              placeholder="What do you want to share with your team?"
              id="text"
              error={!!errors?.message?.message}
              helperText={errors?.message?.message}
              fullWidth
              sx={{ marginBottom: "-15px" }}
              multiline
              minRows={1}
              maxRows={3}
              variant="outlined"
              inputProps={{
                maxLength: 1500,
              }}
            />
          )}
        />

        <Controller
          control={control}
          name="picture"
          render={({ field: { onChange, value } }) => (
            <Box
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
            >
              {value && (
                <div className="relative w-full h-160 sm:h-292 px-32 sm:px-48">
                  <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div>
                      <IconButton
                        onClick={() => {
                          onChange("");
                        }}
                      >
                        <FuseSvgIcon className="text-white">
                          heroicons-solid:trash
                        </FuseSvgIcon>
                      </IconButton>
                    </div>
                  </div>
                  <img
                    src={value}
                    className="absolute inset-0 object-cover w-full h-full"
                  />
                </div>
              )}

              <div className="card-footer flex items-center flex-row border-t-1 px-24 py-12">
                <div className="flex flex-1 items-center">
                  <IconButton>
                    <label aria-label="Add photo">
                      <input
                        accept="image/*"
                        className="hidden"
                        id="button-avatar"
                        type="file"
                        onChange={async (e) => {
                          function readFileAsync() {
                            return new Promise((resolve, reject) => {
                              setPictureFile(e.target.files[0]);
                              const file = e.target.files[0];
                              if (!file) {
                                return;
                              }
                              const reader = new FileReader();

                              reader.onload = () => {
                                resolve(
                                  `data:${file.type};base64,${btoa(
                                    reader.result
                                  )}`
                                );
                              };

                              reader.onerror = reject;

                              reader.readAsBinaryString(file);
                            });
                          }

                          const newImage = await readFileAsync();

                          onChange(newImage);
                        }}
                      />
                      <FuseSvgIcon size={20}>
                        heroicons-solid:photograph
                      </FuseSvgIcon>
                    </label>
                  </IconButton>
                  <IconButton aria-label="Mention somebody" disabled={true}>
                    <FuseSvgIcon size={20}>heroicons-solid:user</FuseSvgIcon>
                  </IconButton>
                </div>

                <div className="flex gap-8">
                  <Button
                    variant="contained"
                    color="info"
                    size="small"
                    aria-label="post"
                    onClick={handleCancel}
                  >
                    cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    aria-label="post"
                    disabled={_.isEmpty(dirtyFields) || !isValid}
                    onClick={handleSubmit(onSubmit)}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </Box>
          )}
        />

        {}
      </div>
    </>
  );
}

export default editPost;
