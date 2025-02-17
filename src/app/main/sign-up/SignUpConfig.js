import SignUpPage from './SignUpPage';
import authRoles from '../../auth/authRoles';

const SignUpConfig = {
  settings: {
    layout: {
      config: {
        navbar: {
          display: false,
        },
        toolbar: {
          display: false,
        },
        footer: {
          display: false,
        },
        leftSidePanel: {
          display: false,
        },
        rightSidePanel: {
          display: false,
        },
      },
    },
  },
  auth: authRoles.guest,
  routes: [
    {
      path: 'sign-up',
      element: <SignUpPage />,
    },
  ],
};

export default SignUpConfig;
