
import React from 'react'
import addBackendProtocol from '../../addBackendProtocol';

let permissionGranted = Notification.permission === 'granted';

export default function useDesktopNotification() {
    const showNotification = async (data) => {
        const body = {
            idesk: 'New interesting post on idesk',
            chat: data.content || 'You have a new message on iHubconnect',
            file: 'You are given access to a new file',
            task: data.content || 'You have a new task',
            iteam: data.content,
        };

        const createNotification = () => {
            const options = {
                body: body[data.subject],
                icon: addBackendProtocol(data.image),
            };

            const notification = new Notification(
                `${data.subject.toUpperCase()} NOTIFICATION`,
                options
            );

            notification.onclick = (event) => {
                event.preventDefault(); // Prevent focusing the Notification's tab
            
                // Open the link in the same tab and bring it to focus
                self.focus();
                window.location.assign(`${process.env.REACT_APP_BASE_FRONTEND + data.link}`);
            };
          };
        

        // If permission is already cached as granted, skip the request
        if (permissionGranted) {
            createNotification();
            return;
        }

        // Otherwise, request permission
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            permissionGranted = true;
            createNotification();
        } else {
            alert('Notification permission not granted');
        }
    };

    return { showNotification };
}
