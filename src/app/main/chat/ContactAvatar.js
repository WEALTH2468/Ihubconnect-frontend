import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import _ from '@lodash';
import Statuses from './Statuses';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';
import { borderColor, borders } from '@mui/system';

const StyledBadge = styled(Badge)(({ theme, ...props }) => ({
  width: 40,
  height: 40,
  fontSize: 20,
  '& .MuiAvatar-root': {
    fontSize: 'inherit',
    color: theme.palette.text.secondary,
    fontWeight: 600,
    border: `3px solid ${props.statuscolor}`,
    borderRadius: '50%',
  },
  '& .MuiBadge-badge': {
    backgroundColor: props.statuscolor,
    width: 12, // ← Increase size
    height: 12, // ← Increase size
    borderRadius: '50%',
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      content: '""',
    },
  },
}));

 

function ContactAvatar({id, data, className }) {
  const status = _.find(Statuses, { value: data?.status });

  return (
    <StyledBadge
      className={className}
      overlap="circular"
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      variant={id === "user" ? null : "dot"}
      statuscolor={status?.color }
    >
      <Avatar src={addBackendProtocol(data.avatar)} alt={data.displayName} className="w-full h-full">
      </Avatar>
    </StyledBadge>
  );
}

export default ContactAvatar;
