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
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { lighten } from '@mui/material/styles';
import Box from '@mui/material/Box';

import { useDeepCompareEffect } from '@fuse/hooks';
import FuseLoading from '@fuse/core/FuseLoading';

import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';

//Redux
import { nanoid } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import { addPost, getPosts } from '../store/postSlice';
import { selectPanelContacts } from 'app/theme-layouts/shared-components/chatPanel/store/contactsSlice';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';
import useEmit from 'src/app/websocket/emit';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  text: yup.string().required('Please type a short message before posting!'),
  picture: yup.string(),
});

const PostForm = () => {
  const {emitRefreshPost, emitEmailAndNotification} = useEmit()
  const [pictureFile, setPictureFile] = useState();
  const receivers = useSelector(selectPanelContacts);
  const user = useSelector(selectUser);

  const dispatch = useDispatch();

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      // mode: "onChange",
      resolver: yupResolver(schema),
    }
  );

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  // FORM SUBMIT

  const onSubmitNew = (data) => {
    const post = {
      userId: user._id,
      text: data.text,
    };

    const formData = new FormData();

    formData.append('picture', pictureFile);
    formData.append('post', JSON.stringify(post));
    dispatch(addPost(formData)).then(({ payload }) => {
      emitEmailAndNotification({
        senderId: user._id,
        receivers,
        image: user.avatar,
        description: `<p><strong>${
          user.displayName
        }</strong> made an interesting post on idesk click on <a href="${
          process.env.REACT_APP_BASE_FRONTEND
        }/idesk">${post.text.slice(0, 15)}</a>... to see</p>`,
        read: true,
        link: '/idesk',
        subject: 'idesk',
        useRouter: true,
      });
      emitRefreshPost({ action: 'addPost', payload });
    });

    setPictureFile(null);
    reset({
      text: '',
    });
  };

  return (
    <>
      <Card
        component={motion.div}
        variants={item}
        className="w-full overflow-hidden mb-32"
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* CardHeader with Avatar */}
          <CardHeader
            sx={{ marginRight: 0, paddingRight: 0 }}
            //avatar={
              // <Avatar
              //   className="md:mx-4"
              //   alt="user photo"
              //   src={
              //     user.avatar
              //       ? addBackendProtocol(user.avatar)
              //       : user.displayName[0]
              //   }
              //   sx={{
              //     width: 56, // Set width
              //     height: 56, // Set height
              //     marginRight: 5, // Remove right margin
              //     // Add any additional styles here
              //   }}
              // />
            //}
            title=""
            subheader=""
          />

          {/* Controller with TextField */}
          <Controller
            control={control}
            name="text"
            render={({ field }) => (
              <TextField
                className="p-24 pl-0 w-full"
                {...field}
                label=""
                placeholder="What do you want to share with your team?"
                id="text"
                error={!!errors?.message?.message}
                helperText={errors?.message?.message}
                fullWidth
                sx={{
                  marginBottom: '-2px',
                  '& .MuiInputBase-input': {
                    lineHeight: '1.3',
                  },
                }}
                multiline
                minRows={1}
                maxRows={5}
                variant="outlined"
                inputProps={{
                  maxLength: 1500,
                }}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="picture"
          render={({ field: { onChange, value } }) => (
            <Box
              sx={{
                // backgroundColor: (theme) =>
                //   theme.palette.mode === 'light'
                //     ? lighten(theme.palette.background.default, 0.4)
                //     : lighten(theme.palette.background.default, 0.02),
                backgroundColor: '#fff',
              }}
            >
              {value && (
                <div className="relative w-full h-160 sm:h-292 px-32 sm:px-48">
                  <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div>
                      <IconButton
                        onClick={() => {
                          onChange('');
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

              <div className="card-footer flex items-center flex-row border-t-1 px-20 py-12">
                <div className="flex flex-1 items-center">
                  <IconButton className='rounded-12'>
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
                       <span className = 'flex'>
                      <FuseSvgIcon size={25} color='secondary'>
                        heroicons-outline:photograph
                      </FuseSvgIcon>
                      <Typography className="mx-4 text-14 font-medium mt-[2px]">
                       Photo/Video
                       </Typography>
                       </span>
                    </label>
                  </IconButton>

                  <IconButton aria-label="Post" disabled={true} className='rounded-12'>
                    <FuseSvgIcon size={25} disabled={true}>heroicons-outline:calendar</FuseSvgIcon>
                    <Typography className="mx-4 text-14 font-medium">
                       Post
                       </Typography>
                  </IconButton>

                  <IconButton aria-label="Events" disabled={true} className='rounded-12'>
                    <FuseSvgIcon size={25} disabled={true} >heroicons-outline:clipboard-list</FuseSvgIcon>
                    <Typography className="mx-4 text-14 font-medium">
                       Events
                       </Typography>
                  </IconButton>


                </div>

                <div className="">
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    aria-label="post"
                    disabled={_.isEmpty(dirtyFields) || !isValid}
                    onClick={handleSubmit(onSubmitNew)}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </Box>
          )}
        />
      </Card>
    </>
  );
};

export default PostForm;
