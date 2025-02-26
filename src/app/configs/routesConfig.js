import FuseUtils from '@fuse/utils';
import FuseLoading from '@fuse/core/FuseLoading';
import { Navigate } from 'react-router-dom';
import settingsConfig from 'app/configs/settingsConfig';
import SignInConfig from '../main/sign-in/SignInConfig';
import SignUpConfig from '../main/sign-up/SignUpConfig';
import SignOutConfig from '../main/sign-out/SignOutConfig';
import GuestConfig from '../main/guest/GuestConfig';
import Error404Page from '../main/404/Error404Page';
import TemplateConfig from '../main/app-template/config/TemplateConfig';
import IdeskConfig from '../main/idesk/config/IdeskConfig';
import ProfileTabConfig from '../main/idesk/sub-apps/profile/config/ProfileTabConfig';
// import FileManagerAppConfig from '../main/file-manager/config/FileManagerAppConfig';
// import TasksAppConfig from '../main/tasks/config/TasksAppConfig';
import UsersAppConfig from '../main/settings/users/config/UsersAppConfig';
import ProfileConfig from '../main/profile/config/IdeskConfig';
import ForgotPasswordConfig from '../main/forgot-password/ForgotPasswordConfig';
// import DashboardAppConfig from '../main/idashboard/config/IDashboardAppConfig';
// import IcourseConfig from '../main/icourse/config/IcourseConfig';
import ReportAppConfig from '../main/report/config/ReportAppConfig';
// import FinanceAppConfig from '../main/finance/config/FinanceAppConfig';
import CrmAppConfig from '../main/crm/config/CrmAppConfig';
// import IPerformanceConfig from '../main/iperformance/config/IPerformanceConfig';
// import TeamsConfig from '../main/teams/config/TeamsConfig';
import ChatAppConfig from '../main/chat/ChatAppConfig';
// import CheckInConfig from '../main/teams/pages/checkIn/CheckInConfig';
import VerifiedEmailConfig from '../main/verified-email/verifiedEmailConfig';

const routeConfigs = [
  SignOutConfig,
  SignInConfig,
  SignUpConfig,
  GuestConfig,
  TemplateConfig,
  IdeskConfig,
  ProfileTabConfig,
  // FileManagerAppConfig,
  // TasksAppConfig,
  UsersAppConfig,
  ProfileConfig,
  ChatAppConfig,
  ForgotPasswordConfig,
  // DashboardAppConfig,
  // IcourseConfig,
  ReportAppConfig,
  // FinanceAppConfig,
  CrmAppConfig,
  // IPerformanceConfig,
  // TeamsConfig,
  // CheckInConfig,
  VerifiedEmailConfig,
];

const routes = [
  ...FuseUtils.generateRoutesFromConfigs(
    routeConfigs,
    settingsConfig.defaultAuth
  ),
  {
    path: '/',
    element: <Navigate to="/idesk" />,
    // auth: settingsConfig.defaultAuth,  does nothing for now
  },
  {
    path: 'loading',
    element: <FuseLoading />,
  },
  {
    path: '404',
    element: <Error404Page />,
  },
  {
    path: '*',
    element: <Navigate to="404" />,
  },
];

export default routes;
