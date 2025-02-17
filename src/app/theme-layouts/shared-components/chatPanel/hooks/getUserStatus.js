import React from 'react';
import { useSelector } from 'react-redux';
import { selectOnlineUsers } from '../store/contactsSlice';

function useGetUserStatus() {
  const onlineUsers = useSelector(selectOnlineUsers);

  const getStatus = (userId) =>
    onlineUsers[userId] ? onlineUsers[userId][1] : 'offline';

  return { getStatus };
}

export default useGetUserStatus;
