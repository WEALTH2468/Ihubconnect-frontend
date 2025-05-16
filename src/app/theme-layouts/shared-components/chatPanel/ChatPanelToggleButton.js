import IconButton from '@mui/material/IconButton';
import { useDispatch, useSelector } from 'react-redux';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { toggleChatPanel } from './store/stateSlice';
import { useNavigate } from 'react-router-dom';
import { selectPanelChats } from './store/chatsSlice';
import { Badge } from '@mui/material';
import { closeChatPanels } from './store/contactsSlice';



const ChatPanelToggleButton = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const allChat = useSelector(selectPanelChats)

  const countUnreadMessages = (messages) => {
    let total = 0
    messages.forEach(message => {
      total = total + message.unreadCount
    });
    return total
  };

  const unreadCount = countUnreadMessages(allChat)

  
    const handleChatClick = () => {
      dispatch(closeChatPanels());
      navigate("/chat")
    };

  


  return (
    <IconButton className="w-40 h-40" onClick={handleChatClick} size="large">
      <Badge 
        badgeContent={unreadCount} 
        color="error" 
        invisible={unreadCount === 0} 
        sx={{ textAlign: "center", display: "flex", flexDirection: "row", justifyItems: "center", alignItems: "center" }}
      >
        <FuseSvgIcon>heroicons-outline:chat</FuseSvgIcon>
      </Badge>
    </IconButton>
  );
};

ChatPanelToggleButton.defaultProps = {
  children: <FuseSvgIcon>heroicons-outline:chat</FuseSvgIcon>,
};

export default ChatPanelToggleButton;
