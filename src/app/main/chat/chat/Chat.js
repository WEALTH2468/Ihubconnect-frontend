import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { lighten, styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useContext, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InputBase from '@mui/material/InputBase';
import { Paper, Menu, MenuItem, TextField, Button } from '@mui/material';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Toolbar from '@mui/material/Toolbar';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  addChat,
  getChat,
  selectChat,
  sendMessage,
  deleteMessage,
  editMessage,
} from '../store/chatSlice';
import {
  removeSelectedContactId,
  selectContactById,
  setSelectedContactId,
} from '../store/contactsSlice';
import { addMessage, updateMessage } from '../store/chatSlice';
import ContactAvatar from '../ContactAvatar';
import ChatMoreMenu from './ChatMoreMenu';
import { ChatAppContext } from '../ChatApp';
import { selectUser } from 'app/store/userSlice';
import { getChats } from '../store/chatsSlice';
import {
  addPanelChat,
  clearCount,
  getPanelChats,
  updatePanelChat,
} from 'app/theme-layouts/shared-components/chatPanel/store/chatsSlice';
import {
  addPanelMessage,
  getPanelChat,
  updatePanelMessage,
  isRead,
  selectPanelChat,
  sendPanelMessage,
} from 'app/theme-layouts/shared-components/chatPanel/store/chatSlice';
import {
  selectPanelContactById,
  selectSelectedPanelContactId,
} from 'app/theme-layouts/shared-components/chatPanel/store/contactsSlice';
import useGetUserStatus from 'app/theme-layouts/shared-components/chatPanel/hooks/getUserStatus';
import useEmit from 'src/app/websocket/emit';
import { parseTextAsLinkIfURLC } from '../../idesk/sub-apps/idesk/utils';
import { ImagesearchRoller } from '@mui/icons-material';
import { sub } from 'date-fns';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';
import useDestopNotification from 'app/theme-layouts/shared-components/notificationPanel/hooks/useDestopNotification';
import RotateRightRoundedIcon from '@mui/icons-material/RotateRightRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import ErrorIcon from "@mui/icons-material/Error";
import { selectSocket } from 'app/store/socketSlice';


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
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedImages, setSelectedImages] = useState([] || null);
  const [selectedDocuments, setSelectedDocuments] = useState([] || null);
  const [imageFile, setImageFile] = useState([] || null);
  const [chatMenu, setChatMenu] = useState(null);
  const [documentFile, setDocumentFile] = useState([] || null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState('');
  const { showNotification } = useDestopNotification();

  const { getStatus } = useGetUserStatus();
  const { emitSendChat } = useEmit();
  const { emitEditChat } = useEmit();
  const { emitDeleteChat } = useEmit();
  const { emitNotification } = useEmit();
  const { emitSendPanelChat } = useEmit();

  const { setMainSidebarOpen, setContactSidebarOpen } =
    useContext(ChatAppContext);
  const dispatch = useDispatch();
  const chat = useSelector(selectChat);
  const user = useSelector(selectUser);
  const routeParams = useParams();
  const contactId = routeParams.id;
  const socket = useSelector(selectSocket);
  const selectedContact = useSelector((state) =>
    selectPanelContactById(state, contactId)
  );
  const [isSending, setIsSending] = useState(false);

  const selectedPanelContactId = useSelector(selectSelectedPanelContactId);

  const chatRef = useRef(null);
  const [messageText, setMessageText] = useState('');



  useEffect(() => {
    dispatch(getChat(contactId));
    dispatch(setSelectedContactId(contactId));
    return () => {
      dispatch(removeSelectedContactId());
    };
  }, [contactId, dispatch]);

  useEffect(() => {
    if (chat) {
      setTimeout(scrollToBottom, 100);
    }
  }, [chat]);

  function scrollToBottom() {
    if (!chatRef.current) {
      return;
    }
    chatRef.current.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }

  // Handle chat menu
  const openChat = Boolean(chatMenu);


  //Add image function
  const handleAddImage = () => {
    handleMenuClose();
    document.getElementById('imageUpload').click();
  };

  const handleRemoveImage = (index) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));

    setImageFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  //Add document file
  const handleAddDocument = () => {
    handleMenuClose();
    document.getElementById('documentUpload').click();
  };

  const handleRemoveDocument = (index) => {
    setSelectedDocuments((prevDocuments) =>
      prevDocuments.filter((_, i) => i !== index)
    );

    setDocumentFile((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };


  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChatMenuOpen = (event, chatId) => {
    setChatMenu(event.currentTarget);
    setSelectedMessageId(chatId); // Store the clicked message ID
    const selectedMessage = chat.find((msg) => msg._id === chatId);
    if (selectedMessage) {
      setEditedText(selectedMessage.content);
    }
  };

  const handleChatMenuClose = () => {
    setChatMenu(null);
    setEditMode(false);
  };

  const handleEditClick = (editId) => {
    setEditMode(editId);
    setChatMenu(null);
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    const Images = files.map((file) => URL.createObjectURL(file));

    if (files.length > 0) {
      setImageFile((prevFiles) => [...prevFiles, ...files]); // Store actual files
      setSelectedImages((prevImages) => [...prevImages, ...Images]); // Store image URLs
    }

    event.target.value = null;
  };

  const handleDocumentChange = (event) => {
    const files = Array.from(event.target.files);
    const Documents = files.map((file) => URL.createObjectURL(file));

    if (files.length > 0) {
      setDocumentFile((prevFiles) => [...prevFiles, ...files]); // Store actual files
      setSelectedDocuments((prevDocuments) => [...prevDocuments, ...Documents]); // Store document URLs
    }

    event.target.value = null;
  };

 // Function to handle sending a message
async function onMessageSubmit(ev) {
  ev.preventDefault();

  if (
    (messageText === '' && imageFile.length === 0 && selectedDocuments.length === 0) ||
    isSending
  ) {
    return;
  }

  setIsSending(true); // Disable input while sending

  // Create a temporary message
  const tempId = `temp-${Date.now()}`;
  const tempMessage = {
    _id: tempId,
    contactId: contactId,
    content: messageText,
    avatar: user.avatar,
    senderId: user._id,
    createdAt: new Date().toISOString(),
    status: "pending", // Mark as pending
  };

 

  dispatch(addMessage(tempMessage)); // Add temp message to UI immediately

  setIsSending(false); // Re-enable input
  setMessageText('');

  try {
    // Dispatch the FormData via the sendMessage action
    const { payload } = await dispatch(
      sendMessage({
        subject: 'chat',
        messageText,
        contactId,
        avatar: user.avatar,
        link: `/chat`,
        images: imageFile,
        documents: documentFile,
      })
    );

    // Emit the message and notification
    emitSendChat(payload);
    
    if (user._id !== contactId) {
      emitNotification({
        senderId: user._id,
        receivers: [{ _id: contactId }],
        image: user.avatar,
        description: `<p><strong>${user.firstName}</strong> sent you a message: "${messageText.slice(0, 15)}..."</p>`,
        content: messageText,
        read: false,
        link: `/chat/${user._id}`,
        subject: 'chat',
        useRouter: true,
      });
    }

    // Replace the temp message with the real message and update the status
    dispatch(updatePanelMessage({
      tempId: tempMessage._id,
      realMessage: {
        ...payload,
        createdAt: payload.createdAt || new Date().toISOString(), // Fallback to a valid date
      }
    }));
    
    dispatch(updateMessage({
      tempId: tempMessage._id,
      realMessage: {
        ...payload,
        createdAt: payload.createdAt || new Date().toISOString(), // Fallback to a valid date
        // seen: true,
      }
    }));

    console.log(payload)
    

    if (payload.chat) {
      dispatch(addPanelChat(payload.chat));
      if (selectedPanelContactId === payload.contactId) {
        dispatch(addPanelMessage(payload));
      }
    } else {
      dispatch(updatePanelChat(payload));
      if (selectedPanelContactId === payload.contactId) {
        dispatch(addPanelMessage(payload));
      }
    }

    // Reset inputs after sending
    setMessageText('');
    setImageFile([]);
    setSelectedImages([]);
    setDocumentFile([]);
    setSelectedDocuments([]);
  } catch (error) {
    console.error('Error submitting message:', error);

    // Mark temp message as failed
    dispatch(updatePanelMessage({ tempId: tempMessage._id, status: "failed" }));
    dispatch(updateMessage({ tempId: tempMessage._id, status: "failed" }));
    
  }
}

useEffect(() => {
  const handleMessageSeen = ({ messageId }) => {
    console.log("Message seen:", messageId);
    dispatch(updateMessage({ tempId: messageId, realMessage: { seen: true } }));
  };

  socket?.on("messageSeen", handleMessageSeen);
  
  return () => {
    socket?.off("messageSeen", handleMessageSeen);
  };
}, [socket, dispatch]);


  // Function to handle deleting a message
  function handleDeleteMessage(chatId) {
    dispatch(deleteMessage(chatId)).then(({ payload }) => {
      emitDeleteChat(payload);
      dispatch(getChat(contactId));
      dispatch(getPanelChat(contactId));

      setChatMenu(null);
    });
  }

  const handleSaveEdit = () => {
    if (selectedMessageId) {
      // handleUpdateMessage(selectedMessageId, editedText);
      dispatch(
        editMessage({
          messageId: selectedMessageId,
          newText: editedText,
        })
      ).then(({ payload }) => {
        emitEditChat(payload);
        dispatch(getChat(contactId));
        dispatch(getPanelChat(contactId));

        setEditMode(false);
      });
    }
  };

  // Function to handle input text change
  function onInputChange(ev) {
    setMessageText(ev.target.value);
  }

  // Check if it's the first message of a group
  function isFirstMessageOfGroup(item, i) {
    return i === 0 || (chat[i - 1] && chat[i - 1].contactId !== item.contactId);
  }

  // Check if it's the last message of a group
  function isLastMessageOfGroup(item, i) {
    return (
      i === chat.length - 1 ||
      (chat[i + 1] && chat[i + 1].contactId !== item.contactId)
    );
  }

  if (!user || !chat || !selectedContact) {
    return null;
  }

  return (
    <>
      <Box
        className="w-full border-b-1"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.02),
        }}
      >
        <Toolbar className="flex items-center justify-between px-16 w-full">
          <div className="flex items-center">
            <IconButton
              aria-label="Open drawer"
              onClick={() => setMainSidebarOpen(true)}
              className="flex lg:hidden"
              size="large"
            >
              <FuseSvgIcon>heroicons-outline:chat</FuseSvgIcon>
            </IconButton>
            <div
              className="flex items-center cursor-pointer"
              onClick={() => {
                setContactSidebarOpen(true);
              }}
              onKeyDown={() => setContactSidebarOpen(true)}
              role="button"
              tabIndex={0}
            >
              <ContactAvatar
                className="relative mx-8"
                data={{
                  ...selectedContact,
                  status: getStatus(selectedContact._id),
                }}
              />
              <Typography
                color="inherit"
                className="text-16 font-semibold px-4"
              >
                {selectedContact.displayName}
              </Typography>
            </div>
          </div>
          <ChatMoreMenu className="-mx-8" />
        </Toolbar>
      </Box>

      <div className="flex flex-auto h-full min-h-0 w-full">
        <div
          className={clsx(
            'flex flex-1 z-10 flex-col relative',
            props.className
          )}
        >
          <div ref={chatRef} className="flex flex-1 flex-col overflow-y-auto">
            {chat?.length > 0 && (
              <div className="flex flex-col pt-16 px-16 pb-40">
                {chat.map((item, i) => {
                  const isSender = item.contactId === user._id;
                  // const chatId = item.chatId

                  return (
                    <StyledMessageRow
                      key={i}
                      className={clsx(
                        'flex flex-col grow-0 shrink-0 items-start justify-end relative px-16 pb-4',
                        isSender ? 'contact' : 'me',
                        { 'first-of-group': isFirstMessageOfGroup(item, i) },
                        { 'last-of-group': isLastMessageOfGroup(item, i) },
                        i + 1 === chat.length && 'pb-96'
                      )}
                    >
                      <div className="bubble flex flex-col relative items-center justify-center p-12 max-w-full">
                        {/* Display Text Message */}
                        {item.content && (
                          <div className="leading-tight whitespace-pre-wrap flex flex-start">
                            {parseTextAsLinkIfURLC(item.content)}

                            {!isSender && (
                              <div>
                                {item.status === "pending" && (
                                  <RotateRightRoundedIcon
                                    sx={{
                                      fontSize: 16,
                                      color: "gray-200",
                                      position: "flex",
                                      flexDirection: "flex-bottom",
                                      marginLeft: "8px",
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
                                      marginLeft: "8px",
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
                                      marginLeft: "8px",
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
                                      marginLeft: "8px",
                                    }}
                                  />
                                )}
                              </div>
                            )}
                          </div>
                        )}
                        {/* Display Edited Indicator */}
                        {item.isEdited && (
                          <span className="text-gray-400 text-sm italic mt-2">
                            Edited
                          </span>
                        )}
                        {/* Display Images */}
                        {item.images?.length > 0 && (
                          <div className="flex flex-wrap gap-4 mt-4">
                            {item.images.map((img, index) => (
                              <img
                                key={index}
                                src={addBackendProtocol(img.path)} // Use `img.path`
                                alt={img.name || `attachment-${index}`} // Use `img.name`
                                className="h-[40rem] w-[30rem] rounded-lg shadow-md object-cover cursor-pointer"
                                onClick={() =>
                                  window.open(
                                    addBackendProtocol(img.path),
                                    '_blank'
                                  )
                                } // Use `img.path`
                              />
                            ))}
                          </div>
                        )}

                        {/* Display Documents */}
                        {item.documents?.length > 0 && (
                          <div className="flex flex-col mt-2">
                            {item.documents.map((doc, index) => {
                              const fileUrl = addBackendProtocol(doc.path); // Use `doc.path`

                              return (
                                <a
                                  key={index}
                                  href={`https://docs.google.com/gview?url=${encodeURIComponent(
                                    fileUrl
                                  )}&embedded=true`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-500 underline flex items-center gap-2"
                                >
                                  <FuseSvgIcon
                                    className="text-20"
                                    color="primary"
                                  >
                                    heroicons-outline:document
                                  </FuseSvgIcon>
                                  {doc.name || `Document ${index + 1}`}{' '}
                                  {/* Use `doc.name` */}
                                </a>
                              );
                            })}
                          </div>
                        )}

                        <div className="relative">
                          {editMode && selectedMessageId === item._id ? (
                            <div className="flex items-center space-x-2">
                              <TextField
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                size="small"
                                variant="outlined"
                                className="flex-1 flex-wrap"
                              />
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSaveEdit}
                              >
                                Save
                              </Button>
                              <Button
                                variant="outlined"
                                onClick={() => setEditMode(false)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <p></p>
                          )}
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

                      {!isSender && (
                        <div className="absolute top-0 right-[-16px]">
                          <IconButton
                            onClick={(e) => handleChatMenuOpen(e, item._id)}
                          >
                            <MoreVertIcon className="text-gray-800 hover:text-gray-1200" />
                          </IconButton>
                          <Menu
                            anchorEl={chatMenu}
                            open={openChat}
                            onClose={handleChatMenuClose}
                            anchorOrigin={{
                              vertical: 'bottom',
                              horizontal: 'right',
                            }}
                            transformOrigin={{
                              vertical: 'top',
                              horizontal: 'right',
                            }}
                          >
                            <MenuItem
                              onClick={() => handleEditClick(selectedMessageId)}
                            >
                              Edit Chat
                            </MenuItem>
                            <MenuItem
                              onClick={() =>
                                handleDeleteMessage(selectedMessageId)
                              }
                            >
                              Delete Chat
                            </MenuItem>
                          </Menu>
                        </div>
                      )}
                    </StyledMessageRow>
                  );
                })}
              </div>
            )}
          </div>

          {chat && (
            <Paper
              square
              component="form"
              onSubmit={onMessageSubmit}
              className="absolute border-t bottom-0 right-0 left-0 py-4 px-4"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === 'light'
                    ? lighten(theme.palette.background.default, 0.4)
                    : lighten(theme.palette.background.default, 0.02),
              }}
            >
              {/* Dropdown menu for attachments */}
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                // className=""
                MenuListProps={{
                  className: 'bg-white shadow-lg rounded-lg',
                }}
                anchorPosition={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem
                  onClick={handleAddImage}
                  className="px-4 py-5 hover:bg-gray-200"
                >
                  <FuseSvgIcon className="text-24" color="action">
                    heroicons-outline:photograph
                  </FuseSvgIcon>
                  Image/Video
                </MenuItem>
                <MenuItem
                  onClick={handleAddDocument}
                  className="px-4 py-2 hover:bg-gray-200"
                >
                  <FuseSvgIcon className="text-24" color="action">
                    heroicons-outline:document
                  </FuseSvgIcon>
                  Document
                </MenuItem>
                <MenuItem
                  onClick={handleMenuClose}
                  className="px-4 py-2 hover:bg-gray-200"
                >
                  <FuseSvgIcon className="text-24" color="action">
                    heroicons-outline:camera
                  </FuseSvgIcon>
                  Camera
                </MenuItem>
              </Menu>

              {selectedImages.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-4">
                  {selectedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Preview ${index}`}
                        className="h-[150px] rounded-lg shadow-lg"
                      />
                      <IconButton
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 text-red-500"
                      >
                        <FuseSvgIcon className="text-24" color="error">
                          heroicons-outline:x-circle
                        </FuseSvgIcon>
                      </IconButton>
                    </div>
                  ))}
                </div>
              )}

              {selectedDocuments.length > 0 && (
                <div className="mt-4 flex flex-col gap-2">
                  {selectedDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <FuseSvgIcon className="text-20" color="primary">
                        heroicons-outline:document
                      </FuseSvgIcon>
                      <Typography className="text-blue-500 underline">
                        {doc || `Document ${index + 1}`} {/* Use `doc.name` */}
                      </Typography>
                      <IconButton
                        onClick={() => handleRemoveDocument(index)}
                        className="text-red-500"
                      >
                        <FuseSvgIcon className="text-24" color="error">
                          heroicons-outline:x-circle
                        </FuseSvgIcon>
                      </IconButton>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center relative">
                <IconButton type="button" size="large">
                  <FuseSvgIcon className="text-24" color="action">
                    heroicons-outline:emoji-happy
                  </FuseSvgIcon>
                </IconButton>

                <IconButton type="button" size="large" onClick={handleMenuOpen}>
                  <FuseSvgIcon className="text-24" color="action">
                    heroicons-outline:paper-clip
                  </FuseSvgIcon>
                </IconButton>

                {/* Hidden file input for image upload */}
                <input
                  type="file"
                  id="imageUpload"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                {/* Hidden file input for document upload */}
                <input
                  type="file"
                  id="documentUpload"
                  multiple
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleDocumentChange}
                />

                <TextField
                  autoFocus={false}
                  id="message-input"
                  className="flex flex-1 grow shrink-0 mx-16 ltr:mr-48 rtl:ml-48 my-8 p-2 w-full "
                  placeholder="Type your message"
                  onChange={onInputChange}
                  value={messageText}
                  multiline // Enables multi-line input
                  minRows={1}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#c96632', // Hover color
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f17e44', // Focused (clicked) color
                      },
                    },
                  }}
                  maxRows={2} // Limit max rows
                  onKeyDown={(ev) => {
                    if (ev.key === 'Enter' && !ev.shiftKey && !isSending) {
                      ev.preventDefault(); // Prevent default Enter behavior
                      onMessageSubmit(ev);
                    }
                  }}
                />

                <IconButton type="submit" size="large">
                  <FuseSvgIcon className="rotate-90 text-24" color="action">
                    heroicons-outline:paper-airplane
                  </FuseSvgIcon>
                </IconButton>
              </div>
            </Paper>
          )}
        </div>
      </div>
    </>
  );
}

export default Chat;