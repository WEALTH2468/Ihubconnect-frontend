import { useEffect, useState } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import _ from "@lodash";
import AvatarGroup from "@mui/material/AvatarGroup";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import FormHelperText from "@mui/material/FormHelperText";
import jwtService from "../../auth/services/jwtService";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "app/store/fuse/messageSlice";
import CircularProgress from '@mui/material/CircularProgress';
import { getRandomUserAvatars } from 'app/store/userSlice';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';
import { selectCompanyProfile } from 'src/app/main/settings/users/store/settingsSlice'; 
import  { AhavaCheck } from '@fuse/utils/ahavaCheck';



/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  firstName: yup.string().required("You must enter first name"),
  lastName: yup.string().required("You must enter last name"),
  email: yup
    .string()
    .email("You must enter a valid email")
    .required("You must enter a email"),
  password: yup
    .string()
    .required("Please enter your password.")
    .min(8, "Password is too short - should be 8 chars minimum."),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  acceptTermsConditions: yup
    .boolean()
    .oneOf([true], "The terms and conditions must be accepted."),
});



const defaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  passwordConfirm: "",
  acceptTermsConditions: false,
};

function SignUpPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSaving, setIsSaving] = useState(false);

  const { control, formState, handleSubmit, reset } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const randomUserAvatars = useSelector(({ user }) => user.randomUserAvatars);
  const company = useSelector(selectCompanyProfile);
  
          // Fetch avatars on mount
  useEffect(() => {
    dispatch(getRandomUserAvatars());
  }, [dispatch]);


    useEffect(() => {
       if (AhavaCheck()) {
         document.title =
             'Ahava Tribe – United in Ministry, Serving with Purpose – Sign Up';
     } else {
         document.title =
             'Ihub Connect - Team Work and Value Creation - Sign Up';
     }
   }, []);

  const { isValid, dirtyFields, errors, setError } = formState;

  function onSubmit({ firstName, lastName, password, email }) {

    setIsSaving(true);
    jwtService
      .createTempUser({
        firstName,
        lastName,
        password,
        email,
      })
      .then((user) => {
        navigate('/auth/verify-email');
        dispatch(showMessage({ message: `Welcome ${firstName} ${lastName}. Please verify your email.`,
          variant: 'success'
         }));
      })
      .catch((errorResponse) => {
        const _errors = errorResponse
        // Check if _errors is an array
        if (Array.isArray(_errors)) {
          _errors.forEach((error) => {
            const message = error.message || 'An unknown error occurred ooo.';
            const statusCode = error.status || 'unknown';
            if (statusCode === 409) {
             dispatch(showMessage({ message: message, variant: 'warning' }));
            } else {
              dispatch(showMessage({ message: message, variant: 'error' }));
            }
          });
        } else {
          // Fallback for unexpected error structures
          const fallbackMessage =
            errorResponse?.message ||
            'An unexpected error occurred.';
          dispatch(showMessage({ message: fallbackMessage, variant: 'error' }));
        }
        setIsSaving(false);
      });
    reset({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
      acceptTermsConditions: false
    });
  }

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full 
      sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <img className="w-48" src={addBackendProtocol(company?.logo)} alt="logo" />

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Sign up
          </Typography>
          <div className="flex items-baseline mt-2 font-medium">
            <Typography>Already have an account?</Typography>
            <Link className="ml-4" to="/sign-in" >
              Sign in
            </Link>
          </div>

          <form
            name="registerForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="firstName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="First name"
                  autoFocus
                  type="name"
                  error={!!errors.firstName}
                  helperText={errors?.firstName?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="lastName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Last name"
                  
                  type="name"
                  error={!!errors.lastName}
                  helperText={errors?.lastName?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                  
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
                  type="password"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant="outlined"
                  required
                  fullWidth
                 
                />
              )}
            />

            <Controller
              name="passwordConfirm"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Password (Confirm)"
                  type="password"
                  error={!!errors.passwordConfirm}
                  helperText={errors?.passwordConfirm?.message}
                  variant="outlined"
                  required
                  fullWidth
                 
                />
              )}
            />

            <Controller
              name="acceptTermsConditions"
              control={control}
              render={({ field }) => (
                <FormControl
                  className="items-center"
                  error={!!errors.acceptTermsConditions}
                >
                  <FormControlLabel
                    label="I agree to the Terms of Service and Privacy Policy"
                    control={ <Checkbox
                      size="small"
                      {...field}
                     
                    />
                  }
                />                 
                  <FormHelperText>
                    {errors?.acceptTermsConditions?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />

            <Button
              variant="contained"
              className="w-full mt-24"
              aria-label="Register"
              disabled={_.isEmpty(dirtyFields) || !isValid || isSaving}
              type="submit"
              size="large"
              color="secondary"
            >
              {isSaving ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                ' Create your free account'
              )}
            </Button>
          </form>
        </div>
      </Paper>

      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundColor: 'primary.main' }}
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
                   {AhavaCheck() ? (
                       <>
                         <div className="text-7xl font-bold leading-none text-white">
                           <div>Welcome to</div>
                           <div>Ahava Tribe</div>
                         </div>
                         <div className="mt-24 text-lg tracking-tight leading-6 text-white">
                         Empowering ministries to stay connected, organized, and impactful. Whether you're leading a small group or a large congregation, We helps you manage communication, streamline operations, and grow your mission with ease.                  </div>
                       </>
                     ) : (
                       <>
                         <div className="text-7xl font-bold leading-none text-white">
                         <div>Welcome to</div>
                         <div>iHubconnect</div>
                       </div>
                       <div className="mt-24 text-lg tracking-tight leading-6 text-white">
                         Helping organizations boost productivity, improve communication, and track performance effortlessly. Whether you manage a small team or a large enterprise, iHub Connect is the smarter way to work.
                       </div>
                       </>
                     )}
                   </div>
                   <div className="flex items-center mt-32">
                   <AvatarGroup
                           max={4} // Display only 4 avatars
                           sx={{
                             '& .MuiAvatar-root': {
                               borderColor: 'secondary.main',
                             },
                           }}
                         >
                           {randomUserAvatars?.length > 0
                             ? randomUserAvatars.slice(0, 4).map((avatar, index) => <Avatar key={index} src={addBackendProtocol(avatar)} />)
                             : // Fallback avatars if API returns empty
                               [ ].map((avatar, index) => <Avatar key={index} src={avatar} />)}
                         </AvatarGroup>
       
                         {AhavaCheck() ? (
                       <>
                         <div className="ml-16 font-medium tracking-tight text-white">
                         Your ministry team is already here — now it's your turn to make an impact.
                     </div>
                       </>
                     ) : (
                       <>
                        <div className="ml-16 font-medium tracking-tight text-white">
                     All of your colleague are here, it's your turn
                     </div>
                       </>
                     )}
       
                    
                   </div>
                 </div>
      </Box>
    </div>
  );
}

export default SignUpPage;