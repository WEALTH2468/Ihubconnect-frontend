import ForgotPasswordPage from './ForgotPasswordPage';
import ResetPasswordPage from './ResetPasswordPage';
import authRoles from '../../auth/authRoles';

const ForgotPasswordConfig = {
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
            path: '/auth/forgot-password',
            element: <ForgotPasswordPage />,
        },
    ],

    routes: [
        {
            path: '/auth',
            children: [
                {
                    path: 'forgot-password',
                    element: <ForgotPasswordPage />,
                },
                {
                    path: 'reset-password/:token',
                    element: <ResetPasswordPage />,
                },
            ],
        },
    ],
};

export default ForgotPasswordConfig;
