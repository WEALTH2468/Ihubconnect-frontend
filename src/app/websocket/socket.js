import { clearSocket, setSocket } from 'app/store/socketSlice';
import { io } from 'socket.io-client';

export const initializeSocket = (dispatch) => {
  const token = localStorage.getItem('jwt_access_token');
  const companyDomain = window.location.origin;
  if (!token) {
    console.error('Token not found! Socket connection will not be established.');
    return null;
  }

  // Initialize the socket connection
  const socket = io(process.env.REACT_APP_BASE_BACKEND, {
    query: { token, companyDomain },
    withCredentials: true,
    reconnection: true, // Enable automatic reconnection
  });

  // Add default event listeners
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error.message);
  });

  // Event listener for receiveMessage event
  socket.on("receiveMessage", (message) => {
    console.log("New message received:", message);
  });

  // Store the socket in Redux
  dispatch(setSocket(socket));

  return socket;
};

export const disconnectSocket = (dispatch, socket) => {
  if (socket) {
    socket.disconnect();
    dispatch(clearSocket());
    console.log('Socket disconnected manually');
  }
};


