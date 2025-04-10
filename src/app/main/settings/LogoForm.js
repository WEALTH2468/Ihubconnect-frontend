import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Box from '@mui/system/Box';
import TextField from '@mui/material/TextField';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { motion } from 'framer-motion';
import { Avatar, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateLogo, getLogo, selectCompanyProfile } from './users/store/settingsSlice';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  logo: yup.string(),
  companyName: yup.string().required('Company name is required'),
  address: yup.string().required('Address is required'),
  phone: yup
    .string()
    .matches(/^\+?\d{10,15}$/, 'Invalid phone number')
    .required('Phone number is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  ownerPhone: yup
    .string()
    .matches(/^\+?\d{10,15}$/, 'Invalid phone number')
    .required('Owner phone is required'),
  ownerEmail: yup
    .string()
    .email('Invalid email')
    .required('Owner email is required'),
});

const LogoForm = () => {
  const [logo, setLogo] = useState(null);
  const dispatch = useDispatch();
  const company = useSelector(selectCompanyProfile);

  console.log({ company });

  const defaultValues = {
    logo: addBackendProtocol(company?.logo) || '',
    companyName: company?.companyName || '',
    address:company?.address || '',
    phone:company?.phone || '',
    email: company?.email || '',
    ownerName: company?.ownerName || '',
    ownerPhone: company?.ownerPhone || '',
    ownerEmail: company?.ownerEmail || '',
  };

  const { control, watch, reset, handleSubmit, formState } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields } = formState;
  /**
   * Form Submit
   */
  function onSubmit(data) {
    data.logo = company?.logo;
    const formData = new FormData();
    formData.append('logo', logo);
    formData.append('company', JSON.stringify(data));

    dispatch(updateLogo({ formData, dispatch }));
  }

  return (
    <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
      <Typography
        variant="h5"
        className="font-medium flex flex-auto items-center justify-center p-8"
      >
        Update Company Details
      </Typography>

      <Card component={motion.div} className="w-full mb-32">
        <CardContent className="px-32 py-24">
          <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
            {/* LOGO UPLOAD */}
            <div className="w-full mt-8 flex flex-auto items-center justify-center">
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
                      <label
                        htmlFor="button-avatar"
                        className="flex p-8 cursor-pointer"
                      >
                        <input
                          accept="image/*"
                          className="hidden"
                          id="button-avatar"
                          type="file"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setLogo(file);
                            onChange(URL.createObjectURL(file));
                          }}
                        />
                        <FuseSvgIcon className="text-white">
                          heroicons-outline:camera
                        </FuseSvgIcon>
                      </label>
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
                    <Avatar
                      sx={{
                        backgroundColor: 'background.default',
                        color: 'text.secondary',
                      }}
                      className="object-cover w-full h-full text-64 font-bold"
                      src={value}
                    />
                  </Box>
                )}
              />
            </div>

            {/* FORM FIELDS */}
            <Box className="w-full mt-16">
              <Controller
                name="companyName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Company Name"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Address"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Phone"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Email"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
               <Controller
                name="ownerName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Owner Name"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="ownerPhone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Owner Phone"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
              <Controller
                name="ownerEmail"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Owner Email"
                    variant="outlined"
                    margin="normal"
                  />
                )}
              />
            </Box>

            {/* SUBMIT BUTTON */}
            <Button
              variant="contained"
              color="secondary"
              onClick={handleSubmit(onSubmit)}
              disabled={_.isEmpty(dirtyFields) || !isValid}
            >
              Update Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogoForm;
