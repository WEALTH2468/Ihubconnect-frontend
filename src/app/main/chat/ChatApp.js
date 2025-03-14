import { styled } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import withReducer from 'app/store/withReducer';
import { createContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import FusePageSimple from '@fuse/core/FusePageSimple';
import useThemeMediaQuery from '@fuse/hooks/useThemeMediaQuery';
import MainSidebar from './sidebars/main/MainSidebar';
import ContactSidebar from './sidebars/contact/ContactSidebar';
import reducer from './store';
import { getUserData } from './store/userSlice';
import UserSidebar from './sidebars/user/UserSidebar';
import { getChats } from './store/chatsSlice';
import { addChat } from './store/chatSlice';
import { socket } from 'src/app/websocket/socket';
import { getPanelChats } from 'app/theme-layouts/shared-components/chatPanel/store/chatsSlice';
import { addPanelChat } from 'app/theme-layouts/shared-components/chatPanel/store/chatSlice';
import { selectUser } from 'app/store/userSlice';

const drawerWidth = 400;

export const ChatAppContext = createContext({});

const Root = styled(FusePageSimple)(({ theme }) => ({
  '& .FusePageSimple-content': {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 100%',
    height: '100%',
  },
}));

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    maxWidth: '100%',
    overflow: 'hidden',
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
}));
function ChatApp(props) {
  const dispatch = useDispatch();
  const isMobile = useThemeMediaQuery((theme) => theme.breakpoints.down('lg'));
  const [mainSidebarOpen, setMainSidebarOpen] = useState(!isMobile);
  const [contactSidebarOpen, setContactSidebarOpen] = useState(false);
  const [userSidebarOpen, setUserSidebarOpen] = useState(false);
  const user = useSelector(selectUser)


  useEffect(() => {
    dispatch(getUserData(user._id));
    dispatch(getChats());
  }, [dispatch]);



  useEffect(() => {
    setMainSidebarOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      setMainSidebarOpen(false);
    }
  }, [location, isMobile]);

  return (
    <ChatAppContext.Provider
      value={{ setMainSidebarOpen, setContactSidebarOpen, setUserSidebarOpen }}
    >
      <Root
        content={<Outlet />}
        leftSidebarContent={<MainSidebar />}
        leftSidebarOpen={mainSidebarOpen}
        leftSidebarOnClose={() => {
          setMainSidebarOpen(false);
        }}
        leftSidebarWidth={400}
        rightSidebarContent={<ContactSidebar />}
        rightSidebarOpen={contactSidebarOpen}
        rightSidebarOnClose={() => {
          setContactSidebarOpen(false);
        }}
        rightSidebarWidth={400}
        scroll="content"
      />
      <StyledSwipeableDrawer
        className="h-full absolute z-9999"
        variant="temporary"
        anchor="left"
        open={userSidebarOpen}
        onOpen={(ev) => {}}
        onClose={() => setUserSidebarOpen(false)}
        classes={{
          paper: 'absolute left-0',
        }}
        style={{ position: 'absolute' }}
        ModalProps={{
          keepMounted: false,
          disablePortal: true,
          BackdropProps: {
            classes: {
              root: 'absolute',
            },
          },
        }}
      >
        <UserSidebar />
      </StyledSwipeableDrawer>
    </ChatAppContext.Provider>
  );
}

export default withReducer('chatApp', reducer)(ChatApp);
