import FuseScrollbars from '@fuse/core/FuseScrollbars';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import withReducer from 'app/store/withReducer';
import { useSnackbar } from 'notistack';
import { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import NotificationTemplate from 'app/theme-layouts/shared-components/notificationPanel/NotificationTemplate';
import NotificationModel from './model/NotificationModel';
import NotificationCard from './NotificationCard';
import {
  addNotification,
  addOfflineNotification,
  dismissAll,
  dismissItem,
  getNotifications,
  selectNotifications,
} from './store/dataSlice';
import reducer from './store';
import {
  closeNotificationPanel,
  selectNotificationPanelState,
  toggleNotificationPanel,
} from './store/stateSlice';
import { selectUser } from 'app/store/userSlice';
import useDestopNotification from './hooks/useDestopNotification';
import { useQueryClient } from '@tanstack/react-query';
import { NotificationType } from 'src/app/main/iperformance/enums/NotificationEnums';
import { selectSocket } from 'app/store/socketSlice';

const StyledSwipeableDrawer = styled(SwipeableDrawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    backgroundColor: theme.palette.background.default,
    width: 320,
  },
}));

function NotificationPanel(props) {
  const socket = useSelector(selectSocket)
  const location = useLocation();
  const dispatch = useDispatch();
  const state = useSelector(selectNotificationPanelState);
  const notifications = useSelector(selectNotifications);
  const queryClient = useQueryClient();

  const user = useSelector(selectUser);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { showNotification } = useDestopNotification();

  useEffect(() => {
    /*
		Get Notifications from db
		 */
    dispatch(getNotifications(user._id));
  }, [dispatch]);

  useEffect(() => {
   if(socket){
    socket?.on('emitNotification', (data) => {
      data.receiverId = user._id;
      demoNotification(data);
    });
    return () => {
      socket.off('emitNotification');
    };
   }
  }, [socket]);

  useEffect(() => {
    if (state) {
      dispatch(closeNotificationPanel());
    }
    // eslint-disable-next-line
  }, [location, dispatch]);

  function handleClose() {
    dispatch(closeNotificationPanel());
  }

  function handleDismiss(id) {
    dispatch(dismissItem(id));
  }
  function handleDismissAll(id) {
    dispatch(dismissAll(id));
  }

  function demoNotification(item) {
    // const item = NotificationModel({ title: 'Great Job! this is awesome.' });
    dispatch(addNotification(item)).then(() => {
      if (document.visibilityState === 'hidden') {
        showNotification(item);
      } else {
        enqueueSnackbar(item.description, {
          key: item._id,
          // autoHideDuration: 3000,
          content: () => (
            <NotificationTemplate
              item={item}
              onClose={() => {
                closeSnackbar(item._id);
              }}
            />
          ),
        });
      }

      console.log({ item });

      if (item.type === NotificationType.TASK) {
        // invalidate the task query key
        queryClient.invalidateQueries(['tasks']);
      }

       if (item.type === NotificationType.GOAL) {
         // invalidate the task query key
         queryClient.invalidateQueries(['goals']);
       }

       if (item.type === NotificationType.OBJECTIVE) {
         // invalidate the task query key
         queryClient.invalidateQueries(['objectives']);
       }


    });
  }

  return (
    <StyledSwipeableDrawer
      open={state}
      anchor="right"
      onOpen={(ev) => {}}
      onClose={(ev) => dispatch(toggleNotificationPanel())}
      disableSwipeToOpen
    >
      <IconButton
        className="m-4 absolute top-0 right-0 z-999"
        onClick={handleClose}
        size="large"
      >
        <FuseSvgIcon color="action">heroicons-outline:x</FuseSvgIcon>
      </IconButton>
      {notifications.length > 0 ? (
        <FuseScrollbars className="p-16">
          <div className="flex flex-col">
            <div className="flex justify-between items-end pt-136 mb-36">
              <Typography className="text-28 font-semibold leading-none">
                Notifications
              </Typography>
              <Typography
                className="text-12 underline cursor-pointer"
                color="secondary"
                onClick={() => handleDismissAll(user._id)}
              >
                dismiss all
              </Typography>
            </div>
            {notifications.map((item) => (
              <NotificationCard
                key={item._id}
                className="mb-16"
                item={item}
                onClose={() => handleDismiss(item._id)}
              />
            ))}
          </div>
        </FuseScrollbars>
      ) : (
        <div className="flex flex-1 items-center justify-center p-16">
          <Typography className="text-24 text-center" color="text.secondary">
            There are no notifications for now.
          </Typography>
        </div>
      )}
      {/* <div className="flex items-center justify-center py-16">
        <Button size="small" variant="outlined" onClick={demoNotification}>
          Create a notification example
        </Button>
      </div> */}
    </StyledSwipeableDrawer>
  );
}

export default withReducer(
  'notificationPanel',
  reducer
)(memo(NotificationPanel));
