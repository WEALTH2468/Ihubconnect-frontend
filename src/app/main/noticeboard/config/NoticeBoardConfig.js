import i18next from 'i18next';
import authRoles from '../../../auth/authRoles';


import en from '../i18n/en';
import tr from '../i18n/tr';
import ar from '../i18n/ar';
 
i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);
/**
 * Lazy load Example
 */
import { lazy } from 'react';

const NoticeBoardPageLayout = lazy(() => import('../layout/NoticeBoardPageLayout'));
// const TemplateApp = lazy(() => import('../TemplateApp'));

const NoticeBoardConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
    auth: authRoles.staff,

  routes: [
    {
      path: '/noticeboard',
      element: <NoticeBoardPageLayout />,
    },
  ],
};

export default NoticeBoardConfig;

