import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import {
  selectFilteredUsers,
  selectGroupedFilteredUsers,
} from './store/settingsSlice';
import UserListItem from './UserListItem';
import Input from '@mui/material/Input';
import { setUsersSearchText } from './store/usersSlice';
import { Box } from '@mui/system';
import Button from '@mui/material/Button';
import NavLinkAdapter from '@fuse/core/NavLinkAdapter';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { selectSearchText } from './store/settingsSlice';

function UsersList(props) {
  const filteredData = useSelector(selectFilteredUsers);
  const groupedFilteredUsers = useSelector(selectGroupedFilteredUsers);
  const searchText = useSelector(selectSearchText);
  const dispatch = useDispatch();

  if (!filteredData) {
    return null;
  }

  if (filteredData.length === 0) {
    return (
      <>
        <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center mt-16 -mx-8 m-2">
          <Box
            component={motion.div}
            initial={{ y: -20, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { delay: 0.2 },
            }}
            className="flex flex-1 w-full sm:w-auto items-center px-16 mx-16 border-1 rounded-full"
          >
            <FuseSvgIcon color="action" size={20}>
              heroicons-outline:search
            </FuseSvgIcon>

            <Input
              placeholder="Search contacts"
              className="flex flex-1 px-16"
              disableUnderline
              fullWidth
              value={searchText}
              inputProps={{
                'aria-label': 'Search',
              }}
              onChange={(ev) => dispatch(setUsersSearchText(ev))}
            />
          </Box>
          <Button
            className="mx-8"
            variant="contained"
            color="secondary"
            component={NavLinkAdapter}
            to="users/new/edit"
          >
            <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
            <span className="mx-6 ">Add</span>
          </Button>
        </div>
        <div className="flex flex-1 items-center justify-center h-full">
          <Typography color="text.secondary" variant="h5">
            There are no users!
          </Typography>
        </div>
      </>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
      className="flex flex-col flex-auto w-full max-h-full"
    >
      <div className="flex flex-col sm:flex-row space-y-16 sm:space-y-0 flex-1 items-center mt-16 mx-8">
        <Box
          component={motion.div}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          className="flex flex-1 w-full sm:w-auto items-center px-16 mx-12 border-1 rounded-full"
        >
          <FuseSvgIcon color="action" size={20}>
            heroicons-outline:search
          </FuseSvgIcon>

          <Input
            placeholder="Search contacts"
            className="flex flex-1 px-16"
            disableUnderline
            fullWidth
            value={searchText}
            inputProps={{
              'aria-label': 'Search',
            }}
            onChange={(ev) => dispatch(setUsersSearchText(ev))}
          />
        </Box>
        <Button
          className="mx-8"
          variant="contained"
          color="secondary"
          component={NavLinkAdapter}
          to="users/new/edit"
        >
          <FuseSvgIcon size={20}>heroicons-outline:plus</FuseSvgIcon>
          <span className="mx-8">Add</span>
        </Button>
      </div>
      <Typography
        component={motion.span}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
        delay={500}
        className="text-14 font-medium"
        color="text.secondary"
        sx={{ marginLeft: '3rem', marginTop: '2.5rem' }}
      >
        {`${filteredData.length} Users`}
      </Typography>
      {Object.entries(groupedFilteredUsers).map(([key, group]) => {
        return (
          <div key={key} className="relative">
            <Typography
              color="text.secondary"
              className="px-32 py-4 text-14 font-medium"
            >
              {key}
            </Typography>
            <Divider />
            <List className="w-full m-0 p-0">
              {group.children.map((item) => (
                <UserListItem key={item._id} user={item} />
              ))}
            </List>
          </div>
        );
      })}
    </motion.div>
  );
}

export default UsersList;
