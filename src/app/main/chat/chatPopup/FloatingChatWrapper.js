import { useLocation } from 'react-router-dom';
import FloatingChat from './FloatingChat'; 

const FloatingChatWrapper = () => {
  const location = useLocation();

  // These are paths or prefixes we want to hide the chat on
  const hiddenPathPrefixes = [
    '/sign-in',
    '/sign-out',
    '/sign-up',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/verify-email',
    '/guest',
    '/chat'
  ];

  const shouldHide = hiddenPathPrefixes.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  return !shouldHide ? <FloatingChat /> : null;
};

export default FloatingChatWrapper;
