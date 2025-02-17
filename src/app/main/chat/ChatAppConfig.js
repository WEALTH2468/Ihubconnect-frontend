import { lazy } from 'react';
import Chat from './chat/Chat';
import ChatFirstScreen from './ChatFirstScreen';
import { authRoles } from 'src/app/auth';

const ChatApp = lazy(() => import('./ChatApp'));

const ChatAppConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  auth: authRoles.employee,
  routes: [
    {
      path: '/chat',
      element: <ChatApp />,
      children: [
        {
          path: '',
          element: <ChatFirstScreen />,
        },
        {
          path: ':id',
          element: <Chat />,
        },
      ],
    },
  ],
};

export default ChatAppConfig;
