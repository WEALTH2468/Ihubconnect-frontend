import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Badge } from '@mui/material';
import { memo, useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Chat from './Chat';
import ContactList from './ContactList';
import {
  getPanelContacts,
  setSelectedContactId,
  selectPanelContacts,
  selectSelectedPanelContactId,
  selectOpenPanelContactIds,
  selectDisabledPanelContactIds,
  closeChatPanelById,
  disableChatPanelById,
  enableChatPanelById
} from './store/contactsSlice';
import {
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
  selectPanelChats,
  clearCount
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

const Root = styled(motion.div, {
  shouldForwardProp: (prop) => prop !== 'index',
})(({ theme, index }) => ({
  position: 'fixed',
  bottom: 25,
  right: 350 + index * 303, // 👈 Shift each panel 350px to the right
  zIndex: 1300 + index,     // 👈 Higher z-index for panels opened later
  width: 300,
  // height: 540,
  borderRadius: 16,
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',

  [theme.breakpoints.down('sm')]: {
    width: '75%',
    height: '80%',
    right: 20 + index * 10, // 👈 small shift on mobile
    bottom: 20,
  },

  [theme.breakpoints.up('xl')]: {
    // height: 750,
    right: 470 + index * 400, // 👈 bigger offset on XL screens
    width: 370,
  },
}));


function ChatPanel() {
  const socket = useSelector(selectSocket);
  const dispatch = useDispatch();
  const theme = useTheme();
  const state = useSelector(selectChatPanelState);
  const contacts = useSelector(selectPanelContacts);
  const selectedContactIds = useSelector(selectOpenPanelContactIds);
  const selectedContactIdFromMainChat = useSelector(selectSelectedContactId);
  const user = useSelector(selectUser);
  const { emitMarkMessageSeen } = useEmit();
  const disabledContactIds = useSelector(selectDisabledPanelContactIds);
  const chats = useSelector(selectPanelChats);

  const ref = useRef();
  const { getStatus } = useGetUserStatus();

  const [collapsedPanels, setCollapsedPanels] = useState({});
  const selectedContactId = useSelector( selectSelectedPanelContactId);

  const collapsedPanelsRef = useRef({});

  const selectedContacts = selectedContactIds
  .map((id) => {
    const chat = chats.find((chat) => chat.participants.includes(id));
    const contact = contacts.find((c) => c._id === id);

    if (!contact) return null;

    return {
      ...chat,
      ...contact,
    };
  })
  .filter(Boolean);

  const handlePanelActivity = (contactId) => {
    if (selectedContactId !== contactId) {
      dispatch(setSelectedContactId(contactId));
    }
  };
  

  useEffect(() => {
    dispatch(getPanelUserData());
    dispatch(getPanelContacts());
    dispatch(getPanelChats());
  }, [dispatch]);
  
  useEffect(() => {
    if (selectedContactIds.length > 0) {
      selectedContactIds.forEach((id) => {
        dispatch(getPanelChat(id));
      });
    }
  }, [selectedContactIds, dispatch]);

  useEffect(() => {
    collapsedPanelsRef.current = collapsedPanels;
  }, [collapsedPanels]);
  

  
  useEffect(() => {
    const handleSendPanelChat = async (data) => {
      const message = data.message || data;

      console.log("message", message)
  
      if (!selectedContactIds.includes(message.userId) 
        || disabledContactIds.includes(message.userId)
        && selectedContactIdFromMainChat !== message.userId 
      ) 
      {
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
  
        if (selectedContactIds.includes(message.userId)) {
          dispatch(addPanelMessage({ contactId: message.userId, tempMessage: message }));
        }
      }

      
        if (selectedContactIdFromMainChat === message.userId) {
          dispatch(isRead(message._id))
          dispatch(clearCount(message.chatId));
          dispatch(addMessage(message));
          emitMarkMessageSeen(message._id, message.userId);
        }
        
      
      
    };
  
    socket?.on('sendPanelChat', handleSendPanelChat);
    socket?.on('sendChat', handleSendPanelChat);
  
    return () => {
      socket?.off('sendPanelChat', handleSendPanelChat);
      socket?.off('sendChat', handleSendPanelChat);
    };
  }, [socket, selectedContactIds, selectedContactIdFromMainChat, collapsedPanels]);
  

      const toggleCollapse = (contactId) => {
        setCollapsedPanels((prev) => ({
          ...prev,
          [contactId]: !prev[contactId],
        }));
      };
      
  
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
       {selectedContacts.map((contact, index) => (
          <Root
            key={contact._id}
            ref={ref}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ duration: 0.3 }}
            index={index}
          >
            <AppBar position="static" className="shadow-lg bg-[#f1f4f9]">
              <Toolbar className="px-4">
                <div className="flex flex-1 items-center px-12">
                  <Badge
                    badgeContent={contact.unreadCount}
                    color="secondary"
                    invisible={contact.unreadCount === 0}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                  >
                    <ContactAvatar
                      id="popup"
                      data={{ ...contact, status: getStatus(contact._id) }}
                    />
                  </Badge>
                  <Typography
                    className="mx-11 truncate max-w-[80%] text-16 font-bold"
                    color="primary"
                  >
                    {contact.firstName}
                  </Typography>
                </div>
  
                <div className="flex px-2 space-x-1 sm:space-x-2">
                  <IconButton
                   onClick={() => {
                    toggleCollapse(contact._id);
                  
                    const isCurrentlyCollapsed = collapsedPanels[contact._id];
                  
                    if (isCurrentlyCollapsed) {
                      dispatch(enableChatPanelById(contact._id));
                  
                      if (contact.unreadCount && contact.unreadCount > 0) {
                        dispatch(isRead(contact._id)).then(({ payload }) => {
                          if (payload?.chatId) {
                            dispatch(clearCount(payload.chatId));
                          }
                        });
                      }
                    } else {
                      dispatch(disableChatPanelById(contact._id));
                    }
                  }}
                    color="secondary"
                    className="p-1 sm:p-2"
                    size="small"
                  >
                    <FuseSvgIcon className="w-4 h-4 sm:w-6 sm:h-6">
                      {collapsedPanels[contact._id]
                        ? 'heroicons-outline:plus'
                        : 'heroicons-outline:minus'}
                    </FuseSvgIcon>
                  </IconButton>
  
                  <IconButton className="p-1 sm:p-2" size="small" disabled={true}>
                    <FuseSvgIcon className="w-4 h-4 sm:w-6 sm:h-6" disabled={true}>
                      heroicons-outline:video-camera
                    </FuseSvgIcon>
                  </IconButton>
  
                  <IconButton className="p-1 sm:p-2" size="small" disabled={true}>
                    <FuseSvgIcon className="w-4 h-4 sm:w-6 sm:h-6" disabled={true}>
                      heroicons-outline:phone
                    </FuseSvgIcon>
                  </IconButton>
  
                  <IconButton
                    onClick={() => dispatch(closeChatPanelById(contact._id))}
                    color="secondary"
                    className="p-1 sm:p-2"
                    size="small"
                  >
                    <FuseSvgIcon className="w-4 h-4 sm:w-6 sm:h-6">
                      heroicons-outline:x
                    </FuseSvgIcon>
                  </IconButton>
                </div>
              </Toolbar>
            </AppBar>
  
            <AnimatePresence initial={false}>
              {!collapsedPanels[contact._id] && (
                <motion.div
                  key={contact._id + '-chat'}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <Paper className="flex flex-1 flex-row max-h-[460px] xl:max-h-[680px] shadow-0">
                    <Chat
                      contactId={contact._id}
                      onActivity={() => handlePanelActivity(contact._id)}
                      className="flex flex-1 w-full min-h-[460px] xl:min-h-[680px]"
                    />
                  </Paper>
                </motion.div>
              )}
            </AnimatePresence>
          </Root>
        ))}
    </AnimatePresence>
  );
  
  
  
}

export default withReducer('chatPanel', reducer)(memo(ChatPanel));





