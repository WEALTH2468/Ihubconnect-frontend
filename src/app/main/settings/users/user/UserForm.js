import Button from '@mui/material/Button';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import _ from '@lodash';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Box from '@mui/system/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import Checkbox from '@mui/material/Checkbox/Checkbox';
import { DatePicker } from '@mui/x-date-pickers';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import { motion } from 'framer-motion';
import Avatar from '@mui/material/Avatar';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

import {
  Radio,
  FormControlLabel,
  RadioGroup,
  TextField,
  MenuItem,
  Grid,
  Switch,
} from '@mui/material';

import { selectRoles } from 'app/store/roleSlice';
import { selectDepartments } from 'app/store/settingsSlice';
import { getUser, removeUser, updateUser, addUser } from '../store/userSlice';
import PhoneNumberSelector from './phone-number-selector/PhoneNumberSelector';
import { selectCountries } from '../store/countriesSlice';
/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  background: yup.string(),
  avatar: yup.string(),
  displayName: yup.string(),
  firstName: yup.string(),
  lastName: yup.string(),
  gender: yup.string(),
  departments: yup.array(),
  units: yup.array(),
  jobPosition: yup.string(),
  email: yup.string(),
  emails: yup.array(),
  phoneNumbers: yup.array(),
  address: yup.string(),
  city: yup.string(),
  birthday: yup.date().nullable(),
  aboutMe: yup.string(),
  roleId: yup.string(),
  password: yup.string(),
  isActive: yup.boolean(),
});

function UserForm() {
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [active, setActive] = useState(false);
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const routeParams = useParams();
  const [pathName, setPathName] = useState(
    location.pathname.includes('users/new')
  );
  const tagDepartments = useSelector((state) => selectDepartments(state));
  const roles = useSelector((state) => selectRoles(state));
  const countries = useSelector(selectCountries);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const user = pathName
    ? null
    : useSelector((state) => state.usersApp.user.user);
  const handleDeleteUser = (id) => {
    dispatch(removeUser(id._id, { dispatch }));
  };
  const { id } = routeParams;
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [units, setUnits] = useState([]);

  const handleSelectedDepartment = (value) => {
    if (value) {
      setSelectedDepartment(value._id);
      const newDepartment = tagDepartments.find(
        (dept) => dept._id === value._id
      );
      setUnits(newDepartment ? newDepartment.units : []);
    } else {
      setUnits([]);
    }
  };
  useEffect(() => {
    if (user && user.departments) {
      const initialDepartmentId = user.departments[0];
      setSelectedDepartment(initialDepartmentId);
      const initialDepartment = tagDepartments.find(
        (dept) => dept._id === initialDepartmentId
      );
      setUnits(initialDepartment ? initialDepartment.units : []);
    }
  }, [user, tagDepartments]);

  function getCountryByIso(iso) {
    return countries.find((country) => country.iso === iso);
  }
  const defaultValues = {
    background: user?.background || '',
    avatar: user?.avatar || '',
    displayName: user?.displayName || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    gender: user?.gender || '',
    departments: user?.departments || null,
    units: user?.units || null,
    jobPosition: user?.jobPosition || '',
    roleId: user?.roleId || '',
    email: user?.email || '',
    emails: user?.emails || [{ email: '', label: '' }],
    phoneNumbers: user?.phoneNumbers || [
      { country: '', phoneNumber: '', label: '' },
    ],
    address: user?.address || '',
    city: user?.city || '',
    birthday: user?.birthday ? new Date(user?.birthday) : null,
    aboutMe: user?.aboutMe || '',
    isActive: user?.isActive || active,
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
    if (pathName) {
      reset(defaultValues);
    }
  }, []);

  useEffect(() => {
    if (!pathName) {
      dispatch(getUser({ id }));
    }
  }, [dispatch, routeParams, id]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };
  const handleToggleNewPassword = () => {
    setShowNewPassword(!showNewPassword);
  };

  /**
   * Form Submit
   */
  function onSubmit(data) {
    if (!pathName) {
      data.background = user.background; // change from base64 to image path
      data.avatar = user.avatar; // change from base64 to image path
      const formData = new FormData();

      formData.append('background', backgroundFile);
      formData.append('avatar', avatarFile);
      formData.append('user', JSON.stringify(data));

      dispatch(updateUser({ id: user._id, user: formData, dispatch }));
    } else {
      // new user
      const formData = new FormData();

      formData.append('background', backgroundFile);
      formData.append('avatar', avatarFile);
      formData.append('user', JSON.stringify(data));
      dispatch(addUser(formData));
    }
    navigate('/settings');
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
      <Card component={motion.div} variants={item} className="w-full mb-32">
        {/* <div className="px-32 pt-24">
          <Typography className="text-2xl font-semibold leading-tight">
            General Information
          </Typography>
        </div> */}

        <CardContent className="px-32 py-24">
          <>
            <Controller
              control={control}
              name="background"
              render={({ field: { onChange, value } }) => (
                <Box
                  sx={{
                    borderWidth: 4,
                    borderStyle: 'solid',
                    borderColor: 'background.paper',
                  }}
                  className="relative w-full h-160 sm:h-192 px-32 sm:px-48"
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div>
                      <label
                        htmlFor="buttonBackground"
                        className="flex p-8 cursor-pointer"
                      >
                        <input
                          accept="image/*"
                          className="hidden"
                          id="buttonBackground"
                          type="file"
                          onChange={async (e) => {
                            setBackgroundFile(e.target.files[0]);

                            function readFileAsync() {
                              return new Promise((resolve, reject) => {
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
                        <FuseSvgIcon className="text-white">
                          heroicons-outline:camera
                        </FuseSvgIcon>
                      </label>
                    </div>

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
                    className="absolute inset-0 object-cover w-full h-full"
                    src={value}
                    alt=""
                  />
                </Box>
              )}
            />

            <div className="relative flex flex-col flex-auto items-center px-24 sm:px-48">
              <div className="w-full">
                <div className="flex flex-auto items-end -mt-64">
                  <Controller
                    control={control}
                    name="avatar"
                    render={({ field: { onChange, value } }) => (
                      <Box
                        sx={{
                          borderWidth: 4,
                          borderStyle: 'solid',
                          borderColor: 'background.paper',
                        }}
                        className="relative flex items-center justify-center w-128 h-128 rounded-full overflow-hidden"
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
                                  setAvatarFile(e.target.files[0]);
                                  onChange(URL.createObjectURL(e.target.files[0]));
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
                          alt={user ? user.firstName : null}
                        >
                          {user ? user.firstName?.charAt(0) : null}
                        </Avatar>
                      </Box>
                    )}
                  />
                </div>
              </div>
              <Controller
                control={control}
                name="displayName"
                render={({ field }) => (
                  <TextField
                    size="small"
                    className="mt-32"
                    {...field}
                    label="Display Name"
                    placeholder="Display Name"
                    id="displayName"
                    error={!!errors.displayName}
                    helperText={errors?.displayName?.message}
                    variant="outlined"              
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FuseSvgIcon size={20}>
                            heroicons-solid:user-circle
                          </FuseSvgIcon>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Grid className="mt-16" container spacing={2}>
                <Grid item xs={6}>
                  <Controller
                    name="firstName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        {...field}
                        label="First Name"
                        variant="outlined"
                        fullWidth
                        error={!!errors.firstName}
                        helperText={errors?.firstName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        {...field}
                        label="Last Name"
                        variant="outlined"
                        fullWidth
                        error={!!errors.lastName}
                        helperText={errors?.lastName?.message}
                      
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Grid className="mt-32  border" container spacing={0}>
                <Grid className="ml-20" item xs={6}>
                  <Controller
                    name="gender"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <RadioGroup size="small" {...field} row>
                        <FormControlLabel
                          value="Male"
                          control={<Radio />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="Female"
                          control={<Radio />}
                          label="Female"
                        />
                      </RadioGroup>
                    )}
                  />
                </Grid>
              </Grid>

             
              <Controller
                control={control}
                name="jobPosition"
                render={({ field }) => (
                  <TextField
                    size="small"
                    className="mt-32"
                    {...field}
                    label="Job Position"
                    placeholder="Job Position"
                    id="jobPosition"
                    variant="outlined"
                    fullWidth
                    error={!!errors.jobPosition}
                    helperText={errors?.jobPosition?.message}
                  
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FuseSvgIcon size={20}>
                            heroicons-solid:briefcase
                          </FuseSvgIcon>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                name="roleId"
                control={control}
                render={({ field }) => (
                  <TextField
                    className="mt-32"
                    {...field}
                    fullWidth
                    select
                    label="Role"
                    name="roleId"
                    variant="outlined"
                    size="small"
                    error={!!errors.roleId}
                    helperText={errors?.roleId?.message}
                  
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FuseSvgIcon size={20}>
                            heroicons-solid:office-building
                          </FuseSvgIcon>
                        </InputAdornment>
                      ),
                    }}
                  >
                    {roles.map((role) => (
                      <MenuItem value={role._id} className="capitalize">{role.name}</MenuItem>
                    ))}
                  </TextField>
                )}
              />

              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mt-24"
                    label="Email"
                    type="email"
                    error={!!errors.email}
                    helperText={errors?.email?.message}
                    variant="outlined"
                  
                    fullWidth
                  />
                )}
              />

              <Controller
                control={control}
                name="phoneNumbers"
                render={({ field }) => (
                  <PhoneNumberSelector
                    size="small"
                    className="mt-32"
                    {...field}
                    error={!!errors.phoneNumbers}
                    helperText={errors?.phoneNumbers?.message}
                  
                  />
                )}
              />
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <TextField
                    className="mt-32"
                    {...field}
                    fullWidth
                    select
                    label="City"
                    name="city"
                    variant="outlined"
                    size="small"
                    error={!!errors.city}
                    helperText={errors?.city?.message}
                  
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FuseSvgIcon size={20}>
                            heroicons-solid:location-marker
                          </FuseSvgIcon>
                        </InputAdornment>
                      ),
                    }}
                  >
                    <MenuItem value="Lagos">Lagos</MenuItem>
                    <MenuItem value="Port-Harcourt">Port-Harcourt</MenuItem>
                    <MenuItem value="Warri">Warri</MenuItem>
                  </TextField>
                )}
              />

              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <TextField
                    size="small"
                    className="mt-32"
                    {...field}
                    label="Address"
                    placeholder="Address"
                    id="address"
                    variant="outlined"
                    fullWidth
                    error={!!errors.address}
                    helperText={errors?.address?.message}
                  
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FuseSvgIcon size={20}>
                            heroicons-solid:location-marker
                          </FuseSvgIcon>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name="birthday"
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    className="mt-32 w-full"
                    label="Birthday"
                    variant="outlined"
                    clearable
                    showTodayButton
                    error={!!errors.birthday}
                    helperText={errors?.birthday?.message}
                  
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    className="mt-32"
                    {...field}
                    label="Password"
                    variant="outlined"
                    type={showPassword ? 'text' : 'password'}
                    fullWidth
                    error={!!errors.password}
                    helperText={errors?.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {showPassword ? (
                            <VisibilityOffIcon
                              onClick={handleTogglePassword}
                              sx={{ cursor: 'pointer' }}
                            />
                          ) : (
                            <VisibilityIcon
                              onClick={handleTogglePassword}
                              sx={{ cursor: 'pointer' }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              {!pathName && (
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      className="mt-32"
                      label="New Password"
                      type={showNewPassword ? 'text' : 'password'}
                      error={!!errors.password}
                      helperText={errors?.password?.message}
                      variant="outlined"
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            {showNewPassword ? (
                              <VisibilityOffIcon
                                onClick={handleToggleNewPassword}
                                sx={{ cursor: 'pointer' }}
                              />
                            ) : (
                              <VisibilityIcon
                                onClick={handleToggleNewPassword}
                                sx={{ cursor: 'pointer' }}
                              />
                            )}
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              )}
              <Controller
                control={control}
                name="aboutMe"
                render={({ field }) => (
                  <TextField
                    className="mt-32"
                    {...field}
                    label="About Me"
                    placeholder="About Me"
                    id="aboutMe"
                    // error={!!errors.aboutMe}
                    // helperText={errors?.aboutMe?.message}
                    //
                    variant="outlined"
                    fullWidth
                    multiline
                    minRows={5}
                    maxRows={10}
                    InputProps={{
                      className: 'max-h-min h-min items-start',
                      startAdornment: (
                        <InputAdornment className="mt-16" position="start">
                          <FuseSvgIcon size={20}>
                            heroicons-solid:menu-alt-2
                          </FuseSvgIcon>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </div>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <FormControlLabel
                  className="mt-32 mr-22"
                  sx={{ marginLeft: '19px' }}
                  control={
                    <Switch
                      {...field}
                      checked={field.value}
                      onChange={(e) => {
                        field.onChange(e.target.checked);
                        setActive(e.target.checked);
                      }}
                      name="isActive"
                      color="secondary"
                    />
                  }
                  label="Status"
                />
              )}
            />

            <Box
              className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
              sx={{ backgroundColor: 'background.default' }}
            >
              <Button
                className="ml-8"
                variant="contained"
                color="secondary"
                onClick={handleSubmit(onSubmit)}
                disabled={_.isEmpty(dirtyFields) || !isValid}
              >
                Save
              </Button>

              <Button
                className="ml-8"
                variant="contained"
                color="error"
                disabled={pathName}
                onClick={() => handleDeleteUser({ _id: routeParams.id })}
              >
                Delete
              </Button>
            </Box>
          </>
        </CardContent>
      </Card>
    </div>
  );
}

export default UserForm;
