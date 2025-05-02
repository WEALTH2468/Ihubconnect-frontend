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
import ContactListItem from '../sidebars/main/ContactListItem';
import { getChat, selectChat } from '../store/chatSlice';
import ContactAvatar from '../ContactAvatar';
import MainSidebarMoreMenu from '../sidebars/main/MainSidebarMoreMenu';
import { ChatAppContext } from '../ChatApp';
import { selectUser } from 'app/store/userSlice';
import { selectPanelContacts } from 'app/theme-layouts/shared-components/chatPanel/store/contactsSlice';
import { selectPanelChats } from 'app/theme-layouts/shared-components/chatPanel/store/chatsSlice';
import useGetUserStatus from 'app/theme-layouts/shared-components/chatPanel/hooks/getUserStatus';
import FloatingContactListItem from './FloatingContactListItem';

function PopupChatList(props) {
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
    <div className="w-[300px] h-[500px] xl:h-[750px] xl:w-[350px] bg-white shadow-lg overflow-hidden flex flex-col">
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

        {useMemo(
          () => (
            <Paper className="flex p-4 items-center w-full px-10 py-4 border-1 h-40 rounded-16 shadow-none">
              <FuseSvgIcon color="action" size={20}>
                heroicons-solid:search
              </FuseSvgIcon>

              <Input
                placeholder="Search or start new chat"
                className="flex flex-1 px-8"
                disableUnderline
                fullWidth
                value={searchText}
                autoFocus={true}
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
       <div className="overflow-y-auto flex-1">
      <FuseScrollbars className="h-full" >
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
                    ...contacts?.find((_contact) =>
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
                      className="font-medium text-[16px] px-32"
                      color="secondary.main"
                    >
                      Chats
                    </Typography>
                  </motion.div>
                )}
            
                <motion.div className="flex flex-col space-y-1">
                  {filteredChatList.map((contact, index) => (
                    <motion.div variants={item} key={contact._id}>
                      <div
                        className={clsx(
                          'py-1',
                          filteredChatList.length !== index + 1 && 'border-b-1'
                        )}
                      >
                        <FloatingContactListItem
                          key={contact._id}
                          chat={chat}
                          contact={contact}
                        />
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
            
                {filteredContacts.length > 0 && (
                  <motion.div variants={item}>
                    <Typography
                      className="font-medium text-[16px] px-32"
                      color="secondary.main"
                    >
                      Contacts
                    </Typography>
                  </motion.div>
                )}
            
            {[...filteredContacts]
                  .sort((a, b) => {
                    const isAOnline = a.status === 'online';
                    const isBOnline = b.status === 'online';
                    return isBOnline - isAOnline; // online first
                  })
                  .map((contact, index) => (
                    <motion.div variants={item} key={contact._id}>
                      <div
                        className={clsx(
                          filteredContacts.length !== index + 1 && 'border-b-1'
                        )}
                      >
                        <FloatingContactListItem
                          key={contact._id}
                          contact={contact}
                          chat={chat}
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
    </div>
    </div>
  );
}

export default PopupChatList;
