import i18next from 'i18next';
import { Navigate } from 'react-router-dom';
// import authRoles from '../../../auth/authRoles';
import { authRoles } from 'src/app/auth';

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

const IdeskPageLayout = lazy(() => import('../layout/IdeskPageLayout'));
const IdeskTab = lazy(() => import('../sub-apps/idesk/IdeskTab'));
const ProfileTab = lazy(() => import('../sub-apps/profile/ProfileTab'));
const ScoreCardTab = lazy(() => import('../sub-apps/score-card/ScoreCardTab'));

const IdeskConfig = {
    settings: {
        layout: {
            config: {},
        },
    },
    auth: authRoles.customer,
    routes: [
        {
            path: '/idesk',
            element: <IdeskPageLayout />,
            auth: authRoles.customer,
        },
    ],
};

export default IdeskConfig;
