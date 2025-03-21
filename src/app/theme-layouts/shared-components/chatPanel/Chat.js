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
import { addMessage } from 'src/app/main/chat/store/chatSlice';
import { parseTextAsLinkIfURLC } from 'src/app/main/idesk/sub-apps/idesk/utils';
import useEmit from 'src/app/websocket/emit';


const StyledMessageRow = styled('div')(({ theme }) => ({
  '&.contact': {
    '& .bubble': {
      // backgroundColor: lighten(theme.palette.primary.main, 0.1),
      backgroundColor: '#2e160e',
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
      // backgroundColor: lighten(theme.palette.secondary.main, 0.1),
      backgroundColor: 'rgb(241, 126, 68)',
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

  const chatScroll = useRef(null);
  const [messageText, setMessageText] = useState('');

    const { emitSendPanelChat } = useEmit();
      const { emitNotification } = useEmit();
    
  


  useEffect(() => {
    scrollToBottom();
  }, [chat]);

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
      className={clsx('flex flex-col relative pb-64 shadow', props.className)}
      sx={{ background: (theme) => theme.palette.background.default }}
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
                  return (
                    <StyledMessageRow
                      key={i}
                      className={clsx(
                        'flex flex-col grow-0 shrink-0 items-start justify-end relative px-16 pb-4',
                        item.contactId === user._id ? 'contact' : 'me',
                        { 'first-of-group': isFirstMessageOfGroup(item, i) },
                        { 'last-of-group': isLastMessageOfGroup(item, i) },
                        i + 1 === chat.length && 'pb-72'
                      )}
                    >
                      <div className="bubble flex relative items-center justify-center p-12 max-w-full">
                        <div className="leading-tight whitespace-pre-wrap break-words overflow-hidden">
                          {parseTextAsLinkIfURLC(item.content)}
                        </div>

                        <Typography
                          className="time absolute hidden w-full text-11 mt-8 -mb-24 ltr:left-0 rtl:right-0 bottom-0 whitespace-nowrap"
                          color="text.secondary"
                        >
                          {formatDistanceToNow(new Date(item.createdAt), {
                            addSuffix: true,
                          })}
                        </Typography>
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
        const onMessageSubmit = (ev) => {
          ev.preventDefault();
          if (messageText === '') {
            return;
          }

          dispatch(
            sendPanelMessage({
                subject: "chat",
                link: `/chat`,
                avatar: user.avatar,
                messageText,
                chatId: chat.id,
                contactId: selectedContactId,
            })
        ).then(({ payload }) => {
        
            // Emit real-time message to the recipient
            emitSendPanelChat(payload);
        
            // Emit the notification only if the recipient is not the sender
                const notificationData = {
                    senderId: user._id,
                    receivers: [{ _id: selectedContactId }],
                    image: user.avatar,
                    description: `<p><strong>${user.firstName}</strong> sent you a message: "${messageText.slice(0, 15)}..."</p>`,
                    content: messageText, // To be used by the desktop notification
                    read: false,
                    link: `/chat/${user._id}`,
                    subject: 'chat',
                    useRouter: true,
                };
        
                emitNotification(notificationData);
            

            if(payload.chat){
              dispatch(addPanelChat(payload.chat));
              if(contactId == payload.message.contactId) {
                dispatch(addMessage(payload.message));
              }
            }else{
              const message = payload
              dispatch(updatePanelChat(message))
              if(contactId == message.contactId) {
                dispatch(addMessage(message));
              }
            }
            setMessageText('');
          });
        };

        return (
          <>
            {chat && (
              <form
                onSubmit={onMessageSubmit}
                className="pb-16 px-8 absolute bottom-0 left-0 right-0"
              >
                <Paper className="rounded-24 flex items-center relative shadow">
                  <InputBase
                    autoFocus={false}
                    id="message-input"
                    className="flex flex-1 grow shrink-0 mx-16 ltr:mr-48 rtl:ml-48 my-8"
                    placeholder="Type your message"
                    onChange={onInputChange}
                    value={messageText}
                  />
                  <IconButton
                    className="absolute ltr:right-0 rtl:left-0 top-0"
                    type="submit"
                    size="large"
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
      }, [chat, dispatch, messageText, selectedContactId])}
    </Paper>
  );
}

export default Chat;
