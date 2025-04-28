import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { lighten, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import InputBase from '@mui/material/InputBase';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectSelectedPanelContactId } from './store/contactsSlice';
import { getPanelChat, selectPanelChat, sendPanelMessage } from './store/chatSlice';
import { selectUser } from 'app/store/userSlice';
import { addPanelChat, getPanelChats, updatePanelChat } from './store/chatsSlice';
import { addMessage, updateMessage } from 'src/app/main/chat/store/chatSlice';
import { parseTextAsLinkIfURLC } from 'src/app/main/idesk/sub-apps/idesk/utils';
import useEmit from 'src/app/websocket/emit';
import TextField from "@mui/material/TextField";
import RotateRightRoundedIcon from '@mui/icons-material/RotateRightRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import ErrorIcon from "@mui/icons-material/Error";
import {
  addPanelMessage,
  updatePanelMessage,
} from 'app/theme-layouts/shared-components/chatPanel/store/chatSlice';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'



const StyledMessageRow = styled('div')(({ theme }) => ({
  '&.contact': {
    '& .bubble': {
      backgroundColor: lighten(theme.palette.primary.main, 0.1),
      color: theme.palette.secondary.contrastText,
      borderTopLeftRadius: 5,
      borderBottomLeftRadius: 5,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      '& .time': {
        marginLeft: 12,
      },
    },
    '&.first-of-group': {
      '& .bubble': {
        borderTopLeftRadius: 20,
      },
    },
    '&.last-of-group': {
      '& .bubble': {
        borderBottomLeftRadius: 20,
      },
    },
  },
  '&.me': {
    paddingLeft: 40,

    '& .bubble': {
      marginLeft: 'auto',
      backgroundColor: lighten(theme.palette.secondary.main, 0.1),
      color: theme.palette.primary.contrastText,
      borderTopLeftRadius: 20,
      borderBottomLeftRadius: 20,
      borderTopRightRadius: 5,
      borderBottomRightRadius: 5,
      '& .time': {
        justifyContent: 'flex-end',
        right: 0,
        marginRight: 12,
      },
    },
    '&.first-of-group': {
      '& .bubble': {
        borderTopRightRadius: 20,
      },
    },

    '&.last-of-group': {
      '& .bubble': {
        borderBottomRightRadius: 20,
      },
    },
  },
  '&.contact + .me, &.me + .contact': {
    paddingTop: 20,
    marginTop: 20,
  },
  '&.first-of-group': {
    '& .bubble': {
      borderTopLeftRadius: 20,
      paddingTop: 13,
    },
  },
  '&.last-of-group': {
    '& .bubble': {
      borderBottomLeftRadius: 20,
      paddingBottom: 13,
      '& .time': {
        display: 'flex',
      },
    },
  },
}));

function Chat(props) {
  const dispatch = useDispatch();
  const selectedContactId = useSelector(selectSelectedPanelContactId);
  const chat = useSelector(selectPanelChat);
  const user = useSelector(selectUser);
  const location = useLocation();
  const contactId = location.pathname.split('/chat/')[1];
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const chatScroll = useRef(null);
  const [messageText, setMessageText] = useState('');

    const { emitSendPanelChat } = useEmit();
      const { emitNotification } = useEmit();
    
  


  useEffect(() => {
    scrollToBottom();
  }, [chat]);


const handleEmojiClick = () => {
  setShowEmojiPicker((prev) => !prev);
};

const handleEmojiSelect = (emoji) => {
  setMessageText((prev) => prev + emoji.native); // Add emoji to message
  setShowEmojiPicker(false);
};
  

  function scrollToBottom() {
    if (!chatScroll.current) {
      return;
    }
    chatScroll.current.scrollTo({
      top: chatScroll.current.scrollHeight,
      behavior: 'smooth',
    });
  }

  const onInputChange = (ev) => {
    setMessageText(ev.target.value);
  };

  return (
    <Paper
      className={clsx('flex flex-col relative z-[1000] pb-64 shadow', props.className)}
      sx={{ background: (theme) => theme.palette.background.paper, borderRadius: '0px'  }}
    >
      <div
        ref={chatScroll}
        className="flex flex-1 flex-col overflow-y-auto overscroll-contain"
        option={{ suppressScrollX: true, wheelPropagation: false }}
      >
        <div className="flex flex-col pt-16">
          {useMemo(() => {
            function isFirstMessageOfGroup(item, i) {
              return (
                i === 0 ||
                (chat[i - 1] && chat[i - 1].contactId !== item.contactId)
              );
            }

            function isLastMessageOfGroup(item, i) {
              return (
                i === chat.length - 1 ||
                (chat[i + 1] && chat[i + 1].contactId !== item.contactId)
              );
            }

            return chat?.length > 0
              ? chat.map((item, i) => {

                const isSender = item.contactId === user._id;

                  return (
                    <StyledMessageRow
                      key={i}
                      className={clsx(
                        'flex flex-col grow-0 shrink-0 items-start justify-end relative px-16 pb-4',
                        item.contactId === user._id ? 'contact' : 'me',
                        { 'first-of-group': isFirstMessageOfGroup(item, i) },
                        { 'last-of-group': isLastMessageOfGroup(item, i) },
                        i + 1 === chat?.length && 'pb-72'
                      )}
                    >
                      <div className="bubble flex relative items-center justify-center p-12 max-w-full">
                        <div className="leading-tight whitespace-pre-wrap break-words overflow-hidden">
                          {parseTextAsLinkIfURLC(item?.content)}
                           {!isSender && (
                                                        <span>
                                                          {item.status === "pending" && (
                                                            <RotateRightRoundedIcon
                                                              sx={{
                                                                fontSize: 16,
                                                                color: "gray-200",
                                                                position: "flex",
                                                                flexDirection: "flex-bottom",
                                                                marginLeft: "5px",
                                                              }}
                                                            />
                                                          )}
                                                            {item.seen === true  && (
                                                            <DoneAllRoundedIcon
                                                              sx={{
                                                                fontSize: 16,
                                                                color: "blue",
                                                                position: "flex",
                                                                flexDirection: "flex-bottom",
                                                                marginLeft: "5px",
                                                              }}
                                                           />
                                                          )}
                                                           {item.seen === false  && (
                                                            <DoneAllRoundedIcon
                                                              sx={{
                                                                fontSize: 16,
                                                                color: "gray-200",
                                                                position: "flex",
                                                                flexDirection: "flex-bottom",
                                                                marginLeft: "5px",
                                                              }}
                                                            />
                                                          )}
                                                        
                                                          {item.status === "failed" && (
                                                            <ErrorIcon
                                                              sx={{
                                                                fontSize: 16,
                                                                color: "red",
                                                                position: "flex",
                                                                flexDirection: "flex-bottom",
                                                                marginLeft: "5px",
                                                              }}
                                                            />
                                                          )}
                                                        </span>
                                                      )}
                        </div>

                        <Typography
                          className="time absolute hidden w-full text-11 mt-8 -mb-24 ltr:left-0 rtl:right-0 bottom-0 whitespace-nowrap"
                          color="text.secondary"
                        >
                          {item.createdAt
                            ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })
                            : 'Just now'}
                        </Typography>

                        {item.failed && (
                          <ErrorOutlineIcon 
                            color="error" 
                            fontSize="small" 
                            className="ml-2 cursor-pointer"
                            titleAccess="Failed to send"
                          />
                        )}
                      </div>
                    </StyledMessageRow>
                  );
                })
              : null;
          }, [chat, user?.id])}
        </div>

        {chat?.length === 0 && (
          <div className="flex flex-col flex-1">
            <div className="flex flex-col flex-1 items-center justify-center">
              <FuseSvgIcon size={128} color="disabled">
                heroicons-outline:chat
              </FuseSvgIcon>
            </div>
            <Typography
              className="px-16 pb-24 text-center"
              color="text.secondary"
            >
              Start a conversation by typing your message below.
            </Typography>
          </div>
        )}
      </div>

                  {useMemo(() => {
           const onMessageSubmit = async (ev) => {
            ev.preventDefault();
            if (!messageText.trim() || isSending) return;
          
            setIsSending(true); // Disable input while sending
          
            // Create a temporary message
            const tempId = `temp-${Date.now()}`;
            const tempMessage = {
              _id: tempId,
              senderId: user._id,
              contactId: selectedContactId,
              content: messageText,
              avatar: user.avatar,
              chatId: chat.id,
              createdAt: new Date().toISOString(),
              status: "pending",
            };

            dispatch(addPanelMessage(tempMessage));
            dispatch(addMessage(tempMessage));
            
              setMessageText('');
              setIsSending(false); // Re-enable input
          
            try {
              const { payload } = await dispatch(
                sendPanelMessage({
                  subject: "chat",
                  link: `/chat`,
                  avatar: user.avatar,
                  messageText,
                  chatId: chat.id,
                  contactId: selectedContactId,
                })
              );
          
              emitSendPanelChat(payload);
          
              if (user._id !== selectedContactId) {
                emitNotification({
                  senderId: user._id,
                  receivers: [{ _id: selectedContactId }],
                  image: user.avatar,
                  description: `<p><strong>${user.firstName}</strong> sent you a message: "${messageText.slice(0, 15)}..."</p>`,
                  content: messageText,
                  read: false,
                  link: `/chat/${user._id}`,
                  subject: "chat",
                  useRouter: true,
                });
              }
              console.log('Real Message Payload:', payload);
          
              const updatedMessage = payload.message ? {
                ...payload.message,
                seen: selectedContactId === payload.message.userId,
                createdAt: payload.message.createdAt || new Date().toISOString(),
              } : {
                ...payload,
                seen: selectedContactId === payload.userId, // Mark as seen if recipient is viewing the chat
                createdAt: payload.createdAt || new Date().toISOString(), // Fallback to a valid date
              };


               // Update sender's temp message
               dispatch(updateMessage({ tempId, realMessage: updatedMessage }));
               dispatch(updatePanelMessage({ tempId, realMessage: updatedMessage }));
          
              if (payload.chat) {
                dispatch(addPanelChat(payload.chat));
                if (selectedContactId === payload.contactId) {
                  dispatch(addMessage(updatedMessage));
                }
              } else {
                dispatch(updatePanelChat(updatedMessage));
                if (selectedContactId === payload.contactId) {
                  dispatch(addMessage(updatedMessage));
                }
              }

              setIsSending(false);
            } catch (error) {
              console.error("Error submitting message:", error);
          
              // Mark temp message as failed
              dispatch(updateMessage({ tempId, status: "failed" }));
              dispatch(updatePanelMessage({ tempId, status: "failed" }));
            } 
          };
          

              return (
                <>
                  {chat && (
                    <form
                      onSubmit={onMessageSubmit}
                      className="pb-16 px-8 absolute bottom-0 left-0 right-0"
                    >
                     <Paper className="rounded-24 flex items-center relative shadow px-8" >
                          <TextField
                            autoFocus={true}
                            id="message-input"
                            className="flex flex-1 grow shrink-0 mx-8 ltr:mr-48 rtl:ml-48 my-8"
                            placeholder="Type your message"
                            onChange={onInputChange}
                            value={messageText}
                            multiline
                            minRows={1}
                            maxRows={2}
                            onKeyDown={(ev) => {
                              if (ev.key === 'Enter' && !ev.shiftKey && !isSending) {
                                ev.preventDefault();
                                onMessageSubmit(ev);
                              }
                            }}
                          />

                           {/* Emoji Toggle Button */}
                           <IconButton
                            size="small"
                            onClick={handleEmojiClick}
                            className="absolute right-[60px]"
                          >
                            <FuseSvgIcon color="action">heroicons-outline:emoji-happy</FuseSvgIcon>
                          </IconButton>

                          {/* Send Icon */}
                          <IconButton
                            className="absolute ltr:right-0 rtl:left-0 top-9"
                            type="submit"
                            size="large"
                            onClick={onMessageSubmit}
                          >
                            <FuseSvgIcon className="rotate-90" color="action">
                              heroicons-outline:paper-airplane
                            </FuseSvgIcon>
                          </IconButton>
                        </Paper>
                   
                    </form>
                  )}
                </>
              );
               
            }, [chat, dispatch, messageText, selectedContactId, isSending])}

                {/* Emoji Picker (Custom Positioned) */}
                {showEmojiPicker && (
                  <div
                    className=" absolute z-9999"
                    style={{
                      bottom: '80px',
                      right: '0px',
                    }}
                  >
                    <Picker  
                    data={data} 
                    emojiSize={17} 
                    onEmojiSelect={handleEmojiSelect} 
                    theme="light"
                    />
                    
                  </div>
                )}
    </Paper>
  );
}

export default Chat;
