import i18next from 'i18next';

import en from '../i18n/en';
import tr from '../i18n/tr';
import ar from '../i18n/ar';

import authRoles from '../../../auth/authRoles';
 
i18next.addResourceBundle('en', 'examplePage', en);
i18next.addResourceBundle('tr', 'examplePage', tr);
i18next.addResourceBundle('ar', 'examplePage', ar);

/**
 * Lazy load Example
 */
import { lazy } from 'react';

const TemplatePageLayout = lazy(() => import('../layout/TemplatePageLayout'));

const TemplateConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.user,
  routes: [
    {
      path: '/app-template',
      element: <TemplatePageLayout />,
    },
  ],
};

export default TemplateConfig;

