import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { motion } from 'framer-motion';
import { Avatar, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateLogo, getLogo } from './users/store/settingsSlice'; 
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  logo: yup.string(),
});

const LogoForm = () => {
  const [logo, setLogo] = useState(null);
  const dispatch = useDispatch();
  const teamLogo = useSelector((state) => state.usersApp.settings.logo);

  const defaultValues = {
    logo: addBackendProtocol(teamLogo) || '',
  };

  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      mode: 'onChange',
      defaultValues,
      resolver: yupResolver(schema),
    }
  );

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  useEffect(() => {
    dispatch(getLogo());
  }, []);

  /**
   * Form Submit
   */

  function onSubmit() {
    const formData = new FormData();
    formData.append('logo', logo);
    dispatch(updateLogo({ formData, dispatch }));
  }

  // if (_.isEmpty(form) || !user) {
  //   return <FuseLoading />;
  // }

  const container = {
    show: {
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
      <Typography
        variant="h5"
        className="font-medium flex flex-auto items-center justify-center p-8"
      >
        Update Team Logo
      </Typography>
      <Card component={motion.div} variants={item} className="w-full mb-32">
        <CardContent className="px-32 py-24">
          <>
            <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
              <div className="w-full mt-8">
                <div className="flex flex-auto items-center justify-center">
                  <Controller
                    control={control}
                    name="logo"
                    render={({ field: { onChange, value } }) => (
                      <Box
                        required
                        sx={{
                          borderWidth: 4,
                          borderStyle: 'solid',
                          borderColor: 'background.paper',
                        }}
                        className="relative flex items-center justify-center w-192 h-192 rounded-full overflow-hidden"
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <div>
                            <label
                              htmlFor="button-avatar"
                              className="flex p-8 cursor-pointer"
                            >
                              <input
                                accept="image/*"
                                className="hidden"
                                id="button-avatar"
                                type="file"
                                onChange={async (e) => {
                                  const file = e.target.files[0];
                                  setLogo(file);
                                  onChange(URL.createObjectURL(file));
                                }}
                              />
                              <FuseSvgIcon className="text-white">
                                heroicons-outline:camera
                              </FuseSvgIcon>
                            </label>
                          </div>
                          <div>
                            <IconButton
                              onClick={() => {
                                setLogo(null);
                                onChange('');
                              }}
                            >
                              <FuseSvgIcon className="text-white">
                                heroicons-solid:trash
                              </FuseSvgIcon>
                            </IconButton>
                          </div>
                        </div>
                        <Avatar
                          sx={{
                            backgroundColor: 'background.default',
                            color: 'text.secondary',
                          }}
                          className="object-cover w-full h-full text-64 font-bold"
                          src={value}
                          alt={null}
                        />
                      </Box>
                    )}
                  />
                </div>
              </div>
            </div>

            <Box
              className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
              sx={{ backgroundColor: 'background.default' }}
            >
              <Button
                className="ml-8"
                variant="contained"
                color="secondary"
                disabled={_.isEmpty(dirtyFields) || !isValid}
                onClick={handleSubmit(onSubmit)}
              >
                update logo
              </Button>
            </Box>
          </>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoForm;
