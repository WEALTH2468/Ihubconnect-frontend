import { memo } from 'react';
import QuickPanel from '../../shared-components/quickPanel/QuickPanel';
import NotificationPanel from '../../shared-components/notificationPanel/NotificationPanel';
import ChatPanel from 'app/theme-layouts/shared-components/chatPanel/ChatPanel';

function RightSideLayout2() {
  return (
    <>
      <ChatPanel />
      <QuickPanel />

      <NotificationPanel />
    </>
  );
}

export default memo(RightSideLayout2);
