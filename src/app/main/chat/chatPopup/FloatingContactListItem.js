import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import { Box } from '@mui/system';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import ContactAvatar from '../ContactAvatar';
import { useDispatch, useSelector } from 'react-redux';
import { isRead } from 'app/theme-layouts/shared-components/chatPanel/store/chatSlice';
import { clearCount } from 'app/theme-layouts/shared-components/chatPanel/store/chatsSlice';
import { selectOpenPanelContactIds, openChatPanelById } from 'app/theme-layouts/shared-components/chatPanel/store/contactsSlice';
import { openChatPanel } from 'app/theme-layouts/shared-components/chatPanel/store/stateSlice';
import useGetUserStatus from 'app/theme-layouts/shared-components/chatPanel/hooks/getUserStatus';

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  backgroundColor: active ? theme.palette.background.default : 'transparent',
  transition: 'background-color 0.2s ease-in-out',
}));

function FloatingContactListItem({ chat, contact}) {
  const { getStatus } = useGetUserStatus();
  const dispatch = useDispatch();
  const selectedId = useSelector( selectOpenPanelContactIds);

  const handleClick = () => {
    dispatch(openChatPanelById(contact._id));
    dispatch(openChatPanel());

    if (contact?.unreadCount && contact?.unreadCount > 0) {
      dispatch(isRead(contact._id)).then(({ payload }) => {
        dispatch(clearCount(payload.chatId));
      });
    }
  };

  return (
    <StyledListItem
      button
      onClick={handleClick}
      className="px-32 py-10 min-h-40"
      active={selectedId === contact._id ? 1 : 0}
    >
      <ContactAvatar
        id="popup"
        data={{ ...contact, status: getStatus(contact._id) }}
      />

      <ListItemText
        classes={{
          root: 'min-w-px px-16',
          primary: 'font-medium text-14',
          secondary: 'truncate',
        }}
        primary={contact.firstName}
        secondary={chat ? contact.lastMessage : contact.aboutMe}
      />

      {chat && (
        <div className="flex flex-col justify-center items-end">
          {contact?.lastMessageAt && (
            <Typography
              className="whitespace-nowrap mb-8 font-medium text-12"
              color="text.secondary"
            >
              {format(new Date(contact?.lastMessageAt), 'PP')}
            </Typography>
          )}
          <div className="items-center flex gap-4">
            {contact.muted && (
              <FuseSvgIcon size={20} color="disabled">
                heroicons-solid:volume-off
              </FuseSvgIcon>
            )}
            {Boolean(contact?.unreadCount) && (
              <Box
                sx={{
                  backgroundColor: 'secondary.main',
                  color: 'secondary.contrastText',
                }}
                className="flex justify-center items-center min-w-20 h-20 rounded-full font-medium text-10"
              >
                {contact?.unreadCount}
              </Box>
            )}
          </div>
        </div>
      )}
    </StyledListItem>
  );
}  


export default FloatingContactListItem;
