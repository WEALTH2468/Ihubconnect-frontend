import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import { motion } from 'framer-motion';
import { memo, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPanelChat, isRead } from './store/chatSlice';
import { selectPanelContacts, selectSelectedPanelContactId, setSelectedContactId } from './store/contactsSlice';
import { openChatPanel } from './store/stateSlice';
import ContactButton from './ContactButton';
import { clearCount, selectPanelChats } from './store/chatsSlice';

const Root = styled(FuseScrollbars)(({ theme }) => ({
  background: theme.palette.background.paper,
}));

function ContactList(props) {
  const dispatch = useDispatch();
  const contacts = useSelector(selectPanelContacts);
  const selectedContactId = useSelector(selectSelectedPanelContactId);
  const chats = useSelector(selectPanelChats);
  const contactListScroll = useRef(null);

  const scrollToTop = () => {
    contactListScroll.current.scrollTop = 0;
  };

  return (
    <Root
      className="flex shrink-0 flex-col overflow-y-auto py-8 overscroll-contain"
      ref={contactListScroll}
      option={{ suppressScrollX: true, wheelPropagation: false }}
    >
      {useMemo(() => {
        const chatListContacts =
          contacts.length > 0 && chats.length > 0
            ? chats.map((_chat) => ({
                ..._chat,
                ...contacts.find((_contact) =>  _chat.participants.includes(_contact._id)),
              }))
            : [];


        const handleContactClick = (contactId, unreadCount) => {
          dispatch(openChatPanel());
          dispatch(setSelectedContactId(contactId));
          if(unreadCount && unreadCount > 0){
            dispatch(isRead(contactId)).then(({payload}) => {
              dispatch(clearCount(payload.chatId))
            })
          } 
          scrollToTop();
        };

        const container = {
          show: {
            transition: {
              staggerChildren: 0.05,
            },
          },
        };

        const item = {
          hidden: { opacity: 0, scale: 0.6 },
          show: { opacity: 1, scale: 1 },
        };

        return (
          contacts.length > 0 && (
            <>
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-col shrink-0"
              >
                {chatListContacts &&
                  chatListContacts.map((contact) => {
                    return (
                      <motion.div variants={item} key={contact._id}>
                        <ContactButton
                          contact={contact}
                          selectedContactId={selectedContactId}
                          onClick={handleContactClick}
                        />
                      </motion.div>
                    );
                  })}
                <Divider className="mx-24 my-8" />
                {contacts.map((contact) => {
                  const chatContact = chats.find((_chat) => _chat.participants.includes(contact._id));

                  return !chatContact ? (
                    <motion.div variants={item} key={contact._id}>
                      <ContactButton
                        contact={contact}
                        selectedContactId={selectedContactId}
                        onClick={handleContactClick}
                      />
                    </motion.div>
                  ) : null;
                })}
              </motion.div>
            </>
          )
        );
      }, [chats, contacts, dispatch, selectedContactId])}
    </Root>
  );
}

export default memo(ContactList);
