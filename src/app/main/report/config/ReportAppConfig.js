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

const ReportApp = lazy(() => import('../ReportApp'));

const ReportAppConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: authRoles.user,
    routes: [
        {
            path: '/report',
            element: <ReportApp />,
        },
    ],
};

export default ReportAppConfig;
