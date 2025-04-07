import { selectSocket } from 'app/store/socketSlice';
import { useSelector } from 'react-redux';

const useEmit = () => {
  const socket = useSelector(selectSocket);

  if (!socket) {
    console.warn('Socket is not available. Ensure it is initialized before using emits.');
  }

  // Emit functions
  const emitUpdateStatus = (data) => {
    if (socket) socket.emit('updateStatus', data);
  };

  const emitRefreshPost = (data) => {
    if (socket) socket.emit('refreshPost', data);
  };

  const emitOffline = () => {
   if (socket)  socket.emit("userlogout");
  };
  const emitEmailAndNotification = (data) => {
    if (socket) socket.emit('emitEmailAndNotification', data);
  };

  const emitNotification = (data) => {
    if (socket) socket.emit('emitNotification', data);
  };

  const emitSendChat = (message) => {
    if (socket) socket.emit('emitSendChat', message);
  };

  const emitDeleteChat = (message) => {
    if (socket) socket.emit('emitDeleteChat', message)
  }

  const emitEditChat = (message) => {
    if (socket) socket.emit('emitEditChat', message)
  }

  const emitGetUsers = () => {
    if (socket) socket.emit('emitGetUsers');
  };

  const emitSendPanelChat = (message) => {
    if (socket) socket.emit('emitSendPanelChat', message);
  };

  const emitMarkMessageSeen = (messageId, senderId) => {
    if (socket) socket.emit('makeMessageSeen', { messageId, senderId });
  };

  return {
    emitUpdateStatus,
    emitOffline,
    emitRefreshPost,
    emitEmailAndNotification,
    emitNotification,
    emitSendChat,
    emitGetUsers,
    emitSendPanelChat,
    emitDeleteChat,
    emitEditChat,
    emitMarkMessageSeen
  };
};

export default useEmit;