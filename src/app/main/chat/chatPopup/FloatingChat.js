import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/store/userSlice';
import PopupChatList from './popupChatList';
import ContactAvatar from '../ContactAvatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { motion, AnimatePresence } from 'framer-motion';
import useGetUserStatus from 'app/theme-layouts/shared-components/chatPanel/hooks/getUserStatus';
import { selectPanelChats } from 'app/theme-layouts/shared-components/chatPanel/store/chatsSlice';
import { Badge } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const user = useSelector(selectUser);
  const { getStatus } = useGetUserStatus();
  const allChat = useSelector(selectPanelChats)

  const isXlScreen = useMediaQuery('(min-width: 1920px)');

const floatVariants = {
  closed: { y: 0, transition: { duration: 0.3 } },
  open: {
    y: isXlScreen ? -750 : -500,
    transition: { duration: 0.3 },
  },
};

  const countUnreadMessages = (messages) => {
    let total = 0
    messages.forEach(message => {
      total = total + message.unreadCount
    });
    return total
  };

  const unreadCount = countUnreadMessages(allChat)


  return (
    <>
      {/* Animated floating container */}
      <motion.div
        animate={isOpen ? 'open' : 'closed'}
        variants={floatVariants}
        className="fixed bottom-[25px] right-[5%] z-[100] bg-[#ffffffe8] rounded-t-lg shadow-lg p-3 min-w-[300px] xl:min-w-[350px] min-h-[50px] flex items-center justify-between"
      >
        {/* User Info (Left side) */}
        {user && (
          <div
            className="flex items-center cursor-pointer gap-8 pl-10"
            tabIndex={0}
          >
            <Badge 
                    badgeContent={unreadCount} 
                    color="error" 
                    invisible={unreadCount === 0} 
                    sx={{ textAlign: "center", display: "flex", flexDirection: "row", justifyItems: "center", alignItems: "center" }}
                  >
                    <ContactAvatar
                    className="relative"
                    size="large"
                    id="user"
                    data={{ ...user, status: getStatus(user._id) }}
                    />
                  </Badge>
           
            <Typography className="text-lg font-bold" color="primary">Chats</Typography>
          </div>
        )}

        {/* Action buttons (Right side) */}
        <div className="flex items-center gap-3">
          <IconButton
            aria-haspopup="true"
            size="medium"
            onClick={() => {
              // Placeholder for future menu
            }}
          >
            <FuseSvgIcon>heroicons-outline:dots-horizontal</FuseSvgIcon>
          </IconButton>

          <IconButton
            aria-haspopup="true"
            size="medium"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <FuseSvgIcon>heroicons-solid:search</FuseSvgIcon>
          </IconButton>

          <IconButton
            aria-haspopup="true"
            size="medium"
            onClick={() => setIsOpen((prev) => !prev)}
          >
            <FuseSvgIcon>
              {isOpen
                ? 'heroicons-outline:chevron-down'
                : 'heroicons-outline:chevron-up'}
            </FuseSvgIcon>
          </IconButton>
        </div>
      </motion.div>

      {/* Animated Chat List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-[25px] right-[5%] z-[100]"
          >
            <PopupChatList onClose={() => setIsOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingChat;
