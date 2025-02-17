import { lazy } from 'react';
import ContactView from '../contact/ContactView';
import ContactForm from '../contact/ContactForm';

const ProfileTab = lazy(() => import('../ProfileTab'));

const ProfileTabConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: '/idesk',
      element: <ProfileTab />,
      children: [
        {
          path: ':id',
          element: <ContactView />,
        },
        {
          path: ':id/edit',
          element: <ContactForm />,
        },
      ],
    },
  ],
};

export default ProfileTabConfig;
