
import React from 'react'
import addBackendProtocol from '../../addBackendProtocol';

export default function useDestopNotification() {
    const showNotification = async (data) => {
      const body = {
        idesk: 'New interesting post on idesk',
        chat: data.content || 'You have a new message on iHubconnect',
        file: 'You are given access to a new file',
        task: data.content || 'You have a new task',
        iteam: data.content
      };
      if (Notification.permission === 'granted') {
        const options = {
          body: body[data.subject],
          icon: addBackendProtocol(data.image),
        };

        const notification = new Notification(
          `${data.subject.toUpperCase()} NOTIFICATION`,
          options
        );
        notification.onclick = (event) => {
          event.preventDefault(); //Prevent the browser from focusing the Notification's tab
          window.open(
            `${process.env.REACT_APP_BASE_FRONTEND + data.link}`,
            '_self'
          );
        };
      } else {
        // alert("Notification permission is not granted");
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const options = {
            body: body[data.subject],
            icon: addBackendProtocol(data.image),
          };

          const notification = new Notification(
            `${data.subject.toUpperCase()} NOTIFICATION`,
            options
          );
          notification.onclick = (event) => {
            event.preventDefault(); //Prevent the browser from focusing the Notification's tab
            window.open(
              `${process.env.REACT_APP_BASE_FRONTEND + data.link}`,
              '_self'
            );
          };
        } else {
          alert('Permission not granted');
        }
      }
    };
  return {showNotification}
}
