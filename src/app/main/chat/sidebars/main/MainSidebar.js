import FuseScrollbars from '@fuse/core/FuseScrollbars';
import FuseUtils from '@fuse/utils';
import Input from '@mui/material/Input';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import {
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import clsx from 'clsx';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Box from '@mui/material/Box';
import { lighten } from '@mui/material/styles';
import ContactListItem from './ContactListItem';
import { getChat, selectChat } from '../../store/chatSlice';
import ContactAvatar from '../../ContactAvatar';
import MainSidebarMoreMenu from './MainSidebarMoreMenu';
import { ChatAppContext } from '../../ChatApp';
import { selectUser } from 'app/store/userSlice';
import { selectPanelContacts } from 'app/theme-layouts/shared-components/chatPanel/store/contactsSlice';
import { selectPanelChats } from 'app/theme-layouts/shared-components/chatPanel/store/chatsSlice';
import useGetUserStatus from 'app/theme-layouts/shared-components/chatPanel/hooks/getUserStatus';

function MainSidebar(props) {
  const {getStatus} = useGetUserStatus()
  const { setUserSidebarOpen } = useContext(ChatAppContext);
  const dispatch = useDispatch();
  const contacts = useSelector(selectPanelContacts);
  const chat = useSelector(selectChat);
  const chats = useSelector(selectPanelChats);
  const user = useSelector(selectUser);


  const [searchText, setSearchText] = useState('');

  function handleSearchText(event) {
    setSearchText(event.target.value);
  }

  return (
    <div className="flex flex-col flex-auto h-full">
      <Box
        className="py-16 px-32 border-b-1"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.02),
        }}
      >
        <div className="flex justify-between items-center mb-16">
          {user && (
            <div
              className="flex items-center cursor-pointer"
              onClick={() => setUserSidebarOpen(true)}
              onKeyDown={() => setUserSidebarOpen(true)}
              role="button"
              tabIndex={0}
            >
              <ContactAvatar className="relative" id={'user'} data={{...user, status: getStatus(user._id)}} />
              <Typography className="mx-16 font-medium">
                {user.displayName}
              </Typography>
            </div>
          )}

          <MainSidebarMoreMenu className="-mx-16" />
        </div>
        {useMemo(
          () => (
            <Paper className="flex p-4 items-center w-full px-16 py-4 border-1 h-40 rounded-full shadow-none">
              <FuseSvgIcon color="action" size={20}>
                heroicons-solid:search
              </FuseSvgIcon>

              <Input
                placeholder="Search or start new chat"
                className="flex flex-1 px-8"
                disableUnderline
                fullWidth
                value={searchText}
                inputProps={{
                  'aria-label': 'Search',
                }}
                onChange={handleSearchText}
              />
            </Paper>
          ),
          [searchText]
        )}
      </Box>

      <FuseScrollbars className="overflow-y-auto flex-1">
        <List className="w-full">
          {useMemo(() => {
            function getFilteredArray(arr, _searchText) {
              if (_searchText.length === 0) {
                return arr;
              }
              return FuseUtils.filterArrayByString(arr, _searchText);
            }

            const chatListContacts =
              contacts.length > 0 && chats.length > 0
                ? chats.map((_chat) => ({
                    ..._chat,
                    ...contacts.find((_contact) =>
                      _chat.participants.includes(_contact._id)
                    ),
                  }))
                : [];

                
            const filteredContacts = getFilteredArray(
              [...contacts],
              searchText
            );
            const filteredChatList = getFilteredArray(
              [...chatListContacts],
              searchText
            );

            const container = {
              show: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            };

            const item = {
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            };

            return (
              <motion.div
                className="flex flex-col shrink-0"
                variants={container}
                initial="hidden"
                animate="show"
              >
                {filteredChatList.length > 0 && (
                  <motion.div variants={item}>
                    <Typography
                      className="font-medium text-20 px-32 py-24"
                      color="rgb(241, 126, 68)"
                    >
                      Chats
                    </Typography>
                  </motion.div>
                )}

                {filteredChatList.map((contact, index) => (
                  <motion.div variants={item} key={contact._id}>
                    <div
                      className={clsx(
                        filteredChatList.length !== index + 1 && 'border-b-1'
                      )}
                    >
                      <ContactListItem
                        key={contact._id}
                        chat={chat}
                        contact={contact}
                      />
                    </div>
                  </motion.div>
                ))}

                {filteredContacts.length > 0 && (
                  <motion.div variants={item}>
                    <Typography
                      className="font-medium text-20 px-32 py-24"
                      color="rgb(241, 126, 68)"
                    >
                      Contacts
                    </Typography>
                  </motion.div>
                )}

                {filteredContacts.map((contact, index) => (
                  <motion.div variants={item} key={contact._id}>
                    <div
                      className={clsx(
                        filteredContacts.length !== index + 1 && 'border-b-1'
                      )}
                    >
                      <ContactListItem
                        key={contact._id}
                        contact={contact}
                        onContactClick={(contactId) =>
                          dispatch(getChat(contactId))
                        }
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            );
          }, [contacts, chats, searchText, dispatch])}
        </List>
      </FuseScrollbars>
    </div>
  );
}

export default MainSidebar;
