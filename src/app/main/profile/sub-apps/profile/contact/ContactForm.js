import Button from "@mui/material/Button";
import NavLinkAdapter from "@fuse/core/NavLinkAdapter";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import FuseLoading from "@fuse/core/FuseLoading";
import _ from "@lodash";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import Box from "@mui/system/Box";
import FuseSvgIcon from "@fuse/core/FuseSvgIcon";
import Avatar from "@mui/material/Avatar";
// import TextField from '@mui/material/TextField';
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete";
import Checkbox from "@mui/material/Checkbox/Checkbox";
import { DatePicker, DateTimePicker, TimePicker } from "@mui/x-date-pickers";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";
import Typography from "@mui/material/Typography";
import {
  ContentPasteSearchTwoTone,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import {
  Radio,
  FormControlLabel,
  RadioGroup,
  TextField,
  MenuItem,
  Grid,
  Select,
} from "@mui/material";

import { updateUserData } from "app/store/userSlice";
import { selectCountries } from "../store/countriesSlice";
import { selectTags } from "../store/tagsSlice";
import ContactEmailSelector from "./email-selector/ContactEmailSelector";
import PhoneNumberSelector from "./phone-number-selector/PhoneNumberSelector";
import { selectUser } from "app/store/userSlice";
import jwtService from "../../../../../auth/services/jwtService";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  // background: yup.string().required("You must add background image"),
  // avatar: yup.string().required("You must add profile photo"),
  displayName: yup.string().required("You must enter a name"),
  firstName: yup.string().required("You must enter a firstName"),
  lastName: yup.string().required("You must enter a lastName"),
  gender: yup.string().required("You must select gender"),
  departments: yup.array().required("You must pick a department"),
  units: yup.array().required("You must pick a unit"),
  jobPosition: yup.string().required("You must enter your job position"),
  emails: yup.array().required("You must enter your email"),
  phoneNumbers: yup.array().required("You must enter your phone number"),
  address: yup.string().required("You must enter your address"),
  city: yup.string().required("You must enter your city"),
  birthday: yup.date().required("You must enter your birth date"),
  aboutMe: yup.string().required("You must say something about yourself"),
});

const ContactForm = ({ setEdit, }) => {
  const [backgroundFile, setBackgroundFile] = useState(null);
  const [avatarFile, setAvatarFile  ] = useState(null);
  const dispatch = useDispatch();

  const userData = useSelector(selectUser);
  const countries = useSelector(selectCountries);
  const [showPassword, setShowPassword] = useState(false);

  function getCountryByIso(iso) {
    return countries.find((country) => country.iso === iso);
  }
  const tagDepartments = [
    { id: 1, title: "ICT Department" },
    { id: 2, title: "HSE Department" },
  ];
  const tagUnits = [
    { id: 1, title: "Unit One" },
    { id: 2, title: "Unit Two" },
  ];

  const defaultValues = {
    background: userData.background || "",
    avatar: userData.avatar || "",
    displayName: userData.displayName || "",
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    gender: userData.gender || "",
    departments: userData.departments,
    units: userData.units,
    jobPosition: userData.jobPosition || "",
    role: userData.role || "",
    emails: userData.emails || [{ email: "", label: "" }],
    phoneNumbers: userData.phoneNumbers || [
      { country: "", phoneNumber: "", label: "" },
    ],
    address: userData.address || "",
    city: userData.city || "",
    birthday: new Date(userData.birthday) || "",
    aboutMe: userData.aboutMe || "",
  };


  const { control, watch, reset, handleSubmit, formState, getValues } = useForm(
    {
      mode: "onChange",
      defaultValues,
      resolver: yupResolver(schema),
    }
  );

  const { isValid, dirtyFields, errors } = formState;

  const form = watch();

  useEffect(() => {
    reset(defaultValues);
  }, [userData, reset]);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  /**
   * Form Submit
   */
  function onSubmit(data) {
    data.background = userData.background; //change from base64 to image path
    data.avatar = userData.avatar; // change from base64 to image path

    const formData = new FormData();

    formData.append("background", backgroundFile);
    formData.append("avatar", avatarFile);
    formData.append("user", JSON.stringify(data));
    dispatch(updateUserData({id:userData._id, user:formData}));

  }

  if (_.isEmpty(form) || !userData) {
    return <FuseLoading />;
  }

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
                  required
                  sx={{
                    borderWidth: 4,
                    borderStyle: "solid",
                    borderColor: "background.paper",
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
                        required
                        sx={{
                          borderWidth: 4,
                          borderStyle: "solid",
                          borderColor: "background.paper",
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
                                onChange("");
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
                            backgroundColor: "background.default",
                            color: "text.secondary",
                          }}
                          className="object-cover w-full h-full text-64 font-bold"
                          src={value}
                          alt={userData.name}
                        >
                          {userData.name?.charAt(0)}
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
                    required
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
                        required
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
                        required
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
                name="departments"
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    id="departments"
                    className="mt-32"
                    options={tagDepartments}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.title}
                    renderOption={(_props, option, { selected }) => (
                      <li {..._props}>
                        <Checkbox
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.title}
                      </li>
                    )}
                    value={
                      value
                        ? value.map((id) => _.find(tagDepartments, { id }))
                        : []
                    }
                    onChange={(event, newValue) => {
                      onChange(newValue.map((item) => item.id));
                    }}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        label="Departments"
                        placeholder="Departments"
                      />
                    )}
                  />
                )}
              />

              <Controller
                control={control}
                name="units"
                render={({ field: { onChange, value } }) => (
                  <Autocomplete
                    multiple
                    id="units"
                    className="mt-32"
                    options={tagUnits}
                    disableCloseOnSelect
                    getOptionLabel={(option) => option.title}
                    renderOption={(_props, option, { selected }) => (
                      <li {..._props}>
                        <Checkbox
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.title}
                      </li>
                    )}
                    value={
                      value ? value.map((id) => _.find(tagUnits, { id })) : []
                    }
                    onChange={(event, newValue) => {
                      onChange(newValue.map((item) => item.id));
                    }}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        size="small"
                        {...params}
                        label="Units"
                        placeholder="Units"
                      />
                    )}
                  />
                )}
              />

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
                    required
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
                control={control}
                name="role"
                render={({ field }) => (
                  <TextField
                    size="small"
                    disabled
                    className="mt-32"
                    {...field}
                    label="Role"
                    placeholder="Role"
                    id="role"
                    variant="outlined"
                    fullWidth
                    error={!!errors.role}
                    helperText={errors?.role?.message}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FuseSvgIcon size={20}>
                            heroicons-solid:office-building
                          </FuseSvgIcon>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <Controller
                control={control}
                name="emails"
                render={({ field }) => (
                  <ContactEmailSelector
                    size="small"
                    className="mt-32"
                    {...field}
                    error={!!errors.emails}
                    helperText={errors?.emails?.message}
                    required
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
                    required
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
                    required
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
                    required
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
                    required
                  />
                )}
              />
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
                    // required
                    variant="outlined"
                    fullWidth
                    multiline
                    minRows={5}
                    maxRows={10}
                    InputProps={{
                      className: "max-h-min h-min items-start",
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

<Grid className="mt-16" container spacing={2}>
                <Grid item xs={6}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        {...field}
                        label="Password"
                        variant="outlined"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors?.password?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Controller
                    name="newPassword"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        {...field}
                        label="New Password"
                        variant="outlined"
                        fullWidth
                        error={!!errors.password}
                        helperText={errors?.password?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </div>

            <Box
              className="flex items-center mt-40 py-14 pr-16 pl-4 sm:pr-48 sm:pl-36 border-t"
              sx={{ backgroundColor: "background.default" }}
            >
              <Button
                className="ml-auto"
                onClick={() => setEdit((prev) => !prev)}
              >
                Cancel
              </Button>
              <Button
                className="ml-8"
                variant="contained"
                color="secondary"
                disabled={_.isEmpty(dirtyFields) || !isValid}
                onClick={handleSubmit(onSubmit)}
              >
                Save
              </Button>
            </Box>
          </>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactForm;
