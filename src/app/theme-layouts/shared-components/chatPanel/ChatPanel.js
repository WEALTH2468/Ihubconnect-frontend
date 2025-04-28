import AppBar from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Chat from './Chat';
import ContactList from './ContactList';
import {
  getPanelContacts,
  selectPanelContacts,
  selectSelectedPanelContactId,
  // selectOpenPanelContactIds
} from './store/contactsSlice';
import {
  closeChatPanel,
  openChatPanel,
  selectChatPanelState,
} from './store/stateSlice';
import { getPanelUserData } from './store/userSlice';
import { selectUser } from 'app/store/userSlice';
import {
  addPanelMessage,
  getPanelChat,
  isRead,
  selectPanelChat,
} from './store/chatSlice';
import {
  addPanelChatAndCount,
  getPanelChats,
  updatePanelChatAndCount,
  updatePanelChat,
  addPanelChat,
} from './store/chatsSlice';
import { selectSelectedContactId } from 'src/app/main/chat/store/contactsSlice';
import { selectSocket } from 'app/store/socketSlice';
import { addMessage, updateMessage } from 'src/app/main/chat/store/chatSlice';
import addBackendProtocol from '../addBackendProtocol';
import useEmit from 'src/app/websocket/emit';
import useDestopNotification from '../notificationPanel/hooks/useDestopNotification';
import withReducer from 'app/store/withReducer';
import reducer from './store';
import keycode from 'keycode';
import { motion, AnimatePresence } from 'framer-motion';
import ContactAvatar from 'src/app/main/chat/ContactAvatar';
import useGetUserStatus from 'app/theme-layouts/shared-components/chatPanel/hooks/getUserStatus';

const Root = styled(motion.div)(({ theme }) => ({
  position: 'fixed',
  bottom: 25,
  right: 380,
  zIndex: 1300,
  width: 300,
  height: 540,
  borderRadius: 16,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',

  [theme.breakpoints.down('sm')]: {
    width: '75%',
    height: '80%',
    right: 20,
    bottom: 20,
  },

   // Extra-large screens
   [theme.breakpoints.up('xl')]: {
    height: 750, 
    right: 500,
    width: 370,
  },
}));

function ChatPanel() {
  const socket = useSelector(selectSocket);
  const dispatch = useDispatch();
  const theme = useTheme();
  const state = useSelector(selectChatPanelState);
  const contacts = useSelector(selectPanelContacts);
  const chat = useSelector(selectPanelChat);
  const selectedContactId = useSelector(selectSelectedPanelContactId);
  const selectedContactIdFromMainChat = useSelector(selectSelectedContactId);
  const user = useSelector(selectUser);
  const { emitMarkMessageSeen } = useEmit();
  const { showNotification } = useDestopNotification();
  const ref = useRef();
  const { getStatus } = useGetUserStatus();

  console.log('contactId', selectedContactId)

  const selectedContact = contacts.find(
    (_contact) => _contact._id === selectedContactId
  );


  useEffect(() => {
    dispatch(getPanelUserData());
    dispatch(getPanelContacts());
    dispatch(getPanelChats());
  }, [dispatch]);

  useEffect(() => {
    if (selectedContactId) {
      dispatch(getPanelChat(selectedContactId));
    }
  }, [selectedContactId]);

  useEffect(() => {
    const handleSendPanelChat = async (data) => {
      const message = data.message || data;
      if (
        selectedContactId !== message.userId &&
        selectedContactIdFromMainChat !== message.userId
      ) {
        if (data.chat) {
          dispatch(addPanelChatAndCount(data.chat));
        } else {
          dispatch(updatePanelChatAndCount(message));
        }
      } else {
        dispatch(isRead(message.userId)).then(() => {
          if (data.chat) {
            dispatch(addPanelChat(data.chat));
          } else {
            dispatch(updatePanelChat(message));
          }
          emitMarkMessageSeen(message._id, message.userId);
        });

        if (selectedContactId === message.userId) {
          dispatch(addPanelMessage(message));
        }
        if (selectedContactIdFromMainChat === message.userId) {
          dispatch(addMessage(message));
        }
      }
    };

    socket?.on('sendPanelChat', handleSendPanelChat);
    socket?.on('sendChat', handleSendPanelChat);

    return () => {
      socket?.off('sendPanelChat', handleSendPanelChat);
      socket?.off('sendChat', handleSendPanelChat);
    };
  }, [socket, selectedContactId, selectedContactIdFromMainChat, dispatch]);

  useEffect(() => {
    const handleMessageSeen = ({ messageId }) => {
      dispatch(updateMessage({ tempId: messageId, realMessage: { seen: true } }));
    };

    socket?.on('messageSeen', handleMessageSeen);
    return () => {
      socket?.off('messageSeen', handleMessageSeen);
    };
  }, [socket, dispatch]);


  return (
    <AnimatePresence>
      {selectedContactId && state && (
        <Root
          ref={ref}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.3 }}
        >
          <AppBar position="static" className="shadow-lg bg-[#f1f4f9]">
            <Toolbar 
            className="px-4"
            >
              <div className="flex flex-1 items-center px-12">
                 <ContactAvatar
                        id="popup"
                        data={{ ...selectedContact, status: getStatus(selectedContact._id) }}
                      />
                <Typography className="mx-16 text-16 font-bold" color="primary">
                  {selectedContact.displayName}
                </Typography>
              </div>
              <div className="flex px-4">
                <IconButton
                  // onClick={}
                  color="secondary"
                  size="medium"
                >
                  <FuseSvgIcon>heroicons-outline:video-camera</FuseSvgIcon>
                </IconButton>
                <IconButton
                  // onClick={}
                  color="secondary"
                  size="medium"
                >
                  <FuseSvgIcon>heroicons-outline:phone</FuseSvgIcon>
                </IconButton>
                <IconButton
                  onClick={() => dispatch(closeChatPanel())}
                  color="secondary"
                  size="medium"
                >
                  <FuseSvgIcon>heroicons-outline:x</FuseSvgIcon>
                </IconButton>
              </div>
            </Toolbar>
          </AppBar>

          <Paper className="flex flex-1 flex-row min-h-px shadow-0">
            <Chat className="flex flex-1 w-full" />
          </Paper>
        </Root>
      )}
    </AnimatePresence>
  
  );
}

export default withReducer('chatPanel', reducer)(memo(ChatPanel));




