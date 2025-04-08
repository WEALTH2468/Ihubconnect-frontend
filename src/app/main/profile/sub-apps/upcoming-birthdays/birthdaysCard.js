import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Avatar, Typography, Button, CardContent, Divider } from '@mui/material';
import { getBirthdayUsers } from 'app/store/userSlice';
import { useEffect } from 'react';
import addBackendProtocol from 'app/theme-layouts/shared-components/addBackendProtocol';

const BirthdayCard = () => {
    const dispatch = useDispatch();

  const { todayBirthdays, upcomingBirthdays } = useSelector((state) => state.user);
  const [showAll, setShowAll] = useState(false);

  const groupedBirthdays = [
    { title: 'Today Birthdays', users: todayBirthdays || [] },
    { title: 'Upcoming Birthdays', users: upcomingBirthdays || [] },
  ];

  useEffect(() => {
    dispatch(getBirthdayUsers());
  }, [dispatch]);

  const displayedUsers = groupedBirthdays.flatMap((group) =>
    (group.users || []).map((user) => ({ ...user, groupTitle: group.title }))
  );

  const visibleUsers = showAll ? displayedUsers : displayedUsers.slice(0, 5 );

  return (
    <CardContent className="p-0">
      <Typography variant="h6" className="font-semibold mb-2">
        Birthdays
      </Typography>

      {visibleUsers.map((user, index) => (
        <div key={index}>
          {index === 0 || user.groupTitle !== visibleUsers[index - 1]?.groupTitle ? (
            <>
              <Divider className="my-3" />
              <Typography variant="subtitle2" className="text-[#f17e45] mb-1 font-bold">
                {user.groupTitle}
              </Typography>
            </>
          ) : null}

          <div className="flex items-center gap-5 py-3 mb-1">
            <Avatar src={addBackendProtocol(user.avatar)} alt={user.firstName} sx={{ width: 36, height: 36 }} />
            <div className="flex flex-col">
              <Typography className="text-[14px] text-gray-800 flex pt-[5px] font-semibold">
              {user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1)} {user.lastName.charAt(0).toUpperCase() + user.lastName.slice(1)} 
              </Typography>
              <Typography className="text-[11px] text-gray-500">
                    {user.jobPosition?.name || 'No Position'} •{' '}
                    {new Date(user.birthday).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        timeZone: 'UTC', // Force UTC
                    })}
                    </Typography>

            </div>
          </div>
        </div>
      ))}

      {displayedUsers.length > 5 && (
        <div className="mt-2 flex justify-center">
         
           <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              onClick={() => setShowAll(!showAll)}
                            >
                              {showAll ? 'Show Less' : 'See More'}
                            </Button>
        </div>
      )}
    </CardContent>
  );
};

export default BirthdayCard;
