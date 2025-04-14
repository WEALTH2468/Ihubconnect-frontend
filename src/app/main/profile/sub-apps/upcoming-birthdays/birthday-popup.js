import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Typography, Divider, Box } from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import { getBirthdayUsers } from 'app/store/userSlice';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';
import CloseIcon from '@mui/icons-material/Close';

const BirthdayPopup = () => {
  const dispatch = useDispatch();
  const { todayBirthdays, upcomingBirthdays } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getBirthdayUsers());
  }, [dispatch]);

  const groupedBirthdays = [
    { title: 'Today Birthdays', users: todayBirthdays || [] },
    { title: 'Upcoming Birthdays', users: upcomingBirthdays || [] },
  ];

  const displayedUsers = groupedBirthdays.flatMap((group) =>
    (group.users || []).map((user) => ({ ...user, groupTitle: group.title }))
  );

  return (
    <Box
      sx={{
        maxHeight: '70vh',
        overflowY: 'auto',
        p: 3,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
        
      {displayedUsers.map((user, index) => (
        <Box key={index}>
          {index === 0 || user.groupTitle !== displayedUsers[index - 1]?.groupTitle ? (
            <>
              {/* <Divider sx={{ my: 3 }} /> */}
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  color: '#f17e45',
                  gap: 1,
                }}
              >
                
                {user.groupTitle}
                <CakeIcon color="secondary" />
                <CakeIcon color="secondary" />
                <CakeIcon color="secondary" />
              </Typography>
            </>
          ) : null}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Avatar
              src={addBackendProtocol(user.avatar)}
              alt={user.firstName}
              sx={{ width: 48, height: 48 }}
            />
           <Box>
            <Typography
                variant="subtitle1"
                sx={{ fontWeight: 'bold' }}
            >
                {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)}{' '}
                {user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)}
            </Typography>

            <Typography
                variant="caption"
                sx={{ color: 'gray' }}
            >
                {user.jobPosition || 'No Position'} •{' '}
                {new Date(user.birthday).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                timeZone: 'UTC',
                })}
            </Typography>
            </Box>

          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default BirthdayPopup;
