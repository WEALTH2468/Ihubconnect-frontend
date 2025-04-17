import Button from '@mui/material/Button';
import { useState, useEffect, useRef } from 'react';
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
import { Tooltip } from '@mui/material';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  logo: yup.string(),
  banner: yup.string(),
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
  const [bannerFile, setBannerFile] = useState(null);
  const dispatch = useDispatch();
  const company = useSelector(selectCompanyProfile);

  const [logoCleared, setLogoCleared] = useState(false);
  const [bannerCleared, setBannerCleared] = useState(false);

  const fileInputRef = useRef();


  console.log("company details",{ company });

  const defaultValues = {
    banner: addBackendProtocol(company?.banner) || '',
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
    const formData = new FormData();
  
    // Handle logo
    if (logoCleared) {
      data.logo = ''; // mark as cleared
      formData.append('logo', ''); // still append key
    } else if (logo) {
      formData.append('logo', logo);
      data.logo = company?.logo;
    } else {
      formData.append('logo', ''); // logo not changed, append blank string
    }
  
    // Handle banner
    if (bannerCleared) {
      data.banner = '';
      formData.append('banner', '');
    } else if (bannerFile) {
      formData.append('banner', bannerFile);
      data.banner = company?.banner;
    } else {
      formData.append('banner', '');
    }
  
    formData.append('company', JSON.stringify(data));
    dispatch(updateLogo({ formData, dispatch }));
  }

  return (
    <div className="flex flex-col flex-1 md:ltr:pr-32 md:rtl:pl-32">
      <Typography
        variant="h5"
        className="font-medium flex flex-auto items-center justify-center p-8 mt-10"
      >
        Update Company Details
      </Typography>

      <Card component={motion.div} className="w-full mb-32">
        <CardContent className="px-32 py-24">
          <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">

            {/* BANNER UPLOAD */}
          <Controller
                        control={control}
                        name="banner"
                        render={({ field: { onChange, value } }) => (
                          <Box
                            required
                            sx={{
                              borderWidth: 4,
                              borderStyle: 'solid',
                              borderColor: 'background.paper',
                            }}
                            className="relative w-full h-160 sm:h-192 px-32 rounded-[15px] sm:px-48"
                          >
                            <div className="absolute inset-0 bg-black bg-opacity-50 z-10 rounded-2" />
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                              <div>
                                <label
                                  htmlFor="companyBanner"
                                  className="flex p-8 cursor-pointer"
                                >
                                  <input
                                    
                                    accept="image/*"
                                    className="hidden"
                                    id="companyBanner"
                                    type="file"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        setBannerCleared(false); // reset clear state
                                        setBannerFile(file);
                                        onChange(URL.createObjectURL(file));
                                      }
                                    }}
                                  />
                                  <Tooltip title="Upload Company Banner" arrow>
                                  <FuseSvgIcon className="text-white cursor-pointer">
                                    heroicons-outline:camera
                                  </FuseSvgIcon>
                                </Tooltip>
                                </label>
                              </div>
          
                              <div>
                                <IconButton
                                   onClick={() => {
                                    setBannerFile(null);
                                    setBannerCleared(true);
                                    onChange('');
                                    if (fileInputRef.current) {
                                      fileInputRef.current.value = null;
                                    }
                                  }}
                                >
                                  <FuseSvgIcon className="text-white">
                                    heroicons-solid:trash
                                  </FuseSvgIcon>
                                </IconButton>
                              </div>
                            </div>
                            <img
                              className="absolute inset-0 object-cover w-full h-full"
                              src={value}
                            />
                          </Box>
                        )}
                      />

            {/* LOGO UPLOAD */}
            <div className="w-full flex flex-auto items-center -mt-64 justify-center">
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
                    className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
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
                            if (file) {
                              setLogoCleared(false);
                              setLogo(file);
                              onChange(URL.createObjectURL(file));
                            }
                          }}
                        />
                        <Tooltip title="Upload Company Logo" arrow>
                        <FuseSvgIcon className="text-white cursor-pointer">
                          heroicons-outline:camera
                        </FuseSvgIcon>
                      </Tooltip>
                      </label>
                      <IconButton
                       onClick={() => {
                        setLogo(null);
                        setLogoCleared(true);
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
