import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import _ from '@lodash';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useEffect } from 'react';
import jwtService from '../../auth/services/jwtService';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'app/store/fuse/messageSlice';
import { useState } from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CircularProgress from '@mui/material/CircularProgress';
import { getRandomUserAvatars } from 'app/store/userSlice';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
    email: yup
        .string()
        .email('You must enter a valid email')
        .required('You must enter a email'),
    password: yup
        .string()
        .required('Please enter your password.')
        .min(4, 'Password is too short - must be at least 4 chars.'),
});

const defaultValues = {
    email: '',
    password: '',
    remember: true,
};

function SignInPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useDispatch();
    const { control, formState, handleSubmit, setError, setValue } = useForm({
        mode: 'onChange',
        defaultValues,
        resolver: yupResolver(schema),
    });

    const randomUserAvatars = useSelector(({ user }) => user.randomUserAvatars);


    // Fetch avatars on mount
  useEffect(() => {
    dispatch(getRandomUserAvatars());
  }, [dispatch]);


    useEffect(() => {
        document.title =
            'Ihub Connect - Team Work and Value Creation - Sign In';
    }, []);

    const { isValid, dirtyFields, errors } = formState;

    useEffect(() => {
        setValue('email', '', { shouldDirty: true, shouldValidate: true });
        setValue('password', 'user', {
            shouldDirty: true,
            shouldValidate: true,
        });
    }, [setValue]);

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    function onSubmit({ email, password }) {
        
    setIsSaving(true);
        jwtService
          .signInWithEmailAndPassword(email, password)
          .then((user) => {
            // No need to do anything, user data will be set at app/auth/AuthContext
          })
          .catch((errorResponse) => {
            const _errors = errorResponse;
            // Check if _errors is an array
            if (Array.isArray(_errors)) {
              _errors.forEach((error) => {
                const message =
                  error.message || 'An unknown error occurred ooo.';
                const statusCode = error.status || 'unknown';
                if (statusCode === 404) {
                  dispatch(
                    showMessage({ message: message, variant: 'warning' })
                  );
                } else if (statusCode === 401) {
                  dispatch(showMessage({ message: message, variant: 'error' }));
                } else {
                    dispatch(
                        showMessage({ message: message, variant: 'error' })
                    );
                    }
              });
            } else {
              // Fallback for unexpected error structures
              const fallbackMessage =
                errorResponse?.message || 'An unexpected error occurred.';
              dispatch(
                showMessage({ message: fallbackMessage, variant: 'error' })
              );
            }
            setIsSaving(false);
          });
    }

    return (
      <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
        <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
          <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
            <img
              className="w-48"
              src="assets/images/logo/logo.svg"
              alt="logo"
            />

            <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight text-[#cd7923]">
              Sign in
            </Typography>
            <div className="flex items-baseline mt-2 font-medium">
              <Typography>Don't have an account?</Typography>
              <Link className="ml-4 text-[#f17e44] !text-[#f17e44]" to="/sign-up">
                Sign up
              </Link>
            </div>

            <form
              name="loginForm"
              noValidate
              className="flex flex-col justify-center w-full mt-32"
              onSubmit={handleSubmit(onSubmit)}
            >
             <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Email"
                  autoFocus
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                  // sx={{
                  //   '& .MuiOutlinedInput-root': {
                  //     '&:hover fieldset': {
                  //       borderColor: '#c96632', // Hover color
                  //     },
                  //     '&.Mui-focused fieldset': {
                  //       borderColor: '#f17e44', // Focused (clicked) color
                  //     },
                  //   },
                  // }}
                />
              )}
            />


              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    className="mb-24"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    error={!!errors.password}
                    helperText={errors?.password?.message}
                    variant="outlined"
                    required
                    fullWidth
                    // sx={{
                    //   '& .MuiOutlinedInput-root': {
                    //     '&:hover fieldset': {
                    //       borderColor: '#c96632', // Hover color
                    //     },
                    //     '&.Mui-focused fieldset': {
                    //       borderColor: '#f17e44', // Focused (clicked) color
                    //     },
                    //   },
                    // }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {showPassword ? (
                            <VisibilityOffIcon
                              onClick={handleTogglePassword}
                              sx={{
                                cursor: 'pointer',
                              }}
                            />
                          ) : (
                            <VisibilityIcon
                              onClick={handleTogglePassword}
                              sx={{
                                cursor: 'pointer',
                              }}
                            />
                          )}
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />

              <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
                <Controller
                  name="remember"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormControlLabel
                             label="Remember me"
                             control={
                               <Checkbox
                                 size="small"
                                 {...field}
                                 sx={{
                                   color: '#f17e44', // Unchecked color
                                   '&.Mui-checked': {
                                     color: '#f17e44', // Checked color
                                   },
                                 }}
                               />
                             }
                           />                             

                    </FormControl>
                  )}
                />

                <Link
                  className="text-md font-medium text-[#f17e44] !text-[#f17e44]"
                  to="/auth/forgot-password"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                  variant="contained"
                  className="w-full mt-16"
                  aria-label="Sign in"
                  disabled={_.isEmpty(dirtyFields) || !isValid}
                  type="submit"
                  size="large"
                  sx={{
                    backgroundColor: '#f17e44',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#cd7923', // A darker shade for hover
                    },
                  }}
                >
                  {isSaving ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign in'
                  )}
                </Button>

            </form>
          </div>
        </Paper>

        <Box
          className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
          sx={{  backgroundColor: '#cd7923' }}
        >
          <svg
            className="absolute inset-0 pointer-events-none"
            viewBox="0 0 960 540"
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMax slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <Box
              component="g"
              sx={{ color: 'white' }}
              className="opacity-20"
              fill="none"
              stroke="currentColor"
              strokeWidth="100"
            >
              <circle r="234" cx="196" cy="23" />
              <circle r="234" cx="790" cy="491" />
            </Box>
          </svg>
          <Box
            component="svg"
            className="absolute -top-64 -right-64 opacity-20"
            sx={{ color: 'white' }}
            viewBox="0 0 220 192"
            width="220px"
            height="192px"
            fill="none"
          >
            <defs>
              <pattern
                id="837c3e70-6c3a-44e6-8854-cc48c737b659"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect x="0" y="0" width="4" height="4" fill="currentColor" />
              </pattern>
            </defs>
            <rect
              width="220"
              height="192"
              fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
            />
          </Box>

          <div className="z-10 relative w-full max-w-2xl">
            <div className="text-7xl font-bold leading-none text-white">
              <div>Welcome to</div>
              <div>iHubconnect</div>
            </div>
            <div className="mt-24 text-lg tracking-tight leading-6 text-white">
              Helping organizations boost productivity, improve communication, and track performance effortlessly. Whether you manage a small team or a large enterprise, iHub Connect is the smarter way to work.
            </div>
            <div className="flex items-center mt-32">
            <AvatarGroup
                    max={4} // Display only 4 avatars
                    sx={{
                      '& .MuiAvatar-root': {
                        borderColor: '#f17e44',
                      },
                    }}
                  >
                    {randomUserAvatars?.length > 0
                      ? randomUserAvatars.slice(0, 4).map((avatar, index) => <Avatar key={index} src={addBackendProtocol(avatar)} />)
                      : // Fallback avatars if API returns empty
                        [ ].map((avatar, index) => <Avatar key={index} src={avatar} />)}
                  </AvatarGroup>

              <div className="ml-16 font-medium tracking-tight text-white">
              All of your colleague are here, it's your turn
              </div>
            </div>
          </div>
        </Box>
      </div>
    );
}
export default SignInPage;