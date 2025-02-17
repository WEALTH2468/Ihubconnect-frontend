import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import { Box } from '@mui/system';
import { useParams } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import ContactAvatar from '../../ContactAvatar';
import { useDispatch } from 'react-redux';
import { isRead } from 'app/theme-layouts/shared-components/chatPanel/store/chatSlice';
import { clearCount } from 'app/theme-layouts/shared-components/chatPanel/store/chatsSlice';
import useGetUserStatus from 'app/theme-layouts/shared-components/chatPanel/hooks/getUserStatus';

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  '&.active': {
    backgroundColor: theme.palette.background.default,
  },
}));

function ContactListItem(props) {
  const {getStatus} = useGetUserStatus()
  const dispatch = useDispatch()
  const { chat, contact } = props;
  const routeParams = useParams();

  return (
    <StyledListItem
      button
      onClick={() => {
        if (contact.unreadCount && contact.unreadCount > 0) {
          dispatch(isRead(contact._id)).then(({ payload }) => {
            dispatch(clearCount(payload.chatId));
          });
        }
      }}
      className="px-32 py-12 min-h-80"
      active={routeParams.id === contact._id ? 1 : 0}
      component={NavLinkAdapter}
      to={`/chat/${contact._id}`}
      end
      activeClassName="active"
    >
      <ContactAvatar id={'contact'} data={{...contact, status: getStatus(contact._id)}} />

      <ListItemText
        classes={{
          root: 'min-w-px px-16',
          primary: 'font-medium text-14',
          secondary: 'truncate',
        }}
        primary={contact.displayName}
        secondary={chat ? contact.lastMessage : contact.aboutMe}
      />

      {chat && (
        <div className="flex flex-col justify-center items-end">
          {contact?.lastMessageAt && (
            <Typography
              className="whitespace-nowrap mb-8 font-medium text-12"
              color="text.secondary"
            >
              {format(new Date(contact.lastMessageAt), 'PP')}
            </Typography>
          )}
          <div className="items-center">
            {contact.muted && (
              <FuseSvgIcon size={20} color="disabled">
                heroicons-solid:volume-off
              </FuseSvgIcon>
            )}
            {Boolean(contact.unreadCount) && (
              <Box
                sx={{
                  backgroundColor: 'secondary.main',
                  color: 'secondary.contrastText',
                }}
                className=" flex justify-center items-end min-w-20 h-20 rounded-full font-medium text-10"
              >
                {contact.unreadCount}
              </Box>
            )}
          </div>
        </div>
      )}
    </StyledListItem>
  );
}

export default ContactListItem;
