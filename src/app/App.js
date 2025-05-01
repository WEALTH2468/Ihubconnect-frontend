// Import necessary modules and components from various libraries
import '@mock-api';
import BrowserRouter from '@fuse/core/BrowserRouter';
import FuseLayout from '@fuse/core/FuseLayout';
import FuseTheme from '@fuse/core/FuseTheme';
import { SnackbarProvider } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { selectCurrentLanguageDirection } from 'app/store/i18nSlice';
import { selectUser } from 'app/store/userSlice';
import themeLayouts from 'app/theme-layouts/themeLayouts';
import { selectMainTheme } from 'app/store/fuse/settingsSlice';
import FuseAuthorization from '@fuse/core/FuseAuthorization';
import settingsConfig from 'app/configs/settingsConfig';
import withAppProviders from './withAppProviders';
import { AuthProvider } from './auth/AuthContext';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { logoutUser } from 'app/store/userSlice';

// Import WebSocket-related functions and actions
import { disconnectSocket, initializeSocket } from './websocket/socket';
import { selectRoleById, selectRoles } from './store/roleSlice';
import { getUsers } from './main/settings/users/store/usersSlice';
import { getDepartments, getUnits } from './store/settingsSlice';
import { getLogo } from './main/settings/users/store/settingsSlice';
import {
  addCommentToStore,
  addDislikeToStore,
  addLikeToStore,
  addPostToStore,
  deleteCommentFromStore,
  deletePostFromStore,
  getPosts,
  updatePostToStore,
} from './main/idesk/sub-apps/idesk/store/postSlice';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  setOnlineUsers,
  updatePanelStatus,
} from './theme-layouts/shared-components/chatPanel/store/contactsSlice';
import { selectSocket } from './store/socketSlice';
import useEmit from './websocket/emit';
import { getRolePermissions, selectRolePermissions } from './store/rolePermissionsSlice';
import AbilityProvider from './AbilityContext';
import FloatingChatWrapper from './main/chat/chatPopup/FloatingChatWrapper';


// Axios HTTP Request defaults
axios.defaults.baseURL = `${process.env.REACT_APP_BASE_BACKEND}`;

window.REACT_APP_FRONTEND_DOMAIN = window.location.origin;

console.log(window.REACT_APP_FRONTEND_DOMAIN);



// Options for emotion cache, supporting RTL and LTR
const emotionCacheOptions = {
  rtl: {
    key: 'muirtl',
    stylisPlugins: [rtlPlugin],
    insertionPoint: document.getElementById('emotion-insertion-point'),
  },
  ltr: {
    key: 'muiltr',
    stylisPlugins: [],
    insertionPoint: document.getElementById('emotion-insertion-point'),
  },
};

function App() {
  const { emitGetUsers } = useEmit();
  // Hook to dispatch actions in Redux
  const dispatch = useDispatch();
  const socket = useSelector(selectSocket);

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnReconnect: 'always',
      },
    },
  });

  // Selectors to access state from the Redux store
  const user = useSelector(selectUser);
  const langDirection = useSelector(selectCurrentLanguageDirection);
  const mainTheme = useSelector(selectMainTheme);
  const role = useSelector((state) => selectRoleById(state, user.roleId));

  useEffect(() => {
    if (user.roleId) {
      dispatch(getRolePermissions(user.roleId));
    }
  }, [user])


  const permissions = useSelector(state => selectRolePermissions(state));


  const getAction = (type) => {
    let action;
    const map = {
      updatePost: (post) => {
        if (post) dispatch(updatePostToStore({ id: post._id, changes: post }));
      },
      addPost: (post) => {
        if (post) dispatch(addPostToStore(post));
      },
      deletePost: (post) => {
        if (post) dispatch(deletePostFromStore(post._id));
      },
      addLike: (post) => {
        if (post) dispatch(addLikeToStore({ id: post._id, changes: post }));
      },
      addDislike: (post) => {
        if (post) dispatch(addDislikeToStore({ id: post._id, changes: post }));
      },
      addComment: (comment) => {
        if (comment) dispatch(addCommentToStore(comment));
      },
      deleteComment: (comment) => {
        if (comment) dispatch(deleteCommentFromStore(comment));
      },
    };

    action =
      map[type] ??
      function (arg) {
        alert('No Action Passed');
      };

    return action;
  };

  useEffect(() => {
    // Initialize socket on mount
    const initializedSocket = initializeSocket(dispatch);
    return () => {
      // Disconnect socket on unmount
      disconnectSocket(dispatch, initializedSocket);
    };
  }, [dispatch, user]);

  // Function to handle updating status
  const handleGetUsersAndPosts = () => {
    dispatch(getUsers());
    dispatch(getPosts());
  };

  const handleSetOnlineUsers = (data) => {
    dispatch(setOnlineUsers(data));
  };

  // Effect to handle online status updates via WebSocket
  useEffect(() => {
    if (socket) {
      emitGetUsers();
      socket.on('emitGetUsers', handleGetUsersAndPosts);
      socket.on('onlineUsers', handleSetOnlineUsers);
      socket?.on('refreshPost', ({ action, payload }) => {
        getAction(action)(payload);
      });

      return () => {
        socket?.off('onlineUsers');
        socket?.off('emitGetUsers');
        socket?.off('refreshPost');
      };
    }
  }, [socket]);

  // Effect to fetch initial data when the component mounts
  useEffect(() => {
    dispatch(getUnits());
    dispatch(getUsers());
    dispatch(getLogo());
  }, [dispatch]);

  // Render the application with necessary providers and components
  return (
    <QueryClientProvider client={queryClient}>
      <CacheProvider value={createCache(emotionCacheOptions[langDirection])}>
        <FuseTheme theme={mainTheme} direction={langDirection}>
          <AuthProvider>
            <AbilityProvider permissions={user.permissions}>
              <BrowserRouter>
                <FuseAuthorization
                  userRole={role ? role.name.toLowerCase() : user.role}
                  loginRedirectUrl={settingsConfig.loginRedirectUrl}
                >
                  <SnackbarProvider
                    maxSnack={5}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'right',
                    }}
                    classes={{
                      containerRoot:
                        'bottom-0 right-0 mb-52 md:mb-68 mr-8 lg:mr-80 z-99',
                    }}
                  >
                    {/* MAIN LAYOUT */}
                    <FuseLayout layouts={themeLayouts} />
  
                    {/* 👉 FLOATING CHAT BUTTON — global and floating */}
                    <FloatingChatWrapper />
                  </SnackbarProvider>
                </FuseAuthorization>
              </BrowserRouter>
            </AbilityProvider>
          </AuthProvider>
        </FuseTheme>
      </CacheProvider>
  
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
  
}

// Export the App component wrapped with application providers
export default withAppProviders(App)();
